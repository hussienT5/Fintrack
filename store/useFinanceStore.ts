import { create } from 'zustand';

export type Currency = {
  code: string;
  symbol: string;
  name: string;
};

export type Budget = {
  id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'weekly';
  spent: number;
};

export type Transaction = {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  type: 'income' | 'expense';
  tags?: string[];
};

export type Account = {
  id: string;
  type: 'bank' | 'investment' | 'crypto';
  name: string;
  balance: number;
  institution: string;
  lastFour?: string;
  growth?: number;
};

type FinanceStore = {
  transactions: Transaction[];
  budgets: Budget[];
  accounts: Account[];
  selectedCurrency: Currency;
  currencies: Currency[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  addAccount: (account: Omit<Account, 'id' | 'growth'>) => void;
  updateAccount: (id: string, account: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  setCurrency: (currency: Currency) => void;
  getBalance: () => number;
  getSpendingByCategory: () => { category: string; amount: number }[];
  getBudgetProgress: (budgetId: string) => number;
};

const defaultCurrencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
];

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  transactions: [],
  budgets: [],
  accounts: [],
  selectedCurrency: defaultCurrencies[0],
  currencies: defaultCurrencies,
  
  addTransaction: (transaction) =>
    set((state) => {
      const newTransaction = {
        ...transaction,
        id: Math.random().toString(36).substr(2, 9),
      };
      
      // Update budget spent amount if it's an expense
      const budgets = state.budgets.map(budget => {
        if (budget.category === transaction.category && transaction.type === 'expense') {
          return {
            ...budget,
            spent: budget.spent + transaction.amount,
          };
        }
        return budget;
      });

      return {
        transactions: [...state.transactions, newTransaction],
        budgets,
      };
    }),

  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),

  addBudget: (budget) =>
    set((state) => ({
      budgets: [
        ...state.budgets,
        {
          ...budget,
          id: Math.random().toString(36).substr(2, 9),
          spent: 0,
        },
      ],
    })),

  updateBudget: (id, budget) =>
    set((state) => ({
      budgets: state.budgets.map((b) =>
        b.id === id ? { ...b, ...budget } : b
      ),
    })),

  deleteBudget: (id) =>
    set((state) => ({
      budgets: state.budgets.filter((b) => b.id !== id),
    })),

  addAccount: (account) =>
    set((state) => ({
      accounts: [
        ...state.accounts,
        {
          ...account,
          id: Math.random().toString(36).substr(2, 9),
          growth: account.type !== 'bank' ? 0 : undefined,
        },
      ],
    })),

  updateAccount: (id, account) =>
    set((state) => ({
      accounts: state.accounts.map((a) =>
        a.id === id ? { ...a, ...account } : a
      ),
    })),

  deleteAccount: (id) =>
    set((state) => ({
      accounts: state.accounts.filter((a) => a.id !== id),
    })),

  setCurrency: (currency) =>
    set(() => ({
      selectedCurrency: currency,
    })),

  getBalance: () => {
    const transactions = get().transactions;
    return transactions.reduce((acc, curr) => {
      return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
    }, 0);
  },

  getSpendingByCategory: () => {
    const transactions = get().transactions;
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, curr) => {
        const existing = acc.find((a) => a.category === curr.category);
        if (existing) {
          existing.amount += curr.amount;
          return acc;
        }
        return [...acc, { category: curr.category, amount: curr.amount }];
      }, [] as { category: string; amount: number }[])
      .sort((a, b) => b.amount - a.amount);
  },

  getBudgetProgress: (budgetId: string) => {
    const budget = get().budgets.find((b) => b.id === budgetId);
    if (!budget) return 0;
    return (budget.spent / budget.amount) * 100;
  },
}));