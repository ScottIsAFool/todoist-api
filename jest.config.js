module.exports = {
    transform: { '^.+\\.ts?$': 'ts-jest' },
    clearMocks: true,
    testEnvironment: 'node',
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};