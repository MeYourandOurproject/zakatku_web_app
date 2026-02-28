<template>
  <div class="container-fluid">
    <div class="container-fluid dashboardpage p-3">

      <!-- ROW ATAS -->
      <div class="row mb-4 align-items-stretch">

        <div class="col-12 col-md-4 d-flex">
          <TransactionForm class="w-100" />
        </div>

        <div class="col-12 col-md-8 d-flex">
          <DashboardView class="w-100" />
        </div>

      </div>

      <!-- ROW BAWAH -->
      <div class="row">
        <div class="col-12">
          <TransactionTable />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import DashboardView from '@/components/dashboardView.vue';
import TransactionForm from '@/components/transactionForm.vue';
import TransactionTable from '@/components/transactionTable.vue';

export default {
  name: 'dashboardPage',
  components: { TransactionForm, DashboardView, TransactionTable },
}
</script>

<style>
.dashboardpage {
  min-height: 100vh;
}
</style>
