<template>
  <div class="container-fluid">
    <div class="container-fluid dashboardpage p-2 my-3">

      <!-- HEADER IDENTITAS -->
      <div class="row m-0 mb-3">
        <div class="col-12">
          <div class="card shadow-sm p-3 px-4 gradient-header text-white rounded-4">
            <div class="d-flex justify-content-between align-items-center">

              <!-- KIRI -->
              <div class="text-start">
                <div class="fw-light small">Assalamu'alaikum 👋</div>

                <div class="fw-bold">
                  Selamat {{ greeting }}, {{ admin.name }}
                </div>

                <div class="small opacity-75">
                  {{ institution.name }} -
                  <span class="small opacity-75">
                    {{ today }} | {{ time }} WIB
                  </span>
                </div>
              </div>

              <!-- USER DROPDOWN -->
              <div class="user-dropdown" ref="dropdown">
                <button
                  class="btn btn-light"
                  @click.stop="toggleMenu"
                >
                  <i class="bi bi-person-circle fs-5"></i>
                </button>

                <div v-if="showMenu" class="dropdown-menu-custom shadow text-dark">
                  <!-- <a class="dropdown-item" href="/setting">
                    <i class="bi bi-gear me-2"></i>
                    Settings
                  </a> -->

                  <div class="dropdown-divider"></div>

                  <a
                    class="dropdown-item text-danger fw-bold"
                    data-bs-toggle="modal"
                    data-bs-target="#logoutModal"
                    @click="showMenu=false"
                  >
                    <i class="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </a>
                </div>
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

  <!-- TOAST SUCCESS -->
  <div class="toast-container position-fixed top-0 end-0 p-3">
    <div ref="successToast" class="toast align-items-center text-bg-success border-0">
      <div class="d-flex">
        <div class="toast-body">✅ Logout berhasil!</div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
        ></button>
      </div>
    </div>
  </div>

  <!-- MODAL LOGOUT -->
  <div class="modal fade" id="logoutModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 shadow">

        <div class="modal-header">
          <h5 class="modal-title">Konfirmasi Logout</h5>
          <button class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body text-start">
          Apakah Anda yakin ingin logout?
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">
            Batal
          </button>

          <button class="btn btn-danger" @click="confirmLogout" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? 'Processing...' : 'Logout' }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { Toast, Modal } from 'bootstrap'
import DashboardView from '@/components/DashboardView.vue'
import TransactionForm from '@/components/TransactionForm.vue'
import TransactionTable from '@/components/TransactionTable.vue'

export default {
  name: 'DashboardPage',

  components: {
    TransactionForm,
    DashboardView,
    TransactionTable,
  },

  data() {
    return {
      admin: {},
      institution: {},
      today: '',
      time: '',
      loading: false,
      greeting: '',
      showMenu: false,
    }
  },

  created() {
    const hour = new Date().getHours()

    if (hour < 12) this.greeting = 'Pagi'
    else if (hour < 15) this.greeting = 'Siang'
    else if (hour < 18) this.greeting = 'Sore'
    else this.greeting = 'Malam'

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

  mounted() {
    document.addEventListener("click", this.handleClickOutside)
  },

  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside)
  },

  methods: {

    toggleMenu() {
      this.showMenu = !this.showMenu
    },

    handleClickOutside(event) {
      const dropdown = this.$refs.dropdown

      if (dropdown && !dropdown.contains(event.target)) {
        this.showMenu = false
      }
    },

    updateClock() {
      const now = new Date()

      this.time = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    },

    async confirmLogout() {
      try {
        this.loading = true

        const modalElement = document.getElementById('logoutModal')
        const modalInstance = Modal.getInstance(modalElement)

        if (modalInstance) modalInstance.hide()

        document.body.classList.remove('modal-open')
        document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove())

        localStorage.removeItem('token')
        localStorage.removeItem('user')

        const toast = new Toast(this.$refs.successToast)
        toast.show()

        setTimeout(() => {
          this.$router.push('/').then(() => {
            window.location.reload()
          })
        }, 1000)

      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style>

.dashboardpage{
  min-height:100vh;
}

.gradient-header{
  background: linear-gradient(135deg,#1e3c72,#2a5298);
}


/* dropdown container */
.user-dropdown{
  position:relative;
}

/* dropdown menu */
.dropdown-menu-custom{
  position:absolute;
  right:0;
  top:48px;
  min-width:170px;
  background:white;
  border-radius:12px;
  padding:8px 0;
  z-index:999;
}

/* dropdown item */
.dropdown-menu-custom .dropdown-item{
  padding:8px 16px;
  cursor:pointer;
}

.dropdown-menu-custom .dropdown-item:hover{
  background:#f5f5f5;
}

</style>