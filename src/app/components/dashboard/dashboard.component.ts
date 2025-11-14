import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GroupService } from '../../services/group.service';
import { ExpenseService } from '../../services/expense.service';
import { UserService } from '../../services/user.service';
import { Group } from '../../models/group.model'; 
import { Expense } from '../../models/expense.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
   currentUser = this.authService.CurrentUserValue;
   groups: Group[] = [];
   recentExpenses : Expense [] = []
   expensesUser : Expense[] = []
   loading = true;

  totalGroups = 0;
  totalExpenses = 0;
  totalAmount = 0;
  


  constructor(
    private authService: AuthService,
    private groupService: GroupService,
    private expenseService: ExpenseService,
    private userService: UserService
  ) {}
  
  ngOnInit(): void {
    this.loadDashboardData()
  }

  loadDashboardData()
  {
    if (!this.currentUser?.id) {
    this.loading = false;
    return;
    }

    this.loading = true;
    const userId = this.currentUser.id;
    this.userService.getUserGroups(userId).subscribe
    ( { next: (groups) => 
        {
        this.groups = groups;
        this.totalGroups = groups.length;
        }, error: (err) => console.error('Error al cargar los grupos',err)
      } 
    );

    this.expenseService.getExpenses().subscribe
    ( { next: (recentExpenses) =>
        {
            this.expensesUser = recentExpenses.filter(expense => 
        expense.payerId === userId)
        this.totalExpenses = this.expensesUser.length;
        this.totalAmount = this.expensesUser.reduce((sum, exp) => sum + exp.totalAmount, 0);
        this.loading = false;


        }, 
        error : (err) => 
            {
               console.error('Error al cargar gastos');
               this.loading= false;
             }


    } );
  
  }

}
