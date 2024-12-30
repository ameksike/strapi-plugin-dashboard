import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('ksvirt')
      // the name of the service file & the method.
      .service('service')
      .getWelcomeMessage();
  },
  async getYoutubeTranscript(ctx) {
    ctx.body = await strapi
      .plugin("ksvirt")
      .service("transcript")
      .getYoutubeTranscript(ctx.params.videoId);
  },
});

export default controller;
