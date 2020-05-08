import * as endPoints from './endpoints';

import { Project, Section } from './entities';
import { authUrl, baseSyncUrl, baseUrl, tokenUrl } from './consts';
import thwack, { ThwackOptions } from 'thwack';

import { Scopes } from './scopes';

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

    //#region Authentication methods

    setAccessToken(accessToken: string) {
        this._accessToken = accessToken;
    }

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
        this.checkForAccessToken();

        const data = {
            client_id: this._clientSecret,
            client_secret: this._clientSecret,
            access_token: this._accessToken
        }

        await this.post<any>(
            endPoints.accessTokensRevoke,
            data,
            false,
            true);
    }

    //#endregion

    //#region Project methods
    async getAllProjects(): Promise<Project[]> {
        this.checkForAccessToken();

        const response = await this.get<Project[]>(endPoints.projects);
        return response;
    }

    async createProject(project: Project): Promise<Project> {
        this.checkForAccessToken();

        if (this.stringIsUndefinedOrEmpty(project.name)) {
            throw new Error("Project must have a name");
        }

        const response = await this.post<Project>(
            endPoints.projects,
            project
        );

        return response;
    }

    async getProject(projectId: number): Promise<Project> {
        this.checkForAccessToken();

        const endPoint = `${endPoints.projects}/${projectId}`;

        const response = await this.get<Project>(endPoint);

        return response;
    }

    async updateProject(project: Project): Promise<any> {
        this.checkForAccessToken();

        const endPoint = `${endPoints.projects}/${project.id}`;

        await this.post<any>(endPoint, project);
    }

    async deleteProject(projectId: number): Promise<any> {
        this.checkForAccessToken();

        const endPoint = `${endPoints.projects}/${projectId}`;

        await this.delete(endPoint);
    }
    //#endregion

    //#region Section methods

    async getAllSections(): Promise<Section[]> {
        this.checkForAccessToken();

        const response = await this.get<Section[]>(endPoints.sections);

        return response;
    }

    async createSection(section: Section): Promise<Section> {
        this.checkForAccessToken();

        if (this.stringIsUndefinedOrEmpty(section.name)) {
            throw new Error("Section must have a name");
        }

        const response = await this.post<Section>(
            endPoints.sections,
            section
        );

        return response;
    }

    async getSection(sectionId: number): Promise<Section> {
        this.checkForAccessToken();

        const endPoint = `${endPoints.sections}/${sectionId}`;

        const response = await this.get<Section>(endPoint);

        return response;
    }

    async updateSection(section: Section): Promise<any> {
        this.checkForAccessToken();

        const endPoint = `${endPoints.sections}/${section.id}`;

        await this.post<any>(endPoint, section);
    }

    async deleteSection(sectionId: number): Promise<any> {
        this.checkForAccessToken();

        const endPoint = `${endPoints.sections}/${sectionId}`;

        await this.delete(endPoint);
    }

    //#endregion

    private checkForAccessToken() {
        if (this.stringIsUndefinedOrEmpty(this._accessToken)) {
            throw new Error("No access token set");
        }
    }

    private stringIsUndefinedOrEmpty(str?: string): boolean {
        return str === undefined
            || str.trim() === "";
    }

    private async get<T>(
        endPoint: string,
        requiresAuthentication: boolean = true,
        useSyncApi: boolean = false
    ): Promise<T> {
        const apiUrl = useSyncApi ? baseSyncUrl : baseUrl;
        const url = apiUrl + endPoint;
        const options: ThwackOptions = {};

        if (requiresAuthentication) {
            options.headers = {
                "Authentication": `Bearer ${this._accessToken}`
            };
        }

        const response = await thwack.get(url, options);

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
        const options: ThwackOptions = {};

        if (requiresAuthentication) {
            options.headers = {
                "Authentication": `Bearer ${this._accessToken}`
            };
        }

        const response = await thwack.post(url, data, options);

        if (response.status >= 300)
            throw Error;

        const body = response.data;
        return body;
    }

    private async delete(
        endPoint: string,
        requiresAuthentication: boolean = true,
        useSyncApi: boolean = false
    ): Promise<any> {
        const apiUrl = useSyncApi ? baseSyncUrl : baseUrl;
        const url = apiUrl + endPoint;
        const options: ThwackOptions = {};

        if (requiresAuthentication) {
            options.headers = {
                "Authentication": `Bearer ${this._accessToken}`
            };
        }

        const response = await thwack.delete(url, options);

        if (response.status >= 300) {
            throw new Error;
        }
    }
}

interface AccessToken {
    access_token: string,
    token_type: string
}