import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
	// Provide the path to the Next.js app to load next.config.js and .env files in your test environment
	dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	moduleNameMapper: {
		// Handle module aliases
		'^@/(.*)$': '<rootDir>/$1',
		// Handle CSS and asset imports
		'\.(css|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
		'\.(gif|ttf|eot|svg|png|jpg|jpeg|webp)$': '<rootDir>/__mocks__/fileMock.js',
	},
	testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
	collectCoverage: true,
	collectCoverageFrom: [
		'components/**/*.{ts,tsx}',
		'lib/**/*.{ts,tsx}',
		'app/**/*.{ts,tsx}',
		'!**/*.d.ts',
		'!**/index.ts',
		'!**/types/**',
	],
	coverageDirectory: '<rootDir>/coverage',
	coverageReporters: ['text', 'lcov', 'html'],
};

export default createJestConfig(customJestConfig);


