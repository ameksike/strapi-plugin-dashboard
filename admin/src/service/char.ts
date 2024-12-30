import { request } from '@strapi/design-system';
import { Chart } from 'src/models/Chart';
import { PLUGIN_ID } from 'src/pluginId';

class ChartService {
    private baseUrl: string;

    constructor(pluginName: string = PLUGIN_ID) {
        this.baseUrl = `/${pluginName}/charts`;
    }

    async create(data: Omit<Chart, 'id'>): Promise<Chart> {
        try {
            const response = await request(this.baseUrl, {
                method: 'POST',
                body: { data },
            });
            return response;
        } catch (error) {
            console.error('Error creating chart:', error);
            throw error;
        }
    }

    async getAll(): Promise<Chart[]> {
        try {
            const response = await request(this.baseUrl, {
                method: 'GET',
            });
            return response;
        } catch (error) {
            console.error('Error fetching charts:', error);
            throw error;
        }
    }

    async select(id: string): Promise<Chart> {
        try {
            const response = await request(`${this.baseUrl}/${id}`, {
                method: 'GET',
            });
            return response;
        } catch (error) {
            console.error(`Error fetching chart with id ${id}:`, error);
            throw error;
        }
    }

    async update(id: string, data: Partial<Chart>): Promise<Chart> {
        try {
            const response = await request(`${this.baseUrl}/${id}`, {
                method: 'PUT',
                body: { data },
            });
            return response;
        } catch (error) {
            console.error(`Error updating chart with id ${id}:`, error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await request(`${this.baseUrl}/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error(`Error deleting chart with id ${id}:`, error);
            throw error;
        }
    }
}

export default ChartService;