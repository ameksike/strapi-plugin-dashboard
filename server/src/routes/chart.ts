export default [
    {
        method: 'POST',
        path: '/charts',
        handler: 'chart.create',
        config: {
            policies: [],
            auth: false,
        },
    },
    {
        method: 'GET',
        path: '/charts',
        handler: 'chart.findAll',
        config: {
            policies: [],
            auth: false,
        },
    },
    {
        method: 'GET',
        path: '/charts/:id',
        handler: 'chart.findOne',
        config: {
            policies: [],
            auth: false,
        },
    },
    {
        method: 'PUT',
        path: '/charts/:id',
        handler: 'chart.update',
        config: {
            policies: [],
            auth: false,
        },
    },
    {
        method: 'DELETE',
        path: '/charts/:id',
        handler: 'chart.delete',
        config: {
            policies: [],
            auth: false,
        },
    },
    {
        method: 'GET',
        path: '/charts/:id/data',
        handler: 'chart.getData',
        config: {
            policies: [],
            auth: false,
        },
    }
];