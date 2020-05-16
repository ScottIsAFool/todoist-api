import * as endPoints from './endpoints';

import { Attachment, Comment, Label, Project, Section, Task } from './entities';
import { authUrl, baseSyncUrl, baseUrl, tokenUrl } from './consts';
import thwack, { ThwackOptions, ThwackResponse } from 'thwack';

import create from '@alcadica/state-manager';

import { Color, isValidColor } from './colors';
import { scopes } from './scopes';

interface TaskOptionsBase {
    label_ids?: number[],
    priority?: priority,
    due_string?: string,
    due_date?: string,
    due_datetime?: string,
    due_lang?: string,
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

interface SectionOptionsBase {
    name: string;
};

export interface AddSectionOptions extends SectionOptionsBase {
    project_id: number;
    order?: number;
};

export interface UpdateSectionOptions extends SectionOptionsBase {
};

export interface AddProjectOptions {
    name: string;
    parent?: number;
    color?: Color;
};

export interface UpdateProjectOptions {
    name?: string;
    color?: Color;
};

interface LabelOptionsBase {
    order?: number;
    color?: Color;
};

export interface AddLabelOptions extends LabelOptionsBase {
    name: string;
};

export interface UpdateLabelOptions extends LabelOptionsBase {
    name?: string;
};

interface ClientDetails {
    clientSecret: string;
    clientId: string;
};

const clientDetailsState = create<ClientDetails>();
const accessTokenState = create<AccessToken>();

//#region Authentication methods

export const setClientDetails = (
    clientSecret: string,
    clientId: string
) => {
    clientDetailsState.update({
        clientId: clientId,
        clientSecret: clientSecret
    });
}

export const setAccessToken = (accessToken: string) => {
    accessTokenState.update({ access_token: accessToken });
};

export const getAuthUrl = (scopes: scopes[], state: string) => {
    const scope = scopes.toString();
    return `${authUrl}?client_id=${clientId()}&scope=${scope}&state=${state}`;
};

export const exchangeToken = async (code: string): Promise<string> => {
    const data = {
        client_id: clientId(),
        client_secret: clientSecret(),
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
        client_id: clientId(),
        client_secret: clientSecret(),
        access_token: accessToken()
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

export const createProject = (options: AddProjectOptions): Promise<Project> => {
    if (stringIsUndefinedOrEmpty(options.name)) {
        throw new Error("Project must have a name");
    }

    if (options.color && !isValidColor(options.color.id)) {
        throw new Error("Color ID is invalid");
    }

    return post<Project>(
        endPoints.projects,
        options
    );
};

export const getProject = (projectId: number): Promise<Project> => {
    if (projectId <= 0) {
        throw new Error("Invalid Project ID");
    }

    const endPoint = `${endPoints.projects}/${projectId}`;

    return get<Project>(endPoint);
};

export const updateProject = (projectId: number, options: UpdateProjectOptions): Promise<any> => {
    if (projectId <= 0) {
        throw new Error("Invalid Project ID");
    }
    if (stringIsUndefinedOrEmpty(options.name) && !options.color) {
        throw new Error("You must provide either a name or a color to update");
    }
    if (options.color && !isValidColor(options.color.id)) {
        throw new Error("Color ID is invalid");
    }

    const endPoint = `${endPoints.projects}/${projectId}`;

    return post<any>(endPoint, options);
};

export const deleteProject = (projectId: number): Promise<any> => {
    if (projectId <= 0) {
        throw new Error("Invalid Project ID");
    }

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

export const createSection = (options: AddSectionOptions): Promise<Section> => {
    if (stringIsUndefinedOrEmpty(options.name)) {
        throw new Error("Section must have a name");
    }

    return post<Section>(
        endPoints.sections,
        options
    );
};

export const getSection = (sectionId: number): Promise<Section> => {
    if (sectionId <= 0) {
        throw new Error("Invalid Section ID");
    }

    const endPoint = `${endPoints.sections}/${sectionId}`;

    return get<Section>(endPoint);
};

export const updateSection = (sectionId: number, options: UpdateSectionOptions): Promise<any> => {
    if (sectionId <= 0) {
        throw new Error("Invalid Section ID");
    }

    if (stringIsUndefinedOrEmpty(options.name)) {
        throw new Error("You must provide a name");
    }

    const endPoint = `${endPoints.sections}/${sectionId}`;

    return post<any>(endPoint, options);
};

export const deleteSection = (sectionId: number): Promise<any> => {
    if (sectionId <= 0) {
        throw new Error("Invalid Section ID");
    }

    const endPoint = `${endPoints.sections}/${sectionId}`;

    return deleteCall(endPoint);
};

//#endregion

//#region Task methods

export const getTasks = (options?: TaskFetchOptions): Promise<Task[]> => {
    if (options) {
        if ((options.label_id || options.project_id) && options.filter) {
            throw new Error("You may provide a label id and/or project id, or a filter name");
        }
    }

    return get<Task[]>(
        endPoints.tasks,
        options);
};

export const addTask = (options: AddTaskOptions): Promise<Task> => {
    if (stringIsUndefinedOrEmpty(options.content)) {
        throw new Error("You must supply content");
    }

    const [dueOptionsValid] = hasValidDueOptions(options);

    if (dueOptionsValid) {
        throw new Error("Only set one due_* option to update the due time")
    }

    return post<Task>(
        endPoints.tasks,
        options
    );
};

export const getTask = (taskId: number): Promise<Task> => {
    const endPoint = `${endPoints.tasks}/${taskId}`;
    return get<Task>(endPoint);
};

export const updateTask = (taskId: number, options: UpdateTaskOptions): Promise<any> => {
    const [dueOptionsValid, dueOptionsCount] = hasValidDueOptions(options);

    if (dueOptionsValid) {
        throw new Error("Only set one due_* option to update the due time")
    }

    if (dueOptionsCount === 0 && !options.content && !options.label_ids) {
        throw new Error("Please update either due date, color, content, or labels")
    }

    const endPoint = `${endPoints.tasks}/${taskId}`;

    return post<any>(endPoint, options);
};

export const closeTask = (taskId: number): Promise<any> => {
    const endPoint = `${endPoints.tasks}/${taskId}/close`;

    return post<any>(endPoint);
};

export const reopenTask = (taskId: number): Promise<any> => {
    const endPoint = `${endPoints.tasks}/${taskId}/reopen`;

    return post<any>(endPoint);
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
    if (stringIsUndefinedOrEmpty(options.name)) {
        throw new Error("You must provide a name for the label");
    }
    if (options.color && !isValidColor(options.color.id)) {
        throw new Error("Color ID is invalid");
    }

    return post<Label>(endPoints.labels, options);
};

export const getLabel = (labelId: number): Promise<Label> => {
    if (labelId <= 0) {
        throw new Error("Invalid label ID");
    }

    const endPoint = `${endPoints.labels}/${labelId}`;

    return get<Label>(endPoint);
};

export const updateLabel = (labelId: number, options: UpdateLabelOptions): Promise<any> => {
    if (labelId <= 0) {
        throw new Error("Invalid label ID");
    }
    if (stringIsUndefinedOrEmpty(options.name) && !options.color && !options.order) {
        throw new Error("You must provide either a name, color or order to update the label");
    }
    if (options.color && !isValidColor(options.color.id)) {
        throw new Error("Color ID is invalid");
    }

    const endPoint = `${endPoints.labels}/${labelId}`;

    return post<any>(endPoint, options);
};

export const deleteLabel = (labelId: number): Promise<any> => {
    if (labelId <= 0) {
        throw new Error("Invalid label ID");
    }

    const endPoint = `${endPoints.labels}/${labelId}`;

    return deleteCall(endPoint);
};

//#endregion

const checkForAccessToken = () => {
    if (stringIsUndefinedOrEmpty(accessToken())) {
        throw new Error("No access token set");
    }
};

const accessToken = () => accessTokenState.getState().access_token;
const clientId = () => clientDetailsState.getState().clientId;
const clientSecret = () => clientDetailsState.getState().clientSecret;

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
            "Authorization": `Bearer ${accessToken()}`
        };
    }

    let response: ThwackResponse<any>;
    try {
        response = await thwack.get(url);
    }
    catch (e) {
        throw new Error();
    }

    if (response.status >= 300)
        throw new Error;

    const body = response.data;
    return body;
};

const post = async <T>(
    endPoint: string,
    data: {} = {},
    requiresAuthentication: boolean = true,
    useSyncApi: boolean = false
): Promise<T> => {
    const apiUrl = useSyncApi ? baseSyncUrl : baseUrl;
    const url = apiUrl + endPoint;
    const options: ThwackOptions = {};

    if (requiresAuthentication) {
        checkForAccessToken();
        options.headers = {
            "Authorization": `Bearer ${accessToken()}`
        };
    }

    let response: ThwackResponse<any>;
    try {
        response = await thwack.post(url, data, options);
    }
    catch (e) {
        throw new Error();
    }

    if (response.status >= 300)
        throw new Error;

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
            "Authorization": `Bearer ${accessToken()}`
        };
    }

    let response: ThwackResponse<any>;
    try {
        response = await thwack.delete(url, options);
    }
    catch (e) {
        throw new Error();
    }

    if (response.status >= 300) {
        throw new Error;
    }
};

interface AccessToken {
    access_token: string,
    token_type: string
};

const hasValidDueOptions = (options: TaskOptionsBase): [boolean, number] => {
    let dueOptionsSet = 0;
    if (options.due_date) {
        dueOptionsSet++;
    }
    if (options.due_datetime) {
        dueOptionsSet++;
    }
    if (options.due_string) {
        dueOptionsSet++;
    }

    return [dueOptionsSet <= 1, dueOptionsSet];
};