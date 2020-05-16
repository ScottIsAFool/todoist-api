import * as endPoints from '../src/endpoints';

import { setThwackResponseData } from "../tests/testConfigs";
import thwack, { ThwackErrorEvent } from 'thwack';
import * as todoistClient from '../src/todoistClient';

test("checks task fetch options set", async () => {

    todoistClient.setAccessToken("956f15d24f128c2e0e706b78c635a069530ab77c");

    // setThwackResponseData(
    //     endPoints.tasks,
    //     {}
    // );

    // thwack.addEventListener("error", (event: ThwackErrorEvent) => {
    //     var i = 0;
    // })

    // const tasks = await todoistClient.getTasks();

    // let i = 0;
})