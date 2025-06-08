import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState } from './task.reducer';

export const selectTaskState = createFeatureSelector<TaskState>('task');

export const selectAllTasks = createSelector(selectTaskState, state => state.tasks);
export const selectLoading = createSelector(selectTaskState, state => state.loading);
export const selectError = createSelector(selectTaskState, state => state.error);
