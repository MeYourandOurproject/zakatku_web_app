<template>
  <div class="container my-4">
    <div class="card shadow-lg border-0 rounded-4 overflow-hidden h-100">
      
      <!-- HEADER -->
      <div class="card-header gradient-header py-3 text-white text-center">
        <h4 class="mb-0 fw-bold">📊 Rekapitulasi Penerimaan Zakat</h4>
      </div>

      <div class="card-body p-4">

        <div class="row">

          <!-- 1. Fitrah Beras -->
          <div class="col-lg-6 mb-4">
            <div class="chart-card">
              <h6 class="section-title">Zakat Fitrah Beras</h6>
              <canvas ref="riceChart"></canvas>
            </div>
          </div>

          <!-- 2. Fitrah Uang -->
          <div class="col-lg-6 mb-4">
            <div class="chart-card">
              <h6 class="section-title">Zakat Fitrah Uang</h6>
              <canvas ref="cashChart"></canvas>
            </div>
          </div>

          <!-- 3. Selain Fitrah -->
          <div class="col-lg-6 mb-4">
            <div class="chart-card">
              <h6 class="section-title">
                Selain Zakat Fitrah (Mal, Infaq, Fidyah)
              </h6>
              <canvas ref="otherChart"></canvas>
            </div>
          </div>

          <!-- 4. Donut -->
          <div class="col-lg-6 mb-4">
            <div class="chart-card text-center">
              <h6 class="section-title">Komposisi Total Zakat</h6>
              <canvas ref="donutChart"></canvas>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto"

export default {
  data() {
    return {
      transactions: []
    }
  },

  async mounted() {
    await this.fetchData()
  },

  methods: {

    async fetchData() {
      const res = await fetch("http://localhost:3001/api/transactions")
      const data = await res.json()
      this.transactions = data || []
      this.prepareCharts()
    },

    formatRupiah(value) {
      return new Intl.NumberFormat("id-ID").format(value)
    },

    prepareCharts() {

      if (!this.transactions.length) return

      const grouped = {}
      let totalRice=0,totalCash=0,totalMal=0,totalInfaq=0,totalFidyah=0

      this.transactions.forEach(trx => {
        if (!trx.details || !trx.date) return

        const date = trx.date.split("T")[0]

        if (!grouped[date]) {
          grouped[date] = { rice:0,cash:0,mal:0,infaq:0,fidyah:0 }
        }

        trx.details.forEach(d => {
          const qty = parseFloat(d.quantity)||0

          switch (d.sub_category) {
            case "RICE": grouped[date].rice+=qty; totalRice+=qty; break
            case "CASH": grouped[date].cash+=qty; totalCash+=qty; break
            case "MAL": grouped[date].mal+=qty; totalMal+=qty; break
            case "INFAQ/SHADAQAH": grouped[date].infaq+=qty; totalInfaq+=qty; break
            case "FIDYAH": grouped[date].fidyah+=qty; totalFidyah+=qty; break
          }
        })
      })

      const rawDates = Object.keys(grouped).sort(
        (a,b)=>new Date(a)-new Date(b)
      )

      const labels = rawDates.map(d=>{
        const x=new Date(d)
        return `${String(x.getDate()).padStart(2,"0")}/${String(x.getMonth()+1).padStart(2,"0")}`
      })

      const riceData=rawDates.map(d=>grouped[d].rice)
      const cashData=rawDates.map(d=>grouped[d].cash)
      const malData=rawDates.map(d=>grouped[d].mal)
      const infaqData=rawDates.map(d=>grouped[d].infaq)
      const fidyahData=rawDates.map(d=>grouped[d].fidyah)

      this.renderSingle(this.$refs.riceChart,labels,riceData,"#2a5298","Kg")
      this.renderSingle(this.$refs.cashChart,labels,cashData,"#198754","Rp")
      this.renderMulti(this.$refs.otherChart,labels,malData,infaqData,fidyahData)
      this.renderDonut(totalRice,totalCash,totalMal,totalInfaq,totalFidyah)
    },

    renderSingle(canvas,labels,data,color,type){
      new Chart(canvas,{
        type:"line",
        data:{
          labels,
          datasets:[{
            data,
            borderColor:color,
            backgroundColor:color,
            tension:0.4,
            fill:false
          }]
        },
        options:{
          plugins:{
            legend:{display:false},
            tooltip:{
              callbacks:{
                label:ctx=>
                  type==="Rp"
                    ?`Rp ${this.formatRupiah(ctx.raw)}`
                    :`${ctx.raw} Kg`
              }
            }
          }
        }
      })
    },

    renderMulti(canvas,labels,mal,infaq,fidyah){
      new Chart(canvas,{
        type:"line",
        data:{
          labels,
          datasets:[
            {label:"Zakat Mal",data:mal,borderColor:"#6f42c1",tension:0.4},
            {label:"Infaq",data:infaq,borderColor:"#fd7e14",tension:0.4},
            {label:"Fidyah",data:fidyah,borderColor:"#dc3545",tension:0.4}
          ]
        },
        options:{
          plugins:{
            legend:{position:"bottom"},
            tooltip:{
              callbacks:{
                label:ctx=>`Rp ${this.formatRupiah(ctx.raw)}`
              }
            }
          }
        }
      })
    },

    renderDonut(rice,cash,mal,infaq,fidyah){
      new Chart(this.$refs.donutChart,{
        type:"doughnut",
        data:{
          labels:["Fitrah Beras","Fitrah Uang","Mal","Infaq","Fidyah"],
          datasets:[{
            data:[rice,cash,mal,infaq,fidyah],
            backgroundColor:["#2a5298","#198754","#6f42c1","#fd7e14","#dc3545"]
          }]
        },
        options:{
          plugins:{
            legend:{position:"bottom"},
            tooltip:{
              callbacks:{
                label:ctx=>`Rp ${this.formatRupiah(ctx.raw)}`
              }
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>

/* SAME AS TRANSACTION FORM */
.gradient-header {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
}

/* Section title */
.section-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 15px;
  color: #2a5298;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 6px;
}

/* Chart card */
.chart-card {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  transition: 0.2s ease;
}

.chart-card:hover {
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  transform: translateY(-3px);
}

canvas {
  max-height: 260px;
}

</style>