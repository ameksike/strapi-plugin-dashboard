export interface Chart {
    id?: string;
    name: string;
    label?: string;
    type?: string;
    tooltip?: boolean;
    legend?: boolean;
    xaxis: { key: string }[];
    yaxis: { key: string; stroke: string; fill: string }[];
}

const protoChart = {
    "name": "order",
    "type": "line",
    "tooltip": true,
    "legend": true,
    "xaxis": [
        {
            "key": "name"
        }
    ],
    "yaxis": [
        {
            "key": "name",
            "stroke": "8884d8",
            "fill": "#8884d8"
        }
    ]
}

export const protoChartStr = JSON.stringify(protoChart, null, 2);

export type FnFilter = (chart: Chart) => boolean;