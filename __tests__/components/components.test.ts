import * as AnimatedDropdown from '@/components/AnimatedDropdown';
import * as ProtectedRoute from '@/components/Auth/ProtectedRoute';
import * as ConfirmDialog from '@/components/common/ConfirmDialog';
import * as DashboardLayout from '@/components/Layout/DashboardLayout';
import * as Navigation from '@/components/Layout/Navigation';
import * as RootLayoutClient from '@/components/Layout/RootLayoutClient';
import * as TaskFilter from '@/components/TaskListStatusDashboard/TaskFilter';
import * as TaskListStatusDashboard from '@/components/TaskListStatusDashboard/TaskListStatusDashboard';
import * as TaskStatusCard from '@/components/TaskListStatusDashboard/TaskStatusCard';
import * as TaskStatusColumn from '@/components/TaskListStatusDashboard/TaskStatusColumn';
import * as TaskTable from '@/components/TaskListStatusDashboard/TaskTable';
import * as TaskModalIndex from '@/components/TaskModal';
import * as TaskBottomsheet from '@/components/TaskModal/TaskBottomsheet';
import * as TaskModal from '@/components/TaskModal/TaskModal';
import * as ThemeProvider from '@/components/ThemeProvider';
import * as FilterTasksLib from '@/components/TaskListStatusDashboard/lib/filterTasks';
import * as UseSelectedTaskStore from '@/components/TaskListStatusDashboard/store/useSelectedTaskStore';
import * as UseTaskFilterStore from '@/components/TaskListStatusDashboard/store/useTaskFilterStore';

describe('components and related libs load', () => {
	it('AnimatedDropdown loads', () => expect(AnimatedDropdown).toBeDefined());
	it('ProtectedRoute loads', () => expect(ProtectedRoute).toBeDefined());
	it('ConfirmDialog loads', () => expect(ConfirmDialog).toBeDefined());
	it('DashboardLayout loads', () => expect(DashboardLayout).toBeDefined());
	it('Navigation loads', () => expect(Navigation).toBeDefined());
	it('RootLayoutClient loads', () => expect(RootLayoutClient).toBeDefined());
	it('TaskFilter loads', () => expect(TaskFilter).toBeDefined());
	it('TaskListStatusDashboard loads', () => expect(TaskListStatusDashboard).toBeDefined());
	it('TaskStatusCard loads', () => expect(TaskStatusCard).toBeDefined());
	it('TaskStatusColumn loads', () => expect(TaskStatusColumn).toBeDefined());
	it('TaskTable loads', () => expect(TaskTable).toBeDefined());
	it('TaskModal index loads', () => expect(TaskModalIndex).toBeDefined());
	it('TaskBottomsheet loads', () => expect(TaskBottomsheet).toBeDefined());
	it('TaskModal loads', () => expect(TaskModal).toBeDefined());
	it('ThemeProvider loads', () => expect(ThemeProvider).toBeDefined());
	it('TaskList lib filterTasks loads', () => expect(FilterTasksLib).toBeDefined());
	it('useSelectedTaskStore loads', () => expect(UseSelectedTaskStore).toBeDefined());
	it('useTaskFilterStore loads', () => expect(UseTaskFilterStore).toBeDefined());
});


