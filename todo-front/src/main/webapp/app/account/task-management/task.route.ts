import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TasksComponent } from './tasks/tasks.component';

const taskRoute: Route = {
  path: 'tasks',
  component: TasksComponent,
  title: 'Profil',
  canActivate: [UserRouteAccessService],
};

export default taskRoute;
