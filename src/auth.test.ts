import * as testConfig from '../tests/testConfigs';

import { Scopes } from './scopes';

test("ensures get auth url is correct", () => {
    const target = testConfig.getTarget();
    const scopes = [Scopes.TaskAdd, Scopes.DataRead];
    const state = "kwijibo";

    expect(target.getAuthUrl(scopes, state))
        .toBe("https://todoist.com/oauth/authorize?client_id=1234&scope=task:add,data:read&state=kwijibo")
});

