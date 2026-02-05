// ======================================================
// SD NEGERI 2 BAWANG - MAIN JAVASCRIPT (FINAL FIX)
// ======================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 0. KONFIGURASI API & GLOBAL
    const API_URL = 'api/'; 
    const UPLOAD_URL = 'uploads/';
    
    // --- JALANKAN FUNGSI PUBLIK ---
    initSlider();           // Slider + Tombol Manual (FIX)
    loadPublicGuruStaff();  // Guru & Staff (FIX "POOL")
    loadHomeData();         // Beranda
    loadPublicNewsList();   // List Berita
    loadNewsDetail();       // <--- FIX BARU: Detail Berita
    loadPublicGallery();    // Galeri

    // ======================================================
    // 1. BAGIAN ADMIN & DASHBOARD (TIDAK SAYA UBAH / AMAN)
    // ======================================================
    
    // [PERBAIKAN SIDEBAR] Sesuaikan selector dengan dashboard.html
    const navbar = document.querySelector('.admin-topbar');
    const navToggle = document.querySelector('.sidebar-toggle');
    const navMenu = document.getElementById('adminSidebar');

    // Sticky Navbar
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }
        });
    }

    // Mobile Menu Toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            navMenu.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && navMenu.classList.contains('active')) {
                if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                    navMenu.classList.remove('active');
                }
            }
        });
    }

    // Back to Top Button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px;
        background: linear-gradient(135deg, #b91c1c, #dc2626); color: white;
        border: none; border-radius: 50%; cursor: pointer; display: none;
        align-items: center; justify-content: center; font-size: 18px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); transition: all 0.3s; z-index: 999;
    `;
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        backToTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Global Notification System
    window.showNotification = function(message, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 100px; right: 30px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white; padding: 15px 25px; border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); z-index: 9999;
            animation: slideIn 0.3s ease; font-family: 'Poppins', sans-serif;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    };

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
    `;
    document.head.appendChild(style);

    // LOGIN FORM
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        window.togglePassword = function() {
            const passwordInput = document.getElementById('password');
            const toggleIcon = document.getElementById('toggleIcon');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleIcon.classList.remove('fa-eye');
                toggleIcon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                toggleIcon.classList.remove('fa-eye-slash');
                toggleIcon.classList.add('fa-eye');   
            }
        };

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const btn = loginForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Loading...';
            btn.disabled = true;

            fetch(API_URL + 'auth/login.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification('Login berhasil!', 'success');
                    localStorage.setItem('user_id', data.data.id);
                    localStorage.setItem('user_name', data.data.nama);
                    localStorage.setItem('user_role', data.data.role);
                    setTimeout(() => window.location.href = 'dashboard.html', 1500);
                } else {
                    showNotification(data.message, 'error');
                }
            })
            .catch(err => showNotification('Gagal koneksi ke server.', 'error'))
            .finally(() => {
                btn.innerText = originalText;
                btn.disabled = false;
            });
        });
    }

    const logoutBtn = document.querySelector('.logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            fetch(API_URL + 'auth/logout.php')
            .then(() => {
                localStorage.clear();
                window.location.href = 'login.html';
            });
        });
    }

    // DASHBOARD LOGIC
    if (document.querySelector('.admin-content')) {
        if (document.getElementById('staffPool')) loadGuruData();
        if (document.getElementById('beritaTableBody')) loadBeritaData();
        if (document.getElementById('adminGalleryGrid')) loadGaleriData(); 
        if (document.getElementById('prestasiTableBody')) loadPrestasiData();
        
        setupUploadZone('galleryDropzone', 'galleryInput', true); 
        setupUploadZone('guruPhotoDrop', null, false, 'guruPreview'); 
        setupUploadZone('prestasiPhotoDrop', null, false, 'prestasiPreview');
        setupUploadZone('beritaPhotoDrop', null, false, 'beritaPreview');
    }

    // --- FUNGSI ADMIN: BERITA ---
    function loadBeritaData() {
        const tbody = document.getElementById('beritaTableBody');
        if (!tbody) return;

        fetch(API_URL + 'berita/read.php?limit=20')
            .then(res => res.json())
            .then(data => {
                let html = '';
                data.forEach(item => {
                    const badgeClass = item.status === 'published' ? 'green' : 'orange';
                    html += `
                        <tr>
                            <td><img src="${UPLOAD_URL}berita/${item.thumbnail}" style="width: 80px; height: 50px; object-fit: cover;" onerror="this.src='https://via.placeholder.com/80?text=No+Img'"></td>
                            <td><strong>${item.judul}</strong></td>
                            <td><span class="badge blue">${item.kategori}</span></td>
                            <td>Admin</td>
                            <td>${item.created_at}</td>
                            <td><span class="badge ${badgeClass}">${item.status}</span></td>
                            <td>
                                <button class="btn-icon" onclick="editBerita(${item.id})" title="Edit">✏️</button>
                                <button class="btn-icon" onclick="deleteBerita(${item.id})" title="Hapus">🗑️</button>
                            </td>
                        </tr>`;
                });
                tbody.innerHTML = html;
            });
    }

    window.deleteBerita = function(id) {
        if(confirm('Yakin hapus berita ini?')) {
            const formData = new FormData();
            formData.append('id', id);
            fetch(API_URL + 'berita/delete.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => { if(data.status === 'success') { showNotification('Berita dihapus', 'success'); loadBeritaData(); } });
        }
    }

    window.editBerita = function(id) {
        fetch(API_URL + 'berita/read_single.php?id=' + id)
        .then(res => res.json())
        .then(data => {
            openModal('modalBerita');
            document.querySelector('#modalBerita h3').innerText = "Edit Berita"; 
            const form = document.getElementById('formTambahBerita');
            form.querySelector('[name="id"]').value = data.id;
            form.querySelector('[name="judul"]').value = data.judul;
            form.querySelector('[name="kategori"]').value = data.kategori;
            form.querySelector('[name="status"]').value = data.status;
            form.querySelector('[name="konten"]').value = data.konten;
            if(data.thumbnail) {
                const preview = document.getElementById('beritaPreview');
                const dropText = document.querySelector('#beritaPhotoDrop .dz-content');
                if(preview) { preview.src = UPLOAD_URL + 'berita/' + data.thumbnail; preview.classList.remove('hidden'); }
                if(dropText) dropText.classList.add('hidden');
            }
        });
    }

    const formBerita = document.getElementById('formTambahBerita'); 
    if (formBerita) {
        formBerita.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(formBerita);
            const fileInput = document.getElementById('beritaPhotoInput');
            if(fileInput && fileInput.files[0]) formData.append('thumbnail', fileInput.files[0]);

            const id = formData.get('id');
            const endpoint = id ? 'berita/update.php' : 'berita/create.php';

            fetch(API_URL + endpoint, { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification(data.message, 'success');
                    closeModal('modalBerita');
                    formBerita.reset();
                    if(formBerita.querySelector('[name="id"]')) formBerita.querySelector('[name="id"]').value = "";
                    loadBeritaData();
                } else {
                    showNotification('Gagal: ' + data.message, 'error');
                }
            });
        });
    }

    // --- FUNGSI ADMIN: GURU & STAFF ---
    function loadGuruData() {
        const pool = document.getElementById('staffPool');
        if(!pool) return;

        fetch(API_URL + 'guru/read.php')
        .then(res => res.json())
        .then(data => {
            pool.innerHTML = '';
            document.querySelectorAll('.role-slot').forEach(slot => {
                const label = slot.querySelector('small, .slot-label');
                slot.innerHTML = ''; 
                if(label) slot.appendChild(label);
            });

            if (data.length === 0) {
                pool.innerHTML = '<p>Belum ada data guru.</p>';
                return;
            }

            data.forEach(pegawai => {
                const card = createGuruCard(pegawai);
                const targetSlot = document.querySelector(`.role-slot[data-slot="${pegawai.jabatan}"]`);
                if (targetSlot) targetSlot.appendChild(card);
                else pool.appendChild(card);
            });
        });
    }

    function createGuruCard(data) {
        const card = document.createElement('div');
        card.className = 'guru-card draggable';
        card.setAttribute('draggable', 'true');
        card.dataset.id = data.id;
        card.innerHTML = `
            <img src="${UPLOAD_URL}guru/${data.foto}" loading="lazy" onerror="this.src='https://via.placeholder.com/60?text=User'">
            <div class="guru-info"><strong>${data.nama}</strong><small>${data.nip || '-'}</small></div>
            <div class="card-actions">
                <button onclick="editGuru(${data.id}, '${data.nama}', '${data.nip}', 'Guru')" title="Edit">✏️</button>
                <button onclick="deleteGuru(${data.id}, '${data.nama}')" title="Hapus">🗑️</button>
            </div>`;
        addDragEvents(card);
        return card;
    }

    window.saveGuruPositions = function() {
        const updates = [];
        document.querySelectorAll('.role-slot').forEach(slot => {
            const jabatanName = slot.getAttribute('data-slot');
            const card = slot.querySelector('.guru-card');
            if (card) updates.push({ id: card.dataset.id, jabatan: jabatanName });
        });
        document.getElementById('staffPool').querySelectorAll('.guru-card').forEach(card => {
            updates.push({ id: card.dataset.id, jabatan: 'pool' });
        });

        fetch(API_URL + 'guru/update_posisi.php', { method: 'POST', body: JSON.stringify(updates) })
        .then(res => res.json())
        .then(data => {
            if(data.status === 'success') showNotification('Posisi berhasil disimpan!', 'success');
            else showNotification('Gagal menyimpan.', 'error');
        });
    };

    function setupDragSystem() {
        const containers = document.querySelectorAll('.role-slot, #staffPool');
        containers.forEach(container => {
            container.addEventListener('dragover', e => { e.preventDefault(); container.classList.add('drag-hover'); });
            container.addEventListener('dragleave', () => container.classList.remove('drag-hover'));
            container.addEventListener('drop', e => {
                e.preventDefault();
                container.classList.remove('drag-hover');
                const draggingCard = document.querySelector('.dragging');
                if (draggingCard) {
                    if (container.classList.contains('role-slot') && container.querySelector('.guru-card')) {
                        document.getElementById('staffPool').appendChild(container.querySelector('.guru-card'));
                    }
                    container.appendChild(draggingCard);
                }
            });
        });
    }

    function addDragEvents(card) {
        card.addEventListener('dragstart', () => card.classList.add('dragging'));
        card.addEventListener('dragend', () => card.classList.remove('dragging'));
    }

    if (document.getElementById('staffPool')) {
        setupDragSystem();
    }

    const formGuru = document.getElementById('formTambahGuru');
    if (formGuru) {
        formGuru.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(formGuru);
            formData.append('jabatan', 'pool');
            const id = formData.get('id');
            const endpoint = id ? 'guru/update.php' : 'guru/create.php';

            fetch(API_URL + endpoint, { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification('Data disimpan', 'success');
                    closeModal('modalTambahGuru');
                    formGuru.reset();
                    if(formGuru.querySelector('[name="id"]')) formGuru.querySelector('[name="id"]').value = ""; 
                    document.getElementById('guruPreview').classList.add('hidden');
                    loadGuruData();
                } else {
                    showNotification('Gagal: ' + data.message, 'error');
                }
            });
        });
    }

    window.editGuru = function(id, nama, nip, kategori) {
        openModal('modalTambahGuru');
        const form = document.getElementById('formTambahGuru');
        form.querySelector('[name="id"]').value = id;
        form.querySelector('[name="nama"]').value = nama;
        form.querySelector('[name="nip"]').value = nip;
    }

    window.deleteGuru = function(id, nama) {
        if(confirm(`Hapus pegawai ${nama}?`)) {
            const formData = new FormData();
            formData.append('id', id);
            fetch(API_URL + 'guru/delete.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(() => { showNotification('Pegawai dihapus', 'success'); loadGuruData(); });
        }
    };

    // --- FUNGSI ADMIN: GALERI ---
    function loadGaleriData() {
        const grid = document.getElementById('adminGalleryGrid');
        if (!grid) return;

        fetch(API_URL + 'galeri/read.php?limit=20')
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) { grid.innerHTML = '<p>Belum ada foto.</p>'; return; }
            let html = '';
            data.forEach(item => {
                html += `
                    <div class="gallery-admin-item" style="position:relative; margin-bottom:15px;">
                        <img src="${UPLOAD_URL}galeri/${item.file_gambar}" loading="lazy" style="width:100%; height:150px; object-fit:cover; border-radius:8px;">
                        <div style="padding: 10px;">${item.judul}</div>
                        <div style="position:absolute; top:5px; right:5px;">
                            <button onclick="deleteGaleri(${item.id})" style="background:red; color:white; border:none; padding:5px;">🗑️</button>
                        </div>
                    </div>`;
            });
            grid.innerHTML = html;
        });
    }

    const formGaleri = document.getElementById('formGaleriManual');
    if (formGaleri) {
        formGaleri.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(formGaleri);
            const endpoint = 'galeri/create_manual.php';
            
            fetch(API_URL + endpoint, { method: 'POST', body: formData })
            .then(res => res.text())
            .then(text => {
                try {
                    const data = JSON.parse(text);
                    if (data.status === 'success') {
                        showNotification('Foto Berhasil Diupload!', 'success');
                        closeModal('modalTambahGaleri');
                        formGaleri.reset();
                        loadGaleriData(); 
                    } else {
                        showNotification(data.message || 'Gagal', 'error');
                    }
                } catch (e) { console.error(text); }
            });
        });
    }

    window.deleteGaleri = function(id) {
        if (confirm('Hapus foto ini?')) {
            const formData = new FormData();
            formData.append('id', id);
            fetch(API_URL + 'galeri/delete.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => { if (data.status === 'success') { showNotification('Foto dihapus', 'success'); loadGaleriData(); } });
        }
    };

    // --- FUNGSI ADMIN: PRESTASI ---
    function loadPrestasiData() {
        const tbody = document.getElementById('prestasiTableBody');
        if(!tbody) return;

        fetch(API_URL + 'prestasi/read.php')
        .then(res => res.json())
        .then(data => {
            let html = '';
            data.forEach(item => {
                html += `
                    <tr>
                        <td><strong>${item.judul}</strong></td>
                        <td>${item.peringkat}</td>
                        <td>${item.tingkat}</td>
                        <td>${item.tanggal}</td>
                        <td><img src="${UPLOAD_URL}prestasi/${item.foto}" style="width:50px; height:35px; object-fit:cover;"></td>
                        <td>
                            <button onclick="editPrestasi(${item.id}, '${item.judul}', '${item.peringkat}', '${item.tingkat}', '${item.tanggal}')">✏️</button>
                            <button onclick="deletePrestasi(${item.id})">🗑️</button>
                        </td>
                    </tr>`;
            });
            tbody.innerHTML = html;
        });
    }

    window.editPrestasi = function(id, judul, peringkat, tingkat, tanggal) {
        openModal('modalPrestasi');
        const form = document.getElementById('formTambahPrestasi');
        form.querySelector('[name="id"]').value = id;
        form.querySelector('[name="judul"]').value = judul;
        form.querySelector('[name="peringkat"]').value = peringkat;
        form.querySelector('[name="tingkat"]').value = tingkat;
        form.querySelector('[name="tanggal"]').value = tanggal;
    }

    const formPrestasi = document.getElementById('formTambahPrestasi');
    if (formPrestasi) {
        formPrestasi.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(formPrestasi);
            const id = formData.get('id');
            const endpoint = id ? 'prestasi/update.php' : 'prestasi/create.php';
            fetch(API_URL + endpoint, { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => { if (data.status === 'success') { showNotification('Disimpan!', 'success'); closeModal('modalPrestasi'); loadPrestasiData(); } });
        });
    }

    window.deletePrestasi = function(id) {
        if (confirm('Hapus data prestasi ini?')) {
            const formData = new FormData();
            formData.append('id', id);
            fetch(API_URL + 'prestasi/delete.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => { if (data.status === 'success') { loadPrestasiData(); } });
        }
    };

    // Load Pesan Admin
    window.loadPesanData = function() {
        const tbody = document.getElementById('pesanTableBody');
        if (!tbody) return;
        fetch(API_URL + 'pesan/read.php').then(res => res.json()).then(data => {
            let html = '';
            data.forEach(item => {
                html += `<tr><td>${item.nama}</td><td>${item.subjek}</td><td>${item.pesan}</td>
                <td><button onclick="deletePesan(${item.id})">Hapus</button></td></tr>`;
            });
            tbody.innerHTML = html;
        });
    }

    window.deletePesan = function(id) {
        const fd = new FormData(); fd.append('id', id);
        fetch(API_URL + 'pesan/delete.php', {method:'POST', body:fd}).then(()=>loadPesanData());
    }

    // Load Admin List
    window.loadAdminData = function() {
        const tbody = document.getElementById('adminTableBody');
        if (!tbody) return;
        fetch(API_URL + 'auth/read_users.php').then(res => res.json()).then(data => {
            let html = '';
            data.forEach(u => { html += `<tr><td>${u.nama}</td><td>${u.role}</td></tr>`; });
            tbody.innerHTML = html;
        });
    }

    // ======================================================
    // 2. LOGIKA SLIDER (HTML CONNECTED)
    // ======================================================
    function initSlider() {
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.hero-dot');
        
        if (slides.length === 0) return;

        let slideIndex = 0;
        let slideInterval;
        const intervalTime = 5000; 

        function showSlide(index) {
            slides.forEach(slide => {
                slide.classList.remove('active');
                slide.style.opacity = 0;
            });
            dots.forEach(dot => dot.classList.remove('active'));

            if (index >= slides.length) slideIndex = 0;
            else if (index < 0) slideIndex = slides.length - 1;
            else slideIndex = index;

            slides[slideIndex].classList.add('active');
            slides[slideIndex].style.opacity = 1;
            if (dots[slideIndex]) dots[slideIndex].classList.add('active');
        }

        function startTimer() {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => showSlide(slideIndex + 1), intervalTime);
        }

        // FUNGSI GLOBAL AGAR BISA DIPANGGIL DARI HTML (onclick)
        window.plusSlides = function(n) {
            clearInterval(slideInterval); 
            showSlide(slideIndex + n);
            startTimer(); 
        };

        window.currentSlide = function(n) {
            clearInterval(slideInterval);
            showSlide(n - 1); 
            startTimer();
        };

        showSlide(0);
        startTimer();
    }

    // ======================================================
    // 3. LOGIKA BERANDA (HOME)
    // ======================================================
    function loadHomeData() {
        const homePrestasiGrid = document.getElementById('homePrestasiGrid');
        const homeBeritaGrid = document.getElementById('homeBeritaGrid');

        // Load Prestasi
        if (homePrestasiGrid) {
            homePrestasiGrid.innerHTML = '<div class="loading-spinner text-center">Sedang memuat prestasi...</div>';
            fetch(API_URL + 'prestasi/read.php?limit=3')
            .then(res => res.json())
            .then(data => {
                const list = Array.isArray(data) ? data : (data.data || []);
                if (list.length === 0) {
                    homePrestasiGrid.innerHTML = '<p class="text-center w-100">Belum ada data prestasi.</p>';
                    return;
                }
                let html = '';
                list.forEach(item => {
                    let badgeClass = 'blue';
                    const tingkatText = (item.tingkat || '').toLowerCase();
                    if (tingkatText.includes('nasional')) badgeClass = 'red';
                    else if (tingkatText.includes('provinsi')) badgeClass = 'purple';
                    
                    html += `
                        <div class="achievement-item">
                            <div class="achievement-img">
                                <img src="${UPLOAD_URL}prestasi/${item.foto}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x200'">
                            </div>
                            <div class="achievement-content">
                                <span class="badge ${badgeClass}">${item.tingkat || 'Prestasi'}</span>
                                <h4>${item.judul}</h4>
                                <p class="rank"><i class="fas fa-trophy"></i> ${item.peringkat}</p>
                            </div>
                        </div>`;
                });
                homePrestasiGrid.innerHTML = html;
            })
            .catch(() => { homePrestasiGrid.innerHTML = '<p class="text-error text-center">Gagal memuat data.</p>'; });
        }

        // Load Berita
        if (homeBeritaGrid) {
            fetch(API_URL + 'berita/read.php?limit=3')
            .then(res => res.json())
            .then(data => {
                const list = Array.isArray(data) ? data : (data.data || []);
                const news = list.filter(d => !d.status || d.status === 'published').slice(0, 3);
                if (news.length === 0) { homeBeritaGrid.innerHTML = '<p class="text-center w-100">Belum ada berita terbaru.</p>'; return; }
                let html = '';
                news.forEach(item => {
                    const date = new Date(item.created_at).toLocaleDateString('id-ID');
                    const excerpt = item.konten ? item.konten.replace(/<[^>]*>?/gm, '').substring(0, 80) + '...' : '';
                    html += `
                    <div class="blog-card">
                        <div class="blog-img"><img src="${UPLOAD_URL}berita/${item.thumbnail}" onerror="this.src='https://via.placeholder.com/400x250'"><span class="blog-cat">${item.kategori}</span></div>
                        <div class="blog-content">
                            <div class="blog-meta"><span><i class="far fa-calendar"></i> ${date}</span></div>
                            <h3><a href="berita-detail.html?id=${item.id}">${item.judul}</a></h3>
                            <p>${excerpt}</p>
                            <a href="berita-detail.html?id=${item.id}" class="read-more">Baca <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </div>`;
                });
                homeBeritaGrid.innerHTML = html;
            })
            .catch(() => { homeBeritaGrid.innerHTML = '<p class="text-error text-center">Gagal memuat berita.</p>'; });
        }
    }

    // ======================================================
    // 4. LOGIKA DETAIL BERITA (DIPERBAIKI)
    // ======================================================
    function loadNewsDetail() {
        const newsDetailContainer = document.getElementById('newsDetailContainer');
        // Jika elemen tidak ada (bukan halaman detail), stop.
        if (!newsDetailContainer) return;

        // 1. Tampilkan Loading
        newsDetailContainer.innerHTML = '<div class="loading-spinner text-center" style="padding:50px;">Sedang memuat berita...</div>';

        // 2. Ambil ID dari URL
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (!id) {
            newsDetailContainer.innerHTML = '<p class="text-center text-error">Berita tidak ditemukan (ID Kosong).</p>';
            return;
        }

        // 3. Fetch Data
        fetch(API_URL + 'berita/read_single.php?id=' + id)
        .then(res => res.json())
        .then(data => {
            // Cek jika data kosong atau error
            if (!data || data.message) { 
                newsDetailContainer.innerHTML = '<p class="text-center">Berita tidak ditemukan.</p>'; 
                return; 
            }

            // 4. Tampilkan HTML
            const date = new Date(data.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            
            newsDetailContainer.innerHTML = `
                <div class="news-detail-header">
                    <span class="news-category-badge">${data.kategori}</span>
                    <h1>${data.judul}</h1>
                    <div class="news-meta">
                        <span><i class="far fa-calendar"></i> ${date}</span>
                        <span><i class="far fa-user"></i> Admin</span>
                    </div>
                </div>
                
                <div class="news-detail-image">
                    <img src="${UPLOAD_URL}berita/${data.thumbnail}" alt="${data.judul}" onerror="this.src='https://via.placeholder.com/800x400'">
                </div>
                
                <div class="news-detail-content">
                    ${data.konten}
                </div>
                
                <div class="news-detail-footer">
                    <a href="berita.html" class="btn-text">&larr; Kembali ke Berita</a>
                </div>`;
        })
        .catch(err => {
            console.error("Error Detail Berita:", err);
            newsDetailContainer.innerHTML = '<p class="text-center text-error">Gagal memuat berita. Periksa koneksi internet Anda.</p>';
        });
    }

    // ======================================================
    // 5. GURU & STAFF (DIPERBAIKI: POOL -> GURU MAPEL)
    // ======================================================
    function loadPublicGuruStaff() {
        const publicGuruGrid = document.getElementById('publicGuruGrid');
        const publicStaffGrid = document.getElementById('publicStaffGrid');
        const publicHeadmasterContainer = document.getElementById('publicHeadmasterContainer');
        
        if (!publicGuruGrid && !publicStaffGrid && !publicHeadmasterContainer) return;

        fetch(API_URL + 'guru/read.php')
        .then(res => res.json())
        .then(data => {
            if(publicGuruGrid) publicGuruGrid.innerHTML = '';
            if(publicStaffGrid) publicStaffGrid.innerHTML = '';
            if(publicHeadmasterContainer) publicHeadmasterContainer.innerHTML = '';

            const waliKelasKeys = ['1', '2', '3', '4', '5', '6'];
            const labelJabatan = { '1': 'Wali Kelas 1', '2': 'Wali Kelas 2', '3': 'Wali Kelas 3', '4': 'Wali Kelas 4', '5': 'Wali Kelas 5', '6': 'Wali Kelas 6' };

            data.forEach(person => {
                const jabatan = (person.jabatan || '').toLowerCase();
                
                // Kepala Sekolah
                if (jabatan.includes('kepala') || jabatan === 'kepala_sekolah') {
                    if(publicHeadmasterContainer) {
                        publicHeadmasterContainer.innerHTML = `
                            <div class="headmaster-card">
                                <div class="headmaster-image"><img src="${UPLOAD_URL}guru/${person.foto}" onerror="this.src='https://via.placeholder.com/300x400'"></div>
                                <div class="headmaster-info"><h3>${person.nama}</h3><span class="position">Kepala Sekolah</span><div class="info-details"><p>NIP: ${person.nip || '-'}</p></div></div>
                            </div>`;
                    }
                    if(document.getElementById('section-kepsek')) document.getElementById('section-kepsek').style.display = 'block';
                } 
                // Guru Kelas
                else if (waliKelasKeys.includes(person.jabatan)) {
                    if(publicGuruGrid) publicGuruGrid.innerHTML += `
                        <div class="teacher-card">
                            <div class="teacher-image"><img src="${UPLOAD_URL}guru/${person.foto}" onerror="this.src='https://via.placeholder.com/300'"></div>
                            <div class="teacher-info"><h4>${person.nama}</h4><span class="position">${labelJabatan[person.jabatan]}</span></div>
                        </div>`;
                } 
                // Staff Lainnya (FIX TULISAN POOL DISINI)
                else {
                    // Ambil posisi dari input manual (posisi) atau dropdown (jabatan)
                    let posisiTampil = person.posisi || person.jabatan || 'Staff';
                    
                    // JIKA ISINYA "pool" ATAU ANGKA, GANTI JADI "GURU MAPEL / STAFF"
                    if (posisiTampil.toLowerCase() === 'pool' || !isNaN(posisiTampil)) {
                        posisiTampil = 'Guru Mapel / Staff';
                    }

                    if(publicStaffGrid) publicStaffGrid.innerHTML += `
                        <div class="staff-card">
                            <img src="${UPLOAD_URL}guru/${person.foto}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;" onerror="this.src='https://via.placeholder.com/80'">
                            <h4>${person.nama}</h4>
                            <p>${posisiTampil}</p> 
                        </div>`;
                }
            });
        });
    }

    // ======================================================
    // 6. LIST BERITA & GALERI
    // ======================================================
    function loadPublicNewsList() {
        const publicNewsList = document.getElementById('publicNewsList');
        if (!publicNewsList) { loadSidebarAndHome(); return; }
        publicNewsList.innerHTML = '<div class="loading-spinner">Memuat berita...</div>';
        const urlParams = new URLSearchParams(window.location.search);
        const filterKategori = urlParams.get('kategori');
        fetch(API_URL + 'berita/read.php?limit=20').then(res => res.json()).then(data => {
            let news = data.filter(item => item.status === 'published');
            if (filterKategori) news = news.filter(item => item.kategori.toLowerCase() === filterKategori.toLowerCase());
            if(news.length === 0) { publicNewsList.innerHTML = '<p class="text-center">Tidak ada berita.</p>'; return; }
            let html = '';
            news.forEach(item => {
                const excerpt = item.konten ? item.konten.substring(0, 100).replace(/<[^>]*>?/gm, '') + '...' : '';
                html += `<article class="news-item"><div class="news-item-image"><img src="${UPLOAD_URL}berita/${item.thumbnail}" onerror="this.src='https://via.placeholder.com/400'"></div><div class="news-item-content"><h2><a href="berita-detail.html?id=${item.id}">${item.judul}</a></h2><p>${excerpt}</p><a href="berita-detail.html?id=${item.id}" class="read-more">Baca Selengkapnya</a></div></article>`;
            });
            publicNewsList.innerHTML = html;
        }).catch(()=>{publicNewsList.innerHTML='<p>Gagal memuat.</p>'});
        loadSidebarAndHome();
    }

    function loadSidebarAndHome() {
        const catList = document.getElementById('sidebarCategoryList');
        const recentList = document.getElementById('sidebarRecentNews');
        if (catList || recentList) {
            fetch(API_URL + 'berita/read.php?limit=10').then(res => res.json()).then(data => {
                if (catList) {
                    const cats = {}; data.forEach(i => { if(i.status==='published') cats[i.kategori] = (cats[i.kategori]||0)+1; });
                    let html = ''; for(let c in cats) html += `<li><a href="berita.html?kategori=${c}">${c} <span>${cats[c]}</span></a></li>`;
                    catList.innerHTML = html;
                }
                if (recentList) {
                    const recent = data.filter(i=>i.status==='published').slice(0,3);
                    let html = ''; recent.forEach(i => html += `<div class="recent-item"><h4><a href="berita-detail.html?id=${i.id}">${i.judul}</a></h4></div>`);
                    recentList.innerHTML = html;
                }
            });
        }
    }

    function loadPublicGallery() {
        const grid = document.getElementById('publicGalleryGrid');
        if (!grid) return;
        grid.innerHTML = '<p class="text-center w-100">Memuat galeri...</p>';
        fetch(API_URL + 'galeri/read.php').then(res => res.json()).then(data => {
            if (!Array.isArray(data) || data.length === 0) { grid.innerHTML = '<p class="text-center w-100">Galeri kosong.</p>'; return; }
            let html = '';
            data.forEach(item => {
                const kat = item.kategori ? item.kategori.toLowerCase().trim() : 'umum';
                html += `<div class="gallery-item show" data-category="${kat}" onclick="openGalleryModal('${UPLOAD_URL}galeri/${item.file_gambar}')"><img src="${UPLOAD_URL}galeri/${item.file_gambar}" loading="lazy"><div class="gallery-overlay"><h4>${item.judul}</h4><span>${item.kategori}</span></div></div>`;
            });
            grid.innerHTML = html;
            initGalleryFilter();
        });
    }

    function initGalleryFilter() {
        const buttons = document.querySelectorAll('.filter-btn, .portfolio-filter button');
        const items = document.querySelectorAll('.gallery-item');
        buttons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                if(e.target.tagName==='A') e.preventDefault();
                buttons.forEach(b => b.classList.remove('active')); this.classList.add('active');
                const filter = (this.getAttribute('data-filter') || this.innerText).toLowerCase().trim();
                items.forEach(item => {
                    const itemCat = item.getAttribute('data-category');
                    if (filter === 'all' || filter === 'semua' || itemCat === filter) { item.style.display = 'block'; setTimeout(()=>item.classList.add('show'),50); }
                    else { item.classList.remove('show'); item.style.display = 'none'; }
                });
            });
        });
    }

}); // END DOMContentLoaded

// ======================================================
// HELPER FUNCTIONS (GLOBAL)
// ======================================================

function switchModule(moduleId, element) {
    const modules = document.querySelectorAll('.module-section');
    modules.forEach(mod => mod.style.display = 'none');
    const selected = document.getElementById('modul-' + moduleId);
    if(selected) selected.style.display = 'block';

    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    if(element) element.classList.add('active');

    if (moduleId === 'pesan') loadPesanData();
    if (moduleId === 'pengaturan') loadAdminData();
}

function openModal(id) { const el = document.getElementById(id); if(el) el.style.display = 'flex'; }
function closeModal(id) { const el = document.getElementById(id); if(el) el.style.display = 'none'; }

window.openGalleryModal = function(src) {
    const modal = document.getElementById('galleryModal');
    const img = document.getElementById('modalImage');
    if(modal && img) { img.src = src; modal.classList.add('active'); modal.style.display = 'flex'; }
}
window.closeGalleryModal = function() {
    const modal = document.getElementById('galleryModal');
    if(modal) { modal.classList.remove('active'); modal.style.display = 'none'; }
}

function setupUploadZone(zoneId, inputId, isMultiple, previewId) {
    const zone = document.getElementById(zoneId); if(!zone) return;
    const input = inputId ? document.getElementById(inputId) : zone.querySelector('input');
    zone.addEventListener('click', ()=>input.click());
    zone.addEventListener('dragover', (e)=>{e.preventDefault();zone.classList.add('drag-over')});
    zone.addEventListener('dragleave', ()=>zone.classList.remove('drag-over'));
    zone.addEventListener('drop', (e)=>{e.preventDefault();zone.classList.remove('drag-over'); if(e.dataTransfer.files.length) { if(input) input.files=e.dataTransfer.files; handleFiles(e.dataTransfer.files, isMultiple, previewId); }});
    if(input) input.addEventListener('change', ()=>handleFiles(input.files, isMultiple, previewId));
}
function handleFiles(files, isMultiple, previewId) {
    if (isMultiple) {
        const fd = new FormData(); for(let i=0; i<files.length; i++) fd.append('files[]', files[i]);
        fetch('api/galeri/upload.php', {method:'POST', body:fd}).then(res=>res.json()).then(d=>{if(d.status==='success') location.reload();});
    } else if (previewId && files.length) {
        const r = new FileReader(); r.onload=(e)=>{const i=document.getElementById(previewId); if(i){i.src=e.target.result; i.classList.remove('hidden');}}; r.readAsDataURL(files[0]);
    }
}