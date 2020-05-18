import thwack, { ThwackRequestEvent } from "thwack";

export const testClientId = "1234";
export const testClientSecret = "abcd";

export const setThwackResponseData = (
    endPoint: string,
    responseData: {},
    status: number = 200) => {
    thwack.addEventListener('request', (event: ThwackRequestEvent) => {
        const { options } = event;
        if (options.url === endPoint) {
            event.preventDefault();

            event.stopPropagation();

            return new thwack.ThwackResponse({
                status: status,
                data: responseData
            }, options);
        }
    })
};

export const removeThwackResponse = () => {
    thwack.removeEventListener('request', (event: ThwackRequestEvent) => {

    });
};

export const dontCareAboutResponse = () => {
    thwack.addEventListener('request', (event: ThwackRequestEvent) => {
        const { options } = event;

        event.preventDefault();
        event.stopPropagation();

        return new thwack.ThwackResponse({
            status: 200
        }, options);
    });
};