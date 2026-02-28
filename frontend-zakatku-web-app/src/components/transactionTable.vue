<template>
  <div class="container-fluid my-4">
    <div class="row">
      <div class="col-12">
        <div class="card shadow-lg border-0 rounded-4 overflow-hidden">

          <!-- HEADER -->
          <div class="card-header gradient-header text-white py-3 text-center">
            <h4 class="mb-0 fw-bold">📊 Transaction List</h4>
          </div>

          <div class="table-responsive p-3">
            <table class="table custom-table text-center align-middle mb-0">
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
                  <th>KG</th>
                  <th>RUPIAH</th>
                  <th>RUPIAH</th>
                  <th>RUPIAH</th>
                  <th>PAKET</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(trx, index) in transactions" :key="trx.id">
                  <td>{{ index + 1 }}</td>
                  <td class="receipt">{{ trx.receipt_number }}</td>
                  <td class="fw-semibold">{{ trx.muzaki?.name }}</td>
                  <td>{{ trx.number_of_people }}</td>

                  <td>{{ getDetail(trx, 'RICE') || '' }}</td>
                  <td>{{ formatCurrency(getDetail(trx, 'CASH')) }}</td>

                  <td>{{ formatCurrency(getDetail(trx, 'MAL')) }}</td>
                  <td>{{ formatCurrency(getDetail(trx, 'INFAQ/SHADAQAH')) }}</td>
                  <td>{{ getDetail(trx, 'FIDYAH') || '' }}</td>

                  <td>
                    <span v-if="trx.muzaki?.is_mustahiq" class="badge bg-success">✔</span>
                  </td>
                  <td>
                    <span v-if="!trx.muzaki?.is_mustahiq" class="badge bg-secondary">✔</span>
                  </td>

                  <td class="total-rice">
                    {{ calculateTotalRice(trx) || '' }}
                  </td>

                  <td class="total-money">
                    {{ formatCurrency(calculateTotalMoney(trx)) }}
                  </td>
                </tr>

                <tr v-if="transactions.length === 0">
                  <td colspan="14" class="py-4 text-muted">
                    No transactions found
                  </td>
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
  </div>
</template>

<script>
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL
export default {
  name: 'TransactionTable',

  data() {
    return {
      transactions: [],
      exporting: false,
    }
  },

  mounted() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/receipts?page=1&limit=10`
        )
        const result = await res.json()
        this.transactions = result.data
      } catch (error) {
        console.error('Failed fetching transactions:', error)
      }
    },

    async exportExcel() {
      try {
        this.exporting = true

        const response = await fetch(
          `${API_BASE_URL}/api/export/excel`
        )

        if (!response.ok) throw new Error('Export failed')

        // 🔥 Ambil nama file dari backend
        const contentDisposition = response.headers.get('Content-Disposition')
        let fileName = 'Laporan_Zakat.xlsx'

        if (contentDisposition && contentDisposition.includes('filename=')) {
          fileName = contentDisposition
            .split('filename=')[1]
            .replace(/"/g, '')
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

    getDetail(trx, subCategory) {
      if (!trx.details) return 0
      const item = trx.details.find(
        (d) => d.sub_category === subCategory
      )
      return item ? parseFloat(item.quantity) : 0
    },

    calculateTotalRice(trx) {
      return this.getDetail(trx, 'RICE')
    },

    calculateTotalMoney(trx) {
      const cash = this.getDetail(trx, 'CASH')
      const mal = this.getDetail(trx, 'MAL')
      const infaq = this.getDetail(trx, 'INFAQ/SHADAQAH')
      const fidyah = this.getDetail(trx, 'FIDYAH')
      return cash + mal + infaq + fidyah
    },

    formatCurrency(value) {
      if (!value) return ''
      return new Intl.NumberFormat('id-ID').format(value)
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

.custom-table td {
  font-size: 13px;
}
</style>