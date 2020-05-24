import * as consts from '../src/consts';

import { isValidWebhookCall, setClientDetails } from '../src/todoistClient';

import { validEventData } from '../tests/eventDataTestData';

describe("Tests for the webhook methods", () => {
    test("that error is thrown if no client details set", () => {
        expect(() => isValidWebhookCall(validEventData, {})).toThrowError("Please set the client secret");
    });

    test("Throws error if headers don't contain todoist header", () => {
        setValidClientDetails();

        expect(() => isValidWebhookCall(validEventData, {})).toThrowError("Todoist validation header not found");
    });

    test.each([
        ["hash", false],
        ["E4wOnLF6OVE85UNoHgdIT5Pw/t4sKymp5IctO511tIU=", true]
    ])
        ("Hash matches the header", (
            hashValue: string,
            expectedResult: boolean
        ) => {
            setValidClientDetails();

            const headers = {
                "x-todoist-hmac-sha256": hashValue
            };

            expect(isValidWebhookCall(validEventData, headers)).toBe(expectedResult);
        })
});

const testSecret = "abcdefgh"
const setValidClientDetails = () => {
    setClientDetails(testSecret, "12345");
};