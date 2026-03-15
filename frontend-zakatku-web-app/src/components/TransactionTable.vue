<template>
  <div class="container-fluid my-4">
    <div class="row">
      <div class="col-12">
        <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
          <!-- HEADER -->
          <div class="card-header gradient-header text-white py-3 text-center">
            <h4 class="mb-0 fw-bold">📊 Daftar Transaksi Terbaru</h4>
          </div>

          <div class="table-responsive p-3">
            <table class="table custom-table text-center align-middle mb-0">
              <!-- TABLE HEADER -->
              <thead>
                <tr>
                  <th rowspan="3">NO</th>
                  <th rowspan="3">RECEIPT</th>
                  <th rowspan="3">NAMA MUZAKI</th>
                  <th rowspan="3">JIWA</th>

                  <th colspan="2">ZAKAT FITRAH</th>
                  <th colspan="3">ZAKAT MAL / INFAQ / FIDYAH</th>
                  <th colspan="2">MUSTAHIQ</th>
                  <th colspan="2">TOTAL</th>
                  <th rowspan="3">ACTION</th>
                </tr>

                <tr>
                  <th>BERAS</th>
                  <th>UANG</th>

                  <th>MAL</th>
                  <th>INFAQ</th>
                  <th>FIDYAH</th>

                  <th rowspan="2">YA</th>
                  <th rowspan="2">BUKAN</th>

                  <th rowspan="2">BERAS</th>
                  <th rowspan="2">UANG</th>
                </tr>

                <tr>
                  <th>kg</th>
                  <th>Rp.</th>
                  <th>Rp.</th>
                  <th>Rp.</th>
                  <th>Paket</th>
                </tr>
              </thead>

              <!-- TABLE BODY -->
              <tbody>
                <tr v-for="(trx, index) in transactions" :key="trx.id">
                  <td>{{ index + 1 }}</td>

                  <td class="receipt">
                    {{ trx.receipt_number }}
                  </td>

                  <td class="fw-semibold">
                    {{ trx.muzaki?.name }}
                  </td>

                  <td>
                    {{ trx.number_of_people }}
                  </td>

                  <td>{{ getQty(trx, 'RICE') || '' }}</td>

                  <td>{{ formatCurrency(getTotal(trx, 'CASH')) }}</td>

                  <td>{{ formatCurrency(getTotal(trx, 'MAL')) }}</td>

                  <td>{{ formatCurrency(getTotal(trx, 'INFAQ/SHADAQAH')) }}</td>

                  <td>{{ getQty(trx, 'FIDYAH') || '' }}</td>

                  <td>
                    <span v-if="trx.muzaki?.is_mustahiq" class="badge bg-success">✔</span>
                  </td>

                  <td>
                    <span v-if="!trx.muzaki?.is_mustahiq" class="badge bg-secondary">✔</span>
                  </td>

                  <td class="total-rice">
                    {{ calculateTotalRice(trx) }}
                  </td>

                  <td class="total-money">
                    {{ formatCurrency(calculateTotalMoney(trx)) }}
                  </td>

                  <!-- ACTION -->
                  <td>
                    <button class="btn btn-sm btn-danger" @click="openDeleteModal(trx.muzaki?.id)">
                      ✕
                    </button>
                  </td>
                </tr>

                <tr v-if="transactions.length === 0">
                  <td colspan="14" class="py-4 text-muted">No transactions found</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- EXPORT BUTTON -->
          <div class="text-end p-3 border-top">
            <button
              class="btn btn-success rounded-3 px-4 fw-semibold shadow-sm"
              @click="exportExcel"
              :disabled="exporting"
            >
              <span v-if="!exporting">⬇ Export to Excel</span>

              <span v-else>
                <span class="spinner-border spinner-border-sm me-2"></span>
                Exporting...
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- DELETE MODAL -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Konfirmasi Hapus</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body text-start">Apakah anda yakin ingin menghapus data ini?</div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>

            <button class="btn btn-danger" @click="deleteMuzaki">Hapus</button>
          </div>
        </div>
      </div>
    </div>

    <!-- TOAST -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div id="liveToast" class="toast align-items-center text-bg-success border-0">
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
  </div>
</template>

<script>
import { Modal, Toast } from 'bootstrap'

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL

export default {
  data() {
    return {
      transactions: [],
      selectedMuzakiId: null,
      toastMessage: '',
    }
  },

  mounted() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      const token = localStorage.getItem('token')

      const res = await fetch(`${API_BASE_URL}/api/receipts?page=1&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await res.json()

      this.transactions = result.data
    },

    openDeleteModal(id) {
      this.selectedMuzakiId = id

      const modal = new Modal(document.getElementById('deleteModal'))

      modal.show()
    },

    async deleteMuzaki() {
      try {
        const token = localStorage.getItem('token')

        const res = await fetch(`${API_BASE_URL}/api/muzakis/${this.selectedMuzakiId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error()

        const modalEl = document.getElementById('deleteModal')
        Modal.getInstance(modalEl).hide()

        this.toastMessage = 'Data berhasil dihapus'

        const toast = new Toast(document.getElementById('liveToast'))
        toast.show()

        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } catch {
        this.toastMessage = 'Gagal menghapus data'

        const toast = new Toast(document.getElementById('liveToast'))
        toast.show()
      }
    },

    async exportExcel() {
      try {
        this.exporting = true

        const response = await fetch(`${API_BASE_URL}/api/export/excel`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        if (!response.ok) throw new Error('Export failed')

        const contentDisposition = response.headers.get('Content-Disposition')

        let fileName = 'Laporan_Zakat.xlsx'

        if (contentDisposition && contentDisposition.includes('filename=')) {
          fileName = contentDisposition.split('filename=')[1].replace(/"/g, '')
        }

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)

        const link = document.createElement('a')

        link.href = url
        link.download = fileName

        document.body.appendChild(link)
        link.click()
        link.remove()

        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Export failed:', error)
        alert('Gagal export data')
      } finally {
        this.exporting = false
      }
    },

    getQty(trx, sub) {
      const item = trx.details?.find((d) => d.sub_category === sub)
      return item?.quantity ? parseFloat(item.quantity) : 0
    },

    getTotal(trx, sub) {
      const item = trx.details?.find((d) => d.sub_category === sub)
      return item?.total ? parseFloat(item.total) : 0
    },

    calculateTotalRice(trx) {
      return this.getQty(trx, 'RICE')
    },

    calculateTotalMoney(trx) {
      return (
        this.getTotal(trx, 'CASH') +
        this.getTotal(trx, 'MAL') +
        this.getTotal(trx, 'INFAQ/SHADAQAH') +
        this.getTotal(trx, 'FIDYAH')
      )
    },

    formatCurrency(value) {
      if (!value) return ''

      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(value)
    },
  },
}
</script>

<style scoped>
.gradient-header {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
}

.custom-table thead th {
  text-align: center !important;
  vertical-align: middle !important;
  font-size: 12px;
  font-weight: 600;
  background: #f1f5ff;
}

.custom-table tbody tr:nth-child(even) {
  background-color: #fafafa;
}

.custom-table tbody tr:hover {
  background-color: #f1f7ff;
  transition: 0.2s ease;
}

.receipt {
  font-weight: bold;
  color: #2a5298;
}

.total-rice {
  font-weight: 600;
  color: #555;
}

.total-money {
  font-weight: 700;
  color: #198754;
}

.money {
  text-align: center;
}

.custom-table td {
  font-size: 13px;
}
</style>
