export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface Transaction {
  id: number | null;
  description: string;
  amount: number;
  type: 'income' | 'expense';
}