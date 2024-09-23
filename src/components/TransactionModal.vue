<template>
  <q-dialog v-model="internalShow">
    <q-card class="q-pa-md" style="width: 500px">
      <q-card-section>
        <div class="text-h6">{{ isEditing ? 'Edit Transaction' : 'Add Transaction' }}</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model.number="localTransaction.amount" label="Amount" type="number" filled @blur="formatAmount" />
        <q-input v-model="localTransaction.description" label="Description" filled />
        <q-select v-model="localTransaction.type" label="Type" :options="['income', 'expense']" filled />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" @click="close" />
        <q-btn flat label="Save" color="primary" @click="save" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { Transaction } from '../stores/transactionStore';

export default defineComponent({
  emits: ['close', 'save'],
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    isEditing: {
      type: Boolean,
      default: false,
    },
    transaction: {
      type: Object as () => Transaction,
      required: true,
    },
  },
  setup(props, { emit }) {
    const internalShow = ref(props.show);
    const localTransaction = ref({ ...props.transaction });

    watch(() => props.show, (newVal) => {
      internalShow.value = newVal;
    });

    watch(() => props.transaction, (newVal) => {
      localTransaction.value = { ...newVal };
    });

    const close = () => {
      emit('close');
      internalShow.value = false;
    };

    const save = () => {
      emit('save', localTransaction.value);
    };

    const formatAmount = () => {
      if (typeof localTransaction.value.amount === 'string') {
        localTransaction.value.amount = parseFloat(localTransaction.value.amount);
      }

      const amount = localTransaction.value.amount;

      if (!isNaN(amount)) {
        localTransaction.value.amount = parseFloat(amount.toFixed(2));
      }
    };

    return {
      internalShow,
      localTransaction,
      close,
      save,
      formatAmount,
    };
  },
});
</script>
