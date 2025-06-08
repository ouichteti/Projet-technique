import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TasksService } from './tasks.service';
import { ITask } from 'app/models/models/task.model';

describe('TasksService', () => {
  let service: TasksService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TasksService],
    });
    service = TestBed.inject(TasksService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getAll without params', () => {
    const dummyTasks: ITask[] = [{ id: 1, label: 'Task 1', description: 'desc', completed: false }];
    service.getAll().subscribe(tasks => {
      expect(tasks).toEqual(dummyTasks);
    });

    const req = httpMock.expectOne(r => r.method === 'GET' && r.url === '/api/tasks');
    expect(req.request.params.has('completed')).toBe(false);
    req.flush(dummyTasks);
  });

  it('should call getAll with completed=true', () => {
    service.getAll(true).subscribe();
    const req = httpMock.expectOne(r => r.method === 'GET' && r.url === '/api/tasks');
    expect(req.request.params.get('completed')).toBe('true');
    req.flush([]);
  });

  it('should call getById', () => {
    const dummyTask: ITask = { id: 1, label: 'Test', description: 'desc', completed: false };
    service.getById(1).subscribe(task => {
      expect(task).toEqual(dummyTask);
    });

    const req = httpMock.expectOne(r => r.method === 'GET' && r.url === '/api/tasks/by-id');
    expect(req.request.params.get('id')).toBe('1');
    req.flush(dummyTask);
  });

  it('should call create', () => {
    const newTask: ITask = { id: 1, label: 'New Task', description: 'desc', completed: false };
    service.create(newTask).subscribe(task => {
      expect(task).toEqual(newTask);
    });

    const req = httpMock.expectOne('/api/tasks');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);
    req.flush(newTask);
  });

  it('should call toggle', () => {
    const toggledTask: ITask = { id: 1, label: 'Toggled', description: 'desc', completed: true };
    service.toggle(1).subscribe(task => {
      expect(task).toEqual(toggledTask);
    });

    const req = httpMock.expectOne(r => r.method === 'PUT' && r.url === '/api/tasks/toggle');
    expect(req.request.params.get('id')).toBe('1');
    expect(req.request.body).toBeNull();
    req.flush(toggledTask);
  });
});
