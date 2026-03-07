<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow-lg border-0 rounded-4 p-4 login-card">
      <h3 class="text-center fw-bold mb-4">🕌 Zakatku Login</h3>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label fw-semibold">Email</label>
          <input
            type="email"
            v-model="email"
            class="form-control"
            placeholder="Masukkan email"
            required
          />
        </div>

        <div class="mb-4">
          <label class="form-label fw-semibold">Password</label>
          <input
            type="password"
            v-model="password"
            class="form-control"
            placeholder="Masukkan password"
            required
          />
        </div>

        <div class="d-grid">
          <button type="submit" class="btn btn-primary py-2 custom-btn" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>

            {{ loading ? 'Processing...' : '🚀 Login' }}
          </button>
        </div>
      </form>
    </div>
    <div class="toast-container position-fixed top-0 end-0 p-3">
      <div
        ref="successToast"
        class="toast align-items-center text-bg-success border-0"
        role="alert"
      >
        <div class="d-flex">
          <div class="toast-body">✅ Login berhasil! Mengarahkan ke dashboard...</div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'bootstrap'
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL

export default {
  data() {
    return {
      email: '',
      password: '',
      loading: false,
    }
  },

  methods: {
    async handleLogin() {
      try {
        this.loading = true

        const response = await fetch(`${API_BASE_URL}/api/users/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message)
        }

        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        // tampilkan toast
        const toast = new Toast(this.$refs.successToast)
        toast.show()

        // delay redirect
        setTimeout(() => {
          this.$router.push('/dashboard')
        }, 1500)
      } catch (error) {
        alert(error.message)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
body {
  background-color: #f4f7fb;
}

.login-card {
  width: 400px;
}

.custom-btn {
  border-radius: 12px;
  font-weight: 600;
  transition: 0.3s ease;
}

.custom-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
}
</style>
