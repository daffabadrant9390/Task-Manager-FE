import * as RootLayout from '@/app/layout';
import * as Page from '@/app/page';
import * as LoginPage from '@/app/login/page';
import * as TaskDetailContent from '@/app/task-detail/[id]/components/TaskDetailContent';
import * as TaskDetailSidePanel from '@/app/task-detail/[id]/components/TaskDetailSidePanel';
import * as TaskDetailPage from '@/app/task-detail/[id]/page';
import * as TaskDetailHelpers from '@/app/task-detail/[id]/helpers';
import * as TaskDetailTypes from '@/app/task-detail/types/types';

describe('app router modules load', () => {
	it('layout loads', () => expect(RootLayout).toBeDefined());
	it('index page loads', () => expect(Page).toBeDefined());
	it('login page loads', () => expect(LoginPage).toBeDefined());
	it('task detail content loads', () => expect(TaskDetailContent).toBeDefined());
	it('task detail side panel loads', () => expect(TaskDetailSidePanel).toBeDefined());
	it('task detail page loads', () => expect(TaskDetailPage).toBeDefined());
	it('task detail helpers loads', () => expect(TaskDetailHelpers).toBeDefined());
	it('task detail types loads', () => expect(TaskDetailTypes).toBeDefined());
});


