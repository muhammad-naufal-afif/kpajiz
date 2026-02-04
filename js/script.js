// ======================================================
// SD NEGERI 2 BAWANG - MAIN JAVASCRIPT (FINAL FIXED)
// ======================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // ======================================================
    // 0. KONFIGURASI API & GLOBAL
    // ======================================================
    // PENTING: Pastikan nama folder 'kpajiz' sesuai dengan nama folder di htdocs kamu
    // Jika nama foldermu 'sekolah', ganti jadi 'http://localhost/sekolah/'
    const BASE_URL = 'http://localhost/kpajiz/'; 
    const API_URL = BASE_URL + 'api/';
    const UPLOAD_URL = BASE_URL + 'uploads/';
    
    // [PERBAIKAN SIDEBAR] Sesuaikan selector dengan dashboard.html
    const navbar = document.querySelector('.admin-topbar');   // Class .admin-topbar
    const navToggle = document.querySelector('.sidebar-toggle'); // Class .sidebar-toggle
    const navMenu = document.getElementById('adminSidebar');     // ID adminSidebar

    // ======================================================
    // 1. GLOBAL UI (Navbar, Sidebar, Notify)
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

    // Mobile Menu Toggle (SIDEBAR FIX)
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault(); // Mencegah link lari ke atas
            navMenu.classList.toggle('active'); // Munculkan sidebar
            console.log('Sidebar diklik!'); // Cek di console browser
        });
        
        // Tutup sidebar kalau klik di luar (untuk HP)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && navMenu.classList.contains('active')) {
                if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                    navMenu.classList.remove('active');
                }
            }
        });
    } else {
        console.error("ERROR: Tombol Sidebar atau Menu tidak ditemukan di HTML!");
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
    // 2. AUTHENTICATION (LOGIN)
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
            const btn = loginForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Loading...';
            btn.disabled = true;

            fetch(API_URL + 'auth/login.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification('Login berhasil! Mengalihkan...', 'success');
                    localStorage.setItem('user_id', data.data.id);
                    localStorage.setItem('user_name', data.data.nama);
                    localStorage.setItem('user_role', data.data.role);
                    setTimeout(() => window.location.href = 'dashboard.html', 1500);
                } else {
                    showNotification(data.message, 'error');
                }
            })
            .catch(err => {
                console.error(err);
                showNotification('Gagal koneksi ke server. Cek Console.', 'error');
            })
            .finally(() => {
                btn.innerText = originalText;
                btn.disabled = false;
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
    // 3. DASHBOARD LOGIC (INIT)
    // ======================================================

    if (document.querySelector('.admin-content')) {
        // [FIX] Cek elemen dulu baru load data (Anti Error)
        if (document.getElementById('staffPool')) loadGuruData();
        if (document.getElementById('beritaTableBody')) loadBeritaData();
        if (document.getElementById('adminGalleryGrid')) loadGaleriData(); 
        if (document.getElementById('prestasiTableBody')) loadPrestasiData();
        
        // Setup Drag & Drop Uploads
        setupUploadZone('galleryDropzone', 'galleryInput', true); 
        setupUploadZone('guruPhotoDrop', null, false, 'guruPreview'); 
        setupUploadZone('prestasiPhotoDrop', null, false, 'prestasiPreview');
        setupUploadZone('beritaPhotoDrop', null, false, 'beritaPreview');
    }

    // ======================================================
    // 4. MANAJEMEN BERITA
    // ======================================================
    
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
    // 5. MANAJEMEN GURU & STAFF
    // ======================================================

    function loadGuruData() {
        const pool = document.getElementById('staffPool');
        if(!pool) return; // Anti-Error

        fetch(API_URL + 'guru/read.php')
        .then(res => res.json())
        .then(data => {
            // Reset Slot
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

                // Cari Slot Jabatan
                const targetSlot = document.querySelector(`.role-slot[data-slot="${pegawai.jabatan}"]`);
                if (targetSlot) {
                    targetSlot.appendChild(card);
                } else {
                    pool.appendChild(card); // Jika tidak punya jabatan, masuk Pool
                }
            });
        })
        .catch(err => console.error("Gagal load guru:", err));
    }

    function createGuruCard(data) {
        const card = document.createElement('div');
        card.className = 'guru-card draggable';
        card.setAttribute('draggable', 'true');
        card.dataset.id = data.id;
        
        card.innerHTML = `
            <img src="${UPLOAD_URL}guru/${data.foto}" loading="lazy" onerror="this.src='https://via.placeholder.com/60?text=User'">
            <div class="guru-info">
                <strong>${data.nama}</strong>
                <small>${data.nip || '-'}</small>
            </div>
            <div class="card-actions">
                <button onclick="editGuru(${data.id}, '${data.nama}', '${data.nip}', 'Guru')" title="Edit">✏️</button>
                <button onclick="deleteGuru(${data.id}, '${data.nama}')" title="Hapus">🗑️</button>
            </div>
        `;
        addDragEvents(card);
        return card;
    }

    window.saveGuruPositions = function() {
        const updates = [];
        // Scan semua slot jabatan
        document.querySelectorAll('.role-slot').forEach(slot => {
            const jabatanName = slot.getAttribute('data-slot');
            const card = slot.querySelector('.guru-card');
            if (card) {
                updates.push({ id: card.dataset.id, jabatan: jabatanName });
            }
        });
        // Scan pool (reset ke pool)
        document.getElementById('staffPool').querySelectorAll('.guru-card').forEach(card => {
            updates.push({ id: card.dataset.id, jabatan: 'pool' });
        });

        fetch(API_URL + 'guru/update_posisi.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        })
        .then(res => res.json()) // <--- Kalau ini error, berarti file PHP-nya ga ada/salah path
        .then(data => {
            if(data.status === 'success') showNotification('Posisi berhasil disimpan!', 'success');
            else showNotification('Gagal: ' + data.message, 'error');
        })
        .catch(err => {
            console.error(err);
            showNotification('Error Sistem! Cek Console.', 'error');
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
                    // Pindahkan penghuni lama ke pool jika slot sudah isi
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
        loadGuruData();
        setupDragSystem();
    }

    // Modal Create Guru
    const formGuru = document.getElementById('formTambahGuru');
    if (formGuru) {
        formGuru.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(formGuru);
            formData.append('jabatan', 'pool'); // Default jabatan
            const id = formData.get('id');
            const endpoint = id ? 'guru/update.php' : 'guru/create.php';

            fetch(API_URL + endpoint, { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification('Data berhasil disimpan', 'success');
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
            .then(() => {
                showNotification('Pegawai dihapus', 'success');
                loadGuruData();
            });
        }
    };

    // ======================================================
    // 6. MANAJEMEN GALERI
    // ======================================================

    function loadGaleriData() {
        const grid = document.getElementById('adminGalleryGrid');
        if (!grid) return;

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
                html += `
                    <div class="gallery-admin-item" style="position:relative; margin-bottom:15px;">
                        <img src="${UPLOAD_URL}galeri/${item.file_gambar}" 
                            class="img-loading" 
                            loading="lazy" 
                            onload="this.classList.remove('img-loading')" ... >
                        <div style="padding: 10px;">${item.judul}</div>
                        <div style="position:absolute; top:5px; right:5px; display:flex; gap:5px;">
                            <button onclick="editGaleri(${item.id}, '${item.judul}', '${item.kategori}')" style="background:#f59e0b; border:none; border-radius:4px; padding:5px 8px; cursor:pointer;">✏️</button>
                            <button onclick="deleteGaleri(${item.id})" style="background:red; border:none; border-radius:4px; padding:5px 8px; cursor:pointer; color:white;">🗑️</button>
                        </div>
                    </div>
                `;
            });
            grid.innerHTML = html;
        });
    }

    window.editGaleri = function(id, judul, kategori) {
        openModal('modalTambahGaleri');
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

            // Validasi File di Client Side (Biar ga berat di server)
            const fileInput = formGaleri.querySelector('[name="file"]');
            if (!id && fileInput.files.length > 0 && fileInput.files[0].size > 5 * 1024 * 1024) {
                showNotification('File terlalu besar! Maksimal 5MB.', 'error');
                return;
            }

            btn.innerText = 'Memproses...';
            btn.disabled = true;

            fetch(API_URL + endpoint, { method: 'POST', body: formData })
            .then(res => res.text()) // Ubah jadi text() dulu biar bisa debug kalau error PHP
            .then(text => {
                try {
                    const data = JSON.parse(text); // Baru di-parse manual
                    if (data.status === 'success') {
                        showNotification(data.message, 'success');
                        closeModal('modalTambahGaleri');
                        formGaleri.reset();
                        formGaleri.querySelector('[name="id"]').value = "";
                        // Reset preview
                        const preview = document.getElementById('preview-galeri'); // Sesuaikan ID preview kamu
                        if(preview) preview.src = "";
                        
                        loadGaleriData(); 
                    } else {
                        showNotification(data.message || 'Gagal menyimpan data.', 'error');
                    }
                } catch (e) {
                    console.error("Server Error:", text); // Cek console F12 untuk liat error asli
                    showNotification('Terjadi kesalahan server! Cek Console.', 'error');
                }
            })
            .catch(err => { 
                console.error(err); 
                showNotification('Gagal koneksi ke server.', 'error'); 
            })
            .finally(() => { 
                btn.innerText = originalText; 
                btn.disabled = false; 
            });
        });
    }

    window.deleteGaleri = function(id) {
        if (confirm('Hapus foto ini?')) {
            const formData = new FormData();
            formData.append('id', id);
            fetch(API_URL + 'galeri/delete.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification('Foto dihapus', 'success');
                    loadGaleriData(); 
                }
            });
        }
    };

    // ======================================================
    // 7. MANAJEMEN PRESTASI
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
            data.forEach(item => {
                html += `
                    <tr>
                        <td><strong>${item.judul}</strong></td>
                        <td>${item.peringkat}</td>
                        <td>${item.tingkat}</td>
                        <td>${item.tanggal}</td>
                        <td><img src="${UPLOAD_URL}prestasi/${item.foto}" style="width:50px; height:35px; object-fit:cover;"></td>
                        <td>
                            <button onclick="editPrestasi(${item.id}, '${item.judul}', '${item.peringkat}', '${item.tingkat}', '${item.tanggal}')" style="font-size:16px;">✏️</button>
                            <button onclick="deletePrestasi(${item.id})" style="font-size:16px;">🗑️</button>
                        </td>
                    </tr>
                `;
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
            .then(data => {
                if (data.status === 'success') {
                    showNotification('Berhasil disimpan!', 'success');
                    closeModal('modalPrestasi');
                    formPrestasi.reset();
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
    // 8. HALAMAN PUBLIK & SIDEBAR DINAMIS
    // ======================================================
    const publicNewsList = document.getElementById('publicNewsList');
    if (publicNewsList) {
        const urlParams = new URLSearchParams(window.location.search);
        const filterKategori = urlParams.get('kategori');

        fetch(API_URL + 'berita/read.php?limit=20')
        .then(res => res.json())
        .then(data => {
            let news = data.filter(item => item.status === 'published');
            if (filterKategori) {
                news = news.filter(item => item.kategori.toLowerCase() === filterKategori.toLowerCase());
            }
            if(news.length === 0) {
                publicNewsList.innerHTML = '<p style="text-align:center;">Tidak ada berita.</p>';
            } else {
                let html = '';
                news.forEach(item => {
                    html += `
                        <article class="news-item">
                            <div class="news-item-image">
                                <img src="${UPLOAD_URL}berita/${item.thumbnail}" onerror="this.src='https://via.placeholder.com/400'">
                            </div>
                            <div class="news-item-content">
                                <h2><a href="berita-detail.html?id=${item.id}">${item.judul}</a></h2>
                                <p>${item.konten.substring(0, 100)}...</p>
                                <a href="berita-detail.html?id=${item.id}" class="read-more">Baca Selengkapnya</a>
                            </div>
                        </article>
                    `;
                });
                publicNewsList.innerHTML = html;
            }
        });
    }

    // Sidebar Dinamis
    const catList = document.getElementById('sidebarCategoryList');
    const recentList = document.getElementById('sidebarRecentNews');
    if (catList || recentList) {
        fetch(API_URL + 'berita/read.php?limit=10')
        .then(res => res.json())
        .then(data => {
            if (catList) {
                const cats = {};
                data.forEach(i => { if(i.status==='published') cats[i.kategori] = (cats[i.kategori]||0)+1; });
                let html = '';
                for(let c in cats) html += `<li><a href="berita.html?kategori=${c}">${c} <span>${cats[c]}</span></a></li>`;
                catList.innerHTML = html;
            }
            if (recentList) {
                const recent = data.filter(i=>i.status==='published').slice(0,3);
                let html = '';
                recent.forEach(i => {
                    html += `<div class="recent-item"><h4><a href="berita-detail.html?id=${i.id}">${i.judul}</a></h4></div>`;
                });
                recentList.innerHTML = html;
            }
        });
    }

    // ======================================================
    // HELPER FUNCTIONS (LOCAL SCOPE)
    // ======================================================

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
        const validFiles = new FormData();
        let validCount = 0;

        // [FIX UPLOAD] Filter file > 2MB
        for(let i=0; i<files.length; i++) {
            if(files[i].size <= 2 * 1024 * 1024) {
                validFiles.append('files[]', files[i]);
                validCount++;
            } else {
                showNotification(`File ${files[i].name} dilewati (>2MB)`, 'error');
            }
        }

        if (isMultiple && validCount > 0) {
            showNotification(`Mengupload ${validCount} foto...`, 'info');
            fetch(API_URL + 'galeri/upload.php', { method: 'POST', body: validFiles })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification(data.message, 'success');
                    setTimeout(() => location.reload(), 1000);
                } else {
                    showNotification('Upload gagal: ' + data.message, 'error');
                }
            });
        } 
        else if (previewId && files.length > 0) {
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
    // ======================================================
    // 11. HALAMAN PUBLIK: GURU & STAFF (LOGIKA BARU - SIMPLIFIED)
    // ======================================================
    const publicGuruGrid = document.getElementById('publicGuruGrid');
    const publicStaffGrid = document.getElementById('publicStaffGrid');
    const publicHeadmasterContainer = document.getElementById('publicHeadmasterContainer');

    if (publicGuruGrid || publicStaffGrid) {
        loadPublicGuruStaff();
    }

    function loadPublicGuruStaff() {
        fetch(API_URL + 'guru/read.php')
        .then(res => res.json())
        .then(data => {
            // 1. Reset Wadah
            if(publicGuruGrid) publicGuruGrid.innerHTML = '';
            if(publicStaffGrid) publicStaffGrid.innerHTML = '';
            if(publicHeadmasterContainer) publicHeadmasterContainer.innerHTML = '';

            // 2. Daftar Jabatan Wali Kelas (Sederhana: 1-6)
            // Pastikan di Dashboard Admin slot-nya nanti diubah jadi data-slot="1", "2", dst.
            const waliKelasKeys = ['1', '2', '3', '4', '5', '6'];

            // 3. Mapping Nama Jabatan
            const labelJabatan = {
                'kepala_sekolah': 'Kepala Sekolah',
                '1': 'Wali Kelas 1', 
                '2': 'Wali Kelas 2',
                '3': 'Wali Kelas 3',
                '4': 'Wali Kelas 4',
                '5': 'Wali Kelas 5',
                '6': 'Wali Kelas 6'
            };

            let hasKepsek = false;

            data.forEach(person => {
                // === A. KEPALA SEKOLAH ===
                if (person.jabatan === 'kepala_sekolah') {
                    hasKepsek = true;
                    if(document.getElementById('section-kepsek')) {
                        document.getElementById('section-kepsek').style.display = 'block';
                    }
                    
                    if(publicHeadmasterContainer) {
                        publicHeadmasterContainer.innerHTML = `
                            <div class="headmaster-card">
                                <div class="headmaster-image">
                                    <img src="${UPLOAD_URL}guru/${person.foto}" alt="${person.nama}" onerror="this.src='https://via.placeholder.com/300x400?text=Kepsek'">
                                </div>
                                <div class="headmaster-info">
                                    <h3>${person.nama}</h3>
                                    <span class="position">Kepala Sekolah</span>
                                    <div class="info-details">
                                        <div class="detail-item"><i class="fas fa-id-card"></i> <span>NIP: ${person.nip || '-'}</span></div>
                                    </div>
                                </div>
                            </div>`;
                    }
                }
                
                // === B. WALI KELAS (Masuk ke 'Dewan Guru') ===
                else if (waliKelasKeys.includes(person.jabatan)) {
                    let displayJabatan = labelJabatan[person.jabatan];
                    
                    const html = `
                        <div class="teacher-card">
                            <div class="teacher-image">
                                <img src="${UPLOAD_URL}guru/${person.foto}" alt="${person.nama}" onerror="this.src='https://via.placeholder.com/300x350?text=Guru'">
                                <div class="teacher-overlay"></div>
                            </div>
                            <div class="teacher-info">
                                <h4>${person.nama}</h4>
                                <span class="position">${displayJabatan}</span>
                                <p class="subject">NIP: ${person.nip || '-'}</p>
                            </div>
                        </div>`;
                    if(publicGuruGrid) publicGuruGrid.innerHTML += html;
                }

                // === C. TENAGA KEPENDIDIKAN (Staff, Guru Mapel, & Pool) ===
                // Guru Agama, Penjas, dan Staff masuk sini semua
                else {
                    // Cek label jabatan, kalau tidak ada di mapping (kayak guru mapel), pakai 'Guru Mapel / Staff'
                    let displayJabatan = person.posisi_default || 'Tenaga Pendidik';
                    
                    // Icon pembeda: Staff pakai dasi, Guru pakai papan tulis
                    let iconClass = person.kategori === 'Staff' ? 'fa-user-tie' : 'fa-chalkboard-teacher';

                    const html = `
                        <div class="staff-card">
                            <div class="staff-icon">
                                <img src="${UPLOAD_URL}guru/${person.foto}" 
                                     style="width:80px; height:80px; object-fit:cover; border-radius:50%; margin-bottom:10px;" 
                                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
                                <i class="fas ${iconClass}" style="display:none; font-size: 40px; color:var(--primary-color);"></i>
                            </div>
                            <h4>${person.nama}</h4>
                            <p class="position">${displayJabatan}</p>
                        </div>`;
                    if(publicStaffGrid) publicStaffGrid.innerHTML += html;
                }
            });

            // Pesan Kosong
            if (publicGuruGrid && publicGuruGrid.innerHTML === '') {
                publicGuruGrid.innerHTML = '<p class="text-center" style="grid-column:1/-1; color:#777;">Belum ada data Wali Kelas.</p>';
            }
            if (publicStaffGrid && publicStaffGrid.innerHTML === '') {
                publicStaffGrid.innerHTML = '<p class="text-center" style="grid-column:1/-1; color:#777;">Belum ada data Staff/Guru Lainnya.</p>';
            }
        })
        .catch(err => {
            console.error(err);
        });
    }

    // ======================================================
    // 12. HALAMAN DETAIL BERITA (LOAD DARI URL)
    // ======================================================
    const newsDetailContainer = document.getElementById('newsDetailContainer');

    if (newsDetailContainer) {
        loadNewsDetail();
    }

    function loadNewsDetail() {
        // 1. Ambil ID dari URL (contoh: berita-detail.html?id=15)
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (!id) {
            newsDetailContainer.innerHTML = '<div class="alert-box">ID Berita tidak ditemukan.</div>';
            return;
        }

        // 2. Panggil API
        fetch(API_URL + 'berita/read_single.php?id=' + id)
        .then(res => res.json())
        .then(data => {
            // Cek jika data kosong / error
            if (!data || data.message) {
                newsDetailContainer.innerHTML = '<div class="alert-box">Berita tidak ditemukan atau telah dihapus.</div>';
                return;
            }

            // 3. Render HTML
            const date = new Date(data.created_at).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            });

            // Ubah baris baru (\n) menjadi paragraf HTML (<p>)
            const kontenHtml = data.konten
                .split('\n')
                .map(paragraf => paragraf.trim() ? `<p>${paragraf}</p>` : '')
                .join('');

            newsDetailContainer.innerHTML = `
                <div class="news-header">
                    <span class="news-badge large">${data.kategori}</span>
                    <h1>${data.judul}</h1>
                    <div class="news-meta">
                        <span><i class="far fa-calendar"></i> ${date}</span>
                        <span><i class="far fa-user"></i> Admin</span>
                        <span><i class="far fa-eye"></i> ${data.views} Views</span>
                    </div>
                </div>

                <div class="news-featured-image">
                    <img src="${UPLOAD_URL}berita/${data.thumbnail}" 
                         alt="${data.judul}" 
                         loading="lazy"
                         onerror="this.src='https://via.placeholder.com/800x400?text=No+Image'">
                </div>

                <div class="news-content">
                    ${kontenHtml}
                </div>
                
                <div class="news-footer-share">
                    <span>Bagikan:</span>
                    <div class="social-share">
                        <a href="https://wa.me/?text=${encodeURIComponent(data.judul + ' ' + window.location.href)}" target="_blank" class="share-btn wa"><i class="fab fa-whatsapp"></i></a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank" class="share-btn fb"><i class="fab fa-facebook-f"></i></a>
                    </div>
                </div>
            `;
            
            // Update Judul Tab Browser
            document.title = data.judul + " - SD NEGERI 2 BAWANG";
        })
        .catch(err => {
            console.error(err);
            newsDetailContainer.innerHTML = '<div class="alert-box error">Gagal memuat berita. Periksa koneksi internet.</div>';
        });
    }

    // ======================================================
    // 13. HALAMAN PUBLIK: GALERI (MISSING LOGIC FIXED)
    // ======================================================
    const publicGalleryGrid = document.getElementById('publicGalleryGrid');
    
    // Cek apakah kita sedang di halaman galeri
    if (publicGalleryGrid) {
        loadPublicGallery();
    }

    function loadPublicGallery() {
        // Tampilkan loading spinner biar user tau proses berjalan
        publicGalleryGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 30px; color: #ccc;"></i>
                <p>Memuat foto...</p>
            </div>
        `;

        fetch(API_URL + 'galeri/read.php')
        .then(res => res.json())
        .then(data => {
            // Cek jika data kosong
            if (!data || data.length === 0) {
                publicGalleryGrid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                        <i class="far fa-images" style="font-size: 50px; color: #ddd;"></i>
                        <p style="margin-top:10px;">Belum ada foto di galeri.</p>
                    </div>
                `;
                return;
            }

            // Render Foto
            let html = '';
            data.forEach(item => {
                // Pastikan kategori lowercase biar filter jalan (misal: "Kegiatan" jadi "kegiatan")
                const kat = item.kategori ? item.kategori.toLowerCase() : 'umum';
                
                html += `
                    <div class="gallery-item" data-category="${kat}" onclick="openGalleryModal('${UPLOAD_URL}galeri/${item.file_gambar}')">
                        <img src="${UPLOAD_URL}galeri/${item.file_gambar}" loading="lazy" alt="${item.judul}">
                        <div class="gallery-overlay">
                            <h4>${item.judul}</h4>
                            <span>${item.kategori}</span>
                        </div>
                    </div>
                `;
            });
            publicGalleryGrid.innerHTML = html;

            // Aktifkan Filter Tombol
            initGalleryFilter();
        })
        .catch(err => {
            console.error("Galeri Error:", err);
            publicGalleryGrid.innerHTML = '<p style="text-align:center; width:100%;">Gagal memuat galeri.</p>';
        });
    }

    function initGalleryFilter() {
        const btns = document.querySelectorAll('.filter-btn');
        const items = document.querySelectorAll('.gallery-item');

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Reset tombol aktif
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');
                
                items.forEach(item => {
                    // Logika Filter: Tampilkan jika 'all' ATAU kategorinya cocok
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // ======================================================
    // 14. HOMEPAGE: PRESTASI & BERITA DINAMIS
    // ======================================================
    const homePrestasiGrid = document.getElementById('homePrestasiGrid');
    const homeBeritaGrid = document.getElementById('homeBeritaGrid');

    if (homePrestasiGrid || homeBeritaGrid) {
        loadHomeData();
    }

    function loadHomeData() {
        // A. LOAD PRESTASI (Ambil 3 Teratas)
        if (homePrestasiGrid) {
            fetch(API_URL + 'prestasi/read.php?limit=3')
            .then(res => res.json())
            .then(data => {
                if (!data || data.length === 0) {
                    homePrestasiGrid.innerHTML = '<p class="text-center" style="width:100%">Belum ada data prestasi.</p>';
                } else {
                    let html = '';
                    data.forEach(item => {
                        // LOGIKA WARNA BADGE
                        let badgeClass = 'blue'; // Default
                        const tingkat = item.tingkat.toLowerCase();
                        if (tingkat.includes('nasional')) badgeClass = 'red';
                        else if (tingkat.includes('provinsi')) badgeClass = 'purple';
                        else if (tingkat.includes('kabupaten')) badgeClass = 'green';
                        else if (tingkat.includes('kecamatan')) badgeClass = 'orange';

                        html += `
                            <div class="achievement-item">
                                <div class="achievement-img">
                                    <img src="${UPLOAD_URL}prestasi/${item.foto}" loading="lazy" alt="${item.judul}" onerror="this.src='https://via.placeholder.com/300x200?text=Prestasi'">
                                </div>
                                <div class="achievement-content">
                                    <span class="badge ${badgeClass}">${item.tingkat}</span>
                                    <h4>${item.judul}</h4>
                                    <p class="rank"><i class="fas fa-trophy"></i> ${item.peringkat}</p>
                                </div>
                            </div>
                        `;
                    });
                    homePrestasiGrid.innerHTML = html;
                }
            })
            .catch(err => console.error("Gagal load prestasi home:", err));
        }

        // B. LOAD BERITA (Ambil 3 Teratas)
        if (homeBeritaGrid) {
            fetch(API_URL + 'berita/read.php?limit=3')
            .then(res => res.json())
            .then(data => {
                // Filter status published, ambil 3
                const news = data.filter(d => d.status === 'published').slice(0, 3);
                
                if (news.length === 0) {
                    homeBeritaGrid.innerHTML = '<p class="text-center" style="width:100%">Belum ada berita terbaru.</p>';
                } else {
                    let html = '';
                    news.forEach(item => {
                        // Format Tanggal
                        const date = new Date(item.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric'
                        });
                        // Potong konten biar pendek
                        const excerpt = item.konten.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...';

                        html += `
                            <div class="blog-card">
                                <div class="blog-img">
                                    <img src="${UPLOAD_URL}berita/${item.thumbnail}" loading="lazy" alt="${item.judul}" onerror="this.src='https://via.placeholder.com/400x250?text=Berita'">
                                    <span class="blog-cat">${item.kategori}</span>
                                </div>
                                <div class="blog-content">
                                    <div class="blog-meta">
                                        <span><i class="far fa-calendar"></i> ${date}</span>
                                        <span><i class="far fa-user"></i> Admin</span>
                                    </div>
                                    <h3><a href="berita-detail.html?id=${item.id}">${item.judul}</a></h3>
                                    <p>${excerpt}</p>
                                    <a href="berita-detail.html?id=${item.id}" class="read-more">Baca Selengkapnya <i class="fas fa-arrow-right"></i></a>
                                </div>
                            </div>
                        `;
                    });
                    homeBeritaGrid.innerHTML = html;
                }
            })
            .catch(err => console.error("Gagal load berita home:", err));
        }
    }

    // ======================================================
    // 9. FITUR KONTAK (PESAN MASUK)
    // ======================================================
    
    // A. LOGIKA PENGUNJUNG (Kirim Pesan)
    const formKontak = document.getElementById('formKontak');
    if (formKontak) {
        formKontak.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = formKontak.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Mengirim... <i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;

            const formData = new FormData(formKontak);

            fetch(API_URL + 'pesan/create.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    // Gunakan alert biasa atau custom modal kalau di halaman publik
                    alert("Terima kasih! Pesan Anda telah terkirim.");
                    formKontak.reset();
                } else {
                    alert("Gagal mengirim pesan: " + data.message);
                }
            })
            .catch(err => {
                console.error(err);
                alert("Terjadi kesalahan koneksi.");
            })
            .finally(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            });
        });
    }

    // B. LOGIKA ADMIN (Baca & Hapus Pesan)
    // Tambahkan 'pesan' ke switchModule helper title map nanti
    window.loadPesanData = function() {
        const tbody = document.getElementById('pesanTableBody');
        if (!tbody) return;

        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Memuat pesan...</td></tr>';

        fetch(API_URL + 'pesan/read.php')
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">Belum ada pesan masuk.</td></tr>';
                return;
            }

            let html = '';
            data.forEach(item => {
                // Format Tanggal
                const date = new Date(item.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                });

                html += `
                    <tr>
                        <td style="white-space:nowrap; font-size:12px; color:#666;">${date}</td>
                        <td>
                            <strong>${item.nama}</strong><br>
                            <small class="text-muted">${item.email}</small><br>
                            <small class="text-muted">${item.telepon || ''}</small>
                        </td>
                        <td>${item.subjek}</td>
                        <td><p style="font-size:13px; max-width:300px;">${item.pesan}</p></td>
                        <td>
                            <button class="btn-icon" onclick="deletePesan(${item.id})" title="Hapus" style="color:red;">
                                <i class="fas fa-trash"></i>
                            </button>
                            <a href="mailto:${item.email}?subject=Re: ${item.subjek}" class="btn-icon" title="Balas via Email" style="color:blue;">
                                <i class="fas fa-reply"></i>
                            </a>
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;
        })
        .catch(err => console.error(err));
    };

    window.deletePesan = function(id) {
        if (confirm('Hapus pesan ini?')) {
            const formData = new FormData();
            formData.append('id', id);
            fetch(API_URL + 'pesan/delete.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification('Pesan dihapus', 'success');
                    loadPesanData();
                } else {
                    showNotification('Gagal menghapus pesan', 'error');
                }
            });
        }
    };

    // ======================================================
    // 15. PENGATURAN (TAMBAH ADMIN & GANTI PASS)
    // ======================================================

    // A. TAMBAH ADMIN
    const formAdmin = document.getElementById('formTambahAdmin');
    if (formAdmin) {
        formAdmin.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(formAdmin);

            fetch(API_URL + 'auth/register.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification(data.message, 'success');
                    formAdmin.reset();
                } else {
                    showNotification(data.message, 'error');
                }
            })
            .catch(err => console.error(err));
        });
    }

    // B. GANTI PASSWORD
    const formPass = document.getElementById('formGantiPassword');
    if (formPass) {
        formPass.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(formPass);
            const newPass = formData.get('new_password');
            const confirmPass = document.getElementById('confirm_password').value;
            const userId = localStorage.getItem('user_id'); // AMBIL ID DARI SINI

            if (!userId) {
                showNotification('Error: Sesi login tidak valid. Silakan login ulang.', 'error');
                return;
            }

            if (newPass !== confirmPass) {
                showNotification('Konfirmasi password tidak cocok!', 'error');
                return;
            }

            formData.append('id', userId); // Kirim ID user

            fetch(API_URL + 'auth/change_password.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification('Password berhasil diubah! Silakan login ulang.', 'success');
                    formPass.reset();
                    setTimeout(() => {
                        localStorage.clear();
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    showNotification(data.message, 'error');
                }
            })
            .catch(err => console.error(err));
        });
    }

    // ======================================================
    // 15. PENGATURAN (TAMBAH, GANTI PASS, & LIST ADMIN)
    // ======================================================

    // A. LOAD DAFTAR ADMIN
    window.loadAdminData = function() {
        const tbody = document.getElementById('adminTableBody');
        if (!tbody) return;

        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Memuat data...</td></tr>';

        fetch(API_URL + 'auth/read_users.php')
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center">Tidak ada data.</td></tr>';
                return;
            }

            let html = '';
            let no = 1;
            const currentUserId = localStorage.getItem('user_id'); // ID kita sendiri

            data.forEach(user => {
                // Cegah tombol hapus muncul di akun sendiri
                const isMe = (user.id == currentUserId);
                const deleteBtn = isMe 
                    ? '<span class="badge blue">Anda</span>' 
                    : `<button class="btn-icon" onclick="deleteAdmin(${user.id}, '${user.nama}')" style="color:red;"><i class="fas fa-trash"></i></button>`;

                html += `
                    <tr>
                        <td>${no++}</td>
                        <td><strong>${user.nama}</strong></td>
                        <td>${user.username}</td>
                        <td><span class="badge purple">${user.role}</span></td>
                        <td>${user.created_at}</td>
                        <td>${deleteBtn}</td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;
        });
    }

    // B. HAPUS ADMIN
    window.deleteAdmin = function(id, nama) {
        if (confirm(`Yakin ingin menghapus admin "${nama}"? Dia tidak akan bisa login lagi.`)) {
            const formData = new FormData();
            formData.append('id', id);

            fetch(API_URL + 'auth/delete_user.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification('Admin berhasil dihapus', 'success');
                    loadAdminData(); // Refresh tabel
                } else {
                    showNotification(data.message, 'error');
                }
            });
        }
    }

    // C. TAMBAH ADMIN (Existing code + Reload Table)
    const formAdmin = document.getElementById('formTambahAdmin');
    if (formAdmin) {
        formAdmin.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(formAdmin);

            fetch(API_URL + 'auth/register.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification(data.message, 'success');
                    formAdmin.reset();
                    loadAdminData(); // <--- Refresh tabel setelah nambah
                } else {
                    showNotification(data.message, 'error');
                }
            });
        });
    }

    // D. GANTI PASSWORD (Existing code...)
    // (Biarkan kode ganti password yang sebelumnya tetap disitu)

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

    // Tambahkan ini di dalam switchModule atau onclick di HTML
    if (moduleId === 'pesan') {
        loadPesanData();
    }

    // Tambahkan ini di dalam switchModule
    if (moduleId === 'pengaturan') {
        if(typeof loadAdminData === 'function') loadAdminData();
    }
}

function openModal(id) {
    const el = document.getElementById(id);
    if(el) el.style.display = 'flex';
}

function closeModal(id) {
    const el = document.getElementById(id);
    if(el) el.style.display = 'none';
}

// Tambahkan di paling bawah file script.js (Global Scope)
window.openGalleryModal = function(src) {
    const modal = document.getElementById('galleryModal');
    const img = document.getElementById('modalImage');
    if(modal && img) {
        img.src = src;
        modal.classList.add('active');
        modal.style.display = 'flex'; // Paksa display flex
    }
}

window.closeGalleryModal = function() {
    const modal = document.getElementById('galleryModal');
    if(modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
}

// ==========================================
// LOGIKA SLIDER OTOMATIS (YANG KAMU SUKA)
// ==========================================
let slideIndex = 1;
// Cek apakah ada elemen slider di halaman ini
if (document.querySelector('.hero-slide')) {
    showSlides(slideIndex);

    // Fungsi Timer Otomatis (5 Detik)
    setInterval(function() {
        plusSlides(1);
    }, 5000);
}

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("hero-slide");
    let dots = document.getElementsByClassName("hero-dot");
    
    if (n > slides.length) {slideIndex = 1}    
    if (n < 1) {slideIndex = slides.length}
    
    // Sembunyikan semua slide
    for (i = 0; i < slides.length; i++) {
        slides[i].style.opacity = "0";
        slides[i].classList.remove("active"); 
    }
    
    // Matikan semua dot
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    // Munculkan slide aktif
    slides[slideIndex-1].style.opacity = "1";
    slides[slideIndex-1].classList.add("active");
    
    // Aktifkan dot
    if (dots.length > 0) {
        dots[slideIndex-1].className += " active";
    }
}

// Update variable titles di dalam function switchModule
const titles = { 
    'dashboard': 'Dashboard', 
    'guru': 'Manajemen Guru', 
    'galeri': 'Manajemen Galeri', 
    'prestasi': 'Data Prestasi', 
    'berita': 'Manajemen Berita', 
    'pesan': 'Kotak Masuk', // <--- TAMBAHAN BARU
    'pengaturan': 'Pengaturan' 
};