import { Chart } from '../models/Chart';
import { PLUGIN_ID } from '../pluginId';

export class ChartService {
    private baseUrl: string;

    constructor(pluginName: string = PLUGIN_ID) {
        this.baseUrl = `/api/${pluginName}/charts`;
    }

    async getData<T>(id: string): Promise<T> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}/data`);
            if (!response.ok) {
                throw new Error(`Failed to create chart: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error creating chart:', error);
            throw error;
        }
    }

    async create(data: Omit<Chart, 'id'>): Promise<Chart> {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`Failed to create chart: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error creating chart:', error);
            throw error;
        }
    }

    async getAll(): Promise<Chart[]> {
        try {
            const response = await fetch(this.baseUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch charts: ${response.status}`);
            }
            const res = await response.json();
            return res.data;
        } catch (error) {
            console.error('Error fetching charts:', error);
            throw error;
        }
    }

    async select(id: string): Promise<Chart> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch chart with id ${id}: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error(`Error fetching chart with id ${id}:`, error);
            throw error;
        }
    }

    async update(id: string, data: Partial<Chart>): Promise<Chart> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`Failed to update chart with id ${id}: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error(`Error updating chart with id ${id}:`, error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`Failed to delete chart with id ${id}: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error deleting chart with id ${id}:`, error);
            throw error;
        }
    }
}

export default new ChartService();