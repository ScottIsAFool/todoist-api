import { TodoistClient } from "../src/todoistClient";

export const testClientId = "1234";
export const testClientSecret = "abcd";

export const getTarget = (): TodoistClient => {
    return new TodoistClient(testClientSecret, testClientId);
}