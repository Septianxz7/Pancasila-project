    /* ============ NAVIGATION ============ */
    const pages = ['home', 'fenomena', 'nilai', 'interaktif', 'refleksi'];
    function go(id) {
    if (!pages.includes(id)) id = 'home';
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + id).classList.add('active');
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.toggle('active', a.dataset.go === id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('navLinks').classList.remove('open');
    setTimeout(initReveal, 80);
    history.replaceState(null, '', '#' + id);
    }
    document.addEventListener('click', e => {
    const t = e.target.closest('[data-go]');
    if (t) { e.preventDefault(); go(t.dataset.go); }
    });
    const burger = document.getElementById('burger');
    burger.addEventListener('click', () => document.getElementById('navLinks').classList.toggle('open'));

    /* ============ SCROLL REVEAL ============ */
    let io;
    function initReveal() {
    const els = document.querySelectorAll('.page.active .reveal:not(.in)');
    if (!io) {
        io = new IntersectionObserver(es => {
        es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
        }, { threshold: .12 });
    }
    els.forEach(el => io.observe(el));
    }

    /* ============ HERO COUNTERS ============ */
    function countUp(el, target, suffix) {
    let cur = 0; const step = target / 60;
    const t = setInterval(() => {
        cur += step; if (cur >= target) { cur = target; clearInterval(t); }
        el.textContent = (target >= 1000 ? Math.floor(cur).toLocaleString('id-ID') : Math.floor(cur)) + (suffix || '');
    }, 22);
    }
    let counted = false;
    function tryCount() {
    if (counted) return; counted = true;
    countUp(document.getElementById('stat1'), 132, ' jt+');
    countUp(document.getElementById('stat2'), 2);
    countUp(document.getElementById('stat3'), 1);
    }
    window.addEventListener('load', () => { initReveal(); setTimeout(tryCount, 400); });

    /* ============ LOGIN (local) ============ */
    const modalBg = document.getElementById('modalBg');
    const loginBtn = document.getElementById('loginBtn');
    const userChip = document.getElementById('userChip');
    function openModal() { modalBg.classList.add('show'); }
    function closeModal() { modalBg.classList.remove('show'); }
    loginBtn.addEventListener('click', () => {
    if (localStorage.getItem('rk_user')) { logout(); } else { openModal(); }
    });
    document.getElementById('modalClose').addEventListener('click', closeModal);
    modalBg.addEventListener('click', e => { if (e.target === modalBg) closeModal(); });
    document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('liName').value.trim();
    localStorage.setItem('rk_user', name);
    closeModal(); setUser(name);
    toast('Halo, ' + name + ' 👋 Selamat datang di Ruang Kemanusiaan!');
    });
    function setUser(name) {
    userChip.style.display = 'inline-flex';
    document.getElementById('userName').textContent = name;
    document.getElementById('userAv').textContent = name.charAt(0).toUpperCase();
    loginBtn.textContent = 'Keluar';
    }
    function logout() {
    localStorage.removeItem('rk_user');
    userChip.style.display = 'none';
    loginBtn.textContent = 'Masuk';
    toast('Kamu telah keluar. Sampai jumpa lagi 🌱');
    }
    const savedUser = localStorage.getItem('rk_user');
    if (savedUser) setUser(savedUser);

    /* ============ TOAST ============ */
    let toastT;
    function toast(msg) {
    const el = document.getElementById('toast');
    document.getElementById('toastTxt').textContent = msg;
    el.classList.add('show'); clearTimeout(toastT);
    toastT = setTimeout(() => el.classList.remove('show'), 3200);
    }

    /* ============ TABS ============ */
    document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
        setTimeout(initReveal, 60);
    });
    });

    /* ============ CERMIN EMPATI — simple AI ============ */
    const toxicWords = ['bodoh', 'goblok', 'tolol', 'bego', 'jelek', 'sampah', 'mati', 'bunuh', 'benci', 'anjing', 'bangsat', 'najis', 'gendut', 'miskin', 'kampungan', 'gak penting', 'tidak penting', 'pantes', 'dasar', 'memuakkan', 'sok', 'idiot', 'dungu', 'lemah', 'cupu', 'sial', 'hina', 'buruk rupa', 'pecundang', 'bacot', 'sok suci'];
    const kindWords = ['semangat', 'hebat', 'terima kasih', 'kuat', 'sayang', 'peduli', 'bangga', 'dukung', 'maaf', 'tolong', 'berharga', 'keren', 'salut', 'sabar', 'tenang', 'kamu bisa', 'jangan menyerah', 'sehat', 'bahagia', 'baik', 'hormat', 'empati', 'damai', 'syukur'];
    const rewrites = [
    ['gak penting', 'Setiap orang punya nilai dan cerita masing-masing.'],
    ['tidak penting', 'Setiap orang punya nilai dan cerita masing-masing.'],
    ['bodoh', 'Mungkin kita bisa belajar bareng soal ini.'],
    ['goblok', 'Mungkin kita bisa belajar bareng soal ini.'],
    ['tolol', 'Mungkin kita bisa belajar bareng soal ini.'],
    ['jelek', 'Setiap orang punya keunikannya sendiri.'],
    ['pantes', 'Yuk dengar dulu sisi ceritanya sebelum menilai.'],
    ['dasar', 'Yuk sampaikan dengan cara yang lebih menghargai.']
    ];
    const samples = [
    "Gak penting banget hidup lo, jelek!",
    "Tetap semangat ya, kamu pasti bisa melewati ini 🌱",
    "Dasar bodoh, pantes aja dijauhin orang",
    "Terima kasih sudah berani cerita, kamu nggak sendirian",
    "Sok suci banget sih, najis liatnya",
    "Aku salut sama keberanianmu, jangan menyerah ya"
    ];
    function analyze(text) {
    const t = ' ' + text.toLowerCase() + ' ';
    let bad = 0, good = 0; const foundBad = [], foundGood = [];
    toxicWords.forEach(w => { if (t.includes(w)) { bad++; foundBad.push(w); } });
    kindWords.forEach(w => { if (t.includes(w)) { good++; foundGood.push(w); } });
      if (/[A-Z]{4,}/.test(text)) bad++; // teriak kapital
      let score = 50 + good * 16 - bad * 20;
    score = Math.max(2, Math.min(100, score));
    return { score: Math.round(score), bad, good, foundBad, foundGood };
    }
    const empBtn = document.getElementById('empBtn');
    function runEmpathy() {
    const text = document.getElementById('empInput').value.trim();
    if (!text) { toast('Tuliskan dulu komentarmu ya 🙂'); return; }
    const r = analyze(text);
    const res = document.getElementById('empResult'); res.classList.add('show');
    const meter = document.getElementById('empMeter');
    meter.style.width = '0%';
    setTimeout(() => { meter.style.width = r.score + '%'; }, 60);
    let color, face, verdict, reaction;
    if (r.score >= 70) { color = 'var(--sage)'; face = '🥰'; verdict = 'Komentar yang Menguatkan'; reaction = 'Pembaca merasa dihargai, didukung, dan lebih percaya diri.'; }
    else if (r.score >= 45) { color = 'var(--accent)'; face = '😐'; verdict = 'Netral — bisa lebih hangat'; reaction = 'Tidak menyakiti, tapi belum benar-benar menumbuhkan empati.'; }
    else { color = 'var(--rose)'; face = '😢'; verdict = 'Komentar yang Melukai'; reaction = 'Pembaca bisa merasa direndahkan, sedih, dan kehilangan rasa aman.'; }
    meter.style.background = color;
    document.getElementById('empScoreTxt').textContent = r.score;
    document.getElementById('empFace').textContent = face;
    document.getElementById('empVerdict').textContent = verdict;
    document.getElementById('empReaction').textContent = reaction;
      // tags
    const tagBox = document.getElementById('empTags'); tagBox.innerHTML = '';
    r.foundBad.slice(0, 4).forEach(w => tagBox.innerHTML += `<span class="tag-pill" style="background:var(--rose-soft);color:#9c3f38">⚠ ${w}</span>`);
    r.foundGood.slice(0, 4).forEach(w => tagBox.innerHTML += `<span class="tag-pill" style="background:var(--sage-soft);color:#33614a">✓ ${w}</span>`);
    if (!r.foundBad.length && !r.foundGood.length) tagBox.innerHTML = `<span class="tag-pill" style="background:var(--primary-soft);color:var(--primary-dark)">nada netral</span>`;
      // rewrite
    const rw = document.getElementById('empRewrite');
    if (r.score < 45) {
        let suggestion = null; const low = text.toLowerCase();
        for (const [k, v] of rewrites) { if (low.includes(k)) { suggestion = v; break; } }
        if (!suggestion) suggestion = 'Coba ungkapkan perasaanmu tanpa merendahkan: "Aku kurang setuju, tapi aku menghargaimu sebagai manusia."';
        document.getElementById('empRewriteTxt').textContent = ' ' + suggestion;
        rw.classList.add('show');
    } else rw.classList.remove('show');
    }
    empBtn.addEventListener('click', runEmpathy);
    document.getElementById('empTry').addEventListener('click', () => {
      document.getElementById('empInput').value = samples[Math.floor(Math.random() * samples.length)];
    runEmpathy();
    });

    /* ============ TIMBANGAN: HUKUM vs MORAL ============ */
    const scaleData = [
    { t: 'Seseorang menyebarkan berita bohong yang menimbulkan kepanikan dan kerugian publik.', legal: 'Benar — penyebaran hoaks yang merugikan dapat dijerat hukum. Namun di baliknya, ada nilai kejujuran & kemanusiaan yang juga dilanggar.', moral: 'Secara moral memang salah. Perlu diingat, hoaks yang merugikan juga bisa berkonsekuensi hukum, sekaligus mencederai kepercayaan sosial.' },
    { t: 'Sekelompok orang ramai-ramai mengejek fisik seseorang di kolom komentar, tanpa ancaman langsung.', moral: 'Tepat — sering kali tidak ada sanksi hukum, tetapi ini jelas melukai martabat manusia dan bertentangan dengan sila ke-2.', legal: 'Bisa saja menyentuh hukum bila mengandung ancaman/penghinaan berat, tetapi yang utama: ini pelanggaran moral yang nyata melukai sesama.' },
    { t: 'Seorang pejabat menyalahgunakan wewenang dan menggelapkan dana publik.', legal: 'Benar — korupsi adalah pelanggaran hukum berat. Lebih dari itu, ia mengkhianati keadilan bagi sesama, inti dari sila ke-2.', moral: 'Memang sangat tidak bermoral. Korupsi juga merupakan kejahatan hukum yang merampas hak banyak orang.' },
    { t: 'Seseorang membiarkan temannya dirundung di grup, memilih diam agar tidak ikut jadi sasaran.', moral: 'Tepat — diam terhadap ketidakadilan bukan pelanggaran hukum, namun bertentangan dengan keberanian membela kebenaran.', legal: 'Umumnya tak ada sanksi hukum untuk "diam". Justru di sinilah nilai moral diuji: berani membela atau tidak.' },
    { t: 'Seseorang menjadikan video bencana sebagai konten lucu demi mengejar viral.', moral: 'Tepat — sering tak tersentuh hukum, tetapi menghapus empati terhadap korban dan merendahkan penderitaan mereka.', legal: 'Bisa menyerempet aturan bila ada unsur penghinaan, namun pokok masalahnya adalah hilangnya empati — pelanggaran moral.' }
    ];
    let scaleIdx = 0;
    function renderScaleDots() {
    const d = document.getElementById('scaleDots'); d.innerHTML = '';
    scaleData.forEach((_, i) => d.innerHTML += `<i class="${i <= scaleIdx ? 'on' : ''}"></i>`);
    }
    function loadScale() {
    document.getElementById('scaleText').textContent = scaleData[scaleIdx].t;
    document.getElementById('scaleNum').textContent = scaleIdx + 1;
    document.getElementById('scaleTotal').textContent = scaleData.length;
    document.getElementById('scaleFeedback').className = 'scale-feedback';
    document.getElementById('scaleNext').style.display = 'none';
    document.querySelectorAll('#panel-timbangan .scale-btn').forEach(b => b.disabled = false);
    renderScaleDots();
    }
    document.querySelectorAll('#panel-timbangan .scale-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const choice = btn.dataset.choice;
        const fb = document.getElementById('scaleFeedback');
        fb.textContent = scaleData[scaleIdx][choice];
        fb.className = 'scale-feedback show ' + choice;
        document.querySelectorAll('#panel-timbangan .scale-btn').forEach(b => b.disabled = true);
        if (scaleIdx < scaleData.length - 1) document.getElementById('scaleNext').style.display = 'inline-flex';
        else {
        document.getElementById('scaleNext').style.display = 'inline-flex';
        document.getElementById('scaleNext').textContent = 'Ulangi ↻';
        }
    });
    });
    document.getElementById('scaleNext').addEventListener('click', () => {
    scaleIdx = (scaleIdx + 1) % scaleData.length;
    loadScale();
    });
    loadScale();

    /* ============ QUIZ ============ */
    const quiz = [
    {
        q: 'Temanmu salah ucap dan jadi bahan ejekan ribuan orang. Sikap paling beradab adalah...',
        o: ['Ikut berkomentar pedas biar seru', 'Diam dan menonton saja', 'Mengingatkan dengan sopan & menguatkan temanmu', 'Menyebarkan ke grup lain'], a: 2
    },
    {
        q: 'Kamu menerima pesan berisi kabar mengejutkan dari sumber tak jelas. Kamu sebaiknya...',
        o: ['Langsung sebarkan agar orang tahu', 'Saring & verifikasi dulu kebenarannya', 'Tambahkan bumbu biar menarik', 'Abaikan dan tetap percaya'], a: 1
    },
    {
        q: 'Manakah yang paling mencerminkan sila "Kemanusiaan yang Adil dan Beradab"?',
        o: ['Menghargai martabat setiap orang', 'Hanya membela yang sependapat', 'Menilai orang dari penampilannya', 'Menertawakan kekurangan orang'], a: 0
    },
    {
        q: '"Tidak semua perilaku buruk ada sanksi hukumnya." Maksud kalimat ini adalah...',
        o: ['Berarti boleh dilakukan', 'Tetap salah secara moral & berdampak', 'Tidak perlu dipikirkan', 'Hanya berlaku di internet'], a: 1
    },
    {
        q: 'Cara terbaik melawan ujaran kebencian di media sosial adalah...',
        o: ['Membalas dengan kebencian serupa', 'Menyebarkan ulang sambil mengejek', 'Menanggapi dengan empati & klarifikasi sehat', 'Mendiamkan lalu ikut membenci'], a: 2
    }
    ];
    let qIdx = 0, qScore = 0;
    function renderQuiz() {
    const body = document.getElementById('quizBody');
    document.getElementById('quizResult').style.display = 'none';
    body.style.display = 'block';
    const item = quiz[qIdx];
    body.innerHTML = `<div style="font-size:.8rem;color:var(--ink-soft);margin-bottom:8px">Pertanyaan ${qIdx + 1} / ${quiz.length}</div>
    <div class="quiz-q">${item.q}</div>`;
    item.o.forEach((opt, i) => {
        const b = document.createElement('button'); b.className = 'opt'; b.textContent = opt;
        b.addEventListener('click', () => answer(i, b));
        body.appendChild(b);
    });
    }
    function answer(i, btn) {
    const item = quiz[qIdx];
    document.querySelectorAll('#quizBody .opt').forEach((o, idx) => {
        o.disabled = true;
        if (idx === item.a) o.classList.add('correct');
        if (idx === i && i !== item.a) o.classList.add('wrong');
    });
    if (i === item.a) qScore++;
    setTimeout(() => {
        qIdx++;
        if (qIdx < quiz.length) renderQuiz(); else showQuizResult();
    }, 900);
    }
    function showQuizResult() {
    document.getElementById('quizBody').style.display = 'none';
    const res = document.getElementById('quizResult'); res.style.display = 'block';
    document.getElementById('quizScore').textContent = qScore + ' / ' + quiz.length + ' benar';
    let emoji, msg;
    if (qScore === quiz.length) { emoji = '🌟'; msg = 'Luar biasa! Kepekaan kemanusiaanmu sangat kuat. Jadilah teladan di ruang digital.'; }
    else if (qScore >= 3) { emoji = '🌱'; msg = 'Bagus! Kamu sudah memahami nilai kemanusiaan. Terus rawat dan tularkan ke sekitarmu.'; }
    else { emoji = '💭'; msg = 'Tidak apa-apa, ini awal yang baik. Yuk pelajari lagi nilai sila ke-2 dan mulai dari hal kecil.'; }
    document.getElementById('quizEmoji').textContent = emoji;
    document.getElementById('quizMsg').textContent = msg;
    }
    document.getElementById('quizRestart').addEventListener('click', () => { qIdx = 0; qScore = 0; renderQuiz(); });
    renderQuiz();

    /* ============ DINDING JANJI ============ */
    const defaultPledges = [
    { n: 'Sahabat Digital', t: 'Aku akan saring dulu sebelum sharing.' },
    { n: 'Anonim', t: 'Berhenti sejenak sebelum berkomentar buruk.' },
    { n: 'Rara', t: 'Membela teman yang dirundung, bukan mendiamkan.' },
    { n: 'Bagas', t: 'Mengkritik dengan cara yang menghargai.' }
    ];
    function loadPledges() {
    const saved = JSON.parse(localStorage.getItem('rk_pledges') || 'null');
    return saved || defaultPledges;
    }
    function renderPledges() {
    const wall = document.getElementById('pledgeWall'); wall.innerHTML = '';
    loadPledges().slice().reverse().forEach(p => {
        const d = document.createElement('div'); d.className = 'pledge';
        d.innerHTML = `<b>${escapeHtml(p.n)}</b><p>"${escapeHtml(p.t)}"</p>`;
        wall.appendChild(d);
    });
    }
    function escapeHtml(s) { return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
    document.getElementById('pledgeBtn').addEventListener('click', () => {
    let n = document.getElementById('pledgeName').value.trim() || localStorage.getItem('rk_user') || 'Anonim';
    const t = document.getElementById('pledgeText').value.trim();
    if (!t) { toast('Tuliskan dulu janjimu ya 🤝'); return; }
    const list = loadPledges(); list.push({ n: n.slice(0, 24), t: t.slice(0, 80) });
    localStorage.setItem('rk_pledges', JSON.stringify(list));
    document.getElementById('pledgeName').value = '';
    document.getElementById('pledgeText').value = '';
    renderPledges();
    toast('Janjimu telah ditempel di dinding 🌱 Terima kasih!');
    });
    renderPledges();

    /* ============ INIT ============ */
    document.getElementById('year').textContent = new Date().getFullYear();
    const hash = location.hash.replace('#', '');
    if (hash && pages.includes(hash)) go(hash);
