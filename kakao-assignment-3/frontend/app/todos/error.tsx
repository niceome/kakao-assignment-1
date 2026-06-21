'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="container">
            <p>문제가 발생했어요: {error.message}</p>
            <button className="btn btn-add" onClick={reset}>다시 시도</button>
        </div>
    )
}