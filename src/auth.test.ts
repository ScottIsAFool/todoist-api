import * as testConfig from '../tests/testConfigs';

import { authUrl, baseUrl, tokenUrl } from './consts';

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

