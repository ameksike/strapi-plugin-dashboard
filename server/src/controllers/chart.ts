import { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
    async create(ctx) {
        const { data } = ctx.request.body;
        const chart = await strapi.plugin('your-plugin-name').service('chart').create(data);
        ctx.body = chart;
    },

    async findAll(ctx) {
        const charts = await strapi.plugin('your-plugin-name').service('chart').findAll();
        ctx.body = charts;
    },

    async findOne(ctx) {
        const { id } = ctx.params;
        const chart = await strapi.plugin('your-plugin-name').service('chart').findOne(id);
        if (chart) {
            ctx.body = chart;
        } else {
            ctx.notFound('Chart not found');
        }
    },

    async update(ctx) {
        const { id } = ctx.params;
        const { data } = ctx.request.body;
        const chart = await strapi.plugin('your-plugin-name').service('chart').update(id, data);
        if (chart) {
            ctx.body = chart;
        } else {
            ctx.notFound('Chart not found');
        }
    },

    async delete(ctx) {
        const { id } = ctx.params;
        const deleted = await strapi.plugin('your-plugin-name').service('chart').delete(id);
        if (deleted) {
            ctx.body = { message: 'Chart deleted successfully' };
        } else {
            ctx.notFound('Chart not found');
        }
    }
});