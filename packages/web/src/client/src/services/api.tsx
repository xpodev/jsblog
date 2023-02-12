import axios from 'axios';
import { useMemo } from 'react';

export function useApi() {
    const api = useMemo(() => axios.create({
        baseURL: 'http://localhost:3000/api',
    }), []);

    return api;
}