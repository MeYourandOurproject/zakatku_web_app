<template>
  <div class="container-fluid">
    <div class="container-fluid dashboardpage p-2 my-3">

      <!-- HEADER IDENTITAS -->
      <div class="row m-0 mb-3">
        <div class="col-12">
          <div class="card shadow-sm p-3 px-4 gradient-header-superadmin text-white rounded-4">
            <div class="d-flex justify-content-between align-items-center">

              <!-- KIRI -->
              <div class="text-start">
                <div class="fw-light small">Assalamu'alaikum 👋</div>

                <div class="fw-bold">
                  Selamat {{ greeting }}, {{ superadmin.name }} (Superadmin)
                </div>

                <div class="small opacity-75">
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

      <!-- STATISTICS CARDS -->
      <div class="row mb-4">
        <div class="col-12 col-md-3">
          <div class="card shadow-sm rounded-4 border-0">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-muted small mb-1">Total Lembaga Zakat</p>
                  <h4 class="fw-bold mb-0">{{ totalInstitutions }}</h4>
                </div>
                <div class="stat-icon-bg bg-primary">
                  <i class="bi bi-building fs-4 text-white"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="card shadow-sm rounded-4 border-0">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-muted small mb-1">Total Admin Terdaftar</p>
                  <h4 class="fw-bold mb-0">{{ totalAdmins }}</h4>
                </div>
                <div class="stat-icon-bg bg-success">
                  <i class="bi bi-people fs-4 text-white"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="card shadow-sm rounded-4 border-0">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-muted small mb-1">Total Penerimaan (Uang)</p>
                  <h4 class="fw-bold mb-0">Rp {{ formatCurrency(totalCashRupiah) }}</h4>
                </div>
                <div class="stat-icon-bg bg-warning">
                  <i class="bi bi-cash-coin fs-4 text-white"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="card shadow-sm rounded-4 border-0">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-muted small mb-1">Total Beras Diterima</p>
                  <h4 class="fw-bold mb-0">{{ formatCurrency(totalRiceKg) }} KG</h4>
                </div>
                <div class="stat-icon-bg bg-info">
                  <i class="bi bi-bag-fill fs-4 text-white"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- INSTITUTIONS TABLE -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm rounded-4 border-0">
            <div class="card-header bg-white border-bottom p-3 rounded-top-4">
              <h5 class="card-title fw-bold mb-0">
                <i class="bi bi-list-check me-2"></i>Daftar Lembaga Zakat
              </h5>
            </div>
            <div class="card-body p-0">
              <div v-if="loading" class="p-4 text-center">
                <div class="spinner-border spinner-border-sm text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              
              <table v-else-if="institutions.length > 0" class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th class="ps-4">Nama Lembaga</th>
                    <th>Tipe</th>
                    <th class="text-center">Jumlah Admin</th>
                    <th class="text-center">Jumlah Penerimaan</th>
                    <th class="text-center">Total Beras (KG)</th>
                    <th class="text-end pe-4">Total Uang (Rp)</th>
                    <th class="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="institution in institutions" :key="institution.id">
                    <td class="ps-4 fw-semibold">{{ institution.name }}</td>
                    <td>
                      <span class="badge" :class="getBadgeClass(institution.type)">
                        {{ formatType(institution.type) }}
                      </span>
                    </td>
                    <td class="text-center">
                      <span class="badge bg-light text-dark">{{ institution.users?.length || 0 }}</span>
                    </td>
                    <td class="text-center">
                      <span class="badge bg-info text-white">{{ institution.totalReceipts || 0 }}</span>
                    </td>
                    <td class="text-center">
                      <span class="fw-semibold text-primary">{{ formatCurrency(institution.totalRiceKg || 0) }} KG</span>
                    </td>
                    <td class="text-end pe-4">
                      <span class="fw-semibold text-success">Rp {{ formatCurrency(institution.totalCashRupiah || 0) }}</span>
                    </td>
                    <td class="text-center">
                      <button
                        class="btn btn-sm btn-danger"
                        title="Hapus Lembaga"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteInstitutionModal"
                        @click="institutionToDelete = institution"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div v-else class="p-4 text-center text-muted">
                <i class="bi bi-inbox fs-3 d-block mb-2"></i>
                <p>Tidak ada data lembaga zakat</p>
              </div>
            </div>
          </div>
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

  <!-- TOAST DELETE SUCCESS -->
  <div class="toast-container position-fixed top-0 end-0 p-3">
    <div ref="deleteSuccessToast" class="toast align-items-center text-bg-success border-0">
      <div class="d-flex">
        <div class="toast-body">✅ Lembaga berhasil dihapus!</div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
        ></button>
      </div>
    </div>
  </div>

  <!-- TOAST ERROR -->
  <div class="toast-container position-fixed top-0 end-0 p-3">
    <div ref="errorToast" class="toast align-items-center text-bg-danger border-0">
      <div class="d-flex">
        <div class="toast-body" ref="errorToastMessage">❌ Terjadi kesalahan!</div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
        ></button>
      </div>
    </div>
  </div>

  <!-- MODAL DELETE INSTITUTION -->
  <div class="modal fade" id="deleteInstitutionModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 shadow">
        <div class="modal-header border-danger">
          <h5 class="modal-title text-danger fw-bold">
            <i class="bi bi-exclamation-triangle me-2"></i>Hapus Lembaga
          </h5>
          <button class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">
          <div v-if="institutionToDelete" class="alert alert-warning" role="alert">
            <strong>⚠️ Perhatian!</strong>
            <p class="mb-2">Anda akan menghapus lembaga berikut dan SEMUA data terkaitnya:</p>
            <div class="card bg-light">
              <div class="card-body">
                <p class="mb-1"><strong>Nama Lembaga:</strong> {{ institutionToDelete.name }}</p>
                <p class="mb-1"><strong>Tipe:</strong> {{ formatType(institutionToDelete.type) }}</p>
                <p class="mb-1"><strong>Jumlah Admin:</strong> {{ institutionToDelete.users?.length || 0 }}</p>
                <p class="mb-0"><strong>Jumlah Penerimaan:</strong> {{ institutionToDelete.totalReceipts || 0 }}</p>
              </div>
            </div>
            <p class="mt-2 mb-0 text-danger"><strong>Data yang akan dihapus:</strong></p>
            <ul class="text-danger small">
              <li>Semua data admin/pengguna</li>
              <li>Semua transaksi penerimaan</li>
              <li>Semua detail penerimaan</li>
              <li>Semua pengaturan lembaga</li>
            </ul>
          </div>

          <p class="text-muted mb-0">Tindakan ini tidak dapat dibatalkan. Pastikan Anda yakin sebelum melanjutkan.</p>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">
            Batal
          </button>

          <button 
            class="btn btn-danger" 
            @click="confirmDeleteInstitution" 
            :disabled="deletingInstitution"
          >
            <span v-if="deletingInstitution" class="spinner-border spinner-border-sm me-2"></span>
            {{ deletingInstitution ? 'Menghapus...' : 'Ya, Hapus Lembaga' }}
          </button>
        </div>
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
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL

export default {
  name: 'DashboardSuperadminPage',

  data() {
    return {
      superadmin: {},
      institutions: [],
      today: '',
      time: '',
      loading: false,
      deletingInstitution: false,
      greeting: '',
      showMenu: false,
      institutionToDelete: null,
      totalInstitutions: 0,
      totalAdmins: 0,
      totalCashRupiah: 0,
      totalRiceKg: 0,
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
      this.superadmin = user
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

    this.fetchInstitutions()
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

    async fetchInstitutions() {
      try {
        this.loading = true
        const token = localStorage.getItem('token')

        const response = await fetch(`${API_BASE_URL}/api/users/institutions/all`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch institutions')
        }

        const data = await response.json()
        this.institutions = data.data || []
        this.totalInstitutions = this.institutions.length
        this.totalAdmins = this.institutions.reduce((sum, inst) => sum + (inst.users?.length || 0), 0)
        this.totalCashRupiah = this.institutions.reduce((sum, inst) => sum + (inst.totalCashRupiah || 0), 0)
        this.totalRiceKg = this.institutions.reduce((sum, inst) => sum + (inst.totalRiceKg || 0), 0)
      } catch (error) {
        console.error('Error fetching institutions:', error)
      } finally {
        this.loading = false
      }
    },

    formatCurrency(value) {
      if (!value) return '0'
      return new Intl.NumberFormat('id-ID', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    },

    formatType(type) {
      const types = {
        'mosque': 'Masjid',
        'laz': 'LAZ',
        'school': 'Sekolah',
        'organization': 'Organisasi'
      }
      return types[type] || type
    },

    getBadgeClass(type) {
      const classes = {
        'mosque': 'bg-primary',
        'laz': 'bg-success',
        'school': 'bg-info',
        'organization': 'bg-warning'
      }
      return classes[type] || 'bg-secondary'
    },

    async confirmDeleteInstitution() {
      try {
        if (!this.institutionToDelete) return

        this.deletingInstitution = true
        const token = localStorage.getItem('token')

        const response = await fetch(`${API_BASE_URL}/api/users/institutions/${this.institutionToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Failed to delete institution')
        }

        // Close modal
        const modalElement = document.getElementById('deleteInstitutionModal')
        const modalInstance = Modal.getInstance(modalElement)
        if (modalInstance) modalInstance.hide()

        // Reset form
        this.institutionToDelete = null

        // Show success toast
        const toast = new Toast(this.$refs.deleteSuccessToast)
        toast.show()

        // Refresh institutions list
        setTimeout(() => {
          this.fetchInstitutions()
        }, 500)

      } catch (error) {
        console.error('Error deleting institution:', error)
        
        // Show error message
        this.$refs.errorToastMessage.textContent = `❌ ${error.message}`
        const errorToast = new Toast(this.$refs.errorToast)
        errorToast.show()

      } finally {
        this.deletingInstitution = false
      }
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

.dashboardpage {
  min-height: 100vh;
}

.gradient-header-superadmin {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

/* STAT ICON */
.stat-icon-bg {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* dropdown container */
.user-dropdown {
  position: relative;
}

/* dropdown menu */
.dropdown-menu-custom {
  position: absolute;
  right: 0;
  top: 48px;
  min-width: 170px;
  background: white;
  border-radius: 12px;
  padding: 8px 0;
  z-index: 999;
}

/* dropdown item */
.dropdown-menu-custom .dropdown-item {
  padding: 8px 16px;
  cursor: pointer;
}

.dropdown-menu-custom .dropdown-item:hover {
  background: #f5f5f5;
}

</style>
