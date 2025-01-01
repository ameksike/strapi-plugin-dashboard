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
  },

  async getData(id: string): Promise<any[]> {
    const chart =  await this.getSrv().findOne(getFilter(id));
    console.log(">>>>>>>>>>> getData: ", id, chart);
    return [
      {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
      },
      {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
      },
      {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
      },
      {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
      },
      {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
      },
      {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
      },
      {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
      },
    ];
  }

});