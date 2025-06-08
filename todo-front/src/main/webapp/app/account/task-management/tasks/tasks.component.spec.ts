import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TasksComponent } from './tasks.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, Subject } from 'rxjs';
import { TasksService } from 'app/Services/tasks.service';
import { ITask } from 'app/models/models/task.model';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { loadTasks } from '../task-state/task.actions';
import { selectAllTasks, selectLoading } from '../task-state/task.selectors';

jest.mock('app/Services/tasks.service');

describe('TasksComponent full coverage', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;
  let store: MockStore;
  let tasksService: jest.Mocked<TasksService>;
  let modalService: NgbModal;

  const initialTasks: ITask[] = [
    { id: 1, label: 'A', description: 'desc A', completed: true },
    { id: 2, label: 'B', description: 'desc B', completed: false },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        provideMockStore(),
        TasksService,
        {
          provide: NgbModal,
          useValue: { open: jest.fn() },
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    tasksService = TestBed.inject(TasksService) as jest.Mocked<TasksService>;
    modalService = TestBed.inject(NgbModal);
    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
  });

  it('should dispatch loadTasks and subscribe to selectors', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    store.overrideSelector(selectAllTasks, initialTasks);
    store.overrideSelector(selectLoading, false);

    fixture.detectChanges();
    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(loadTasks());
    expect(component.tasks).toEqual(initialTasks);
    expect(component.loadingSnapshot).toBe(false);
  });



  it('should return showNotFound = true when notFound is true and not loading', () => {
    component.notFound = true;
    component.loadingSnapshot = false;
    expect(component.showNotFound).toBe(true);
  });

  it('should return showNotFound = false when loadingSnapshot is true', () => {
    component.notFound = true;
    component.loadingSnapshot = true;
    expect(component.showNotFound).toBe(false);
  });

  it('should clean up destroy$ on ngOnDestroy()', () => {
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    const nextSpy = jest.spyOn(component['destroy$'], 'next');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should open modal and handle save', fakeAsync(() => {
    const mockModalRef = {
      componentInstance: {
        task: null,
        isEditOnlyCompleted: false,
        applyPatch: jest.fn(),
        save: new Subject<ITask>(),
        cancel: new Subject<void>(),
      },
      close: jest.fn(),
      dismiss: jest.fn(),
    } as unknown as NgbModalRef;

    const createTask: ITask = { id: 3, label: 'C', description: 'desc C', completed: false };

    jest.spyOn(modalService, 'open').mockReturnValue(mockModalRef);
    tasksService.create.mockReturnValue(of(createTask));
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.openModal();

    // Simule le clic sur "save"
    mockModalRef.componentInstance.save.next(createTask);
    tick();

    expect(tasksService.create).toHaveBeenCalledWith(createTask);
    expect(dispatchSpy).toHaveBeenCalledWith(loadTasks());
    expect(mockModalRef.close).toHaveBeenCalled();
  }));

  it('should open modal and handle cancel', () => {
    const mockModalRef = {
      componentInstance: {
        task: null,
        isEditOnlyCompleted: false,
        applyPatch: jest.fn(),
        save: new Subject<ITask>(),
        cancel: new Subject<void>(),
      },
      close: jest.fn(),
      dismiss: jest.fn(),
    } as unknown as NgbModalRef;

    jest.spyOn(modalService, 'open').mockReturnValue(mockModalRef);
    component.openModal();

    mockModalRef.componentInstance.cancel.next();

    expect(mockModalRef.dismiss).toHaveBeenCalled();
  });
});
