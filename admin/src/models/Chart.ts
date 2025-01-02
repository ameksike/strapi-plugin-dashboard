export interface Axis {
    key: string;
    stroke?: string;
    fill?: string;
    active?: any;
    type?: string;
    barSize?: number;
}

export interface Vars {
    key: string;
    value?: any;
    defaults: any;
    component?: string;
}

export interface Filters {
    [key: string]: any;
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
    vars?: Vars[];
    filters?: Filters
}

export const protoChart = {
    "tooltip": true,
    "legend": true,
    "xaxis": [
        {
            "key": "month"
        }
    ],
    "yaxis": [
        {
            "type": "area",
            "key": "total_charged",
            "stroke": "#caca9d",
            "fill": "#caca9d"
        },
        {
            "type": "bar",
            "key": "total_cost_real",
            "stroke": "#8884d8",
            "fill": "#8884d8"
        },
        {
            "type": "line",
            "active": {
                "r": 8
            },
            "key": "total_profits",
            "stroke": "#82ca9d",
            "fill": "#82ca9d"
        }
    ],
    "label": "Order History 2024",
    "query": "WITH monthly_totals AS (\n    SELECT\n        DATE_TRUNC('month', o.published_at) AS month,\n        COALESCE(SUM(o.charged),0) AS total_charged,\n        COALESCE(SUM(o.cost_real),0) AS total_cost_real,\n        COALESCE(SUM(o.profits),0) AS total_profits\n    FROM\n        public.orders AS o\n    INNER JOIN\n        public.orders_user_lnk AS ou\n        ON ou.order_id = o.id\n    INNER JOIN\n        public.up_users AS u\n        ON u.id = ou.user_id\n    WHERE\n        o.published_at IS NOT NULL\n        AND EXTRACT(YEAR FROM o.published_at) = :year\n    GROUP BY\n        DATE_TRUNC('month', o.published_at)\n)\nSELECT\n    TO_CHAR(month, 'YYYY-MM') AS month,\n    total_charged,\n    total_cost_real,\n    total_profits\nFROM\n    monthly_totals\nORDER BY\n    month;",
    "vars": {
        "year": {
            "component": "select",
            "value": ["2023", "2024", "2025", "2026", "2027", "2028", "2029"],
            "default": "2024"
        }
    }
}

export function toStr(data: Object): string {
    return JSON.stringify(data, null, 2);
}

export type FnFilter = (chart: Chart) => boolean;