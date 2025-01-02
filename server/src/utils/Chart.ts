import * as fs from 'fs/promises';
import * as path from 'path';
import { Chart, FnFilter, Vars } from '../../../admin/src/models/Chart';

// Define the path to the JSON file
const FILE = '../cfg/charts.json';

export class ChartService {
    private filePath: string;

    constructor(filePath: string = FILE) {
        this.filePath = filePath;
    }

    configure(filePath: string) {
        this.filePath = filePath;
        console.log("ChartService >>", this.filePath);
        return this;
    }

    /**
     * Read the JSON file asynchronously.
     * @returns {Promise<Chart[]>} - The parsed charts array.
     */
    private async read(): Promise<Chart[]> {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data) as Chart[] || [];
        } catch (_) {
            return [];
        }
    }

    /**
     * Write to the JSON file asynchronously.
     * @param {Chart[]} charts - The charts array to save.
     * @returns {Promise<void>}
     */
    private async write(charts: Chart[]): Promise<void> {
        try {
            const dir = path.dirname(this.filePath);
            await fs.mkdir(dir, { recursive: true });
            await fs.writeFile(this.filePath, JSON.stringify(charts, null, 2), 'utf8');
        } catch (error) {
            throw new Error('Could not write to charts file.');
        }
    }

    /**
     * Add a new chart.
     * @param {Chart} newChart - The chart to add.
     * @returns {Promise<void>}
     */
    async create(newChart: Chart): Promise<Chart> {
        const charts = await this.read();
        charts.push(newChart);
        await this.write(charts);
        return newChart;
    }

    /**
     * Add multiple new charts.
     * @param {Chart[]} newCharts - The charts to add.
     * @returns {Promise<void>}
     */
    async bulkCreate(newCharts: Chart[]): Promise<Chart[]> {
        const charts = await this.read();
        charts.push(...newCharts);
        await this.write(charts);
        return newCharts;
    }

    /**
     * Select charts based on a filter.
     * @param {FnFilter | null} [filterFn=null] - The filter function or null to return all charts.
     * @returns {Promise<Chart[]>} - The filtered charts or all charts if no filter is provided.
     */
    async select(filterFn: FnFilter | null = null): Promise<Chart[]> {
        const charts = await this.read();
        return filterFn ? charts.filter(filterFn) : charts;
    }

    /**
     * Find a single chart based on a filter.
     * @param {FnFilter | null} [filterFn=null] - The filter function or null to find the first chart.
     * @returns {Promise<Chart | null>} - The found chart or null if not found.
     */
    async findOne(filterFn: FnFilter | null = null): Promise<Chart | null> {
        const charts = await this.read();
        return filterFn ? charts.find(filterFn) || null : null;
    }

    /**
     * Update charts based on a filter.
     * @param {FnFilter | null} [filterFn=null] - The filter function to find charts to update.
     * @param {Partial<Chart>} data - The updated properties.
     * @returns {Promise<void>}
     */
    async update(filterFn: FnFilter | null = null, data: Partial<Chart>): Promise<Chart> {
        if (!filterFn) {
            throw new Error('A filter function must be provided for updates.');
        }
        const charts = await this.read();
        let updated = false;
        for (let i = 0; i < charts.length; i++) {
            if (filterFn(charts[i])) {
                charts[i] = { ...charts[i], ...data };
                updated = true;
            }
        }
        if (!updated) {
            throw new Error('No matching charts found for update.');
        }
        await this.write(charts);
        return data as Chart;
    }

    /**
     * Update multiple charts with specific filters.
     * @param {Array<{ FnFilter: FnFilter; updates: Partial<Chart> }>} updatesArray - The updates to apply.
     * @returns {Promise<void>}
     */
    async bulkUpdate(updatesArray: { filterFn: FnFilter; updates: Partial<Chart> }[]): Promise<void> {
        const charts = await this.read();
        for (const { filterFn, updates } of updatesArray) {
            for (let i = 0; i < charts.length; i++) {
                if (filterFn(charts[i])) {
                    charts[i] = { ...charts[i], ...updates };
                }
            }
        }
        await this.write(charts);
    }

    /**
     * Remove charts based on a filter.
     * @param {FnFilter | null} [filterFn=null] - The filter function to identify charts to delete.
     * @returns {Promise<void>}
     */
    async remove(filterFn: FnFilter | string | number | null = null): Promise<Chart[]> {
        const charts = await this.read();
        const filteredCharts = filterFn instanceof Function
            ? charts.filter(chart => !filterFn(chart))
            : (typeof filterFn === "string" || typeof filterFn === "number" ? [charts[filterFn]] : charts);
        if (filteredCharts.length === charts.length) {
            throw new Error('No matching charts found for removal.');
        }
        await this.write(filteredCharts);
        return filteredCharts;
    }

    /**
     * Remove multiple charts based on specific filters.
     * @param {Array<FnFilter>} filters - The filters to identify charts to delete.
     * @returns {Promise<void>}
     */
    async bulkRemove(filters: FnFilter[]): Promise<void> {
        let charts = await this.read();
        for (const filterFn of filters) {
            charts = charts.filter(chart => !filterFn(chart));
        }
        await this.write(charts);
    }

    getDefaults(data: Vars[]) {
        return data.reduce((acc, item) => (acc[item.key] = item.defaults) && acc, {});
    }
}

// Example operations:
// chartService.create({
//     name: "Sales",
//     type: "bar",
//     tooltip: true,
//     legend: false,
//     xaxis: [{ key: "date" }],
//     yaxis: [{ key: "sales", stroke: "#123456", fill: "#654321" }],
// });

// const charts = await chartService.select(chart => chart.type === "bar");
// console.log(charts);

// const foundChart = await chartService.findOne(chart => chart.name === "Sales");
// console.log(foundChart);

// await chartService.update(chart => chart.name === "Orders", { tooltip: false });

// await chartService.bulkUpdate([
//     { filterFn: chart => chart.name === "Sales", updates: { legend: true } },
//     { filterFn: chart => chart.name === "Orders", updates: { type: "line" } }
// ]);

// await chartService.remove(chart => chart.name === "Orders");

// await chartService.bulkRemove([
//     chart => chart.name === "Sales",
//     chart => chart.name === "Orders"
// ]);

export default new ChartService();
