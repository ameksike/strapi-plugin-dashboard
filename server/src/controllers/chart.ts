import { Core } from '@strapi/strapi';
import { PLUGIN_ID } from '../../../admin/src/pluginId';

const SERVICE_ID = 'chart';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
    async create(ctx) {
        const { data } = ctx.request.body;
        const chart = await strapi.plugin(PLUGIN_ID).service(SERVICE_ID).create(data);
        ctx.body = chart;
    },

    async findAll(ctx) {
        const charts = await strapi.plugin(PLUGIN_ID).service(SERVICE_ID).findAll();
        ctx.body = charts;
    },

    async findOne(ctx) {
        const { id } = ctx.params;
        const chart = await strapi.plugin(PLUGIN_ID).service(SERVICE_ID).findOne(id);
        if (chart) {
            ctx.body = chart;
        } else {
            ctx.notFound('Chart not found');
        }
    },

    async update(ctx) {
        const { id } = ctx.params;
        const { data } = ctx.request.body;
        const chart = await strapi.plugin(PLUGIN_ID).service(SERVICE_ID).update(id, data);
        if (chart) {
            ctx.body = chart;
        } else {
            ctx.notFound('Chart not found');
        }
    },

    async delete(ctx) {
        const { id } = ctx.params;
        const deleted = await strapi.plugin(PLUGIN_ID).service(SERVICE_ID).delete(id);
        if (deleted) {
            ctx.body = { message: 'Chart deleted successfully' };
        } else {
            ctx.notFound('Chart not found');
        }
    }
});