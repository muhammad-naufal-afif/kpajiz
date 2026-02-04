// ======================================================
// SD NEGERI 2 BAWANG - MAIN JAVASCRIPT (FINAL FIXED V2)
// ======================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // ======================================================
    // 0. KONFIGURASI API & GLOBAL
    // ======================================================
    // PENTING: Pastikan nama folder 'kpajiz' sesuai dengan nama folder di htdocs kamu
    const BASE_URL = 'http://localhost/kpajiz/'; 
    const API_URL = BASE_URL + 'api/';
    const UPLOAD_URL = BASE_URL + 'uploads/';
    
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    // ======================================================
    // 1. GLOBAL UI (Navbar, Scroll, Notify)
    // ======================================================

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
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const isOpened = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isOpened);
            navToggle.setAttribute('aria-label', isOpened ? 'Tutup Menu Navigasi' : 'Buka Menu Navigasi');
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

    // Inject CSS Animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
    `;
    document.head.appendChild(style);

    // ======================================================
    // 2. HOMEPAGE & GALLERY LOGIC
    // ======================================================
    
    // Hero Slider
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length > 0) {
        let currentSlide = 0;
        const heroPrev = document.querySelector('.hero-prev');
        const heroNext = document.querySelector('.hero-next');
        const heroDotsContainer = document.querySelector('.hero-dots');

        heroSlides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('hero-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            if (heroDotsContainer) heroDotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.hero-dot');

        function showSlide(n) {
            heroSlides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            if (n >= heroSlides.length) currentSlide = 0;
            else if (n < 0) currentSlide = heroSlides.length - 1;
            else currentSlide = n;

            heroSlides[currentSlide].classList.add('active');
            if (dots.length > 0) dots[currentSlide].classList.add('active');
        }

        function goToSlide(n) { currentSlide = n; showSlide(currentSlide); }
        function nextSlide() { goToSlide(currentSlide + 1); }
        function prevSlide() { goToSlide(currentSlide - 1); }

        if (heroNext) heroNext.addEventListener('click', nextSlide);
        if (heroPrev) heroPrev.addEventListener('click', prevSlide);
        setInterval(nextSlide, 5000);
    }

    // Gallery Filter Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');
                const dynamicItems = document.querySelectorAll('.gallery-item');

                dynamicItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    if (filterValue === 'all' || itemCategory === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Pesan berhasil dikirim! Kami akan menghubungi Anda segera.', 'success');
            contactForm.reset();
        });
    }

    // ======================================================
    // 3. ADMIN: AUTHENTICATION
    // ======================================================
    
    // Login Logic
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

            fetch(API_URL + 'auth/login.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification('Login berhasil! Mengalihkan...', 'success');
                    localStorage.setItem('user_name', data.data.nama);
                    localStorage.setItem('user_role', data.data.role);
                    setTimeout(() => window.location.href = 'dashboard.html', 1500);
                } else {
                    showNotification(data.message, 'error');
                }
            })
            .catch(err => {
                console.error(err);
                showNotification('Gagal koneksi ke server', 'error');
            });
        });
    }

    // Logout Logic
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

    // ======================================================
    // 4. ADMIN: DASHBOARD LOGIC (INIT)
    // ======================================================

    if (document.querySelector('.admin-content')) {
        // [FIX] Cek keberadaan elemen sebelum load data (Anti Error)
        if (document.getElementById('modul-guru')) loadGuruData();
        if (document.getElementById('modul-berita')) loadBeritaData();
        if (document.getElementById('modul-galeri')) loadGaleriData(); 
        if (document.getElementById('modul-prestasi')) loadPrestasiData();
        
        // Setup Drag & Drop Uploads (Aman karena ada cek di dalam fungsi setupUploadZone)
        setupUploadZone('galleryDropzone', 'galleryInput', true); 
        setupUploadZone('guruPhotoDrop', null, false, 'guruPreview'); 
        setupUploadZone('prestasiPhotoDrop', null, false, 'prestasiPreview');
        setupUploadZone('beritaPhotoDrop', null, false, 'beritaPreview');
    }

    // ======================================================
    // 5. MANAJEMEN BERITA
    // ======================================================
    
    function loadBeritaData() {
        const tbody = document.querySelector('#modul-berita tbody');
        if (!tbody) return;

        fetch(API_URL + 'berita/read.php?limit=20')
            .then(res => res.json())
            .then(data => {
                let html = '';
                data.forEach(item => {
                    const badgeClass = item.status === 'published' ? 'green' : 'orange';
                    html += `
                        <tr>
                            <td>
                                <img src="${UPLOAD_URL}berita/${item.thumbnail}" loading="lazy" style="width: 80px; height: 50px; object-fit: cover; border-radius: 6px;" onerror="this.src='https://via.placeholder.com/80?text=No+Img'">
                            </td>
                            <td><strong>${item.judul}</strong><div style="font-size: 11px; color: #888;">Views: ${item.views}</div></td>
                            <td><span class="badge blue">${item.kategori}</span></td>
                            <td>Admin</td>
                            <td>${item.created_at}</td>
                            <td><span class="badge ${badgeClass}">${item.status}</span></td>
                            <td>
                                <button class="btn-icon" onclick="editBerita(${item.id})" title="Edit" style="font-size:16px;">✏️</button>
                                <button class="btn-icon" onclick="deleteBerita(${item.id})" title="Hapus" style="font-size:16px;">🗑️</button>
                            </td>
                        </tr>
                    `;
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
            .then(data => {
                if(data.status === 'success') {
                    showNotification('Berita dihapus', 'success');
                    loadBeritaData(); 
                }
            });
        }
    }

    window.editBerita = function(id) {
        fetch(API_URL + 'berita/read_single.php?id=' + id)
        .then(res => res.json())
        .then(data => {
            openModal('modalBerita');
            document.querySelector('#modalBerita h3').innerText = "Edit Berita"; 
            
            const form = document.getElementById('formTambahBerita');
            if(form.querySelector('[name="id"]')) form.querySelector('[name="id"]').value = data.id;
            form.querySelector('[name="judul"]').value = data.judul;
            form.querySelector('[name="kategori"]').value = data.kategori;
            form.querySelector('[name="status"]').value = data.status;
            form.querySelector('[name="konten"]').value = data.konten;
            
            if(data.thumbnail) {
                const preview = document.getElementById('beritaPreview');
                const dropText = document.querySelector('#beritaPhotoDrop .dz-content');
                if(preview) {
                    preview.src = UPLOAD_URL + 'berita/' + data.thumbnail;
                    preview.classList.remove('hidden');
                }
                if(dropText) dropText.classList.add('hidden');
            }
        })
        .catch(err => { console.error(err); });
    }

    const formBerita = document.getElementById('formTambahBerita'); 
    if (formBerita) {
        formBerita.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(formBerita);
            
            const fileInput = document.getElementById('beritaPhotoInput');
            if(fileInput && fileInput.files[0]) {
                formData.append('thumbnail', fileInput.files[0]);
            }

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
                    document.querySelector('#modalBerita h3').innerText = "Tulis Berita Baru";
                    const preview = document.getElementById('beritaPreview');
                    const dropText = document.querySelector('#beritaPhotoDrop .dz-content');
                    if(preview) { preview.classList.add('hidden'); preview.src = ""; }
                    if(dropText) dropText.classList.remove('hidden');
                    loadBeritaData();
                } else {
                    showNotification('Gagal: ' + data.message, 'error');
                }
            });
        });
    }

    // ======================================================
    // 6. MANAJEMEN GURU
    // ======================================================
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

            data.forEach(guru => {
                const card = document.createElement('div');
                card.className = 'guru-card draggable';
                card.setAttribute('draggable', 'true');
                card.id = 'guru-' + guru.id;
                card.dataset.id = guru.id;

                card.innerHTML = `
                    <img src="${UPLOAD_URL}guru/${guru.foto}" loading="lazy" onerror="this.src='https://via.placeholder.com/40'">
                    <div class="guru-info">
                        <strong>${guru.nama}</strong>
                        <small>${guru.posisi_default}</small>
                    </div>
                    <div style="position:absolute; top:5px; right:5px; display:flex; gap:5px;">
                        <button onclick="editGuru(${guru.id}, '${guru.nama}', '${guru.nip || ''}', '${guru.posisi_default}')" 
                                style="background:#f59e0b; color:white; border:none; width:20px; height:20px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:10px;">✏️</button>
                        <button onclick="deleteGuru(${guru.id}, '${guru.nama}')" 
                                style="background:#ef4444; color:white; border:none; width:20px; height:20px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:10px;">🗑️</button>
                    </div>
                `;

                const targetSlotId = guru.lokasi_slot && guru.lokasi_slot !== 'pool' ? 'slot-' + guru.lokasi_slot : 'staffPool';
                const targetContainer = document.getElementById(targetSlotId);
                
                if (targetContainer) targetContainer.appendChild(card);
                else pool.appendChild(card);
                
                addDragEvents(card); 
            });
        });
    }

    window.editGuru = function(id, nama, nip, posisi) {
        openModal('modalTambahGuru');
        document.querySelector('#modalTambahGuru h3').innerText = "Edit Data Guru";
        const form = document.getElementById('formTambahGuru');
        if(form.querySelector('[name="id"]')) form.querySelector('[name="id"]').value = id;
        form.querySelector('[name="nama"]').value = nama;
        form.querySelector('[name="nip"]').value = nip;
        form.querySelector('[name="posisi"]').value = posisi;
        const preview = document.getElementById('guruPreview');
        if(preview) preview.classList.add('hidden');
    }

    const formGuru = document.getElementById('formTambahGuru');
    if (formGuru) {
        formGuru.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(formGuru);
            const id = formData.get('id');
            const endpoint = id ? 'guru/update.php' : 'guru/create.php';

            fetch(API_URL + endpoint, { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification(data.message, 'success');
                    closeModal('modalTambahGuru');
                    formGuru.reset();
                    if(formGuru.querySelector('[name="id"]')) formGuru.querySelector('[name="id"]').value = ""; 
                    document.querySelector('#modalTambahGuru h3').innerText = "Tambah Guru Baru"; 
                    loadGuruData();
                } else {
                    showNotification('Gagal: ' + data.message, 'error');
                }
            });
        });
    }

    window.deleteGuru = function(id, nama) {
        if(confirm(`Yakin ingin menghapus data ${nama}?`)) {
            const formData = new FormData();
            formData.append('id', id);
            fetch(API_URL + 'guru/delete.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if(data.status === 'success') {
                    showNotification('Data guru dihapus', 'success');
                    loadGuruData();
                }
            });
        }
    };

    const btnSimpanPosisi = document.querySelector('#modul-guru .action-btn.green');
    if (btnSimpanPosisi) {
        btnSimpanPosisi.addEventListener('click', () => {
            const positions = [];
            document.querySelectorAll('.role-slot').forEach(slot => {
                const roleName = slot.getAttribute('data-slot');
                const card = slot.querySelector('.guru-card');
                if (card) {
                    const guruId = card.id.replace('guru-', '');
                    positions.push({ posisi: roleName, guru_id: guruId });
                } else {
                    positions.push({ posisi: roleName, guru_id: null });
                }
            });
            const poolCards = document.getElementById('staffPool').querySelectorAll('.guru-card');
            poolCards.forEach(card => {
                const guruId = card.id.replace('guru-', '');
                positions.push({ posisi: 'pool', guru_id: guruId });
            });
            fetch(API_URL + 'guru/update_posisi.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(positions)
            })
            .then(res => res.json())
            .then(data => {
                showNotification('Struktur Organisasi Berhasil Disimpan!', 'success');
            });
        });
    }

    function setupDragAndDrop() {
        const slots = document.querySelectorAll('.role-slot, .staff-pool');
        slots.forEach(slot => {
            slot.addEventListener('dragover', e => { e.preventDefault(); slot.classList.add('drag-over'); });
            slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
            slot.addEventListener('drop', e => {
                e.preventDefault();
                slot.classList.remove('drag-over');
                const draggable = document.querySelector('.dragging');
                if (draggable) {
                    if (slot.classList.contains('role-slot') && slot.querySelector('.guru-card')) {
                        const existing = slot.querySelector('.guru-card');
                        document.getElementById('staffPool').appendChild(existing);
                    }
                    slot.appendChild(draggable);
                }
            });
        });
    }

    function addDragEvents(element) {
        element.addEventListener('dragstart', () => element.classList.add('dragging'));
        element.addEventListener('dragend', () => element.classList.remove('dragging'));
    }

    if (document.getElementById('staffPool')) {
        loadGuruData();
        setupDragAndDrop();
    }

    // ======================================================
    // 7. MANAJEMEN GALERI (FIX UPLOAD - INTEGRATED)
    // ======================================================

    function loadGaleriData() {
        const grid = document.getElementById('adminGalleryGrid');
        if (!grid) return;

        // Ambil data limit 20, jika mau lebih banyak ubah angkanya
        fetch(API_URL + 'galeri/read.php?limit=20')
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                grid.innerHTML = '<p>Belum ada foto.</p>';
                return;
            }
            let html = '';
            data.forEach(item => {
                let badgeColor = 'blue';
                if(item.kategori === 'prestasi') badgeColor = 'purple';
                if(item.kategori === 'fasilitas') badgeColor = 'orange';

                html += `
                    <div class="gallery-admin-item" style="position:relative; margin-bottom:15px;">
                        <img src="${UPLOAD_URL}galeri/${item.file_gambar}" loading="lazy" style="width:100%; height:150px; object-fit:cover; border-radius:8px;" onerror="this.src='https://via.placeholder.com/150?text=Err'">
                        <div style="padding: 10px; background: #fff; border:1px solid #eee; border-radius:0 0 8px 8px;">
                            <span class="badge ${badgeColor}" style="font-size:10px; margin-bottom:5px; display:inline-block;">${item.kategori}</span>
                            <div style="font-weight:bold; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.judul}</div>
                        </div>
                        <div style="position:absolute; top:5px; right:5px; display:flex; gap:5px;">
                            <button onclick="editGaleri(${item.id}, '${item.judul}', '${item.kategori}')" style="background:#f59e0b; color:white; border:none; border-radius:4px; padding:5px 8px; cursor:pointer;" title="Edit">✏️</button>
                            <button onclick="deleteGaleri(${item.id})" style="background:red; color:white; border:none; border-radius:4px; padding:5px 8px; cursor:pointer;" title="Hapus">🗑️</button>
                        </div>
                    </div>
                `;
            });
            grid.innerHTML = html;
        });
    }

    window.editGaleri = function(id, judul, kategori) {
        openModal('modalTambahGaleri');
        document.querySelector('#modalTambahGaleri h3').innerText = "Edit Info Foto";
        document.querySelector('#modalTambahGaleri button[type="submit"]').innerText = "Simpan Perubahan";
        const form = document.getElementById('formGaleriManual');
        form.querySelector('[name="id"]').value = id;
        form.querySelector('[name="judul"]').value = judul;
        form.querySelector('[name="kategori"]').value = kategori;
        form.querySelector('[name="file"]').removeAttribute('required');
    }

    const formGaleri = document.getElementById('formGaleriManual');
    if (formGaleri) {
        formGaleri.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(formGaleri);
            const btn = formGaleri.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            const id = formData.get('id');
            const endpoint = id ? 'galeri/update.php' : 'galeri/create_manual.php';

            btn.innerText = 'Memproses...';
            btn.disabled = true;

            fetch(API_URL + endpoint, { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification(data.message, 'success');
                    closeModal('modalTambahGaleri');
                    formGaleri.reset();
                    formGaleri.querySelector('[name="id"]').value = "";
                    formGaleri.querySelector('[name="file"]').setAttribute('required', 'true'); 
                    document.querySelector('#modalTambahGaleri h3').innerText = "Upload Foto Galeri";
                    document.querySelector('#modalTambahGaleri button[type="submit"]').innerText = "Upload Foto";
                    loadGaleriData(); 
                } else {
                    showNotification(data.message, 'error');
                }
            })
            .catch(err => { console.error(err); })
            .finally(() => { btn.innerText = originalText; btn.disabled = false; });
        });
    }

    window.deleteGaleri = function(id) {
        if (confirm('Yakin ingin menghapus foto ini?')) {
            const formData = new FormData();
            formData.append('id', id);
            fetch(API_URL + 'galeri/delete.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification('Foto berhasil dihapus', 'success');
                    loadGaleriData(); 
                } else {
                    showNotification('Gagal hapus: ' + data.message, 'error');
                }
            });
        }
    };

    // ======================================================
    // 8. MANAJEMEN PRESTASI
    // ======================================================
    if (document.getElementById('prestasiTableBody')) {
        loadPrestasiData();
        setupUploadZone('prestasiPhotoDrop', 'prestasiInput', false, 'prestasiPreview');
    }

    function loadPrestasiData() {
        const tbody = document.getElementById('prestasiTableBody');
        if(!tbody) return;

        fetch(API_URL + 'prestasi/read.php')
        .then(res => res.json())
        .then(data => {
            let html = '';
            if (data.length === 0) {
                html = '<tr><td colspan="6" class="text-center">Belum ada data prestasi.</td></tr>';
            } else {
                data.forEach(item => {
                    const date = new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                    let color = 'blue';
                    if(item.tingkat === 'Provinsi') color = 'purple';
                    if(item.tingkat === 'Nasional') color = 'orange';
                    html += `
                        <tr>
                            <td><strong>${item.judul}</strong></td>
                            <td><span class="badge green">${item.peringkat}</span></td>
                            <td><span class="badge ${color}">${item.tingkat}</span></td>
                            <td>${date}</td>
                            <td><img src="${UPLOAD_URL}prestasi/${item.foto}" loading="lazy" style="width:50px; height:35px; object-fit:cover; border-radius:4px; cursor:pointer;" onclick="window.open(this.src)"></td>
                            <td>
                                <button class="btn-icon" onclick="editPrestasi(${item.id}, '${item.judul}', '${item.peringkat}', '${item.tingkat}', '${item.tanggal}')" title="Edit" style="font-size:16px;">✏️</button>
                                <button class="btn-icon" onclick="deletePrestasi(${item.id})" title="Hapus" style="font-size:16px;">🗑️</button>
                            </td>
                        </tr>
                    `;
                });
            }
            tbody.innerHTML = html;
        });
    }

    window.editPrestasi = function(id, judul, peringkat, tingkat, tanggal) {
        openModal('modalPrestasi');
        document.querySelector('#modalPrestasi h3').innerText = "Edit Data Prestasi";
        document.querySelector('#modalPrestasi button[type="submit"]').innerText = "Simpan Perubahan";
        const form = document.getElementById('formTambahPrestasi');
        form.querySelector('[name="id"]').value = id;
        form.querySelector('[name="judul"]').value = judul;
        form.querySelector('[name="peringkat"]').value = peringkat;
        form.querySelector('[name="tingkat"]').value = tingkat;
        form.querySelector('[name="tanggal"]').value = tanggal;
        const preview = document.getElementById('prestasiPreview');
        if(preview) preview.classList.add('hidden');
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
            .then(data => {
                if (data.status === 'success') {
                    showNotification('Prestasi berhasil disimpan!', 'success');
                    closeModal('modalPrestasi');
                    formPrestasi.reset();
                    if(formPrestasi.querySelector('[name="id"]')) formPrestasi.querySelector('[name="id"]').value = "";
                    document.querySelector('#modalPrestasi h3').innerText = "Tambah Prestasi";
                    const preview = document.getElementById('prestasiPreview');
                    if(preview) preview.classList.add('hidden');
                    loadPrestasiData();
                } else {
                    showNotification('Gagal: ' + data.message, 'error');
                }
            });
        });
    }

    window.deletePrestasi = function(id) {
        if (confirm('Hapus data prestasi ini?')) {
            const formData = new FormData();
            formData.append('id', id);
            fetch(API_URL + 'prestasi/delete.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification('Data dihapus.', 'success');
                    loadPrestasiData();
                }
            });
        }
    };
    
    // ======================================================
    // 9. LOGIKA PENGATURAN & SIDEBAR
    // ======================================================
    const btnUpdatePass = document.querySelector('#modul-pengaturan .btn-primary'); 
    if(btnUpdatePass) {
        btnUpdatePass.addEventListener('click', (e) => {
            e.preventDefault();
            const inputs = btnUpdatePass.closest('form').querySelectorAll('input');
            const oldPass = inputs[0].value;
            const newPass = inputs[1].value;
            if(oldPass === '' || newPass === '') { showNotification('Harap isi semua kolom!', 'error'); return; }
            btnUpdatePass.innerHTML = 'Memproses...';
            setTimeout(() => {
                showNotification('Password berhasil diperbarui!', 'success');
                btnUpdatePass.innerHTML = 'Update Password';
                inputs[0].value = ''; inputs[1].value = '';
            }, 1500);
        });
    }

    const adminSidebar = document.getElementById('adminSidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (adminSidebar && sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            adminSidebar.classList.toggle('active');
        });
    }

    // ======================================================
    // 10. HALAMAN PUBLIK
    // ======================================================
    const publicNewsList = document.getElementById('publicNewsList');
    const paginationContainer = document.getElementById('paginationContainer');
    let currentNewsPage = 1;
    const newsPerPage = 5; 
    let allNewsData = []; 

    if (publicNewsList) {
        loadPublicNews();
    }

    function loadPublicNews() {
        const urlParams = new URLSearchParams(window.location.search);
        const filterKategori = urlParams.get('kategori');

        fetch(API_URL + 'berita/read.php?limit=20')
        .then(res => res.json())
        .then(data => {
            let publishedNews = data.filter(item => item.status === 'published');
            if (filterKategori) {
                publishedNews = publishedNews.filter(item => item.kategori.toLowerCase() === filterKategori.toLowerCase());
                const pageTitle = document.querySelector('.page-header h1');
                if(pageTitle) pageTitle.innerText = 'Kategori: ' + filterKategori.toUpperCase();
            }
            allNewsData = publishedNews;
            if(allNewsData.length === 0) {
                publicNewsList.innerHTML = `<div style="text-align:center; padding: 40px; width:100%;"><p>Tidak ada berita ditemukan.</p></div>`;
                if(paginationContainer) paginationContainer.innerHTML = ''; 
                return;
            }
            renderNewsPage(currentNewsPage);
        })
        .catch(err => {
            console.error(err);
            publicNewsList.innerHTML = '<p style="text-align:center; color:red;">Gagal memuat berita.</p>';
        });
    }

    function renderNewsPage(page) {
        const start = (page - 1) * newsPerPage;
        const end = start + newsPerPage;
        const pageItems = allNewsData.slice(start, end);
        let html = '';
        pageItems.forEach(item => {
            const date = new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            const plainText = item.konten.replace(/<[^>]*>?/gm, ''); 
            const excerpt = plainText.substring(0, 150) + '...';
            html += `
                <article class="news-item">
                    <div class="news-item-image">
                        <img src="${UPLOAD_URL}berita/${item.thumbnail}" loading="lazy" alt="${item.judul}" onerror="this.src='https://via.placeholder.com/800x450/3498DB/ffffff?text=No+Image'">
                        <span class="news-badge">${item.kategori}</span>
                    </div>
                    <div class="news-item-content">
                        <div class="news-meta">
                            <span><i class="far fa-calendar"></i> ${date}</span>
                            <span><i class="far fa-user"></i> Admin</span>
                            <span><i class="far fa-eye"></i> ${item.views} views</span>
                        </div>
                        <h2><a href="berita-detail.html?id=${item.id}">${item.judul}</a></h2>
                        <p>${excerpt}</p>
                        <a href="berita-detail.html?id=${item.id}" class="read-more">Baca Selengkapnya <i class="fas fa-arrow-right"></i></a>
                    </div>
                </article>
            `;
        });
        publicNewsList.innerHTML = html;
        window.scrollTo({ top: 300, behavior: 'smooth' });
        renderPaginationControls(page);
    }

    function renderPaginationControls(activePage) {
        if (!paginationContainer) return;
        const totalPages = Math.ceil(allNewsData.length / newsPerPage);
        if(totalPages <= 1) { paginationContainer.innerHTML = ''; return; }
        let buttonsHTML = '';
        if(activePage > 1) buttonsHTML += `<a href="#" class="page-link" onclick="changePage(${activePage - 1}); return false;"><i class="fas fa-chevron-left"></i></a>`;
        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === activePage ? 'active' : '';
            buttonsHTML += `<a href="#" class="page-link ${activeClass}" onclick="changePage(${i}); return false;">${i}</a>`;
        }
        if(activePage < totalPages) buttonsHTML += `<a href="#" class="page-link" onclick="changePage(${activePage + 1}); return false;"><i class="fas fa-chevron-right"></i></a>`;
        paginationContainer.innerHTML = buttonsHTML;
    }

    window.changePage = function(pageNumber) {
        currentNewsPage = pageNumber;
        renderNewsPage(pageNumber);
    };

    // Load Sidebar Data (Auto Kategori)
    const catList = document.getElementById('sidebarCategoryList');
    const recentList = document.getElementById('sidebarRecentNews');
    if (catList || recentList) {
        loadSidebarData(catList, recentList);
    }

    function loadSidebarData(catListElement, recentListElement) {
        fetch(API_URL + 'berita/read.php?limit=20')
        .then(res => res.json())
        .then(data => {
            if (catListElement) {
                const categories = {};
                data.forEach(item => {
                    if (item.status === 'published') {
                        const kat = item.kategori.toLowerCase(); 
                        categories[kat] = (categories[kat] || 0) + 1;
                    }
                });
                let catHTML = '';
                for (const [key, count] of Object.entries(categories)) {
                    const label = key.charAt(0).toUpperCase() + key.slice(1);
                    catHTML += `<li><a href="berita.html?kategori=${key}">${label} <span>${count}</span></a></li>`;
                }
                catListElement.innerHTML = catHTML;
            }
            if (recentListElement) {
                let recentHTML = '';
                const recentItems = data.filter(i => i.status === 'published').slice(0, 3);
                recentItems.forEach(item => {
                    const date = new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                    recentHTML += `
                        <div class="recent-item">
                            <img src="${UPLOAD_URL}berita/${item.thumbnail}" loading="lazy" alt="${item.judul}" style="width:80px; height:80px; object-fit:cover; border-radius:8px;" onerror="this.src='https://via.placeholder.com/80x80/eee/999?text=News'">
                            <div class="recent-content">
                                <h4><a href="berita-detail.html?id=${item.id}">${item.judul}</a></h4>
                                <span><i class="far fa-calendar"></i> ${date}</span>
                            </div>
                        </div>
                    `;
                });
                if(recentItems.length === 0) recentHTML = '<small>Belum ada berita terbaru.</small>';
                recentListElement.innerHTML = recentHTML;
            }
        })
        .catch(err => console.error("Gagal memuat sidebar:", err));
    }

    // Load Public Gallery
    const galleryGrid = document.getElementById('publicGalleryGrid');
    if (galleryGrid) {
        fetch(API_URL + 'galeri/read.php?limit=20')
        .then(res => res.json())
        .then(data => {
            let html = '';
            if (data.length === 0) {
                galleryGrid.innerHTML = `<p style="text-align:center;">Belum ada foto.</p>`;
                return;
            }
            data.forEach(item => {
                const category = item.kategori ? item.kategori.toLowerCase() : 'kegiatan';
                html += `
                    <div class="gallery-item" data-category="${category}">
                        <div class="gallery-image">
                            <img src="${UPLOAD_URL}galeri/${item.file_gambar}" loading="lazy" alt="${item.judul}" onerror="this.src='https://via.placeholder.com/400x300'">
                            <div class="gallery-overlay">
                                <div class="gallery-info"><h4>${item.judul}</h4><p>${item.kategori}</p></div>
                                <button class="gallery-zoom" onclick="openModalGallery(this)"><i class="fas fa-search-plus"></i></button>
                            </div>
                        </div>
                    </div>
                `;
            });
            galleryGrid.innerHTML = html;
        });
    }

    // Load Public Prestasi
    const publicPrestasiGrid = document.getElementById('publicPrestasiGrid');
    if (publicPrestasiGrid) {
        fetch(API_URL + 'prestasi/read.php?limit=3')
        .then(res => res.json())
        .then(data => {
            let html = '';
            if(data.length === 0) { publicPrestasiGrid.innerHTML = '<p class="text-center">Belum ada prestasi.</p>'; return; }
            data.forEach(item => {
                html += `
                    <div class="achievement-card">
                        <div style="position: relative; height: 200px;">
                            <img src="${UPLOAD_URL}prestasi/${item.foto}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://via.placeholder.com/400'">
                            <span style="position: absolute; top: 15px; right: 15px; background: #3b82f6; color: white; padding: 5px 12px; border-radius: 20px; font-size: 12px;">${item.tingkat}</span>
                        </div>
                        <div style="padding: 20px;">
                            <h3>${item.judul}</h3>
                            <div class="badge green">${item.peringkat}</div>
                        </div>
                    </div>
                `;
            });
            publicPrestasiGrid.innerHTML = html;
        });
    }

    // ======================================================
    // HELPER FUNCTIONS (LOCAL SCOPE - INSIDE DOMContentLoaded)
    // ======================================================
    // Memindahkan fungsi helper ke dalam agar bisa baca API_URL

    function setupUploadZone(zoneId, inputId, isMultiple, previewId = null) {
        const zone = document.getElementById(zoneId);
        if(!zone) return;
        const input = inputId ? document.getElementById(inputId) : zone.querySelector('input');
        zone.addEventListener('click', () => input.click());
        zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            if(e.dataTransfer.files.length > 0) {
                if(input) input.files = e.dataTransfer.files; 
                handleFiles(e.dataTransfer.files, isMultiple, previewId);
            }
        });
        if(input) input.addEventListener('change', () => { handleFiles(input.files, isMultiple, previewId); });
    }

    function handleFiles(files, isMultiple, previewId) {
        // Cek Ukuran File (Max 2MB per file)
        for(let i=0; i<files.length; i++) {
            if(files[i].size > 2 * 1024 * 1024) {
                showNotification(`File ${files[i].name} terlalu besar! Max 2MB.`, 'error');
                return; // Stop upload
            }
        }

        if (isMultiple) {
            showNotification(`Sedang mengupload ${files.length} foto...`, 'info');
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('files[]', files[i]);
            }
            // GUNAKAN API_URL DINAMIS, JANGAN HARDCODED
            fetch(API_URL + 'galeri/upload.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification(data.message, 'success');
                    setTimeout(() => location.reload(), 1000);
                } else {
                    showNotification('Upload gagal: ' + data.message, 'error');
                }
            })
            .catch(err => {
                console.error(err);
                showNotification('Error koneksi upload', 'error');
            });
        } 
        else if (previewId) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.getElementById(previewId);
                if(img) {
                    img.src = e.target.result;
                    img.classList.remove('hidden');
                    const icon = img.previousElementSibling;
                    if(icon && icon.classList.contains('dz-content')) icon.classList.add('hidden');
                }
            };
            reader.readAsDataURL(files[0]);
        }
    }

}); // END DOMContentLoaded

// ======================================================
// HELPER FUNCTIONS (GLOBAL SCOPE)
// ======================================================

function switchModule(moduleId, element) {
    const modules = document.querySelectorAll('.module-section');
    modules.forEach(mod => mod.style.display = 'none');
    const selected = document.getElementById('modul-' + moduleId);
    if(selected) selected.style.display = 'block';

    const titles = { 'dashboard': 'Dashboard', 'guru': 'Manajemen Guru', 'galeri': 'Manajemen Galeri', 'prestasi': 'Data Prestasi', 'berita': 'Manajemen Berita', 'pengaturan': 'Pengaturan' };
    const pageTitle = document.getElementById('pageTitle');
    if(pageTitle) pageTitle.innerText = titles[moduleId] || 'Dashboard';

    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    if(element) element.classList.add('active');
}

function openModal(id) {
    const el = document.getElementById(id);
    if(el) el.style.display = 'flex';
}

function closeModal(id) {
    const el = document.getElementById(id);
    if(el) el.style.display = 'none';
}

// Gallery Viewer Global
let currentGalleryIndex = 0;
window.changeImage = function(n) {
    const items = document.querySelectorAll('.gallery-item:not([style*="display: none"])');
    if(items.length === 0) return;
    currentGalleryIndex += n;
    if (currentGalleryIndex >= items.length) currentGalleryIndex = 0;
    else if (currentGalleryIndex < 0) currentGalleryIndex = items.length - 1;

    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const currentItem = items[currentGalleryIndex];
    
    if(modalImg && currentItem) {
        modalImg.style.opacity = '0.5';
        setTimeout(() => {
            modalImg.src = currentItem.querySelector('img').src;
            modalImg.style.opacity = '1';
            if(modalCaption) {
                const h4 = currentItem.querySelector('h4');
                const p = currentItem.querySelector('p');
                modalCaption.innerHTML = `<h4>${h4 ? h4.innerText : ''}</h4><p>${p ? p.innerText : ''}</p>`;
            }
        }, 200);
    }
};

window.openModalGallery = function(btn) {
    const modal = document.getElementById('galleryModal');
    const items = Array.from(document.querySelectorAll('.gallery-item')).filter(i => i.style.display !== 'none');
    const clickedItem = btn.closest('.gallery-item');
    currentGalleryIndex = items.indexOf(clickedItem);
    if(modal) {
        modal.classList.add('active');
        window.changeImage(0); 
    }
}