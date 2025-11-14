import {User} from './user.model';
import {Group} from './group.model';

export interface Expense{
    id: number;
    groupId: number;
    payerId: string;
    totalAmount: number;
    description: string;
    expenseDate: string;
    createdAt?: Date;
    payer?: User;
    group?: Group;
    participants?: User[];
}

export interface ExpenseParticipant{
    expenseId: number;
    userId: string;
    amountOwed: number;
    user?: User;
}