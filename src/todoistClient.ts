import * as endPoints from './endpoints';

import { Attachment, Comment, Label, Project, Section, Task } from './entities';
import { authUrl, baseSyncUrl, baseUrl, tokenUrl } from './consts';
import thwack, { ThwackOptions, ThwackResponse } from 'thwack';

import { Color } from './colors';
import { scopes } from './scopes';

interface TaskOptionsBase {
    label_ids?: number[],
    priority?: priority,
    due_string?: string,
    due_date?: string,
    due_datetime?: string,
    due_lang?: string,
    color?: Color
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

// export class TodoistClient {
//     constructor(
//         clientSecret: string,
//         clientId: string
//     ) {
//         _clientId = clientId;
//         _clientSecret = clientSecret;
//     }

let _clientSecret: string;
let _clientId: string
let _accessToken: string | undefined;

//#region Authentication methods

export const setClientDetails = (
    clientSecret: string,
    clientId: string
) => {
    _clientSecret = clientSecret;
    _clientId = clientId;
}

export const setAccessToken = (accessToken: string) => {
    _accessToken = accessToken;
};

export const getAuthUrl = (scopes: scopes[], state: string) => {
    const scope = scopes.toString();
    return `${authUrl}?client_id=${_clientId}&scope=${scope}&state=${state}`;
};

export const exchangeToken = async (code: string): Promise<string> => {
    const data = {
        client_id: _clientId,
        client_secret: _clientSecret,
        code: code
    };

    const response = await thwack.post(tokenUrl, data);

    if (response.status !== 200)
        throw Error;

    const accessToken: AccessToken = response.data;

    return accessToken.access_token;
};

export const revokeAccessTokens = async (): Promise<any> => {
    checkForAccessToken();

    const data = {
        client_id: _clientSecret,
        client_secret: _clientSecret,
        access_token: _accessToken
    }

    await post<any>(
        endPoints.accessTokensRevoke,
        data,
        false,
        true);
};

//#endregion

//#region Project methods
export const getAllProjects = (): Promise<Project[]> => {
    return get<Project[]>(endPoints.projects);
};

export const createProject = (project: Project): Promise<Project> => {
    if (stringIsUndefinedOrEmpty(project.name)) {
        throw new Error("Project must have a name");
    }

    return post<Project>(
        endPoints.projects,
        project
    );
};

export const getProject = (projectId: number): Promise<Project> => {
    const endPoint = `${endPoints.projects}/${projectId}`;

    return get<Project>(endPoint);
};

export const updateProject = (project: Project): Promise<any> => {
    const endPoint = `${endPoints.projects}/${project.id}`;

    return post<any>(endPoint, project);
};

export const deleteProject = (projectId: number): Promise<any> => {
    const endPoint = `${endPoints.projects}/${projectId}`;

    return deleteCall(endPoint);
};
//#endregion

//#region Section methods

export const getAllSections = (): Promise<Section[]> => {
    return get<Section[]>(endPoints.sections);
};

export const getProjectSections = (projectId: number): Promise<Section[]> => {
    if (projectId <= 0) {
        throw new Error("Invalid projectID");
    }

    const data = {
        project_id: projectId
    };

    return get<Section[]>(endPoints.sections, data);
};

export const createSection = (section: Section): Promise<Section> => {
    if (stringIsUndefinedOrEmpty(section.name)) {
        throw new Error("Section must have a name");
    }

    return post<Section>(
        endPoints.sections,
        section
    );
};

export const getSection = (sectionId: number): Promise<Section> => {
    const endPoint = `${endPoints.sections}/${sectionId}`;

    return get<Section>(endPoint);
};

export const updateSection = (section: Section): Promise<any> => {
    const endPoint = `${endPoints.sections}/${section.id}`;

    return post<any>(endPoint, section);
};

export const deleteSection = (sectionId: number): Promise<any> => {
    const endPoint = `${endPoints.sections}/${sectionId}`;

    return deleteCall(endPoint);
};

//#endregion

//#region Task methods

export const getTasks = (fetchOptions?: TaskFetchOptions): Promise<Task[]> => {
    return get<Task[]>(
        endPoints.tasks,
        fetchOptions);
};

export const addTask = (options: AddTaskOptions): Promise<Task> => {
    if (stringIsUndefinedOrEmpty(options.content)) {
        throw new Error("You must supply content");
    }

    return post<Task>(
        endPoints.tasks,
        options
    );
};

export const getTask = (taskId: number): Promise<Task> => {
    const endPoint = `${endPoints.tasks}/${taskId}`;
    const response = get<Task>(endPoint);

    return response;
};

export const updateTask = (taskId: number, options: UpdateTaskOptions): Promise<any> => {
    const endPoint = `${endPoints.tasks}/${taskId}`;

    return post<any>(endPoint, options);
};

export const closeTask = (taskId: number): Promise<any> => {
    const endPoint = `${endPoints.tasks}/${taskId}/close`;

    return post<any>(endPoint, {});
};

export const reopenTask = (taskId: number): Promise<any> => {
    const endPoint = `${endPoints.tasks}/${taskId}/reopen`;

    return post<any>(endPoint, {});
};

export const deleteTask = (taskId: number): Promise<any> => {
    const endPoint = `${endPoints.tasks}/${taskId}`;

    return deleteCall(endPoint);
};

//#endregion

//#region Comment methods

export const getTaskComments = (taskId: number): Promise<Comment[]> => {
    const endpoint = `${endPoints.comments}?task_id=${taskId}`;

    return get<Comment[]>(endpoint);
};

export const getProjectComments = (projectId: number): Promise<Comment[]> => {
    const endpoint = `${endPoints.comments}?project_id=${projectId}`;

    return get<Comment[]>(endpoint);
};

export const addTaskComment = (taskId: number, options: AddCommentOptions): Promise<Comment> => {
    if (stringIsUndefinedOrEmpty(options.content)) {
        throw new Error("You must supply content for the comment");
    }

    const data = {
        task_id: taskId,
        ...options
    };

    return post<Comment>(endPoints.comments, data);
};

export const addProjectComment = (projectId: number, options: AddCommentOptions): Promise<Comment> => {
    if (stringIsUndefinedOrEmpty(options.content)) {
        throw new Error("You must supply content for the comment");
    }

    const data = {
        project_id: projectId,
        ...options
    };

    return post<Comment>(endPoints.comments, data);
};

export const getComment = (commentId: number): Promise<Comment> => {
    const endpoint = `${endPoints.comments}/${commentId}`;

    return get<Comment>(endpoint);
};

export const updateComment = (commentId: number, content: string): Promise<any> => {
    if (stringIsUndefinedOrEmpty(content)) {
        throw new Error("You must supply content for the comment");
    }

    const endpoint = `${endPoints.comments}/${commentId}`;

    return post<any>(endpoint, { content: content });
};

export const deleteComment = (commentId: number): Promise<any> => {
    const endpoint = `${endPoints.comments}/${commentId}`;

    return deleteCall(endpoint);
};

//#endregion

//#region Label methods

export const getLabels = (): Promise<Label[]> => {
    return get<Label[]>(endPoints.labels);
};

export const createLabel = (options: AddLabelOptions): Promise<Label> => {
    return post<Label>(endPoints.labels, options);
};

export const getLabel = (labelId: number): Promise<Label> => {
    const endPoint = `${endPoints.labels}/${labelId}`;

    return get<Label>(endPoint);
};

export const updateLabel = (labelId: number, options: UpdateLabelOptions): Promise<any> => {
    const endPoint = `${endPoints.labels}/${labelId}`;

    return post<any>(endPoint, options);
};

export const deleteLabel = (labelId: number): Promise<any> => {
    const endPoint = `${endPoints.labels}/${labelId}`;

    return deleteCall(endPoint);
};

//#endregion

const checkForAccessToken = () => {
    if (stringIsUndefinedOrEmpty(_accessToken)) {
        throw new Error("No access token set");
    }
};

const stringIsUndefinedOrEmpty = (str?: string): boolean => {
    return str === undefined
        || str.trim() === "";
};

const get = async <T>(
    endPoint: string,
    params: {} = {},
    requiresAuthentication: boolean = true,
    useSyncApi: boolean = false
): Promise<T> => {
    const apiUrl = useSyncApi ? baseSyncUrl : baseUrl;
    const url = apiUrl + endPoint;
    const options: ThwackOptions = {
        params: params
    };

    if (requiresAuthentication) {
        checkForAccessToken();
        options.headers = {
            "Authorization": `Bearer ${_accessToken}`
        };
    }

    const response = await thwack.get(url);

    if (response.status >= 300)
        throw new Error;

    const body = response.data;
    return body;
};

const post = async <T>(
    endPoint: string,
    data: {},
    requiresAuthentication: boolean = true,
    useSyncApi: boolean = false
): Promise<T> => {
    const apiUrl = useSyncApi ? baseSyncUrl : baseUrl;
    const url = apiUrl + endPoint;
    const options: ThwackOptions = {};

    if (requiresAuthentication) {
        checkForAccessToken();
        options.headers = {
            "Authorization": `Bearer ${_accessToken}`
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
};

const deleteCall = async (
    endPoint: string,
    requiresAuthentication: boolean = true,
    useSyncApi: boolean = false
): Promise<any> => {
    const apiUrl = useSyncApi ? baseSyncUrl : baseUrl;
    const url = apiUrl + endPoint;
    const options: ThwackOptions = {};

    if (requiresAuthentication) {
        checkForAccessToken();
        options.headers = {
            "Authorization": `Bearer ${_accessToken}`
        };
    }

    const response = await thwack.delete(url, options);

    if (response.status >= 300) {
        throw new Error;
    }
};
// }

interface AccessToken {
    access_token: string,
    token_type: string
};