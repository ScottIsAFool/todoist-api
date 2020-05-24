const apiUrl = "https://api.todoist.com/rest/";
const syncUrl = "https://api.todoist.com/sync/";
const syncVersion = "v8";
const version = "v1";

export const authUrl = "https://todoist.com/oauth/authorize";
export const tokenUrl = "https://todoist.com/oauth/access_token";
export const baseUrl = apiUrl + version + "/";
export const baseSyncUrl = syncUrl + syncVersion + "/";

export const todoistHmacHeader = "x-todoist-hmac-sha256";
