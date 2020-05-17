import * as todoistClient from '../src/todoistClient';

import { dontCareAboutResponse } from "../tests/testConfigs";

describe("Test the inputs for the task methods", () => {
    beforeAll(() => {
        todoistClient.setAccessToken("abcd");
        dontCareAboutResponse();
    });

    describe("Happy path tests", () => {
        test("deleteTask: Valid task id doesn't throw error", () => {
            return todoistClient.deleteTask(1);
        });

        test("reopenTask: Valid task id doesn't throw error", () => {
            return todoistClient.reopenTask(1);
        });

        test("closeTask: Valid task id doesn't throw error", () => {
            return todoistClient.closeTask(1);
        });

        test("updateTask: Valid task id doesn't throw error", () => {
            return todoistClient.updateTask(1, { content: "kwijibo" });
        });

        test("getTask: Valid task id doesn't throw error", () => {
            return todoistClient.getTask(1);
        });
        test("addTask: Content not empty, no error thrown", () => {
            return todoistClient.addTask({ content: "kwijibo" });
        });

        test("getTasks: no options, no Error", () => {
            return todoistClient.getTasks();
        });

        test("getTasks: label_id set, no Error", () => {
            return todoistClient.getTasks({
                label_id: 1234
            });
        });

        test("getTasks: project_id set, no Error", () => {
            return todoistClient.getTasks({
                project_id: 1234
            });
        });

        test("getTasks: label_id and project_id set, no Error", () => {
            return todoistClient.getTasks({
                label_id: 1234,
                project_id: 1234
            });
        });

        test("getTasks: filter set, no Error", () => {
            return todoistClient.getTasks({
                filter: "today"
            });
        });
    });

    describe("Unhappy path tests", () => {
        describe("Tests for getTasks", () => {
            test("getTasks: filter, label_id set, Error thrown", async () => {
                expect.assertions(1);
                try {
                    await todoistClient.getTasks({
                        filter: "today",
                        label_id: 1234
                    });
                }
                catch (e) {
                    expect(e).toEqual(new Error("You may provide a label id and/or project id, or a filter name"));
                }
            });

            test("getTasks: filter, project_id set, Error thrown", async () => {
                expect.assertions(1);
                try {
                    await todoistClient.getTasks({
                        filter: "today",
                        project_id: 1234
                    });
                }
                catch (e) {
                    expect(e).toEqual(new Error("You may provide a label id and/or project id, or a filter name"));
                }
            });
        });

        describe("Tests for addTask", () => {
            test.each(["", " "])("Content is empty, throws error",
                async (content: string) => {
                    try {
                        await todoistClient.addTask({ content: content });
                    }

                    catch (e) {

                        expect(e).toEqual(new Error("You must supply content"));
                    }
                    expect.assertions(1);
                });

            test("Invalid due dates throws error", async () => {
                try {
                    await todoistClient.addTask({
                        content: "kwijibo",
                        due_date: "date",
                        due_string: "next monday"
                    });
                }
                catch (e) {
                    expect(e).toEqual(new Error("Only set one due_* option to update the due time"));
                }
                expect.assertions(1);
            });
        });

        describe("Tests for getTask", () => {
            test.each([-1, 0])
                ("Invalid task id throws error", async (id: number) => {
                    try {
                        await todoistClient.getTask(id);
                    }
                    catch (e) {
                        expect(e).toEqual(new Error("Invalid task ID"));
                    }
                    expect.assertions(1);
                });
        });

        describe("Tests for updateTask", () => {
            test.each([-1, 0])
                ("Invalid task id throws error", async (id: number) => {
                    try {
                        await todoistClient.updateTask(id, {});
                    }
                    catch (e) {

                        expect(e).toEqual(new Error("Invalid task ID"));
                    }
                    expect.assertions(1);
                });

            test("Invalid due dates throws error", async () => {
                try {
                    await todoistClient.updateTask(1, {
                        due_date: "date",
                        due_string: "next monday"
                    });
                }
                catch (e) {
                    expect(e).toEqual(new Error("Only set one due_* option to update the due time"));
                }
                expect.assertions(1);
            });

            test("No options set throws error", async () => {
                try {
                    await todoistClient.updateTask(1, {});
                }
                catch (e) {
                    expect(e).toEqual(new Error("Please update either due date, color, content, or labels"));
                }
                expect.assertions(1);
            });
        });

        describe("closeTask tests", () => {
            test.each([-1, 0])
                ("Invalid task id throws error", async (id: number) => {
                    try {
                        await todoistClient.closeTask(id);
                    }
                    catch (e) {
                        expect(e).toEqual(new Error("Invalid task ID"));
                    }
                    expect.assertions(1);
                });
        });

        describe("reopenTask tests", () => {
            test.each([-1, 0])
                ("Invalid task id throws error", async (id: number) => {
                    try {
                        await todoistClient.reopenTask(id);
                    }
                    catch (e) {
                        expect(e).toEqual(new Error("Invalid task ID"));
                    }
                    expect.assertions(1);
                });
        });

        describe("deleteTask tests", () => {
            test.each([-1, 0])
                ("Invalid task id throws error", async (id: number) => {
                    try {
                        await todoistClient.deleteTask(id);
                    }
                    catch (e) {
                        expect(e).toEqual(new Error("Invalid task ID"));
                    }
                    expect.assertions(1);
                });
        });
    });
});