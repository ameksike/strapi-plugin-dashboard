import { useCallback, useEffect, useState } from "react";
import { Chart } from "../models/Chart";
import srvChart from './charsrv';

export const useCharts = ({ all = true, id = "" }: { all?: boolean, id?: string }) => {
    const [chart, setChart] = useState<Chart | null>(null);
    const [charts, setCharts] = useState<Chart[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const load = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await srvChart.getAll();
            setCharts(data);
        } catch (err: any) {
            if (err.name !== "AbortError") {
                setError(err);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const find = useCallback(async (id: string) => {
        try {
            setIsLoading(true);
            const data = await srvChart.select(id);
            setChart(data);
        } catch (err: any) {
            if (err.name !== "AbortError") {
                setError(err);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const create = async (chart: Omit<Chart, 'id'>) => {
        try {
            const newChart = await srvChart.create(chart);
            setCharts((prevCharts) => [...prevCharts, newChart]);
        } catch (err: any) {
            if (err.name !== "AbortError") {
                setError(err);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const update = async (id: string, data: Partial<Chart>) => {
        try {
            await srvChart.update(id, data);
            setCharts((prevCharts) =>
                prevCharts.map((chart) => (chart.id === id ? { ...chart, ...data } : chart))
            );
        } catch (err: any) {
            if (err.name !== "AbortError") {
                setError(err);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const remove = async (id: string) => {
        try {
            await srvChart.delete(id);
            setCharts((prevCharts) => prevCharts.filter((chart) => chart.id !== id));
        } catch (err: any) {
            if (err.name !== "AbortError") {
                setError(err);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        all && load();
        id && find(id);
    }, [load, all, id]);

    return { isLoading, error, chart, charts, create, update, remove, load, find };
};
