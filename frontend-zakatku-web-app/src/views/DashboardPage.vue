<template>
  <div class="container-fluid">
    <div class="container-fluid dashboardpage p-2 my-3">
      <!-- HEADER IDENTITAS -->
      <div class="row m-0 mb-3">
        <div class="col-12">
          <div class="card shadow-sm p-3 gradient-header text-white rounded-4">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <!-- KIRI : LOGO + INSTITUSI -->
              <div class="d-flex align-items-start gap-3 text-start">
                <img v-if="institution.logo" :src="institution.logo" class="institution-logo" />

                <div>
                  <h5 class="mb-0 fw-bold">{{ institution.name }}</h5>
                  <small>{{ institution.address }}</small>
                  <br />
                  <strong>Admin :</strong> {{ admin.name }}
                </div>
              </div>

              <!-- KANAN : ADMIN + DATE -->
              <div class="text-start text-md-end">
                <div><strong>Tanggal :</strong> {{ today }}</div>

                <div><strong>Jam :</strong> {{ time }}</div>

                <!-- LOGOUT BUTTON -->
                <button class="btn btn-light btn-sm mt-2" @click="handleLogout">Logout</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ROW ATAS -->
      <div class="row align-items-stretch">
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
import DashboardView from '@/components/DashboardView.vue'
import TransactionForm from '@/components/TransactionForm.vue'
import TransactionTable from '@/components/TransactionTable.vue'

export default {
  name: 'dashboardPage',
  components: { TransactionForm, DashboardView, TransactionTable },

  data() {
    return {
      admin: {},
      institution: {},
      today: '',
      time: '',
    }
  },

  created() {
    const user = JSON.parse(localStorage.getItem('user'))

    if (user) {
      this.admin = user
      this.institution = user.institution || {}
    }

    const date = new Date()

    this.today = date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

    this.updateClock()

    setInterval(() => {
      this.updateClock()
    }, 1000)
  },

  methods: {
    updateClock() {
      const now = new Date()

      this.time = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    },

    handleLogout() {
      const confirmLogout = confirm('Yakin ingin logout?')

      if (!confirmLogout) return

      localStorage.removeItem('access_token')
      localStorage.removeItem('user')

      this.$router.push('/')
    },
  },
}
</script>

<style>
.dashboardpage {
  min-height: 100vh;
}

.gradient-header {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
}

.institution-logo {
  width: 45px;
  height: 45px;
  object-fit: contain;
  background: white;
  border-radius: 8px;
  padding: 3px;
}
</style>
