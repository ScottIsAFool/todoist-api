import * as todoistClient from '../src/todoistClient';

import { dontCareAboutResponse } from "../tests/testConfigs";

describe("Input tests for comment methods", () => {
    beforeAll(() => {
        todoistClient.setAccessToken("abcd");
        dontCareAboutResponse();
    });

    describe("Happy path tests", () => {
        test("getTaskComments, happy path", () => {
            return todoistClient.getTaskComments(1);
        });

        test("getProjectComments, happy path", () => {
            return todoistClient.getProjectComments(1);
        });

        test("addTaskComment, happy path", () => {
            return todoistClient.addTaskComment(1, { content: "kwijibo" });
        });

        test("addProjectComment, happy path", () => {
            return todoistClient.addProjectComment(1, { content: "kwijibo" });
        });

        test("getComment, happy path", () => {
            return todoistClient.getComment(1);
        });

        test("updateComment happy path", () => {
            return todoistClient.updateComment(1, { content: "kwijibo" })
        });

        test("deleteComment, happy path", () => {
            return todoistClient.deleteComment(1);
        });
    });

    describe("Unhappy path tests", () => {
        describe("Tests for getTaskComments", () => {
            test.each([-1, 0])
                ("Invalid task id throws error", (id: number) => {
                    todoistClient.getTaskComments(id)
                        .catch(e => {
                            expect(e).toEqual({
                                error: "Invalid Task ID"
                            });
                        });
                    expect.assertions(1);
                });
        });

        describe("Tests for getProjectComments", () => {
            test.each([-1, 0])
                ("Invalid project id throws error", (id: number) => {
                    todoistClient.getProjectComments(id)
                        .catch(e => {
                            expect(e).toEqual({
                                error: "Invalid Project ID"
                            });
                        });
                    expect.assertions(1);
                });
        });

        describe("Tests for addTaskComment methods", () => {
            test.each([-1, 0])
                ("Invalid task id throws error", (id: number) => {
                    todoistClient.addTaskComment(id, { content: "kwijibo" })
                        .catch(e => {
                            expect(e).toEqual({
                                error: "Invalid Task ID"
                            });
                        });
                    expect.assertions(1);
                });

            test.each(["", " "])
                ("Empty content, throws Error", (content: string) => {
                    todoistClient.addTaskComment(1, { content: content })
                        .catch(e => {
                            expect(e).toEqual({
                                error: "You must supply content for the comment"
                            });
                        });
                });
        });

        describe("Tests for addProjectComment methods", () => {
            test.each([-1, 0])
                ("Invalid project id throws error", (id: number) => {
                    todoistClient.addProjectComment(id, { content: "kwijibo" })
                        .catch(e => {
                            expect(e).toEqual({
                                error: "Invalid Project ID"
                            });
                        });
                    expect.assertions(1);
                });

            test.each(["", " "])
                ("Empty content, throws Error", (content: string) => {
                    todoistClient.addProjectComment(1, { content: content })
                        .catch(e => {
                            expect(e).toEqual({
                                error: "You must supply content for the comment"
                            });
                        });
                });
        });

        describe("Tests for getComment", () => {
            test.each([-1, 0])
                ("Invalid comment id throws error", (id: number) => {
                    todoistClient.getComment(id)
                        .catch(e => {
                            expect(e).toEqual({
                                error: "Invalid Comment ID"
                            });
                        });
                    expect.assertions(1);
                });
        });

        describe("Tests for updateComment", () => {
            test.each([-1, 0])
                ("Invalid comment id throws error", (id: number) => {
                    todoistClient.updateComment(id, {})
                        .catch(e => {
                            expect(e).toEqual({
                                error: "Invalid Comment ID"
                            });
                        });
                    expect.assertions(1);
                });

            test.each(["", " "])
                ("Empty content, throws Error", (content: string) => {
                    todoistClient.updateComment(1, { content: content })
                        .catch(e => {
                            expect(e).toEqual({
                                error: "You must supply content for the comment"
                            });
                        });
                });
        });

        describe("Tests for deleteComment", () => {
            test.each([-1, 0])
                ("Invalid comment id throws error", (id: number) => {
                    todoistClient.deleteComment(id)
                        .catch(e => {
                            expect(e).toEqual({
                                error: "Invalid Comment ID"
                            });
                        });
                    expect.assertions(1);
                });
        });
    });
});