import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';          
import { GroupService } from '../../../services/group.service';
import { Group } from '../../../models/group.model';
import { Expense } from '../../../models/expense.model';
import { User } from '../../../models/user.model';
import { GroupBalanceSummary } from '../../../models/dtos.model';
import { ExpenseService } from '../../../services/expense.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './group-detail.component.html',
  styleUrl: './group-detail.component.scss'
})
export class GroupDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('expenseChart') expenseChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('balanceChart') balanceChartRef!: ElementRef<HTMLCanvasElement>;

  groupId!:number;
  group: Group | null = null;
  members : User[] = [];
  expenses: Expense[] = [];
  balances : GroupBalanceSummary | null = null;
  loading = true;
  error = '';
  activeTab = 'expenses'
  private expenseChart?: Chart;
  private balanceChart?: Chart;


  constructor( private route: ActivatedRoute,
    private groupService: GroupService,
    private expenseService: ExpenseService
  ){}
  
 ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadGroupDetails();
  }

  ngAfterViewInit(): void {
    // Los charts se crearán después de cargar los datos
  }

  ngOnDestroy(): void {
    // Destruir charts al salir
    if (this.expenseChart) {
      this.expenseChart.destroy();
    }
    if (this.balanceChart) {
      this.balanceChart.destroy();
    }
  }

   createCharts(): void {
    if (this.activeTab !== 'stats') return;
    
    this.createExpenseChart();
    this.createBalanceChart();
  }
      createExpenseChart(): void {
    if (!this.expenseChartRef || !this.expenses.length) return;

    // Agrupar gastos por pagador
    const expensesByPayer = this.expenses.reduce((acc, expense) => {
      const payerName = expense.payer?.name || 'Desconocido';
      acc[payerName] = (acc[payerName] || 0) + expense.totalAmount;
      return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(expensesByPayer);
    const data = Object.values(expensesByPayer);
    const colors = this.generateColors(labels.length);

    if (this.expenseChart) {
      this.expenseChart.destroy();
    }

    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Gastos Pagados',
          data: data,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Total Pagado por Cada Miembro',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value.toFixed(2)} (${percentage}%)`;
              }
            }
          }
        }
      }
    };

    this.expenseChart = new Chart(this.expenseChartRef.nativeElement, config);
  }

  createBalanceChart(): void {
    if (!this.balanceChartRef || !this.balances?.userBalances.length) return;

    const sortedBalances = [...this.balances.userBalances].sort((a, b) => b.balance - a.balance);
    const labels = sortedBalances.map(b => b.userName);
    const data = sortedBalances.map(b => b.balance);
    const colors = data.map(value => value >= 0 ? '#10b981' : '#ef4444');

    if (this.balanceChart) {
      this.balanceChart.destroy();
    }

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Balance',
          data: data,
          backgroundColor: colors,
          borderWidth: 0,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Balance de Cada Miembro',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed.x || 0;
                return value >= 0 
                  ? `Le deben: ${value.toFixed(2)}`
                  : `Debe: ${Math.abs(value).toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `${value}`
            }
          }
        }
      }
    };

    this.balanceChart = new Chart(this.balanceChartRef.nativeElement, config);
  }

  generateColors(count: number): string[] {
    const colors = [
      '#3b82f6', // blue
      '#10b981', // green
      '#f59e0b', // yellow
      '#ef4444', // red
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#14b8a6', // teal
      '#f97316', // orange
    ];
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
  }
  
  getTotalAmount(): number {
  return this.expenses.reduce((sum, exp) => sum + exp.totalAmount, 0);
}

getAverageAmount(): number {
  if (this.expenses.length === 0) return 0;
  return this.getTotalAmount() / this.expenses.length;
}

  loadGroupDetails(): void
  {
    this.loading = true;
    this.groupService.getGroupById(this.groupId).subscribe(
    {
      next : (group)  => {
       this.group = group; 
       this.loadMembers();
       this.loadExpenses();
       this.loadBalances();
      }, error : (err) => {
        this.error = 'Error al cargar grupos';
        this.loading = false;
        console.error(this.error);
      }

    });
  }

  loadMembers():void {
    this.groupService.getGroupMembers(this.groupId).subscribe({
       next: (groupMembers) => {
         this.members = groupMembers;
         this.loading = false;
       }, error : (err) => {
        this.error = 'Erro al carar miembros de grupo';
        this.loading = false;
        console.error(this.error);
       }
    })
  }
  
  loadExpenses():void {
      this.groupService.getGroupExpenses(this.groupId).subscribe({
        next: (expenses) =>
        {
           this.expenses = expenses;
           this.loading = false;
        }, error : (err) =>
        {
          this.error = 'Error al cargar Gastos';
          this.loading = false;
          console.error(this.error);
        }
      });
  }

  loadBalances(): void {
    this.expenseService.getGroupBalances(this.groupId).subscribe({
      next: (balances) => {
        this.balances = balances;
        // Crear gráficos después de cargar los datos
        setTimeout(() => this.createCharts(), 100);
      },
      error: (err) => console.error('Error al cargar balances:', err)
    });
  }

   setActiveTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'stats') {
      setTimeout(() => this.createCharts(), 100);
    }
  }

  deleteExpense(expenseId: number): void {
    if(confirm('Desea Eliminar el gasto?') === true)
    {
      this.expenseService.deleteExpense(expenseId).subscribe({
         next: () => {
            this.loadExpenses();
            this.loadBalances();
        },  error: (err) => alert('Error al eliminar: ' + err.message)
    });

    }
  
  }

    removeMember(userId : string): void{
      
      if(confirm('Desea Eliminar el gasto?') === true)
      {
        this.groupService.removeMemberFromGroup(this.groupId,userId).subscribe({
         next: () => {
            this.loadMembers();
        },  error: (err) => alert('Error al eliminar: ' + err.message)
        });
      }
    }
 
}
