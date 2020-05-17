import * as todoistClient from '../src/todoistClient';

import { berryRed } from '../src/colors';
import { dontCareAboutResponse } from "../tests/testConfigs";
import { invalidColor } from '../tests/colorTestData';

describe("Input tests for label methods", () => {
    beforeAll(() => {
        todoistClient.setAccessToken("abcd");
        dontCareAboutResponse();
    });

    describe("Happy path tests", () => {
        test("getLabels, happy path", () => {
            return todoistClient.getLabels();
        });

        test("addLabel, no color, happy path", () => {
            return todoistClient.addLabel({ name: "kwijibo" });
        });

        test("addLabel, with color, happy path", () => {
            return todoistClient.addLabel({ name: "kwijibo", color: berryRed });
        });

        test("addLabel, with order, happy path", () => {
            return todoistClient.addLabel({ name: "kwijibo", order: 20 });
        });

        test("getLabel, happy path", () => {
            return todoistClient.getLabel(1);
        });

        test("updateLabel, name set, happy path", () => {
            return todoistClient.updateLabel(1, { name: "kwijibo" });
        });

        test("updateLabel, color set, happy path", () => {
            return todoistClient.updateLabel(1, { color: berryRed });
        });

        test("updateLabel, order set, happy path", () => {
            return todoistClient.updateLabel(1, { order: 20 });
        });

        test("deleteLabel, happy path", () => {
            return todoistClient.deleteLabel(1);
        });
    });

    describe("Unhappy path tests", () => {
        describe("Tests for addLabel", () => {
            test.each(["", " "])
                ("name not set, error thrown", async (name: string) => {
                    expect.assertions(1);
                    try {
                        await todoistClient.addLabel({ name: name })
                    }
                    catch (e) {
                        expect(e).toEqual(new Error("You must provide a name for the label"));
                    }
                });

            test("color is set, but invalid", async () => {
                expect.assertions(1);

                try {
                    await todoistClient.addLabel({
                        name: "kwijibo",
                        color: invalidColor
                    })
                }
                catch (e) {
                    expect(e).toEqual(new Error("Color ID is invalid"));
                }
            });
        });

        describe("Tests for getLabel", () => {
            test.each([-1, 0])
                ("Invalid label id throws error", async (id: number) => {
                    expect.assertions(1);
                    try {
                        await todoistClient.getLabel(id)
                    }
                    catch (e) {
                        expect(e).toEqual(new Error("Invalid label ID"));
                    }
                });
        });

        describe("Tests for updateLabel", () => {
            test.each([-1, 0])
                ("Invalid label id throws error", async (id: number) => {
                    try {
                        await todoistClient.getLabel(id)
                    }
                    catch (e) {
                        expect(e).toEqual(new Error("Invalid label ID"));
                    }
                    expect.assertions(1);
                });

            test("No options set, throws error", async () => {

                try {
                    await todoistClient.updateLabel(1, {})
                }
                catch (e) {
                    expect(e).toEqual(new Error("You must provide either a name, color or order to update the label"));
                }
                expect.assertions(1);
            });

            test("name not set, error thrown", async () => {
                try {
                    await todoistClient.updateLabel(1, { name: "" })
                }
                catch (e) {
                    expect(e).toEqual(new Error("You must provide either a name, color or order to update the label"));
                }
                expect.assertions(1);
            });

            test("color set, but is invalid, throws Error", async () => {
                try {
                    await todoistClient.updateLabel(1, { color: invalidColor })
                }
                catch (e) {
                    expect(e).toEqual(new Error("Color ID is invalid"));
                }
                expect.assertions(1);
            });

            test("name is set, but is whitespace", async () => {
                try {
                    await todoistClient.updateLabel(1, { name: " " })
                }
                catch (e) {
                    expect(e).toEqual(new Error("You must provide a valid name in order to update"));
                }
                expect.assertions(1);
            });
        });

        describe("Tests for deleteLabel", () => {
            test.each([-1, 0])
                ("Invalid label id throws error", async (id: number) => {
                    try {
                        await todoistClient.deleteLabel(id)
                    }
                    catch (e) {
                        expect(e).toEqual(new Error("Invalid label ID"));
                    }
                    expect.assertions(1);
                });
        })
    });
});