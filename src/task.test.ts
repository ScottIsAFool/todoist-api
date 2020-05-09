import * as endPoints from './endpoints';

import { getTarget, setThwackResponseData } from "../tests/testConfigs";
import thwack, { ThwackErrorEvent } from 'thwack';

test("checks task fetch options set", async () => {
    const target = getTarget();
    target.setAccessToken("956f15d24f128c2e0e706b78c635a069530ab77c");

    // setThwackResponseData(
    //     endPoints.tasks,
    //     {}
    // );

    // thwack.addEventListener("error", (event: ThwackErrorEvent) => {
    //     var i = 0;
    // })

    // const tasks = await target.getTasks();

    // let i = 0;
})