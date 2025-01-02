export interface Axis {
    key: string;
    stroke?: string;
    fill?: string;
    active?: any;
    type?: string;
    barSize?: number;
}

export interface Chart {
    id?: string;
    name: string;
    label?: string;
    tooltip?: boolean;
    legend?: boolean;
    xaxis: Axis[];
    yaxis: Axis[];
    query?: string;
}

export const protoChart = {
    "name": "order",
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
            "stroke": "#8884d8",
            "fill": "8884d8",
            "type": "line",
            "active": { "r": 8 }
        }
    ]
}

export function toStr(data: Object): string {
    return JSON.stringify(data, null, 2);
}

export type FnFilter = (chart: Chart) => boolean;