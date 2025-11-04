import * as ApiClient from '@/lib/services/api/client';
import * as AuthService from '@/lib/services/auth.service';
import * as TaskService from '@/lib/services/task.service';
import * as UserService from '@/lib/services/user.service';

jest.mock('@/lib/services/api/client', () => ({
	__esModule: true,
	default: {
		get: jest.fn(),
		post: jest.fn(),
		put: jest.fn(),
		delete: jest.fn(),
	},
}));

describe('services load and can be imported', () => {
	it('api client loads', () => expect(ApiClient).toBeDefined());
	it('auth service loads', () => expect(AuthService).toBeDefined());
	it('task service loads', () => expect(TaskService).toBeDefined());
	it('user service loads', () => expect(UserService).toBeDefined());
});


