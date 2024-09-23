<template>
  <div>
    <div class="row justify-between q-mt-md">
      <q-card class="q-pa-md col-4 bg-primary text-white">
        <div class="text-h6">General Balance</div>
        <div class="text-subtitle1">{{ formatCurrency(generalBalance) }}</div>
      </q-card>
      <q-card class="q-pa-md col-4 bg-green text-white">
        <div class="text-h6">Income</div>
        <div class="text-subtitle1">{{ formatCurrency(totalIncome) }}</div>
      </q-card>
      <q-card class="q-pa-md col-4 bg-red text-white">
        <div class="text-h6">Expenses</div>
        <div class="text-subtitle1">{{ formatCurrency(totalExpense) }}</div>
      </q-card>
    </div>
    <div class="row justify-between q-mt-md">
      <q-card class="q-pa-md col-4 bg-primary text-white">
        <div class="text-h6">Balance This Month</div>
        <div class="text-subtitle1">{{ formatCurrency(balanceThisMonth) }}</div>
      </q-card>
      <q-card class="q-pa-md col-4 bg-green text-white">
        <div class="text-h6">Income This Month</div>
        <div class="text-subtitle1">{{ formatCurrency(incomeThisMonth) }}</div>
      </q-card>
      <q-card class="q-pa-md col-4 bg-red text-white">
        <div class="text-h6">Expenses This Month</div>
        <div class="text-subtitle1">{{ formatCurrency(expenseThisMonth) }}</div>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useTransactionStore } from '../stores/transactionStore';

export default defineComponent({
  setup() {
    const transactionStore = useTransactionStore();

    const generalBalance = computed(() => transactionStore.balance.generalBalance);
    const totalIncome = computed(() => transactionStore.balance.totalIncome);
    const totalExpense = computed(() => transactionStore.balance.totalExpense);
    const balanceThisMonth = computed(() => transactionStore.balance.balanceThisMonth);
    const incomeThisMonth = computed(() => transactionStore.balance.incomeThisMonth);
    const expenseThisMonth = computed(() => transactionStore.balance.expenseThisMonth);

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('en-Mx', {
        style: 'currency',
        currency: 'MXN',
      }).format(value);
    };

    return {
      generalBalance,
      totalIncome,
      totalExpense,
      balanceThisMonth,
      incomeThisMonth,
      expenseThisMonth,
      formatCurrency,
    };
  },
});
</script>
