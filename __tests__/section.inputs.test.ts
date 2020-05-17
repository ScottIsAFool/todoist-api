import * as todoistClient from '../src/todoistClient';

import { dontCareAboutResponse } from "../tests/testConfigs";

describe("Test the inputs for the section methods", () => {
    beforeAll(() => {
        todoistClient.setAccessToken("abcd");
        dontCareAboutResponse();
    });

    describe("Happy path tests", () => {
        test("getAllSections, happy path", () => {
            return todoistClient.getAllSections();
        });

        test("getProjectSections, happy path", () => {
            return todoistClient.getProjectSections(1);
        });

        test("addSection, happy path", () => {
            return todoistClient.addSection({
                name: "kwijibo",
                project_id: 1
            });
        });

        test("getSection, happy path", () => {
            return todoistClient.getSection(1);
        });

        test("updateSection, happy path", () => {
            return todoistClient.updateSection(1, { name: "kwijibo" });
        });

        test("deleteSection, happy path", () => {
            return todoistClient.deleteSection(1);
        });
    });

    describe("Unhappy path", () => {
        describe("getProjectSections tests", () => {
            test.each([-1, 0])
                ("Invalid project id throws error", (id: number) => {
                    todoistClient.getProjectSections(id)
                        .catch(e => {
                            expect(e).toEqual({
                                error: "Invalid Project ID"
                            });
                        });
                    expect.assertions(1);
                });
        });

        describe("addSection Tests", () => {
            test.each(["", " "])
                ("name is empty, throws Error", (name: string) => {
                    todoistClient.addSection({ name: name, project_id: 1 })
                        .catch(e => {
                            expect(e).toEqual({
                                error: "Section must have a name"
                            });
                        });
                    expect.assertions(1);
                });

            test.each([-1, 0])
                ("name is valid, project id is invalid, throws Error", (id: number) => {
                    todoistClient.addSection({ name: "kwijibo", project_id: id })
                        .catch(e => {
                            expect(e).toEqual({
                                error: "Invalid Project ID"
                            });
                        });
                    expect.assertions(1);
                });
        });

        describe("getSection Tests", () => {
            test.each([-1, 0])
                ("Invalid section id throws error", (id: number) => {
                    todoistClient.getSection(id)
                        .catch(e => {
                            expect(e).toEqual({
                                error: "Invalid Section ID"
                            });
                        });
                    expect.assertions(1);
                });
        });

        describe("updateSection Tests", () => {
            test.each([-1, 0])
                ("Invalid section id throws error", (id: number) => {
                    todoistClient.updateSection(id, { name: "" })
                        .catch(e => {
                            expect(e).toEqual({
                                error: "Invalid Section ID"
                            });
                        });
                    expect.assertions(1);
                });

            test.each(["", " "])
                ("Empty name, throws Error", (name: string) => {
                    todoistClient.updateSection(1, { name: name })
                        .catch(e => {
                            expect(e).toEqual({
                                error: "You must provide a section name"
                            });
                        });
                    expect.assertions(1);
                });
        });

        describe("deleteSection Tests", () => {
            test.each([-1, 0])
                ("Invalid section id throws error", (id: number) => {
                    todoistClient.deleteSection(id)
                        .catch(e => {
                            expect(e).toEqual({
                                error: "Invalid Section ID"
                            });
                        });
                    expect.assertions(1);
                });
        });
    });
});