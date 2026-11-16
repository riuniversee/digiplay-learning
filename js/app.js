// Cek Sesi Login
const sessionRaw = localStorage.getItem('userSession');
if (!sessionRaw) {
    window.location.href = 'index.html';
}
const currentUser = JSON.parse(sessionRaw);

// State Aplikasi (Tersimpan di LocalStorage)
let userState = JSON.parse(localStorage.getItem(`progress_${currentUser.nim}`)) || {
    completedModules: [],
    bestScore: null,
    xp: 0
};

let modulList = JSON.parse(localStorage.getItem('customModules')) || defaultModul;
let diskusiList = JSON.parse(localStorage.getItem('forumDiskusi')) || [
    { nama: '(Guru)', pesan: 'Selamat datang di DigiPlay Learning! Silakan pelajari modul animasi 3D dan selesaikan evaluasi untuk meraih sertifikat.' }
];

// Inisialisasi Tampilan Awal
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('user-name').textContent = currentUser.nama;
    document.getElementById('user-role').textContent = `${currentUser.role} • ${currentUser.nim}`;
    document.getElementById('user-avatar').textContent = currentUser.nama.charAt(0).toUpperCase();

    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-btn').textContent = '☀️';
    }

    updateStatsUI();
});

function saveState() {
    localStorage.setItem(`progress_${currentUser.nim}`, JSON.stringify(userState));
    updateStatsUI();
}

function updateStatsUI() {
    const totalModul = modulList.length;
    const doneCount = userState.completedModules.length;
    const percent = totalModul > 0 ? Math.min(100, Math.round((doneCount / totalModul) * 100)) : 0;

    document.getElementById('stat-progress').textContent = `${percent}%`;
    document.getElementById('stat-modul-count').textContent = `${doneCount}/${totalModul} Modul`;
    document.getElementById('progress-bar-fill').style.width = `${percent}%`;
    document.getElementById('stat-xp').textContent = `${userState.xp} XP`;

    if (userState.bestScore !== null) {
        document.getElementById('stat-score').textContent = `${userState.bestScore} / 100`;
    }

    if (userState.bestScore !== null && userState.bestScore >= 80) {
        document.getElementById('stat-cert-status').textContent = 'Lulus (Tersedia)';
        document.getElementById('btn-view-cert').classList.remove('hidden');
    }
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    document.getElementById('theme-btn').textContent = isDark ? '☀️' : '🌙';
}

function logout() {
    localStorage.removeItem('userSession');
    window.location.href = 'index.html';
}

// Navigasi Halaman
const viewHome = document.getElementById('view-home');
const viewFeature = document.getElementById('view-feature');
const featureContainer = document.getElementById('feature-container');
let quizTimerInterval = null;

function goHome() {
    clearInterval(quizTimerInterval);
    viewFeature.classList.add('hidden');
    viewHome.classList.remove('hidden');
    updateStatsUI();
}

function openFeature(type) {
    clearInterval(quizTimerInterval);
    viewHome.classList.add('hidden');
    viewFeature.classList.remove('hidden');

    if (type === 'sumber-belajar') renderSumberBelajar();
    if (type === 'game-interaktif') renderGameInteraktif();
    if (type === 'kelas-digital') renderKelasDigital();
    if (type === 'bank-soal') renderBankSoalIntro();
}

/* ==================================================
   1. SUMBER BELAJAR DIGITAL (+ Form Tambah untuk Guru/Pengembang)
   ================================================== */
function renderSumberBelajar() {
    const canManage = currentUser.role === 'Guru' || currentUser.role === 'Pengembang';
    const adminForm = canManage ? `
        <div class="box-item" style="margin-top: 24px; border-color: var(--accent);">
            <h3>➕ Tambah Materi Animasi 3D (Mode ${currentUser.role})</h3>
            <form onsubmit="tambahModulBaru(event)" style="display: grid; gap: 10px; margin-top: 12px;">
                <input type="text" id="new-mod-title" class="chat-input" placeholder="Judul Modul Pembelajaran 3D" required>
                <input type="text" id="new-mod-summary" class="chat-input" placeholder="Ringkasan singkat materi" required>
                <textarea id="new-mod-content" class="chat-input" rows="3" placeholder="Isi lengkap materi pembelajaran animasi 3D..." required></textarea>
                <button type="submit" class="btn-primary" style="width: fit-content;">Simpan Materi</button>
            </form>
        </div>
    ` : '';

    featureContainer.innerHTML = `
        <h1 class="title">Sumber Belajar Digital (Animasi 3D)</h1>
        <p class="subtitle">Baca seluruh modul pembelajaran untuk meningkatkan pemahaman, progres, dan mendapatkan XP.</p>
        
        <div class="panel-grid">
            ${modulList.map(m => {
                const isDone = userState.completedModules.includes(m.id);
                return `
                <div class="box-item">
                    ${isDone ? '<span class="badge-done">✓ Selesai Dibaca</span>' : ''}
                    <h3>${m.judul}</h3>
                    <p>${m.ringkasan}</p>
                    <button class="btn-primary" onclick="bukaIsiModul('${m.id}')">
                        ${isDone ? 'Baca Ulang Materi' : 'Mulai Belajar (+50 XP)'}
                    </button>
                </div>`;
            }).join('')}
        </div>

        <div id="modul-reader" class="box-item hidden" style="margin-top: 24px; background: var(--accent-soft);">
            <h3 id="reader-title"></h3>
            <p id="reader-content" style="color: var(--text-body); margin-top: 10px;"></p>
        </div>

        ${adminForm}
    `;
}

function bukaIsiModul(id) {
    const modul = modulList.find(m => m.id === id);
    if (!modul) return;

    document.getElementById('modul-reader').classList.remove('hidden');
    document.getElementById('reader-title').textContent = modul.judul;
    document.getElementById('reader-content').textContent = modul.konten;

    if (!userState.completedModules.includes(id)) {
        userState.completedModules.push(id);
        userState.xp += 50;
        saveState();
        showToast('🎉 Selamat! Modul selesai dibaca (+50 XP)');
        renderSumberBelajar();
        document.getElementById('modul-reader').classList.remove('hidden');
        document.getElementById('reader-title').textContent = modul.judul;
        document.getElementById('reader-content').textContent = modul.konten;
    }
}

function tambahModulBaru(e) {
    e.preventDefault();
    const judul = document.getElementById('new-mod-title').value.trim();
    const ringkasan = document.getElementById('new-mod-summary').value.trim();
    const konten = document.getElementById('new-mod-content').value.trim();

    modulList.push({
        id: 'mod-' + Date.now(),
        kategori: 'Modul Tambahan',
        judul,
        ringkasan,
        konten
    });
    localStorage.setItem('customModules', JSON.stringify(modulList));
    showToast('✅ Materi animasi 3D baru berhasil ditambahkan!');
    renderSumberBelajar();
}

/* ==================================================
   2. GAME INTERAKTIF (Memory Match + XP Reward)
   ================================================== */
let flipped = [];
let matched = 0;
let steps = 0;

function renderGameInteraktif() {
    const icons = ['🧊', '🎨', '🦖', '⭐', '🧊', '🎨', '🦖', '⭐'].sort(() => Math.random() - 0.5);
    flipped = [];
    matched = 0;
    steps = 0;

    featureContainer.innerHTML = `
        <h1 class="title">Game Interaktif: Asah Memori 3D</h1>
        <p class="subtitle">Cocokkan seluruh pasangan ikon animasi 3D untuk mendapatkan +100 XP! Langkah: <strong id="step-counter">0</strong></p>
        <div class="game-board">
            ${icons.map(ic => `<div class="memory-card" data-icon="${ic}" onclick="handleCardFlip(this)">?</div>`).join('')}
        </div>
        <div style="text-align: center; margin-top: 24px;">
            <button class="btn-primary" onclick="renderGameInteraktif()">Mulai Ulang Permainan</button>
        </div>
    `;
}

function handleCardFlip(card) {
    if (card.classList.contains('open') || flipped.length === 2) return;
    card.classList.add('open');
    card.textContent = card.dataset.icon;
    flipped.push(card);

    if (flipped.length === 2) {
        steps++;
        document.getElementById('step-counter').textContent = steps;
        const [c1, c2] = flipped;
        if (c1.dataset.icon === c2.dataset.icon) {
            matched += 2;
            flipped = [];
            if (matched === 8) {
                userState.xp += 100;
                saveState();
                showToast(`🏆 Hebat! Game selesai dalam ${steps} langkah (+100 XP)`);
            }
        } else {
            setTimeout(() => {
                c1.classList.remove('open'); c1.textContent = '?';
                c2.classList.remove('open'); c2.textContent = '?';
                flipped = [];
            }, 600);
        }
    }
}

/* ==================================================
   3. KELAS DIGITAL (Forum Diskusi Persisten)
   ================================================== */
function renderKelasDigital() {
    featureContainer.innerHTML = `
        <h1 class="title">Kelas Digital & Diskusi</h1>
        <p class="subtitle">Berdiskusi seputar animasi 3D bersama teman sekelas dan guru.</p>
        <div class="chat-box" id="chat-box">
            ${diskusiList.map(item => `
                <div class="chat-msg">
                    <strong>${item.nama}</strong>
                    <p style="margin-top: 4px; color: var(--text-body);">${item.pesan}</p>
                </div>
            `).join('')}
        </div>
        <form class="chat-form" onsubmit="kirimDiskusi(event)">
            <input type="text" id="input-diskusi" class="chat-input" placeholder="Tulis pertanyaan seputar animasi 3D..." required>
            <button type="submit" class="btn-primary">Kirim Pesan</button>
        </form>
    `;
}

function kirimDiskusi(e) {
    e.preventDefault();
    const input = document.getElementById('input-diskusi');
    const teks = input.value.trim();
    if (!teks) return;

    diskusiList.push({
        nama: `${currentUser.nama} (${currentUser.role})`,
        pesan: teks
    });
    localStorage.setItem('forumDiskusi', JSON.stringify(diskusiList));
    userState.xp += 15;
    saveState();
    showToast('💬 Pesan terkirim (+15 XP)');
    renderKelasDigital();
}

/* ==================================================
   4. BANK SOAL (Timer, Pembahasan & Sertifikat)
   ================================================== */
let qIndex = 0;
let qScore = 0;
let userAnswers = [];
let timeLeft = 120; // 2 menit

function renderBankSoalIntro() {
    featureContainer.innerHTML = `
        <h1 class="title">Bank Soal & Evaluasi Animasi 3D</h1>
        <p class="subtitle">Uji pemahaman Anda melalui evaluasi berwaktu untuk memperoleh Sertifikat Kelulusan.</p>
        <div class="box-item" style="margin-top: 24px;">
            <h3>📋 Ketentuan Evaluasi:</h3>
            <p>• Jumlah Soal: <strong>${bankSoalData.length} Soal Pilihan Ganda (Animasi 3D SD)</strong><br>
               • Waktu Pengerjaan: <strong>2 Menit</strong><br>
               • Syarat Lulus Sertifikat: <strong>Minimal Nilai 80</strong></p>
            <button class="btn-primary" onclick="mulaiKuis()">Mulai Evaluasi Sekarang →</button>
        </div>
    `;
}

function mulaiKuis() {
    qIndex = 0;
    qScore = 0;
    userAnswers = [];
    timeLeft = 120;

    quizTimerInterval = setInterval(() => {
        timeLeft--;
        const timerEl = document.getElementById('quiz-timer');
        if (timerEl) {
            const m = Math.floor(timeLeft / 60);
            const s = String(timeLeft % 60).padStart(2, '0');
            timerEl.textContent = `${m}:${s}`;
        }
        if (timeLeft <= 0) {
            clearInterval(quizTimerInterval);
            selesaiKuis();
        }
    }, 1000);

    tampilkanPertanyaan();
}

function tampilkanPertanyaan() {
    if (qIndex >= bankSoalData.length) {
        clearInterval(quizTimerInterval);
        selesaiKuis();
        return;
    }

    const q = bankSoalData[qIndex];
    featureContainer.innerHTML = `
        <h1 class="title">Evaluasi Pembelajaran Animasi 3D</h1>
        <div class="quiz-header">
            <span>Soal ${qIndex + 1} dari ${bankSoalData.length}</span>
            <span>⏱️ Sisa Waktu: <span id="quiz-timer">02:00</span></span>
        </div>
        <div class="box-item" style="margin-top: 20px;">
            <h3>${q.tanya}</h3>
            ${q.opsi.map((opt, idx) => `
                <button class="quiz-option" onclick="pilihJawaban(${idx})">${opt}</button>
            `).join('')}
        </div>
    `;
}

function pilihJawaban(idx) {
    userAnswers.push(idx);
    if (idx === bankSoalData[qIndex].benar) {
        qScore++;
    }
    qIndex++;
    tampilkanPertanyaan();
}

function selesaiKuis() {
    const finalScore = Math.round((qScore / bankSoalData.length) * 100);
    if (userState.bestScore === null || finalScore > userState.bestScore) {
        userState.bestScore = finalScore;
    }
    userState.xp += finalScore;
    saveState();

    const lulus = finalScore >= 80;

    featureContainer.innerHTML = `
        <h1 class="title">Hasil Evaluasi Pembelajaran</h1>
        <p class="subtitle">Berikut adalah rincian nilai dan pembahasan jawaban Anda.</p>

        <div class="box-item" style="text-align: center; margin-top: 20px;">
            <h2 style="font-size: 2.5rem; color: ${lulus ? '#16a34a' : '#dc2626'};">Nilai: ${finalScore}</h2>
            <p>${lulus ? 'Selamat! Anda dinyatakan LULUS dan berhak mencetak Sertifikat Kelulusan.' : 'Nilai Anda belum mencapai batas lulus (80). Silakan pelajari kembali modul dan coba lagi.'}</p>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <button class="btn-primary" onclick="mulaiKuis()">Ulangi Evaluasi</button>
                ${lulus ? `<button class="btn-primary" style="background:#16a34a;" onclick="openCertificate()">🎓 Cetak Sertifikat Kelulusan</button>` : ''}
            </div>
        </div>

        <h3 style="margin-top: 28px; color: var(--text-primary);">Pembahasan Soal:</h3>
        <div class="panel-grid">
            ${bankSoalData.map((soal, i) => {
                const benar = userAnswers[i] === soal.benar;
                return `
                <div class="box-item">
                    <span class="badge-done" style="background:${benar ? '#dcfce7' : '#fee2e2'}; color:${benar ? '#15803d' : '#dc2626'};">
                        ${benar ? '✓ Jawaban Benar' : '✕ Kurang Tepat'}
                    </span>
                    <h3>${soal.tanya}</h3>
                    <p><strong>Kunci:</strong> ${soal.opsi[soal.benar]}<br>${soal.pembahasan}</p>
                </div>`;
            }).join('')}
        </div>
    `;
}

/* ==================================================
   5. GENERATOR SERTIFIKAT KELULUSAN OTOMATIS
   ================================================== */
function openCertificate() {
    viewHome.classList.add('hidden');
    viewFeature.classList.remove('hidden');

    const tanggal = new Date().toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    featureContainer.innerHTML = `
        <div class="no-print" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="color: var(--text-primary);">Pratinjau Sertifikat Kelulusan</h2>
            <button class="btn-primary" onclick="window.print()">🖨️ Cetak / Simpan PDF</button>
        </div>

        <div class="certificate-box">
            <p style="font-weight: 600; color: #64748b; letter-spacing: 1px;">DIGIPLAY LEARNING DIGITAL</p>
            <h1 class="cert-title">Sertifikat Kelulusan</h1>
            <p>Diberikan dengan bangga kepada:</p>
            <div class="cert-name">${currentUser.nama}</div>
            <p style="color: #475569; margin-bottom: 16px;">Nomor Induk / NIS: <strong>${currentUser.nim}</strong></p>
            <p style="max-width: 600px; margin: 0 auto 24px; line-height: 1.6; color: #334155;">
                Telah berhasil menyelesaikan seluruh modul animasi 3D anak SD dan lulus evaluasi akhir dengan nilai <strong>${userState.bestScore} / 100</strong>.
            </p>
            <p style="font-size: 0.9rem; color: #64748b;">Diterbitkan pada ${tanggal}</p>
        </div>
    `;
}