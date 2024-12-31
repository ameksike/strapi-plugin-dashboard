import React, { useState, useEffect } from 'react';
import { ChartView } from './ChartView';
import { Chart } from '../models/Chart';
import srvChart from '../service/charsrv';
import { Grid } from '@strapi/design-system';

interface ChartListProps { }

export function ChartList({ }: ChartListProps) {
    const [charts, setCharts] = useState<Chart[]>([]);

    useEffect(() => {
        const fetchCharts = async () => {
            const data = await srvChart.getAll();
            setCharts(data);
        };
        fetchCharts();
    }, []);

    if (!charts?.length) {
        return <>Loading...</>
    }

    return (
        <div>
            {charts?.map((chart) => (
                <Grid.Item col={4} s={12} marginBottom={4} marginRight={2} key={chart.id}>
                    <ChartView data={chart} />
                </Grid.Item>
            ))}
        </div>
    );
}