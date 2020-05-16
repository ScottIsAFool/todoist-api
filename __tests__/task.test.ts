import * as todoistClient from '../src/todoistClient';

import { dontCareAboutResponse, setThwackResponseData } from "../tests/testConfigs";
import thwack, { ThwackErrorEvent } from 'thwack';

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

    describe("Tests for addTask", () => {
        test.each(["", " "])("Content is empty, throws error",
            (content: string) => {
                todoistClient.addTask({ content: content })
                    .catch(e => {
                        expect(e).toEqual({
                            error: "You must supply content"
                        });
                    });
            });

        test("Content not empty, no error thrown", () => {
            todoistClient.addTask({ content: "kwijibo" })
                .then(task => expect(task).not.toBeUndefined());
        });

        test("Invalid due dates throws error", () => {
            todoistClient.addTask({
                content: "kwijibo",
                due_date: "date",
                due_string: "next monday"
            }).catch(e => {
                expect(e).toEqual({
                    error: "Only set one due_* option to update the due time"
                })
            });
        });
    });

    describe("Tests for getTask", () => {
        test.each([-1, 0])
            ("Invalid task id throws error", (id: number) => {
                todoistClient.getTask(id)
                    .catch(e => {
                        expect(e).toEqual({
                            error: "Invalid task ID"
                        });
                    });
            });

        test("Valid task id doesn't throw error", () => {
            todoistClient.getTask(1)
                .then(task => {
                    expect(task).not.toBeUndefined();
                });
        });
    });

    describe("Tests for updateTask", () => {
        test.each([-1, 0])
            ("Invalid task id throws error", (id: number) => {
                todoistClient.updateTask(id, {})
                    .catch(e => {
                        expect(e).toEqual({
                            error: "Invalid task ID"
                        });
                    });
            });

        test("Valid task id doesn't throw error", () => {
            todoistClient.updateTask(1, { content: "kwijibo" })
                .then(task => {
                    expect(task).not.toBeUndefined();
                });
        });

        test("Invalid due dates throws error", () => {
            todoistClient.updateTask(1, {
                due_date: "date",
                due_string: "next monday"
            }).catch(e => {
                expect(e).toEqual({
                    error: "Only set one due_* option to update the due time"
                })
            });
        });

        test("No options set throws error", () => {
            todoistClient.updateTask(1, {})
                .catch(e => {
                    expect(e).toEqual({
                        error: "Please update either due date, color, content, or labels"
                    });
                });
        });
    });

    describe("closeTask tests", () => {
        test.each([-1, 0])
            ("Invalid task id throws error", (id: number) => {
                todoistClient.closeTask(id)
                    .catch(e => {
                        expect(e).toEqual({
                            error: "Invalid task ID"
                        });
                    });
            });

        test("Valid task id doesn't throw error", () => {
            todoistClient.closeTask(1)
                .then(task => {
                    expect(task).not.toBeUndefined();
                });
        });
    });

    describe("reopenTask tests", () => {
        test.each([-1, 0])
            ("Invalid task id throws error", (id: number) => {
                todoistClient.reopenTask(id)
                    .catch(e => {
                        expect(e).toEqual({
                            error: "Invalid task ID"
                        });
                    });
            });

        test("Valid task id doesn't throw error", () => {
            todoistClient.reopenTask(1)
                .then(task => {
                    expect(task).not.toBeUndefined();
                });
        });
    });

    describe("deleteTask tests", () => {
        test.each([-1, 0])
            ("Invalid task id throws error", (id: number) => {
                todoistClient.deleteTask(id)
                    .catch(e => {
                        expect(e).toEqual({
                            error: "Invalid task ID"
                        });
                    });
            });

        test("Valid task id doesn't throw error", async () => {
            await expect(todoistClient.deleteTask(1)).resolves.not.toThrowError();
        });
    });
});