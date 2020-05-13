import * as endPoints from '../src/endpoints';

import { authUrl, baseSyncUrl, baseUrl, tokenUrl } from '../src/consts';
import { getTarget, setThwackResponseData } from "../tests/testConfigs";

import { scopes } from '../src/scopes';

test("ensures get auth url is correct", () => {
    const target = getTarget();
    const scopesList = [scopes.taskAdd, scopes.dataRead];
    const state = "kwijibo";
    const expectedUrl = "https://todoist.com/oauth/authorize?client_id=1234&scope=task:add,data:read&state=kwijibo";

    expect(target.getAuthUrl(scopesList, state))
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

    const target = getTarget();
    const token = await target.exchangeToken(code);
    expect(token).toBe(expectedToken);
});

test.each([200, 204])("checks the token revokation", async (status: number) => {
    const target = getTarget();
    target.setAccessToken("abcd");

    setThwackResponseData(
        baseSyncUrl + endPoints.accessTokensRevoke,
        {},
        status
    );

    let error: Error | undefined;
    try {
        await target.revokeAccessTokens();
    }
    catch (e) {
        error = e;
    }

    expect(error).toBeUndefined();
});

test("checks token revokation throws if no token set", async () => {
    const target = getTarget();

    let error: Error | undefined;
    try {
        await target.revokeAccessTokens();
    }
    catch (e) {
        error = e;
    }

    expect(error).toEqual(new Error("No access token set"))
});

test("checks token revokation throws if not 2xx status", async () => {
    const target = getTarget();
    target.setAccessToken("abcd");

    setThwackResponseData(
        baseSyncUrl + endPoints.accessTokensRevoke,
        {},
        403
    );

    let error: Error | undefined = undefined;
    try {
        await target.revokeAccessTokens();
    }
    catch (e) {
        error = e;
    }

    expect(error).toEqual(new Error())
});

