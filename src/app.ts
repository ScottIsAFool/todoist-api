import thwack, { ThwackOptions } from 'thwack';

import { TodoistClient } from './todoistClient';

const app = async () => {
    const client = new TodoistClient("", "");
    client.setAccessToken("956f15d24f128c2e0e706b78c635a069530ab77c");

    try {
        // const tasks = await client.getTasks();

        const options: ThwackOptions = {
            fetch: fetch
        }
        const w = await thwack.get("https://github.com", options);
        let e = 1;
    }
    catch (er) {
        let o = 1;
    }

    let i = 1;
}

app();