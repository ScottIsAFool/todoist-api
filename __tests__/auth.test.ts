import * as endPoints from '../src/endpoints';
import * as todoistClient from '../src/todoistClient';

import { authUrl, baseSyncUrl, baseUrl, tokenUrl } from '../src/consts';

import { scopes } from '../src/scopes';
import { setThwackResponseData } from "../tests/testConfigs";

describe("authentication tests", () => {
    beforeAll(() => {
        todoistClient.setClientDetails("abcd", "1234");
    });

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

    test.each([200, 204])("checks the token revokation succeeds with the right status",
        (status: number) => {
            todoistClient.setAccessToken("abcd");

            setThwackResponseData(
                baseSyncUrl + endPoints.accessTokensRevoke,
                {},
                status
            );

            return todoistClient.revokeAccessTokens();
        });

    test("checks token revokation throws if no token set", async () => {
        try {
            await todoistClient.revokeAccessTokens()
        }
        catch (e) {
            expect(e).toEqual(new Error("No access token set"));
        }
        expect.assertions(1);
    });

    test("checks token revokation throws if not 2xx status", async () => {
        todoistClient.setAccessToken("abcd");

        setThwackResponseData(
            baseSyncUrl + endPoints.accessTokensRevoke,
            {},
            403
        );

        try {
            await todoistClient.revokeAccessTokens();
        }
        catch (e) {
            expect(e).toEqual(new Error());
        }
        expect.assertions(1);
    });
});