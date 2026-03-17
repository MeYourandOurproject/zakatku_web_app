<template>
  <div class="dashboard-layout">
    <!-- SIDEBAR/NAVBAR -->
    <div class="sidebar-navbar">
      <!-- Header -->
      <div class="navbar-header">
        <div class="navbar-brand">
          <i class="bi bi-mosque"></i>
          <span>Zakatku Web App</span>
        </div>
      </div>

      <!-- User Info -->
      <div class="user-info text-start">
        <div class="user-avatar d-flex align-items-start">
          <i class="bi bi-person-circle"></i>
        </div>
        <div class="user-details">
          <p class="user-name">{{ admin.name }}</p>
          <p class="institution-name">{{ institution.name }}</p>
          <p class="user-time">{{ today }} | {{ time }}</p>
        </div>
      </div>

      <hr class="divider">

      <!-- Navigation Menu -->
      <div class="nav-menu">
        <a 
          v-for="menu in menuItems" 
          :key="menu.id"
          @click="currentPage = menu.page"
          :class="['nav-item', { active: currentPage === menu.page }]"
        >
          <i :class="menu.icon"></i>
          <span>{{ menu.label }}</span>
        </a>
      </div>

      <hr class="divider">

      <!-- Logout Button -->
      <button 
        class="btn-logout"
        data-bs-toggle="modal"
        data-bs-target="#logoutModal"
      >
        <i class="bi bi-box-arrow-right"></i>
        <span>Logout</span>
      </button>
    </div>

    <!-- MAIN CONTENT -->
    <div class="main-content">
      <!-- DASHBOARD PAGE -->
      <div v-if="currentPage === 'dashboard'" class="page-content">
        <!-- ROW ATAS -->
        <div class="row align-items-stretch mb-4">
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

      <!-- SETTING PAGE -->
      <div v-if="currentPage === 'settings'" class="page-content">
        <SettingPage />
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
import SettingPage from '@/views/SettingPage.vue'

export default {
  name: 'DashboardPage',

  components: {
    TransactionForm,
    DashboardView,
    TransactionTable,
    SettingPage,
  },

  data() {
    return {
      admin: {},
      institution: {},
      today: '',
      time: '',
      loading: false,
      currentPage: 'dashboard',
      menuItems: [
        {
          id: 1,
          label: 'Dashboard',
          page: 'dashboard',
          icon: 'bi bi-graph-up',
        },
        {
          id: 2,
          label: 'Settings',
          page: 'settings',
          icon: 'bi bi-gear',
        },
      ],
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

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
}

/* SIDEBAR NAVBAR */
.sidebar-navbar {
  width: 280px;
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  color: white;
  padding: 1.5rem;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

.navbar-brand i {
  font-size: 28px;
}

/* USER INFO */
.user-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.user-avatar {
  font-size: 40px;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
}

.user-details p {
  margin: 0;
  font-size: 0.9rem;
}

.user-name {
  font-weight: 600;
  margin-bottom: 4px;
}

.institution-name {
  font-size: 0.85rem;
  opacity: 0.9;
  margin-bottom: 4px;
}

.user-time {
  font-size: 0.8rem;
  opacity: 0.8;
}

.divider {
  border-color: rgba(255, 255, 255, 0.2);
  margin: 1.5rem 0;
}

/* NAVIGATION MENU */
.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
  text-decoration: none;
  font-weight: 500;
  border: none;
  background: none;
  text-align: left;
  width: 100%;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.15);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.3);
  border-left: 4px solid #ffd700;
  padding-left: 12px;
}

.nav-item i {
  font-size: 18px;
  flex-shrink: 0;
}

/* LOGOUT BUTTON */
.btn-logout {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background: rgba(255, 73, 73, 0.2);
  border-color: rgba(255, 73, 73, 0.4);
}

/* MAIN CONTENT */
.main-content {
  margin-left: 280px;
  flex: 1;
  padding: 2rem;
}

.page-content {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .sidebar-navbar {
    width: 250px;
    padding: 1rem;
  }

  .main-content {
    margin-left: 250px;
    padding: 1rem;
  }

  .user-info {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 576px) {
  .dashboard-layout {
    flex-direction: column;
  }

  .sidebar-navbar {
    width: 100%;
    height: auto;
    position: static;
    max-height: 300px;
    overflow-y: auto;
  }

  .main-content {
    margin-left: 0;
    padding: 1rem 0.5rem;
  }

  .nav-menu {
    flex-direction: row;
    overflow-x: auto;
    gap: 4px;
  }

  .nav-item {
    white-space: nowrap;
    padding: 8px 12px;
  }
}
</style>

  