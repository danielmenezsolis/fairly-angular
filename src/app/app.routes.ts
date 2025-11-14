import { Routes } from '@angular/router';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GroupListComponent } from './components/group/group-list/group-list.component';
import { GroupDetailComponent } from './components/group/group-detail/group-detail.component';
import { CreateExpenseComponent } from './components/expenses/create-expense/create-expense.component';
import { AddMemberComponent } from './components/group/add-member/add-member.component';
import { CreateGroupComponent } from './components/group/create-group/create-group.component';
import { LoginComponent } from './components/auth/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'users', component: UserListComponent, canActivate: [authGuard] },
  { path: 'groups', component: GroupListComponent, canActivate: [authGuard] },
  { path: 'groups/create', component: CreateGroupComponent, canActivate: [authGuard] },
  { path: 'groups/:id', component: GroupDetailComponent, canActivate: [authGuard] },
  { path: 'groups/:groupId/members/add', component: AddMemberComponent, canActivate: [authGuard] },
  { path: 'groups/:groupId/expenses/create', component: CreateExpenseComponent, canActivate: [authGuard] },
];
