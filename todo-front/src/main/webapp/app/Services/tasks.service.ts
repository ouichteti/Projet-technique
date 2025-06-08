import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { ITask } from 'app/models/models/task.model';
@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private resourceUrl = '/api/tasks';

  constructor(private http: HttpClient) { }

  getAll(completed?: boolean): Observable<ITask[]> {
    let params = new HttpParams();
    if (completed !== undefined) {
      params = params.set('completed', completed.toString());
    }
    return this.http.get<ITask[]>(this.resourceUrl, { params });
  }

  getById(id: number): Observable<ITask | null> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<ITask>(`${this.resourceUrl}/by-id`, { params }).pipe(
      catchError(() => of(null))
    );
  }


  create(task: ITask): Observable<ITask> {
    return this.http.post<ITask>(this.resourceUrl, task);
  }

  toggle(id: number): Observable<ITask> {
    return this.http.put<ITask>(`${this.resourceUrl}/toggle`, null, {
      params: { id },
    });
  }
}
