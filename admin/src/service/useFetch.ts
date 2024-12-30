import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for fetching data from an API.
 *
 * @param {string} url - The API endpoint.
 * @param {object} [options] - The fetch options (method, headers, body, etc.).
 * @returns {object} - { data, error, isLoading, refetch }
 */
function useFetch<T>(url: string, options?: RequestInit) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const controller = new AbortController();
            const signal = controller.signal;

            const response = await fetch(url, { ...options, signal });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            setData(result);
        } catch (err: any) {
            if (err.name !== "AbortError") {
                setError(err);
            }
        } finally {
            setIsLoading(false);
        }
    }, [url, options]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, error, isLoading, refetch: fetchData };
}

export default useFetch;

/**
        import React from "react";
        import useFetch from "./hooks/useFetch";

        interface User {
            id: number;
            name: string;
            email: string;
        }

        function UserList() {
            const { data, error, isLoading, refetch } = useFetch<User[]>(
                "https://jsonplaceholder.typicode.com/users"
            );

            if (isLoading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;

            return (
                <div>
                <h1>User List</h1>
                <button onClick={refetch}>Reload</button>
                <ul>
                    {data?.map((user) => (
                        <li key={user.id}>
                            {user.name} - {user.email}
                        </li>
                    ))}
                </ul>
                </div>
            );
        }

        export default UserList;
 */