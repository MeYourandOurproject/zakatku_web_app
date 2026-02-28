<template>
  <div class="container my-4">
    <div class="card shadow-lg border-0 rounded-4 overflow-hidden h-100">
      <!-- HEADER -->
      <div class="card-header gradient-header py-3 text-white text-center">
        <h4 class="mb-0 fw-bold">📝 Transaction Form</h4>
      </div>

      <div class="card-body p-4">
        <!-- TOAST -->
        <div class="position-fixed top-0 end-0 p-3" style="z-index: 9999">
          <div
            class="toast align-items-center text-white border-0"
            :class="toastType"
            ref="toastRef"
          >
            <div class="d-flex">
              <div class="toast-body">
                {{ toastMessage }}
              </div>
              <button
                type="button"
                class="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast"
              ></button>
            </div>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="text-start">
          <!-- RECEIPT -->
          <div class="mb-4">
            <label class="form-label custom-label">Receipt Number</label>
            <input
              type="text"
              class="form-control custom-input receipt-input"
              v-model="form.receipt_number"
              disabled
            />
          </div>

          <!-- DATA MUZAKI -->
          <!-- <h6 class="section-title">Data Muzaki</h6> -->

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label custom-label">Nama Muzaki</label>
              <input
                type="text"
                class="form-control custom-input"
                v-model="form.name"
                :disabled="isDisabled"
                required
                ref="nameInput"
              />
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label custom-label">Nomor</label>
              <input
                type="text"
                class="form-control custom-input"
                v-model="form.phone"
                :disabled="isDisabled"
              />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label custom-label">Alamat</label>
            <textarea
              class="form-control custom-input"
              v-model="form.address"
              :disabled="isDisabled"
            ></textarea>
          </div>

          <!-- ZAKAT -->
          <!-- <h6 class="section-title">Zakat & Infaq</h6> -->

          <div class="row">
            <div class="col-md-4 mb-3">
              <label class="form-label custom-label"
                >Jumlah <br />
                Jiwa</label
              >
              <input
                type="number"
                class="form-control custom-input"
                v-model.number="form.number_of_people"
                :disabled="isDisabled"
              />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label custom-label">Zakat Beras <br />(Kg)</label>
              <input
                type="number"
                step="any"
                class="form-control custom-input"
                v-model.number="form.zakat_rice"
                :disabled="isDisabled"
              />
            </div>

            <div class="col-md-4 mb-3">
              <label class="form-label custom-label">Zakat Uang <br />(Rp)</label>
              <input
                type="number"
                class="form-control custom-input"
                v-model.number="form.zakat_cash"
                :disabled="isDisabled"
              />
            </div>
          </div>

          <div class="row">
            <div class="col-md-4 mb-3">
              <label class="form-label custom-label">Zakat Mal</label>
              <input
                type="number"
                class="form-control custom-input"
                v-model.number="form.outher_mal"
                :disabled="isDisabled"
              />
            </div>

            <div class="col-md-4 mb-3">
              <label class="form-label custom-label">Infaq/Shadaqah</label>
              <input
                type="number"
                class="form-control custom-input"
                v-model.number="form.outher_infaq"
                :disabled="isDisabled"
              />
            </div>

            <div class="col-md-4 mb-3">
              <label class="form-label custom-label">Fidyah</label>
              <input
                type="number"
                class="form-control custom-input"
                v-model.number="form.outher_fidyah"
                :disabled="isDisabled"
              />
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label custom-label">Apakah Mustahiq?</label>
            <select
              class="form-select custom-input"
              v-model="form.is_mustahiq"
              :disabled="isDisabled"
            >
              <option :value="false">Bukan</option>
              <option :value="true">Ya</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="form-label custom-label">Catatan</label>
            <textarea
              class="form-control custom-input"
              v-model="form.notes"
              :disabled="isDisabled"
            ></textarea>
          </div>

          <!-- BUTTON -->
          <div class="d-flex gap-3 mt-3">
            <button
              type="button"
              class="btn btn-primary px-4 custom-btn"
              @click="handleGenerate"
              :disabled="!isDisabled || loadingGenerate"
            >
              <span v-if="loadingGenerate" class="spinner-border spinner-border-sm me-2"></span>
              ISI
            </button>

            <button
              type="submit"
              class="btn btn-success px-4 custom-btn"
              :disabled="isDisabled || loadingSubmit"
            >
              <span v-if="loadingSubmit" class="spinner-border spinner-border-sm me-2"></span>
              SIMPAN
            </button>
          </div>
        </form>
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
      isDisabled: true,
      loadingGenerate: false,
      loadingSubmit: false,
      toastMessage: '',
      toastType: 'bg-success',
      form: this.getInitialForm(),
    }
  },

  methods: {
    getInitialForm() {
      return {
        name: '',
        phone: '',
        address: '',
        is_mustahiq: false,
        receipt_number: '',
        number_of_people: 1,
        zakat_rice: 0,
        zakat_cash: 0,
        outher_mal: 0,
        outher_infaq: 0,
        outher_fidyah: 0,
        notes: '',
      }
    },

    showToast(message, type = 'success') {
      this.toastMessage = message
      this.toastType = type === 'success' ? 'bg-success' : 'bg-danger'
      const toast = new Toast(this.$refs.toastRef)
      toast.show()
    },

    async handleGenerate() {
      this.loadingGenerate = true
      try {
        const response = await fetch(`${API_BASE_URL}/api/transactions/generate-number`, {
          method: 'POST',
        })
        const data = await response.json()

        this.form.receipt_number = data.receipt_number
        this.isDisabled = false

        this.showToast('Receipt number generated!', 'success')

        // 👉 Fokus otomatis ke input Name
        this.$nextTick(() => {
          this.$refs.nameInput.focus()
        })
      } catch {
        this.showToast('Failed generate number', 'error')
      } finally {
        this.loadingGenerate = false
      }
    },

    async handleSubmit() {
      this.loadingSubmit = true
      try {
        const response = await fetch(`${API_BASE_URL}/api/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form),
        })

        if (!response.ok) throw new Error()

        this.showToast('Transaction saved successfully!', 'success')

        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } catch {
        this.showToast('Upload failed!', 'error')
      } finally {
        this.loadingSubmit = false
      }
    },
  },
}
</script>

<style scoped>
/* Same Gradient as Table */
.gradient-header {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
}

/* Labels */
.custom-label {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 6px;
}

/* Section title */
.section-title {
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 15px;
  color: #2a5298;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 6px;
}

/* Input clean style */
.custom-input {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
}

.custom-input:focus {
  border-color: #2a5298;
  box-shadow: 0 0 0 0.15rem rgba(42, 82, 152, 0.2);
}

/* Receipt highlight */
.receipt-input {
  font-weight: bold;
  color: #2a5298;
  background-color: #f1f5ff;
}

/* Buttons */
.custom-btn {
  border-radius: 10px;
  font-weight: 600;
  transition: 0.2s ease;
}

.custom-btn:hover {
  transform: translateY(-2px);
}
</style>
