import { Box, Typography, Flex, Button, Loader, Alert } from "@strapi/design-system";
import { Chart, Axis } from "../models/Chart";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area, Bar, Line } from 'recharts';
import { Pencil, Trash, Eye } from "@strapi/icons";
import { useFetchSrv } from "../service/useFetch";
import srvChart from "../service/charsrv";
import { useCallback } from "react";
import { getTranslation } from "../utils/getTranslation";
import { useIntl } from "react-intl";
import { useSize } from "../service/useSize";

interface Item {
    name: string;
    uv?: number;
    pv?: number;
    amt?: number;
}

interface ChartViewProps {
    data: Chart;
    size?: {
        width?: number;
        height?: number;
    };
    onEdit?: (value: Chart) => void;
    onDel?: (value: Chart) => void;
    onView?: (value: Chart) => void;
}

function ChartItem({ item, index }: { item: Axis, index: number }) {
    switch (item?.type?.toLowerCase()) {
        case "bar":
            return <Bar type="monotone" dataKey={item.key} stroke={item.stroke} fill={item.fill} key={index} barSize={item.barSize ?? 10} />

        case "area":
            return <Area type="monotone" dataKey={item.key} stroke={item.stroke} fill={item.fill} activeDot={item.active} key={index} />

        default:
            return <Line type="monotone" dataKey={item.key} stroke={item.stroke} activeDot={item.active} key={index} />
    }
}

export function ChartView({ data, onEdit, onDel, onView, size }: ChartViewProps) {
    const { formatMessage } = useIntl();
    const fetchChartData: () => Promise<{ data: Array<Item> }> | null | undefined = useCallback(() => !data?.id ? null : srvChart.getData(data.id), []);
    const { data: result, error, isLoading } = useFetchSrv<{ data: Array<Item> }>(fetchChartData);
    const wSize = useSize();

    if (isLoading) {
        return <Loader>{formatMessage({ id: getTranslation('msg.loading') })}</Loader>
    }

    return (
        <Box width="100%" minWidth="600px" background="neutral100" borderColor="neutral150" borderWidth="2px" hasRadius>
            <Box width={600} padding={4} background="neutral100" borderColor="neutral150" borderWidth="2px" hasRadius>
                <Flex justifyContent="space-between" alignItems="center">
                    <Typography>{data.label}</Typography>
                    <Flex>
                        {onView && <Box paddingLeft={2}>
                            <Button variant="tertiary" onClick={() => onView instanceof Function && onView(data)} label="View"  > <Eye /></Button>
                        </Box>}
                        <Box paddingLeft={2}>
                            <Button variant="tertiary" onClick={() => onEdit instanceof Function && onEdit(data)} label="Edit" ><Pencil /></Button>
                        </Box>
                        <Box paddingLeft={2}>
                            <Button variant="tertiary" onClick={() => onDel instanceof Function && onDel(data)} label="Delete"  > <Trash /></Button>
                        </Box>
                    </Flex>
                </Flex>
            </Box>

            {error && (
                <Alert width="100%" closeLabel="Close" title="Title" variant="danger">
                    {formatMessage({ id: getTranslation('error.retrieve') })}
                </Alert>
            )}

            {!result?.data && !error && (
                <Loader >{getTranslation('msg.loading')}</Loader>
            )}

            {result?.data && (
                <Box
                    width="100%"
                    minHeight="200px"
                    marginTop={2}
                    marginBottom={2}
                    justifyContent="center"
                    alignItems="center"
                >
                    <ComposedChart
                        data={result?.data}
                        width={size?.width ?? wSize.percernt(90, "width")}
                        height={size?.height ?? wSize.percernt(70, "height")}
                        margin={{
                            top: 5,
                            right: 10,
                            left: 10,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                        {data.xaxis.map(point => (<XAxis dataKey={point.key} key={point.key} />))}
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {data.yaxis.map((item, index) => ChartItem({ item, index }))}
                    </ComposedChart>
                </Box>
            )}
        </Box>
    )
}