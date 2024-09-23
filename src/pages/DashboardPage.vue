<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h5">Financial Summary</div>
        <q-separator />
        <FinanceSummary />
      </q-card-section>

      <q-card
        class="my-card text-white"
        style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
      >
        <q-card-section>
          {{ tip }}
        </q-card-section>
      </q-card>

      <q-card-section>
        <div class="row justify-between">
          <div class="text-h5">Last 25 Transactions</div>
          <div>
            <q-btn
              :loading="progress.loading"
              :percentage="progress.percentage"
              color="primary"
              @click="startComputing()"
              class="q-mr-sm"
            >
              Download
              <template v-slot:loading>
                <q-spinner-gears class="on-left" />
                Downloading...
              </template>
            </q-btn>
            <q-btn color="primary" label="Add Transaction" @click="openModal('add')" />
          </div>
        </div>
        <q-separator />

        <TransactionTable
          @edit="openModal('edit', $event)"
        />
      </q-card-section>
    </q-card>

    <TransactionModal
      :show="showModal"
      :isEditing="isEditing"
      :transaction="transaction"
      @close="closeModal"
      @save="saveTransaction"
    />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useTransactionStore, Transaction } from '../stores/transactionStore';
import FinanceSummary from '../components/FinanceSummary.vue';
import TransactionTable from '../components/TransactionTable.vue';
import TransactionModal from '../components/TransactionModal.vue';

export default defineComponent({
  components: {
    FinanceSummary,
    TransactionTable,
    TransactionModal,
  },
  setup() {
    const transactionStore = useTransactionStore();

    const progress = ref({ loading: false, percentage: 0 })
    const showModal = ref(false);
    const isEditing = ref(false);
    const transaction = ref<Transaction>({
      id: null,
      amount: 0,
      description: '',
      type: 'expense',
    });

    const openModal = (mode: 'add' | 'edit', trans?: Transaction) => {
      isEditing.value = mode === 'edit';
      if (mode === 'edit' && trans) {
        transaction.value = { ...trans };
      } else {
        transaction.value = { id: null, amount: 0, description: '', type: 'expense' };
      }
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const saveTransaction = (trans: Transaction) => {
      if (isEditing.value) {
        transactionStore.updateTransaction(trans);
      } else {
        transactionStore.addTransaction(trans);
      }
      closeModal();
    };

    async function startComputing () {
      progress.value.loading = true;
      progress.value.percentage = 0;

      const interval = setInterval(async () => {
        if (progress.value.percentage < 100) {
          progress.value.percentage += 10;
        } else {
          const url = await transactionStore.downloadTransactions();
          window.open(url, '_blank')
          clearInterval(interval);
          progress.value.loading = false;
        }
      }, 100);
    }

    const tip = computed(() => transactionStore.balance.tip);

    return {
      showModal,
      isEditing,
      transaction,
      openModal,
      closeModal,
      saveTransaction,
      progress,
      startComputing,
      tip,
    };
  },
});
</script>
