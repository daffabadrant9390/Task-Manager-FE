import '@testing-library/jest-dom';

// Mock for next/navigation frequently used in app router
jest.mock('next/navigation', () => {
	return {
		useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
		useSearchParams: () => new URLSearchParams(),
		usePathname: () => '/',
	};
});


