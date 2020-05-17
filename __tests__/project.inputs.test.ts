import * as todoistClient from '../src/todoistClient';

import { berryRed } from '../src/colors';
import { dontCareAboutResponse } from "../tests/testConfigs";

describe("Test the inputs for the project methods", () => {
    beforeAll(() => {
        todoistClient.setAccessToken("abcd");
        dontCareAboutResponse();
    });

    describe("Happy path tests", () => {
        test("getAllProjects, no errors thrown", () => {
            return todoistClient.getAllProjects();
        });

        test("addProject, happy path, just content", () => {
            return todoistClient.addProject({
                name: "kwijibo"
            });
        });

        test("addProject, happy path, content and colour", () => {
            return todoistClient.addProject({
                name: "kwijibo",
                color: berryRed
            });
        });

        test("getProject, happy path", () => {
            return todoistClient.getProject(1);
        });

        test("updateProject, happy path, name set", () => {
            return todoistClient.updateProject(1, {
                name: "kwijibo"
            });
        });

        test("updateProject, happy path, color set", () => {
            return todoistClient.updateProject(1, {
                color: berryRed
            });
        });

        test("deleteProject, happy path", () => {
            return todoistClient.deleteProject(1);
        });
    });

    describe("Unhappy path tests", () => {
        describe("Tests for addProject", () => {
            test.each(["", " "])
                ("name not set, error thrown", (name: string) => {
                    todoistClient.addProject({ name: name })
                        .catch(e => {
                            expect(e).toEqual({
                                error: "Project must have a name"
                            });
                        });
                    expect.assertions(1);
                });

            test("color set, but not valid", () => {
                todoistClient.addProject({
                    name: "kwijibo",
                    color: { name: "a", id: 28, value: "" }
                }).catch(e => {
                    expect(e).toEqual({
                        error: "Color ID is invalid"
                    });
                });
                expect.assertions(1);
            });
        });

        describe("Tests for getProject", () => {
            test.each([-1, 0])
                ("Invalid project id throws error", (id: number) => {
                    todoistClient.getProject(id)
                        .catch(e => {
                            expect(e).toEqual({
                                error: "Invalid Project ID"
                            });
                        });
                    expect.assertions(1);
                });
        });

        describe("Tests for updateProject", () => {
            test.each([-1, 0])
                ("Invalid project id throws error", (id: number) => {
                    todoistClient.updateProject(id, {})
                        .catch(e => {
                            expect(e).toEqual({
                                error: "Invalid Project ID"
                            });
                        });
                    expect.assertions(1);
                });

            test("neither name or color set, Error thrown", () => {
                todoistClient.updateProject(1, {})
                    .catch(e => {
                        expect(e).toEqual({
                            error: "You must provide either a name or a color to update"
                        });
                    });
                expect.assertions(1);
            });

            test.each(["", " "])
                ("name is set, but is empty, Error thrown", (name: string) => {
                    todoistClient.updateProject(1, {
                        name: name
                    }).catch(e => {
                        expect(e).toEqual({
                            error: "Project name cannot be empty or undefined"
                        });
                    });
                    expect.assertions(1);
                });

            test("color is set, but is invalid, Error thrown", () => {
                todoistClient.updateProject(1, {
                    color: { name: "a", id: 28, value: "" }
                }).catch(e => {
                    expect(e).toEqual({
                        error: "Color ID is invalid"
                    });
                });
                expect.assertions(1);
            });
        });

        describe("Tests for deleteProject", () => {
            test.each([-1, 0])
                ("Invalid project id throws error", (id: number) => {
                    todoistClient.deleteProject(id)
                        .catch(e => {
                            expect(e).toEqual({
                                error: "Invalid Project ID"
                            });
                        });
                    expect.assertions(1);
                });
        });
    });
});