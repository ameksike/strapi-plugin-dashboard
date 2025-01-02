import { Box, Typography, Flex, Button, Loader, Alert } from "@strapi/design-system";

import { Chart, Filters } from "../models/Chart";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart } from 'recharts';
import { Pencil, Trash, Eye } from "@strapi/icons";
import { useFetchSrv } from "../service/useFetch";
import srvChart from "../service/charsrv";
import { useCallback } from "react";
import { getTranslation } from "../utils/getTranslation";
import { useIntl } from "react-intl";
import { useSize } from "../service/useSize";
import { FilterPanel } from "./FilterPanel";
import { ChartItem } from "./ChartItem";

import { useAuth } from '@strapi/strapi/admin';
import { PLUGIN_ID } from "../pluginId";

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

type FnFetch = (params?: Filters | null) => Promise<{ data: Array<Item> }> | null | undefined;

export function ChartView({ data, onEdit, onDel, onView, size }: ChartViewProps) {
    const { formatMessage } = useIntl();
    const fetchChartData: FnFetch = useCallback((param = null) => !data?.id ? null : srvChart.getData(data.id, param), []);

    const { data: result, error, isLoading, load } = useFetchSrv<{ data: Array<Item>, filters?: Filters }, Filters>(fetchChartData);
    const wSize = useSize();

    //const auth = useAuth(PLUGIN_ID, (state) => state.permissions);

    function onApply(state: Filters) {
        load(state);
    }

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
                            <Button variant="tertiary" onClick={() => onView instanceof Function && onView(data)} label="View"><Eye /></Button>
                        </Box>}
                        <Box paddingLeft={2}>
                            <Button variant="tertiary" onClick={() => onEdit instanceof Function && onEdit(data)} label="Edit"><Pencil /></Button>
                        </Box>
                        <Box paddingLeft={2}>
                            <Button variant="tertiary" onClick={() => onDel instanceof Function && onDel(data)} label="Delete"><Trash /></Button>
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
                <Box style={{
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: 'auto',
                    minHeight: '200px',
                    marginTop: '2px',
                    marginBottom: '2px'
                }}>
                    <ComposedChart
                        data={result?.data}
                        width={wSize.percernt(size?.width || 90, "width")}
                        height={wSize.percernt(size?.height || 70, "height")}
                        margin={{
                            top: 5,
                            right: 6,
                            left: 6,
                            bottom: 5
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

            <FilterPanel data={data} onApply={onApply} filters={result?.filters} />
        </Box>
    )
}