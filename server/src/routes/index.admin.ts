import chart from './chart';
export default [
    {
        method: 'GET',
        path: '/',
        auth: false,
        handler: 'controller.index',
        config: {
            policies: [],
        },
    },
    ...chart,
    {
        method: "GET",
        path: "/transcript/:videoId",
        handler: "controller.getYoutubeTranscript",
        config: {
            policies: [],
        },
    }
];
