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

export const protoChart = {
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

export function toStr(data: Object): string {
    return JSON.stringify(data, null, 2);
}

export type FnFilter = (chart: Chart) => boolean;