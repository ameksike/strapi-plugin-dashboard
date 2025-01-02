import fs from 'fs/promises';
import path from 'path';
import { Chart, FnFilter } from '../../../admin/src/models/Chart';
import srvChart from '../utils/Chart';

function getFilter(id: string): FnFilter {
  return chart => chart.id === id || chart.name === id;
}

export default ({ strapi }: { strapi: any }) => ({
  getPath() {
    return path.resolve(strapi.dirs.app?.root, 'config/charts.json');
  },

  sanitizeSQL(sql?: string): string | null {
    // Trim leading and trailing whitespaces
    if (!sql) {
      return null;
    }
    const trimmedQuery = sql.trim().replace(/\n/g, ' ').replace(/ +/g, " ");
    // Define forbidden keywords that indicate non-select operations
    const forbiddenKeywords = /\b(UPDATE|DELETE|CREATE|TRUNCATE|DROP|INSERT|ALTER|EXEC|MERGE|CALL|GRANT|REVOKE|SET)\b/i;
    if (forbiddenKeywords.test(trimmedQuery)) {
      return null;
    }
    // Check for potentially dangerous characters or sequences outside valid SELECT syntax
    const dangerousPatterns = /(--|\/\*|\*\/)/g;
    if (dangerousPatterns.test(trimmedQuery)) {
      return null;
    }
    // Remove trailing semicolon for safety
    return trimmedQuery.replace(/;$/, '').trim();
  },

  getSrv() {
    return srvChart.configure(this.getPath());
  },

  async create(data: Omit<Chart, 'id'>): Promise<Chart> {
    return await this.getSrv().create({ id: Date.now().toString(), ...data });
  },

  async findAll(): Promise<Chart[]> {
    return await this.getSrv().select();
  },

  async findOne(id: string): Promise<Chart | null> {
    return await this.getSrv().findOne(getFilter(id)) || null;
  },

  async update(id: string, data: Partial<Chart>): Promise<Chart | null> {
    return await this.getSrv().update(getFilter(id), data);
  },

  async delete(id: string): Promise<Chart[]> {
    return await this.getSrv().remove((item) => item.id === id);
  },

  async getData(id: string): Promise<any[]> {
    const chart = await this.getSrv().findOne(getFilter(id));
    const query = chart?.query && this.sanitizeSQL(chart?.query);
    let res = null;
    if (query) {
      res = await strapi.db.connection.raw(query);
      if (res?.rows?.length) {
        return res.rows;
      }
    }
    return [];
  }

});