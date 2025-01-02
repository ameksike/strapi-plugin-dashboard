import { useState, useEffect } from 'react';
type Dimension = 'width' | 'height';

export function useSize() {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const size = { width, height };
    const percernt = (val: number, type: Dimension = "width") => size[type] * (val / 100);

    return { width, height, percernt };
}