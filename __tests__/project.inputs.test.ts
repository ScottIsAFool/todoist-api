import * as todoistClient from '../src/todoistClient';

import { berryRed } from '../src/colors';
import { dontCareAboutResponse } from "../tests/testConfigs";
import { invalidColor } from '../tests/colorTestData';

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
                ("name not set, error thrown", async (name: string) => {
                    try {
                        await todoistClient.addProject({ name: name });
                    }
                    catch (e) {
                        expect(e).toEqual(new Error("Project must have a name"));
                    }
                    expect.assertions(1);
                });

            test("color set, but not valid", async () => {
                try {
                    await todoistClient.addProject({
                        name: "kwijibo",
                        color: invalidColor
                    });
                }
                catch (e) {
                    expect(e).toEqual(new Error("Color ID is invalid"));
                }
                expect.assertions(1);
            });
        });

        describe("Tests for getProject", () => {
            test.each([-1, 0])
                ("Invalid project id throws error", async (id: number) => {
                    try {
                        await todoistClient.getProject(id);
                    }
                    catch (e) {
                        expect(e).toEqual(new Error("Invalid Project ID"));
                    }
                    expect.assertions(1);
                });
        });

        describe("Tests for updateProject", () => {
            test.each([-1, 0])
                ("Invalid project id throws error", async (id: number) => {
                    try {
                        await todoistClient.updateProject(id, {});
                    }
                    catch (e) {
                        expect(e).toEqual(new Error("Invalid Project ID"));
                    }
                    expect.assertions(1);
                });

            test("neither name or color set, Error thrown", async () => {
                try {
                    await todoistClient.updateProject(1, {});
                }
                catch (e) {
                    expect(e).toEqual(new Error("You must provide either a name or a color to update"));
                }
                expect.assertions(1);
            });

            test
                ("name is set, but is empty, Error thrown", async () => {
                    try {
                        await todoistClient.updateProject(1, {
                            name: " "
                        });
                    }
                    catch (e) {
                        expect(e).toEqual(new Error("Project name cannot be empty or undefined"));
                    }
                    expect.assertions(1);
                });

            test("color is set, but is invalid, Error thrown", async () => {
                try {
                    await todoistClient.updateProject(1, {
                        color: invalidColor
                    });
                }
                catch (e) {
                    expect(e).toEqual(new Error("Color ID is invalid"));
                }
                expect.assertions(1);
            });
        });

        describe("Tests for deleteProject", () => {
            test.each([-1, 0])
                ("Invalid project id throws error", async (id: number) => {
                    try {
                        await todoistClient.deleteProject(id);
                    }
                    catch (e) {
                        expect(e).toEqual(new Error("Invalid Project ID"));
                    }
                    expect.assertions(1);
                });
        });
    });
});