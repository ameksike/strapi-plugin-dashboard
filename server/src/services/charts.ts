import fs from 'fs/promises';
import path from 'path';
import { Chart, FnFilter } from '../../../admin/src/models/Chart';
import srvChart from '../utils/Chart';

function getFilter(id: string): FnFilter {
  return chart => chart.id === id || chart.name === id;
}

export default ({ strapi }: { strapi: any }) => ({
  getPath() {
    return path.resolve(strapi.dirs.app?.root, 'dist/cfg/charts.json');
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
    return await this.getSrv().remove(id);
  }
});