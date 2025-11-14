

export interface CreateExpenseDto
{
    groupId: number;
    payerId: string;
    totalAmount: number;
    description:string;
    expenseDate: string;
    participantIds: string[];
}

export interface UserBalance{
    userId:string;
    userName:string;
    balance:number;
}

export interface Settlement{
    fromUserId:string;
    fromUserName:string;
    toUserId:string;
    toUserName:string;
    amount:number;
}

export interface GroupBalanceSummary{
    groupId:number;
    groupName:string;
    totalBalance:number;
    userBalances:UserBalance[];
    suggestedSettlements: Settlement [];
}
