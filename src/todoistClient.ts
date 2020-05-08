import * as endPoints from './endpoints';

import { authUrl, baseSyncUrl, baseUrl, tokenUrl } from './consts';

import { Scopes } from './scopes';
import thwack from 'thwack';

export class TodoistClient {
    constructor(
        clientSecret: string,
        clientId: string
    ) {
        this._clientId = clientId;
        this._clientSecret = clientSecret;
    }

    private _clientSecret: string;
    private _clientId: string
    private _accessToken: string | undefined;

    getAuthUrl(scopes: Scopes[], state: string) {
        const scope = scopes.toString();
        const s = `${authUrl}?client_id=${this._clientId}&scope=${scope}&state=${state}`;
        return s;
    }

    async exchangeToken(code: string): Promise<string> {
        const data = {
            client_id: this._clientId,
            client_secret: this._clientSecret,
            code: code
        };

        const response = await thwack.post(tokenUrl, data);

        if (response.status !== 200)
            throw Error;

        const accessToken: AccessToken = response.data;

        return accessToken.access_token;
    }

    async revokeAccessTokens(): Promise<any> {
        if (this._accessToken === undefined
            || this._accessToken.trim() === "") {
            throw Error;
        }

        const data = {
            client_id: this._clientSecret,
            client_secret: this._clientSecret,
            access_token: this._accessToken
        }

        await this.post<any>(
            endPoints.AccessTokensRevoke,
            data,
            false,
            true);
    }

    private async get<T>(
        endPoint: string,
        requiresAuthentication: boolean = true,
        useSyncApi: boolean = false
    ): Promise<T> {
        const apiUrl = useSyncApi ? baseSyncUrl : baseUrl;
        const url = apiUrl + endPoint;

        const response = await thwack.get(url);

        if (response.status >= 300)
            throw Error;

        const body = response.data;
        return body;
    }

    private async post<T>(
        endPoint: string,
        data: {},
        requiresAuthentication: boolean = true,
        useSyncApi: boolean = false
    ): Promise<T> {
        const apiUrl = useSyncApi ? baseSyncUrl : baseUrl;
        const url = apiUrl + endPoint;

        const response = await thwack.post(url, data);

        if (response.status >= 300)
            throw Error;

        const body = response.data;
        return body;
    }
}

interface AccessToken {
    access_token: string,
    token_type: string
}