import thwack, { ThwackRequestEvent, ThwackResponse } from "thwack";

import { TodoistClient } from "../src/todoistClient";

export const testClientId = "1234";
export const testClientSecret = "abcd";

export const getTarget = (): TodoistClient => {
    return new TodoistClient(testClientSecret, testClientId);
};

export const setThwackResponseData = (
    endPoint: string,
    responseData: {},
    status: number = 200) => {
    thwack.addEventListener('request', (event: ThwackRequestEvent) => {
        const { options } = event;
        if (options.url === endPoint) {
            event.preventDefault();

            event.stopPropagation();

            return new thwack.ThwackResponse({
                status: status,
                data: responseData
            }, options);
        }
    })
}