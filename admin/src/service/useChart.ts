import { useCallback, useEffect, useState } from "react";
import { Chart } from "../models/Chart";
import srvChart from './charsrv';

export const useCharts = () => {
    const [charts, setCharts] = useState<Chart[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchCharts = useCallback(async () => {
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

    const update = async (id: string, updatedChart: Partial<Chart>) => {
        try {
            await srvChart.update(id, updatedChart);
            setCharts((prevCharts) =>
                prevCharts.map((chart) => (chart.id === id ? { ...chart, ...updatedChart } : chart))
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
        fetchCharts();
    }, [fetchCharts]);

    return { isLoading, error, charts, create, update, remove, load: fetchCharts };
};
