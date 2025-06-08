import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, combineLatest, debounceTime, switchMap, takeUntil, catchError, of, startWith } from 'rxjs';

import { ITask } from 'app/models/models/task.model';
import { TasksService } from 'app/Services/tasks.service';
import { loadTasks } from '../task-state/task.actions';
import { selectAllTasks, selectLoading } from '../task-state/task.selectors';
import { PopupComponent } from '../task-modal/popup/popup.component';

@Component({
  selector: 'jhi-tasks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit, OnDestroy {
  store = inject(Store);
  taskService = inject(TasksService);
  modalService = inject(NgbModal);

  searchControl = new FormControl('');
  statusControl = new FormControl('');
  destroy$ = new Subject<void>();

  tasks: ITask[] = [];
  loading$ = this.store.select(selectLoading);
  loadingSnapshot = false;
  notFound = false;

  ngOnInit(): void {
    this.store.dispatch(loadTasks());

    this.store.select(selectAllTasks)
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => (this.tasks = tasks));

    this.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => (this.loadingSnapshot = loading));

    combineLatest([
      this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300)),
      this.statusControl.valueChanges.pipe(startWith(''))
    ])
      .pipe(
        switchMap(([searchVal, statusVal]) => {
          const search = (searchVal ?? '').trim();
          const isSearchEmpty = search === '';
          const status = statusVal;

          if (!isSearchEmpty) {
            const id = Number(search);
            if (isNaN(id)) {
              return of(null);
            }
            return this.taskService.getById(id).pipe(catchError(() => of(null)));
          }

          if (status === '') {
            return this.taskService.getAll();
          } else if (status === 'true') {
            return this.taskService.getAll(true);
          } else {
            return this.taskService.getAll(false);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(result => {
        const search = (this.searchControl.value ?? '').trim();
        const isSearchEmpty = search === '';

        if (!isSearchEmpty && result === null) {
          this.tasks = [];
          this.notFound = true;
        } else {
          this.tasks = result ? (Array.isArray(result) ? result : [result]) : [];
          this.notFound = !this.tasks.length && !isSearchEmpty;
        }
      });
  }

  openModal(task?: ITask): void {
    const modalRef = this.modalService.open(PopupComponent, {
      backdrop: 'static',
      centered: true,
    });

    modalRef.componentInstance.task = task ?? null;
    modalRef.componentInstance.isEditOnlyCompleted = !!task;

    modalRef.componentInstance.applyPatch();

    modalRef.componentInstance.save.subscribe((savedTask: ITask) => {
      const request = this.taskService.create(savedTask);
      request.subscribe(() => {
        this.store.dispatch(loadTasks());
        modalRef.close();
      });
    });

    modalRef.componentInstance.cancel.subscribe(() => {
      modalRef.dismiss();
    });
  }


  get showNotFound(): boolean {
    return this.notFound && !this.loadingSnapshot;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
