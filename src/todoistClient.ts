import { Scopes } from './scopes';
import thwack from 'thwack';

const authUrl = "https://todoist.com/oauth/authorize";
const apiUrl = "https://api.todoist.com/rest/";
const version = "v1";
const baseUrl = apiUrl + version + "/";

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

    private async get<T>(
        endPoint: string,
        requiresAuthentication: boolean = true
    ): Promise<T> {
        let url = baseUrl + endPoint;

        const response = await thwack.get(url);

        if (response.status != 200)
            throw Error;

        const body = response.data;
        return body;
    }
}