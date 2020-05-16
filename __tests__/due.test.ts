import { hasValidDueOptions } from '../src/todoistClient';

describe("Due date tests", () => {
    test("No due options set, returns [true, 0]", () => {
        const actual = hasValidDueOptions({});
        expect(actual).toStrictEqual([true, 0]);
    });

    test("due_date set, returns [true, 1]", () => {
        const actual = hasValidDueOptions({ due_date: "2020-05-16" });
        expect(actual).toStrictEqual([true, 1]);
    });

    test("due_datetime set, returns [true, 1]", () => {
        const actual = hasValidDueOptions({ due_datetime: "16/05/2020 21:06:20" });
        expect(actual).toStrictEqual([true, 1]);
    });

    test("due_string set, returns [true, 1]", () => {
        const actual = hasValidDueOptions({ due_string: "next monday" });
        expect(actual).toStrictEqual([true, 1]);
    });

    test("Set due_date and due_datetime, returns [false, 2]", () => {
        const actual = hasValidDueOptions({
            due_date: "2020-05-16",
            due_datetime: "16/05/2020 21:06:20"
        });
        expect(actual).toStrictEqual([false, 2]);
    });

    test("Set due_date and due_string, returns [false, 2]", () => {
        const actual = hasValidDueOptions({
            due_date: "2020-05-16",
            due_string: "next monday"
        });
        expect(actual).toStrictEqual([false, 2]);
    });

    test("Set due_datetime and due_string, returns [false, 2]", () => {
        const actual = hasValidDueOptions({
            due_datetime: "16/05/2020 21:06:20",
            due_string: "next monday"
        });
        expect(actual).toStrictEqual([false, 2]);
    });

    test("Set due_datetime, due_date, and due_string, returns [false, 3]", () => {
        const actual = hasValidDueOptions({
            due_datetime: "16/05/2020 21:06:20",
            due_string: "next monday",
            due_date: "2020-05-16"
        });
        expect(actual).toStrictEqual([false, 3]);
    });
});