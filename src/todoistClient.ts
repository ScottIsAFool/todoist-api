import * as endPoints from './endpoints';

import { Attachment, Comment, Label, Project, Section, Task } from './entities';
import { authUrl, baseSyncUrl, baseUrl, tokenUrl } from './consts';
import thwack, { ThwackOptions, ThwackResponse } from 'thwack';

import { Scopes } from './scopes';

interface TaskOptionsBase {
    label_ids?: number[],
    priority?: priority,
    due_string?: string,
    due_date?: string,
    due_datetime?: string,
    due_lang?: string
};

export interface UpdateTaskOptions extends TaskOptionsBase {
    content?: string,
};

export interface AddTaskOptions extends TaskOptionsBase {
    content: string,
    project_id?: number,
    section_id?: number,
    parent?: number,
    order?: number,
};

export interface TaskFetchOptions {
    project_id?: number,
    label_id?: number,
    filter?: string,
    lang?: string
};

export enum priority {
    urgent = 4,
    high = 3,
    medium = 2,
    normal = 1
};

export interface AddCommentOptions {
    content: string;
    attachment?: Attachment
};

export interface AddLabelOptions {
    name: string;
    order?: number;
};

export interface UpdateLabelOptions {
    name?: string;
    order?: number;
};

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

    //#region Task methods

    async getTasks(fetchOptions?: TaskFetchOptions): Promise<Task[]> {
        this.checkForAccessToken();

        const response = this.get<Task[]>(
            endPoints.tasks,
            true, false,
            fetchOptions);

        return response;
    }

    async addTask(options: AddTaskOptions): Promise<Task> {
        this.checkForAccessToken();

        if (this.stringIsUndefinedOrEmpty(options.content)) {
            throw new Error("You must supply content");
        }

        const response = await this.post<Task>(
            endPoints.tasks,
            options
        );

        return response;
    }

    async getTask(taskId: number): Promise<Task> {
        this.checkForAccessToken();

        const endPoint = `${endPoints.tasks}/${taskId}`;
        const response = this.get<Task>(endPoint);

        return response;
    }

    async updateTask(taskId: number, options: UpdateTaskOptions): Promise<any> {
        this.checkForAccessToken();

        const endPoint = `${endPoints.tasks}/${taskId}`;

        await this.post<any>(endPoint, options);
    }

    async closeTask(taskId: number): Promise<any> {
        this.checkForAccessToken();

        const endPoint = `${endPoints.tasks}/${taskId}/close`;

        await this.post<any>(endPoint, {});
    }

    async reopenTask(taskId: number): Promise<any> {
        this.checkForAccessToken();

        const endPoint = `${endPoints.tasks}/${taskId}/reopen`;

        await this.post<any>(endPoint, {});
    }

    async deleteTask(taskId: number): Promise<any> {
        this.checkForAccessToken();

        const endPoint = `${endPoints.tasks}/${taskId}`;

        await this.delete(endPoint);
    }

    //#endregion

    //#region Comment methods

    async getTaskComments(taskId: number): Promise<Comment[]> {
        this.checkForAccessToken();

        const endpoint = `${endPoints.comments}?task_id=${taskId}`;

        const response = await this.get<Comment[]>(endpoint);

        return response;
    }

    async getProjectComments(projectId: number): Promise<Comment[]> {
        this.checkForAccessToken();

        const endpoint = `${endPoints.comments}?project_id=${projectId}`;

        const response = await this.get<Comment[]>(endpoint);

        return response;
    }

    addTaskComment(taskId: number, options: AddCommentOptions): Promise<Comment> {
        this.checkForAccessToken();

        if (this.stringIsUndefinedOrEmpty(options.content)) {
            throw new Error("You must supply content for the comment");
        }

        const data = {
            task_id: taskId,
            ...options
        };

        return this.post<Comment>(endPoints.comments, data);
    }

    addProjectComment(projectId: number, options: AddCommentOptions): Promise<Comment> {
        this.checkForAccessToken();

        if (this.stringIsUndefinedOrEmpty(options.content)) {
            throw new Error("You must supply content for the comment");
        }

        const data = {
            project_id: projectId,
            ...options
        };

        return this.post<Comment>(endPoints.comments, data);
    }

    getComment(commentId: number): Promise<Comment> {
        this.checkForAccessToken();

        const endpoint = `${endPoints.comments}/${commentId}`;

        return this.get<Comment>(endpoint);
    }

    updateComment(commentId: number, content: string): Promise<any> {
        this.checkForAccessToken();

        if (this.stringIsUndefinedOrEmpty(content)) {
            throw new Error("You must supply content for the comment");
        }

        const endpoint = `${endPoints.comments}/${commentId}`;

        return this.post<any>(endpoint, { content: content });
    }

    deleteComment(commentId: number): Promise<any> {
        this.checkForAccessToken();

        const endpoint = `${endPoints.comments}/${commentId}`;

        return this.delete(endpoint);
    }

    //#endregion

    //#region Label methods

    getLabels(): Promise<Label[]> {
        this.checkForAccessToken();

        return this.get<Label[]>(endPoints.labels);
    }

    createLabel(options: AddLabelOptions): Promise<Label> {
        this.checkForAccessToken();

        return this.post<Label>(endPoints.labels, options);
    }

    getLabel(labelId: number): Promise<Label> {
        this.checkForAccessToken();

        const endPoint = `${endPoints.labels}/${labelId}`;

        return this.get<Label>(endPoint);
    }

    updateLabel(labelId: number, options: UpdateLabelOptions): Promise<any> {
        this.checkForAccessToken();

        const endPoint = `${endPoints.labels}/${labelId}`;

        return this.post<any>(endPoint, options);
    }

    deleteLabel(labelId: number): Promise<any> {
        this.checkForAccessToken();

        const endPoint = `${endPoints.labels}/${labelId}`;

        return this.delete(endPoint);
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
        useSyncApi: boolean = false,
        params: {} = {}
    ): Promise<T> {
        const apiUrl = useSyncApi ? baseSyncUrl : baseUrl;
        const url = apiUrl + endPoint;
        const options: ThwackOptions = {
            params: params
        };

        if (requiresAuthentication) {
            options.headers = {
                "Authentication": `Bearer ${this._accessToken}`
            };
        }

        const response = await thwack.get(url);

        if (response.status >= 300)
            throw new Error;

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

        let response: ThwackResponse<any>;
        try {
            response = await thwack.post(url, data, options);

            if (response.status >= 300)
                throw new Error();
        }
        catch (e) {
            throw new Error();
        }

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
};