import * as endPoints from './endpoints';
import * as testConfig from '../tests/testConfigs';

import { authUrl, baseSyncUrl, baseUrl, tokenUrl } from './consts';

import { Scopes } from './scopes';

test("ensures get auth url is correct", () => {
    const target = testConfig.getTarget();
    const scopes = [Scopes.TaskAdd, Scopes.DataRead];
    const state = "kwijibo";
    const expectedUrl = "https://todoist.com/oauth/authorize?client_id=1234&scope=task:add,data:read&state=kwijibo";

    expect(target.getAuthUrl(scopes, state))
        .toBe(expectedUrl);
});

test("checks the token exchange", async () => {
    const code = "1234";
    const expectedToken = "abcd";

    testConfig.setThwackResponseData(
        tokenUrl,
        {
            access_token: expectedToken
        }
    );

    const target = testConfig.getTarget();
    const token = await target.exchangeToken(code);
    expect(token).toBe(expectedToken);
});

test.each([200, 204])("checks the token revokation", (status: number) => {
    const target = testConfig.getTarget();

    testConfig.setThwackResponseData(
        baseSyncUrl + endPoints.accessTokensRevoke,
        {},
        status
    );

    expect(async () => await target.revokeAccessTokens()).not.toThrow();
});

test("checks token revokation throws if no token set", () => {
    const target = testConfig.getTarget();

    expect(target.revokeAccessTokens()).rejects.toEqual(new Error("No access token set"))
});

test("checks token revokation throws if not 2xx status", () => {
    const target = testConfig.getTarget();
    target.setAccessToken("abcd");

    testConfig.setThwackResponseData(
        baseSyncUrl + endPoints.accessTokensRevoke,
        {},
        403
    );

    expect(target.revokeAccessTokens()).rejects.toEqual(new Error())
})

