<template>
  <div class="container my-4">
    <div class="card shadow-lg border-0 rounded-4 overflow-hidden h-100">
      <!-- HEADER -->
      <div class="card-header gradient-header py-3 text-white text-center">
        <h4 class="mb-0 fw-bold">📊 Rekapitulasi Penerimaan Zakat</h4>
      </div>

      <div class="card-body">
        <!-- SUMMARY -->
        <div class="row">
          <div class="col-12 mb-4">
            <div class="chart-card">
              <h6 class="section-title">Rekapitulasi Penerimaan</h6>
              <div class="row text-center">
                <div class="col-md-2 my-2">
                  <div class="summary-muzaki text-white">
                    <div class="title fst-italic">Muzaki</div>
                    <div class="value">{{ summary.muzaki }}</div>
                  </div>
                </div>
                <div class="col-md-2 my-2">
                  <div class="summary-card text-white">
                    <div class="title fst-italic">Jumlah Jiwa</div>
                    <div class="value">{{ summary.jiwa }}</div>
                  </div>
                </div>

                <div class="col-md-4 my-2">
                  <div class="summary-card text-white">
                    <div class="title fst-italic">Fitrah Beras</div>
                    <div class="value">{{ summary.rice }} Kg</div>
                  </div>
                </div>

                <div class="col-md-4 my-2">
                  <div class="summary-card text-white">
                    <div class="title fst-italic">Fitrah Cash</div>
                    <div class="value">Rp {{ formatRupiah(summary.cash) }}</div>
                  </div>
                </div>

                <div class="col-md-4 my-2">
                  <div class="summary-card text-white">
                    <div class="title fst-italic">Zakat Mal</div>
                    <div class="value">Rp {{ formatRupiah(summary.mal) }}</div>
                  </div>
                </div>

                <div class="col-md-4 my-2">
                  <div class="summary-card text-white">
                    <div class="title fst-italic">Infaq</div>
                    <div class="value">Rp {{ formatRupiah(summary.infaq) }}</div>
                  </div>
                </div>

                <div class="col-md-4 my-2">
                  <div class="summary-card text-white">
                    <div class="title fst-italic">Fidyah</div>
                    <div class="value">
                      Rp {{ formatRupiah(summary.fidyah) }} (
                      {{ summary.fidyah / settings.fidyah_price }} Paket )
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CHART -->
        <div class="row">
          <div class="col-lg-6 mb-4">
            <div class="chart-card">
              <h6 class="section-title">Trend Penerimaan Beras</h6>
              <canvas ref="riceChart"></canvas>
            </div>
          </div>

          <div class="col-lg-6 mb-4">
            <div class="chart-card">
              <h6 class="section-title">Trend Penerimaan Uang</h6>
              <canvas ref="moneyChart"></canvas>
            </div>
          </div>
        </div>

        <!-- SETTINGS -->
        <div class="row">
          <div class="col-12">
            <div class="chart-card">
              <h6 class="section-title">Pengaturan Zakat</h6>

              <div class="row text-center">
                <div class="col-md-4 my-2 my-md-0">
                  <div class="summary-card text-white">
                    <div class="title">Fidyah / Paket</div>
                    <div class="value">Rp {{ formatRupiah(settings.fidyah_price) }}</div>
                  </div>
                </div>

                <div class="col-md-4 my-2 my-md-0">
                  <div class="summary-card text-white">
                    <div class="title">Fitrah Beras / Orang</div>
                    <div class="value">{{ settings.zakat_fitrah_rice_per_person }} Kg</div>
                  </div>
                </div>

                <div class="col-md-4 my-2 my-md-0">
                  <div class="summary-card text-white">
                    <div class="title">Fitrah Cash / Orang</div>
                    <div class="value">
                      Rp {{ formatRupiah(settings.zakat_fitrah_cash_per_person) }}
                    </div>
                  </div>
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
import Chart from 'chart.js/auto'

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL
const token = localStorage.getItem('token')

export default {
  data() {
    return {
      transactions: [],
      summary: {
        muzaki: 0,
        jiwa:0,
        rice: 0,
        cash: 0,
        mal: 0,
        infaq: 0,
        fidyah: 0,
      },
      settings: {
        fidyah_price: 0,
        zakat_fitrah_rice_per_person: 0,
        zakat_fitrah_cash_per_person: 0,
      },
    }
  },

  async mounted() {
    await this.fetchSettings()
    await this.fetchData()
  },

  methods: {
    async fetchSettings() {
      const res = await fetch(`${API_BASE_URL}/api/settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await res.json()

      if (!result.success) return

      const map = {}

      result.data.forEach((s) => {
        map[s.key] = s.value
      })

      this.settings = {
        fidyah_price: Number(map.fidyah_price) || 0,
        zakat_fitrah_rice_per_person: Number(map.zakat_fitrah_rice_per_person) || 0,
        zakat_fitrah_cash_per_person: Number(map.zakat_fitrah_cash_per_person) || 0,
      }
    },

    async fetchData() {
      const res = await fetch(`${API_BASE_URL}/api/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      this.transactions = data || []

      this.prepareCharts()
    },

    formatRupiah(value) {
      return new Intl.NumberFormat('id-ID').format(value)
    },

    prepareCharts() {
      if (!this.transactions.length) return

      const grouped = {}

      this.summary.muzaki = this.transactions.length
      this.summary.jiwa = 0

      this.transactions.forEach((trx) => {
        if (!trx.details || !trx.date) return

        const date = trx.date.split('T')[0]

        if (!grouped[date]) {
          grouped[date] = {
            rice: 0,
            cash: 0,
            mal: 0,
            infaq: 0,
            fidyah: 0,
          }
        }

        this.summary.jiwa += parseInt(trx.number_of_people) || 0

        trx.details.forEach((d) => {
          switch (d.sub_category) {
            case 'RICE': {
              const rice = parseFloat(d.quantity) || 0
              grouped[date].rice += rice
              this.summary.rice += rice
              break
            }

            case 'CASH': {
              const cash = parseFloat(d.total) || 0
              grouped[date].cash += cash
              this.summary.cash += cash
              break
            }

            case 'MAL': {
              const mal = parseFloat(d.total) || 0
              grouped[date].mal += mal
              this.summary.mal += mal
              break
            }

            case 'INFAQ/SHADAQAH': {
              const infaq = parseFloat(d.total) || 0
              grouped[date].infaq += infaq
              this.summary.infaq += infaq
              break
            }

            case 'FIDYAH': {
              const fidyah = parseFloat(d.total) || 0
              grouped[date].fidyah += fidyah
              this.summary.fidyah += fidyah
              break
            }
          }
        })
      })

      const rawDates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b))

      const labels = rawDates.map((d) => {
        const x = new Date(d)
        return `${String(x.getDate()).padStart(2, '0')}/${String(x.getMonth() + 1).padStart(2, '0')}`
      })

      const riceData = rawDates.map((d) => grouped[d].rice)
      const cashData = rawDates.map((d) => grouped[d].cash)
      const malData = rawDates.map((d) => grouped[d].mal)
      const infaqData = rawDates.map((d) => grouped[d].infaq)
      const fidyahData = rawDates.map((d) => grouped[d].fidyah)

      this.renderRiceChart(labels, riceData)
      this.renderMoneyChart(labels, cashData, malData, infaqData, fidyahData)
    },

    renderRiceChart(labels, data) {
      new Chart(this.$refs.riceChart, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Beras (Kg)',
              data,
              borderColor: '#2a5298',
              tension: 0.4,
            },
          ],
        },
      })
    },

    renderMoneyChart(labels, cash, mal, infaq, fidyah) {
      new Chart(this.$refs.moneyChart, {
        type: 'line',
        data: {
          labels,
          datasets: [
            { label: 'Fitrah Cash', data: cash, borderColor: '#198754', tension: 0.4 },
            { label: 'Zakat Mal', data: mal, borderColor: '#6f42c1', tension: 0.4 },
            { label: 'Infaq', data: infaq, borderColor: '#fd7e14', tension: 0.4 },
            { label: 'Fidyah', data: fidyah, borderColor: '#dc3545', tension: 0.4 },
          ],
        },
        options: {
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (ctx) => `Rp ${this.formatRupiah(ctx.raw)}`,
              },
            },
          },
        },
      })
    },
  },
}
</script>

<style scoped>
.gradient-header {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
}

.section-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 15px;
  color: #2a5298;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 6px;
}

.chart-card {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.summary-card {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  border-radius: 12px;
  padding: 15px;
  border: 1px solid #e9ecef;
  text-align: center;
}

.summary-muzaki {
  background: black;
  border-radius: 12px;
  padding: 15px;
  border: 1px solid #e9ecef;
  text-align: center;
}

.summary-muzaki .title {
  font-size: 13px;
  color: #d1d3d5;
}

.summary-card .title {
  font-size: 13px;
  color: #d1d3d5;
}

.summary-card .value {
  font-size: 15px;
  font-weight: bold;
  /* color: #2a5298; */
}

.summary-muzaki .value {
  font-size: 15px;
  font-weight: bold;
  /* color: #2a5298; */
}

canvas {
  max-height: 260px;
}
</style>
