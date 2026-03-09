<template>
  <div class="container my-4">
    <div class="card shadow-lg border-0">
      <!-- HEADER -->
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="fw-bold mb-0">⚙ System Settings</h5>

        <button class="btn btn-primary btn-sm" @click="openCreate">+ Add Setting</button>
      </div>

      <!-- TABLE -->
      <div class="table-responsive">
        <table class="table table-striped align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th width="60">ID</th>
              <th width="200">KEY</th>
              <th>VALUE</th>
              <th>DESCRIPTION</th>
              <th width="140">ACTION</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="s in settings" :key="s.id">
              <td>{{ s.id }}</td>

              <td>
                <code>{{ s.key }}</code>
              </td>

              <td>{{ s.value }}</td>

              <td>{{ s.description }}</td>

              <td>
                <button class="btn btn-sm btn-warning me-2" @click="openEdit(s)">Edit</button>

                <button class="btn btn-sm btn-danger" @click="confirmDelete(s.id)">Delete</button>
              </td>
            </tr>

            <tr v-if="settings.length === 0">
              <td colspan="5" class="text-center py-4 text-muted">No settings found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- FORM MODAL -->
    <div class="modal fade" id="settingModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ form.id ? 'Edit Setting' : 'Create Setting' }}
            </h5>

            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Key</label>
              <input v-model="form.key" class="form-control" :disabled="form.id" />
            </div>

            <div class="mb-3">
              <label class="form-label">Value</label>
              <input v-model="form.value" class="form-control" />
            </div>

            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea v-model="form.description" class="form-control"></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>

            <button class="btn btn-primary" @click="saveSetting">Save</button>
          </div>
        </div>
      </div>
    </div>

    <!-- DELETE MODAL -->
    <div class="modal fade" id="deleteModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete Setting</h5>
          </div>

          <div class="modal-body">Are you sure want to delete this setting?</div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>

            <button class="btn btn-danger" @click="deleteSetting">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- TOAST -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div class="toast text-bg-success border-0" ref="toast">
        <div class="d-flex">
          <div class="toast-body">
            {{ toastMessage }}
          </div>

          <button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal, Toast } from 'bootstrap'

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL

export default {
  data() {
    return {
      settings: [],

      form: {
        id: null,
        key: '',
        value: '',
        description: '',
      },

      deleteId: null,
      toastMessage: '',
    }
  },

  mounted() {
    this.fetchSettings()
  },

  methods: {
    async fetchSettings() {
      const token = localStorage.getItem('token')

      const res = await fetch(`${API_BASE_URL}/api/settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await res.json()

      this.settings = result.data
    },

    openCreate() {
      this.form = {
        id: null,
        key: '',
        value: '',
        description: '',
      }

      new Modal(document.getElementById('settingModal')).show()
    },

    openEdit(setting) {
      this.form = { ...setting }

      new Modal(document.getElementById('settingModal')).show()
    },

    async saveSetting() {
      const token = localStorage.getItem('token')

      const url = this.form.id
        ? `${API_BASE_URL}/api/settings/${this.form.id}`
        : `${API_BASE_URL}/api/settings`

      const method = this.form.id ? 'PUT' : 'POST'

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(this.form),
      })

      Modal.getInstance(document.getElementById('settingModal')).hide()

      this.showToast('Setting saved')

      this.fetchSettings()
    },

    confirmDelete(id) {
      this.deleteId = id

      new Modal(document.getElementById('deleteModal')).show()
    },

    async deleteSetting() {
      const token = localStorage.getItem('token')

      await fetch(`${API_BASE_URL}/api/settings/${this.deleteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      Modal.getInstance(document.getElementById('deleteModal')).hide()

      this.showToast('Setting deleted')

      this.fetchSettings()
    },

    showToast(message) {
      this.toastMessage = message

      const toast = new Toast(this.$refs.toast)

      toast.show()
    },
  },
}
</script>

<style scoped>
code {
  font-size: 13px;
  color: #0d6efd;
}
</style>
