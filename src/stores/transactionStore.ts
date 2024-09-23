import { defineStore } from 'pinia';
import client from '../boot/axios';

export interface Transaction {
  id: number | null;
  description: string;
  amount: number;
  type: 'income' | 'expense';
}

export interface Balance {
  userId: number;
  totalIncome: number;
  totalExpense: number;
  generalBalance: number;
  balanceThisMonth: number;
}

interface TransactionState {
  transactions: Transaction[];
  balance: Balance;
}

export const useTransactionStore = defineStore('transactionStore', {
  state: (): TransactionState => ({
    transactions: [],
    balance: {
      userId: 0,
      totalIncome: 0,
      totalExpense: 0,
      generalBalance: 0,
      balanceThisMonth: 0,
    },
  }),

  actions: {
    async fetchTransactions(params: { page: number; per_page: number }) {
      const { page = 1, per_page= 25 } = params || {};
      try {
        const {data} = await client.get(`/api/wallets/?per_page=${per_page}&page=${page}`);
        const pagination = data?.pagination ?? {
          total: 0,
          total_pages: 0,
          per_page: 5,
          page: 1,
        };
        this.transactions = data.data;
        await this.calculateSummary();
        return {
          data: this.transactions,
          pagination,
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    },

    async calculateSummary() {
      try {
        const {data} = await client.get('/api/balances');
        this.balance = data;
      } catch (error) {
        console.error('Error calculating summary:', error);
      }
    },

    async addTransaction(transaction: Transaction) {
      try {
        const response = await client.post('/api/wallets/', transaction);
        this.transactions.unshift(response.data);
        this.calculateSummary();
      } catch (error) {
        console.error('Error adding transaction:', error);
      }
    },

    async updateTransaction(transaction: Transaction) {
      try {
        const response = await client.put(`/api/wallets/${transaction.id}`, transaction);
        const index = this.transactions.findIndex((t: Transaction) => t.id === transaction.id);
        this.transactions.splice(index, 1, response.data);
        this.calculateSummary();
      } catch (error) {
        console.error('Error updating transaction:', error);
      }
    },

    async deleteTransaction(id: number) {
      try {
        await client.delete(`/api/wallets/${id}`);
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    },

    async downloadTransactions() {
      try {
        const {data} = await client.get('/api/download-excel');
        return data.path;
      } catch (error) {
        console.error('Error downloading transactions:', error);
      }
    }
  },
});
