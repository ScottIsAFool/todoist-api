import { ColorData, colorTestData } from '../tests/colorTestData';

import { getColor } from './colors';

test.each(colorTestData())(
    "Checks colors are right",
    (colorData: ColorData) => {
        const color = getColor(colorData.id);

        expect(color.value).toBe(colorData.value);
    });