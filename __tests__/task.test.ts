import { setThwackResponseData, dontCareAboutResponse } from "../tests/testConfigs";
import thwack, { ThwackErrorEvent } from 'thwack';
import * as todoistClient from '../src/todoistClient';

describe("Test the inputs for the task methods", () => {
    beforeAll(() => {
        todoistClient.setAccessToken("abcd");
        dontCareAboutResponse();
    });

    describe("Tests for getTasks", () => {
        test("getTasks: no options, no Error", () => {
            todoistClient.getTasks().catch(e => {
                expect(e).toBeUndefined();
            });
        });

        test("getTasks: label_id set, no Error", () => {
            todoistClient.getTasks({
                label_id: 1234
            }).catch(e => {
                expect(e).toBeUndefined();
            });
        });

        test("getTasks: project_id set, no Error", () => {
            todoistClient.getTasks({
                project_id: 1234
            }).catch(e => {
                expect(e).toBeUndefined();
            });
        });

        test("getTasks: label_id and project_id set, no Error", () => {
            todoistClient.getTasks({
                label_id: 1234,
                project_id: 1234
            }).catch(e => {
                expect(e).toBeUndefined();
            });
        });

        test("getTasks: filter set, no Error", () => {
            todoistClient.getTasks({
                filter: "today"
            }).catch(e => {
                expect(e).toBeUndefined();
            });
        });

        test("getTasks: filter, label_id set, Error thrown", async () => {
            // expect.assertions(1);
            await expect(todoistClient.getTasks({
                filter: "today",
                label_id: 1234
            })).rejects.toThrowError("You may provide a label id and/or project id, or a filter name");
            // .toEqual({
            //     error: "You may provide a label id and/or project id, or a filter name"
            // });
            // });
        });

        test("getTasks: filter, project_id set, Error thrown", () => {
            expect.assertions(1);
            todoistClient.getTasks({
                filter: "today",
                project_id: 1234
            }).catch(e => {
                expect(e).toEqual({
                    error: "You may provide a label id and/or project id, or a filter name"
                });
            });
        });
    });
});