<template>
  <div class="container d-flex justify-content-center align-items-center my-5">
    <div class="card shadow-lg border-0 rounded-4 p-4 register-card">
      <h3 class="text-center fw-bold mb-4">🕌 Zakatku Register</h3>

      <form @submit.prevent="handleRegister" class="text-start">
        <!-- USER INFO -->
        <div class="mb-3">
          <label class="form-label fw-semibold">Nama Lengkap</label>
          <input
            v-model="name"
            type="text"
            class="form-control"
            placeholder="Masukkan nama"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Email</label>
          <input
            v-model="email"
            type="email"
            class="form-control"
            placeholder="Masukkan email"
            required
          />
        </div>

        <div class="mb-4">
          <label class="form-label fw-semibold">Password</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Masukkan password"
            required
          />
        </div>

        <hr />

        <!-- INSTITUTION INFO -->
        <h6 class="fw-bold mb-3 text-muted">Data Lembaga Zakat</h6>

        <div class="mb-3">
          <label class="form-label fw-semibold">Nama Lembaga</label>
          <input
            v-model="institution_name"
            type="text"
            class="form-control"
            placeholder="Contoh: Masjid Al-Furqan"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Jenis Lembaga</label>
          <select v-model="institution_type" class="form-select" required>
            <option value="mosque">Masjid</option>
            <option value="laz">LAZ</option>
            <option value="school">Sekolah</option>
            <option value="organization">Organisasi</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Alamat</label>
          <textarea v-model="institution_address" class="form-control" rows="2" required></textarea>
        </div>

        <div class="mb-4">
          <label class="form-label fw-semibold">No. HP</label>
          <input
            v-model="institution_phone"
            type="text"
            class="form-control"
            placeholder="08xxxxxxxxxx"
          />
        </div>

        <div class="d-grid">
          <button type="submit" class="btn btn-primary py-2 custom-btn" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? 'Processing...' : '✨ Daftar Sekarang' }}
          </button>
        </div>

        <div class="text-center mt-3">
          <small>Sudah punya akun? <router-link to="/login">Login</router-link></small>
        </div>
      </form>
    </div>

    <!-- SUCCESS TOAST -->
    <div class="toast-container position-fixed top-0 end-0 p-3">
      <div
        ref="successToast"
        class="toast align-items-center text-bg-success border-0"
        role="alert"
      >
        <div class="d-flex">
          <div class="toast-body">✅ Registrasi berhasil! Membuka Dashboard...</div>
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
      name: '',
      email: '',
      password: '',
      institution_name: '',
      institution_type: 'mosque',
      institution_address: '',
      institution_phone: '',
      loading: false,
    }
  },

  methods: {
    async handleRegister() {
      try {
        this.loading = true

        // =========================
        // 1️⃣ REGISTER
        // =========================
        const registerResponse = await fetch(`${API_BASE_URL}/api/users/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.name,
            email: this.email,
            password: this.password,
            institution_name: this.institution_name,
            institution_type: this.institution_type,
            institution_address: this.institution_address,
            institution_phone: this.institution_phone,
          }),
        })

        const registerData = await registerResponse.json()
        if (!registerResponse.ok) throw new Error(registerData.message)

        // =========================
        // 2️⃣ AUTO LOGIN
        // =========================
        const loginResponse = await fetch(`${API_BASE_URL}/api/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        })

        const loginData = await loginResponse.json()
        if (!loginResponse.ok) throw new Error(loginData.message)

        // =========================
        // 3️⃣ SIMPAN TOKEN
        // =========================
        localStorage.setItem('token', loginData.token)
        localStorage.setItem('user', JSON.stringify(loginData.user))

        const toast = new Toast(this.$refs.successToast)
        toast.show()

        // delay redirect
        setTimeout(() => {
          this.$router.push('/dashboard').then(() => {
            window.location.reload()
          })
        }, 2000)
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

.register-card {
  width: 460px;
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
