import { Box, Typography, Flex, Button, Loader, Alert } from "@strapi/design-system";
import { Chart } from "../models/Chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Pencil, Trash } from "@strapi/icons";
import { useFetchSrv } from "../service/useFetch";
import srvChart from "../service/charsrv";
import { useCallback } from "react";


const dataContent = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

interface Item {
    name: string;
    uv?: number;
    pv?: number;
    amt?: number;
}

interface ChartViewProps {
    data: Chart;
    onEdit?: (value: Chart) => void;
    onDel?: (value: Chart) => void;
}

export function ChartView({ data, onEdit, onDel }: ChartViewProps) {
    const fetchChartData: () => Promise<{ data: Array<Item> }> | null | undefined = useCallback(() => !data?.id ? null : srvChart.getData(data.id), []);

    const { data: result, error, isLoading } = useFetchSrv<{ data: Array<Item> }>(fetchChartData)

    return (
        <Box width="100%" minWidth="600px" background="neutral100" borderColor="neutral150" borderWidth="2px" hasRadius>
            <Box width={600} padding={4} background="neutral100" borderColor="neutral150" borderWidth="2px" hasRadius>
                <Flex justifyContent="space-between" alignItems="center">
                    <Typography>{data.label}</Typography>
                    <Flex>
                        <Button onClick={() => onEdit instanceof Function && onEdit(data)} label="Edit" ><Pencil /></Button>
                        <Box paddingLeft={2}>
                            <Button onClick={onDel instanceof Function && onDel(data)} label="Delete"  > <Trash /></Button>
                        </Box>
                    </Flex>
                </Flex>
            </Box>

            {error && (
                <Alert width="100%" closeLabel="Close" title="Title" variant="danger">
                    There is no data to retrieve.
                </Alert>
            )}

            {!result?.data && !error && (
                <Loader >Loading content...</Loader>
            )}

            {result?.data && (
                <Box width="100%" marginTop={2} marginBottom={2}>
                    <LineChart
                        width={600}
                        height={300}
                        data={result?.data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        {data.xaxis.map(point => (<XAxis dataKey={point.key} key={point.key} />))}
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {data.yaxis.map(line => (<Line type="monotone" key={line.key} dataKey={line.key} stroke={line.stroke} activeDot={{ r: 8 }} />))}
                        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                    </LineChart>
                </Box>
            )}
        </Box>
    )
}