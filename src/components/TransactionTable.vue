<template>
  <q-table
    :rows="transactions"
    :columns="columns"
    row-key="id"
    :loading="loading"
    :pagination="pagination"
    @request="onRequest"
  >
    <template v-slot:body-cell-amount="props">
      <q-td :props="props">
        {{ formatAmount(props.row.amount) }}
      </q-td>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn class="q-mr-sm" size="sm" color="primary" @click="onEdit(props.row)">Edit</q-btn>
        <q-btn class="q-mr-sm" size="sm" color="negative" @click="onDelete(props.row.id)">Delete</q-btn>
      </q-td>
    </template>
    <template v-slot:bottom="">
      <q-pagination
        v-model="pagination.page"
        :max="pagination.rowsNumber"
        @update:model-value="onRequest"
      />
    </template>
  </q-table>
</template>

<script lang="ts">
import { defineComponent, computed, ref} from 'vue';
import { useTransactionStore, Transaction } from '../stores/transactionStore';

export default defineComponent({
  emits: ['edit', 'delete'],
  setup(_, { emit }) {
    const transactionStore = useTransactionStore();
    const transactions = computed(() => transactionStore.transactions);
    const loading = ref(true);
  
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 0,
    })

    const columns = [
      { name: 'date', label: 'Date', field: 'date', align: 'left' as const },
      { name: 'category', label: 'Category', field: 'category', align: 'left' as const },
      { name: 'description', label: 'Description', field: 'description', align: 'left' as const },
      { name: 'amount', label: 'Amount', field: 'amount', align: 'right' as const },
      { name: 'type', label: 'Type', field: 'type', align: 'left' as const },
      { name: 'actions', label: 'Actions', field: 'actions', align: 'center' as const },
    ];

    const onEdit = (transaction: Transaction) => {
      emit('edit', transaction);
    };

    const onDelete = (id: Transaction) => {
      transactionStore.deleteTransaction(id);
      onRequest();
    };

    const formatAmount = (amount: number) => {
      return amount.toFixed(2);
    };

    const onRequest = async () => {
      loading.value = true;

      const response = await transactionStore.fetchTransactions({
        page: pagination.value.page,
        per_page: pagination.value.rowsPerPage,
      });

      pagination.value.rowsNumber = response.pagination.total_pages;
      loading.value = false;
    };

    onRequest();

    return {
      pagination,
      transactions,
      loading,
      columns,
      onEdit,
      onDelete,
      formatAmount,
      onRequest,
    };
  },
});
</script>
