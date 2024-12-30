import chart from './chart';
export default [
    {
        method: 'GET',
        path: '/',
        // name of the controller file & the method.
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
