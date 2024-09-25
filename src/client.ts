import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Parameter } from './interfaces/parameter';

export class Client {
    private readonly POKEMONTCG_API_BASE_URL: string =
        'https://api.pokemontcg.io';
    private readonly POKEMONTCG_API_VERSION: string = '2';
    private readonly POKEMONTCG_API_URL: string;
    private readonly POKEMONTCG_API_KEY?: string =
        process.env.POKEMONTCG_API_KEY;

    private static instance: Client;

    private constructor() {
        this.POKEMONTCG_API_URL = `${this.POKEMONTCG_API_BASE_URL}/v${this.POKEMONTCG_API_VERSION}`;
    }

    public static getInstance(): Client {
        if (!Client.instance) {
            Client.instance = new Client();
        }
        return Client.instance;
    }

    async get<T>(resource: string, params?: Parameter | string): Promise<T> {
        let url = `${this.POKEMONTCG_API_URL}/${resource}`;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.POKEMONTCG_API_KEY) {
            headers['X-Api-Key'] = this.POKEMONTCG_API_KEY;
        }

        const config: AxiosRequestConfig = {
            headers,
        };

        if (typeof params === 'string') {
            url += `/${params}`;
        } else if (params) {
            url += `?${this.stringify(params)}`;
        }

        try {
            const response: AxiosResponse<{ data: T }> = await axios.get(
                url,
                config
            );
            return response.data.data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    private stringify(params: Parameter): string {
        return Object.entries(params)
            .map(
                ([key, value]) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(
                        String(value)
                    )}`
            )
            .join('&');
    }
}
