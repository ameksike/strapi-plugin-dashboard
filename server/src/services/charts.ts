import fs from 'fs/promises';
import path from 'path';
import { Chart } from '../../../admin/src/models/Chart';

export default ({ strapi }: { strapi: any }) => ({
  async create(data: Omit<Chart, 'id'>): Promise<Chart> {
    const charts = await this.findAll();
    const newChart: Chart = { id: Date.now().toString(), ...data };
    charts.push(newChart);
    await this.saveCharts(charts);
    return newChart;
  },

  async findAll(): Promise<Chart[]> {
    const filePath = path.join(__dirname, '..', 'data', 'charts.json');
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      strapi.log.error('Error reading charts:', error);
      return [];
    }
  },

  async findOne(id: string): Promise<Chart | null> {
    const charts = await this.findAll();
    return charts.find(chart => chart.id === id) || null;
  },

  async update(id: string, data: Partial<Chart>): Promise<Chart | null> {
    const charts = await this.findAll();
    const index = charts.findIndex(chart => chart.id === id);
    if (index === -1) return null;
    charts[index] = { ...charts[index], ...data };
    await this.saveCharts(charts);
    return charts[index];
  },

  async delete(id: string): Promise<boolean> {
    const charts = await this.findAll();
    const filteredCharts = charts.filter(chart => chart.id !== id);
    if (filteredCharts.length === charts.length) return false;
    await this.saveCharts(filteredCharts);
    return true;
  },

  async saveCharts(charts: Chart[]): Promise<void> {
    const filePath = path.join(__dirname, '..', 'data', 'charts.json');
    await fs.writeFile(filePath, JSON.stringify(charts, null, 2));
  }
});