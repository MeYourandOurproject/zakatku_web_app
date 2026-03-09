<template>
  <div class="container-fluid">
    <div class="container-fluid p-2 my-3">
      <!-- HEADER IDENTITAS -->
      <div class="row m-0 mb-3">
        <div class="col-12">
          <div class="card shadow-sm p-3 px-4 gradient-header text-white rounded-4">
            <div class="d-flex justify-content-between align-items-center">
              <!-- KIRI -->
              <div class="text-start">
                <div class="fw-light small">Assalamu'alaikum 👋</div>

                <div class="fw-bold">Selamat {{ greeting }}, {{ admin.name }}</div>

                <div class="small opacity-75">
                  {{ institution.name }} -
                  <span class="small opacity-75"> {{ today }} | {{ time }} WIB </span>
                </div>
              </div>

              <!-- USER DROPDOWN -->
              <div class="user-dropdown" ref="dropdown">
                <button class="btn btn-light" @click.stop="toggleMenu">
                  <i class="bi bi-person-circle fs-5"></i>
                </button>

                <div v-if="showMenu" class="dropdown-menu-custom shadow text-dark">
                  <a class="dropdown-item" href="/setting">
                    <i class="bi bi-gear me-2"></i>
                    Settings
                  </a>

                  <div class="dropdown-divider"></div>

                  <a
                    class="dropdown-item text-danger fw-bold"
                    data-bs-toggle="modal"
                    data-bs-target="#logoutModal"
                    @click="showMenu = false"
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
    </div>
  </div>
</template>

<script>
import { Toast, Modal } from 'bootstrap'

export default {
  name: 'NavbarComponent',

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