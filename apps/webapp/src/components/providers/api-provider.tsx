'use client';

import { useEffect } from 'react';
import { createApiClient, TaskAPI } from '@appomate-challenge/api-client';

let isInitialized = false;

export function ApiProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (!isInitialized) {
            const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
            console.log('Initializing API client with baseURL:', baseURL);
            const apiClient = createApiClient({
                baseURL,
            });
            TaskAPI.initialize(apiClient);
            isInitialized = true;
            console.log('API client initialized successfully');
        }
    }, []);

    return <>{children}</>;
}
