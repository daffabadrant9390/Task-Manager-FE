import * as Constant from '@/lib/constant';
import * as Assignees from '@/lib/constants/assignees';
import * as AuthContext from '@/lib/context/AuthContext';
import * as useDeviceType from '@/lib/hooks/useDeviceType';
import * as useTaskForm from '@/lib/hooks/useTaskForm';
import * as useTasks from '@/lib/hooks/useTasks';
import * as useTheme from '@/lib/hooks/useTheme';
import * as useUsers from '@/lib/hooks/useUsers';
import * as MockTasksData from '@/lib/mocks/MockTasksData';
import * as Store from '@/lib/store/useTaskStore';
import * as DeviceTypes from '@/lib/types/device';
import * as TasksDataTypes from '@/lib/types/tasksData';
import * as DateUtils from '@/lib/utils/dateUtils';
import * as ProjectIdGenerator from '@/lib/utils/projectIdGenerator';
import * as TaskIdGenerator from '@/lib/utils/taskIdGenerator';

describe('lib files load', () => {
	it('constant loads', () => expect(Constant).toBeDefined());
	it('assignees loads', () => expect(Assignees).toBeDefined());
	it('AuthContext loads', () => expect(AuthContext).toBeDefined());
	it('useDeviceType loads', () => expect(useDeviceType).toBeDefined());
	it('useTaskForm loads', () => expect(useTaskForm).toBeDefined());
	it('useTasks loads', () => expect(useTasks).toBeDefined());
	it('useTheme loads', () => expect(useTheme).toBeDefined());
	it('useUsers loads', () => expect(useUsers).toBeDefined());
	it('MockTasksData loads', () => expect(MockTasksData).toBeDefined());
	it('useTaskStore loads', () => expect(Store).toBeDefined());
	it('device types loads', () => expect(DeviceTypes).toBeDefined());
	it('tasks data types loads', () => expect(TasksDataTypes).toBeDefined());
	it('dateUtils loads', () => expect(DateUtils).toBeDefined());
	it('projectIdGenerator loads', () => expect(ProjectIdGenerator).toBeDefined());
	it('taskIdGenerator loads', () => expect(TaskIdGenerator).toBeDefined());
});


