import * as endPoints from '../src/endpoints';

import { authUrl, baseSyncUrl, baseUrl, tokenUrl } from '../src/consts';
import { setThwackResponseData } from "../tests/testConfigs";
import * as todoistClient from '../src/todoistClient';

import { scopes } from '../src/scopes';

test("ensures get auth url is correct", () => {
    const scopesList = [scopes.taskAdd, scopes.dataRead];
    const state = "kwijibo";
    const expectedUrl = "https://todoist.com/oauth/authorize?client_id=1234&scope=task:add,data:read&state=kwijibo";

    expect(todoistClient.getAuthUrl(scopesList, state))
        .toBe(expectedUrl);
});

test("checks the token exchange", async () => {
    const code = "1234";
    const expectedToken = "abcd";

    setThwackResponseData(
        tokenUrl,
        {
            access_token: expectedToken
        }
    );

    const token = await todoistClient.exchangeToken(code);
    expect(token).toBe(expectedToken);
});

test.each([200, 204])("checks the token revokation", async (status: number) => {
    todoistClient.setAccessToken("abcd");

    setThwackResponseData(
        baseSyncUrl + endPoints.accessTokensRevoke,
        {},
        status
    );

    let error: Error | undefined;
    try {
        await todoistClient.revokeAccessTokens();
    }
    catch (e) {
        error = e;
    }

    expect(error).toBeUndefined();
});

test("checks token revokation throws if no token set", async () => {
    let error: Error | undefined;
    try {
        await todoistClient.revokeAccessTokens();
    }
    catch (e) {
        error = e;
    }

    expect(error).toEqual(new Error("No access token set"))
});

test("checks token revokation throws if not 2xx status", async () => {
    todoistClient.setAccessToken("abcd");

    setThwackResponseData(
        baseSyncUrl + endPoints.accessTokensRevoke,
        {},
        403
    );

    let error: Error | undefined = undefined;
    try {
        await todoistClient.revokeAccessTokens();
    }
    catch (e) {
        error = e;
    }

    expect(error).toEqual(new Error())
});

