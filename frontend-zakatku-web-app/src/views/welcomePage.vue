<template>
  <div class="container my-5">
    <div class="card shadow-lg border-0 rounded-4 overflow-hidden">

      <!-- HEADER -->
      <div class="card-header gradient-header text-white text-center py-4">
        <h2 class="fw-bold mb-1">🕌 Zakatku Web App</h2>
        <p class="mb-0 opacity-75">Sistem Manajemen & Rekapitulasi Zakat</p>
      </div>

      <!-- BODY -->
      <div class="card-body p-5 text-center">

        <h3 class="fw-bold mb-3">
          Assalamu'alaikum Warahmatullahi Wabarakatuh
        </h3>

        <p class="lead mb-4 text-muted">
          Kelola, catat, dan rekap zakat dengan sistem yang aman,
          rapi, dan transparan.
        </p>

        <!-- AYAT -->
        <div class="ayat-box mb-4">
          <p class="arabic-text mb-2">
            وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ
             
          </p>
          <p class="text-muted fst-italic small">
            “Dan dirikanlah shalat, tunaikanlah zakat, dan rukuklah beserta
            orang-orang yang rukuk.”  
            <br />
            (QS. Al-Baqarah: 110)
          </p>
        </div>

        <!-- HADIS -->
        <div class="hadis-box mb-5">
          <p class="fst-italic text-muted small">
            Rasulullah ﷺ bersabda:  
            “Islam dibangun atas lima perkara… menunaikan zakat…”  
            (HR. Bukhari & Muslim)
          </p>
        </div>

        <!-- BUTTON -->
        <router-link to="/login">
          <button class="btn btn-primary px-5 py-2 custom-btn">
            🚀 Masuk Dashboard
          </button>
        </router-link>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Background subtle */
body {
  background-color: #f4f7fb;
}

/* Gradient Header */
.gradient-header {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
}

/* Arabic text styling */
.arabic-text {
  font-size: 22px;
  font-weight: bold;
  direction: rtl;
}

/* Ayat Box */
.ayat-box {
  background-color: #f1f5ff;
  border-radius: 12px;
  padding: 20px;
}

/* Hadis Box */
.hadis-box {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 15px;
}

/* Button Style */
.custom-btn {
  border-radius: 12px;
  font-weight: 600;
  transition: 0.3s ease;
}

.custom-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}
</style>