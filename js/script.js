// ======================================================
// SD NEGERI 2 BAWANG - MAIN JAVASCRIPT (FINAL INTEGRATED)
// ======================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // ======================================================
    // 0. KONFIGURASI API & GLOBAL
    // ======================================================
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

    // Scroll Reveal Animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.info-card, .news-card, .facility-card, .extra-card, .teacher-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

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

    // Gallery Filter
    // ======================================================
    // PERBAIKAN: GALLERY FILTER (LOGIKA REAL-TIME)
    // ======================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    if (filterBtns.length > 0) {
        // Kita tidak mendefinisikan galleryItems di luar sini,
        // karena itemnya belum ada (sedang loading).
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 1. Atur tombol aktif visual
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // 2. Ambil kategori yang dipilih (misal: 'prestasi')
                const filterValue = btn.getAttribute('data-filter');

                // 3. CARI ITEM FOTO SEKARANG (PENTING!)
                // Kita cari elemen .gallery-item tepat saat tombol diklik
                // supaya foto yang baru diload dari database terdeteksi.
                const dynamicItems = document.querySelectorAll('.gallery-item');

                dynamicItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    // Logika Show/Hide
                    if (filterValue === 'all' || itemCategory === filterValue) {
                        // Tampilkan
                        item.style.display = 'block';
                        // Timeout kecil untuk efek transisi
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        // Sembunyikan
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

    // Lupa Password (Login Page)
    const forgotLink = document.querySelector('.forgot-password');
    if(forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Silakan hubungi Tim IT / Developer untuk mereset password Super Admin Anda.\n\nEmail Support: it@sekolah.sch.id');
        });
    }

    // ======================================================
    // 4. ADMIN: DASHBOARD LOGIC
    // ======================================================

    // Cek apakah di halaman dashboard
    if (document.querySelector('.admin-content')) {
        loadGuruData();
        loadBeritaData();
        loadGaleriData(); // Aktifkan jika API sudah siap
        
        // Setup Drag & Drop Uploads
        setupUploadZone('galleryDropzone', 'galleryInput', true); 
        setupUploadZone('guruPhotoDrop', null, false, 'guruPreview'); 
        setupUploadZone('prestasiPhotoDrop', null, false, 'prestasiPreview');
        setupUploadZone('beritaPhotoDrop', null, false, 'beritaPreview');
    }

    // --- A. LOGIKA DATA BERITA ---
    function loadBeritaData() {
        const tbody = document.querySelector('#modul-berita tbody');
        if (!tbody) return;

        fetch(API_URL + 'berita/read.php')
            .then(res => res.json())
            .then(data => {
                let html = '';
                data.forEach(item => {
                    const badgeClass = item.status === 'published' ? 'green' : 'orange';
                    html += `
                        <tr>
                            <td><img src="${UPLOAD_URL}berita/${item.thumbnail}" style="width: 80px; height: 50px; object-fit: cover; border-radius: 6px;" onerror="this.src='https://via.placeholder.com/80x50'"></td>
                            <td><strong>${item.judul}</strong><div style="font-size: 11px; color: #888;">Views: ${item.views}</div></td>
                            <td><span class="badge blue">${item.kategori}</span></td>
                            <td>Admin</td>
                            <td>${item.created_at}</td>
                            <td><span class="badge ${badgeClass}">${item.status}</span></td>
                            <td>
                                <button class="btn-icon" onclick="deleteBerita(${item.id})"><i class="fas fa-trash"></i></button>
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

    // --- B. LOGIKA SIMPAN BERITA ---
    const formBerita = document.getElementById('formTambahBerita'); 
    if (formBerita) {
        formBerita.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(formBerita);
            const fileInput = document.getElementById('beritaPhotoInput');
            if(fileInput && fileInput.files[0]) {
                formData.append('thumbnail', fileInput.files[0]);
            }

            fetch(API_URL + 'berita/create.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification('Berita berhasil diterbitkan!', 'success');
                    closeModal('modalBerita');
                    loadBeritaData();
                    formBerita.reset();
                } else {
                    showNotification('Gagal: ' + data.message, 'error');
                }
            });
        });
    }

    // --- C. LOGIKA GURU (Drag & Drop Jabatan) ---
    function loadGuruData() {
        fetch(API_URL + 'guru/read.php')
        .then(res => res.json())
        .then(data => {
            console.log("Data Guru Loaded:", data);
            // Disini bisa ditambahkan logika render kartu guru ke 'staffPool' jika ingin dinamis
        });
    }

    const btnSimpanPosisi = document.querySelector('#modul-guru .action-btn.green');
    if (btnSimpanPosisi) {
        btnSimpanPosisi.addEventListener('click', () => {
            const positions = [];
            document.querySelectorAll('.role-slot').forEach(slot => {
                const roleName = slot.getAttribute('data-role');
                const card = slot.querySelector('.guru-card');
                if (card) {
                    const guruId = card.id.replace('guru-', '');
                    positions.push({ posisi: roleName, guru_id: guruId });
                } else {
                    positions.push({ posisi: roleName, guru_id: null });
                }
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

    // Init Drag & Drop Events
    const draggables = document.querySelectorAll('.draggable');
    const slots = document.querySelectorAll('.role-slot, .staff-pool');

    draggables.forEach(drag => {
        drag.addEventListener('dragstart', () => drag.classList.add('dragging'));
        drag.addEventListener('dragend', () => drag.classList.remove('dragging'));
    });

    slots.forEach(slot => {
        slot.addEventListener('dragover', e => {
            e.preventDefault();
            slot.classList.add('drag-over');
        });
        slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
        slot.addEventListener('drop', e => {
            e.preventDefault();
            slot.classList.remove('drag-over');
            const draggable = document.querySelector('.dragging');
            if (draggable) {
                if(slot.classList.contains('role-slot') && slot.querySelectorAll('.guru-card').length > 0) {
                    const existing = slot.querySelector('.guru-card');
                    document.getElementById('staffPool').appendChild(existing);
                }
                slot.appendChild(draggable);
            }
        });
    });

    // --- D. LOGIKA PENGATURAN (Ganti Password) ---
    const btnUpdatePass = document.querySelector('#modul-pengaturan .btn-primary'); 
    if(btnUpdatePass) {
        btnUpdatePass.addEventListener('click', (e) => {
            e.preventDefault();
            const inputs = btnUpdatePass.closest('form').querySelectorAll('input');
            const oldPass = inputs[0].value;
            const newPass = inputs[1].value;

            if(oldPass === '' || newPass === '') {
                showNotification('Harap isi semua kolom password!', 'error');
                return;
            }
            if(newPass.length < 6) {
                showNotification('Password baru minimal 6 karakter!', 'error');
                return;
            }

            // Simulasi Kirim (Nanti ganti fetch ke change-password.php)
            btnUpdatePass.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
            setTimeout(() => {
                showNotification('Password berhasil diperbarui!', 'success');
                btnUpdatePass.innerHTML = 'Update Password';
                inputs[0].value = '';
                inputs[1].value = '';
            }, 1500);
        });
    }

    // Reset User Password (oleh Admin)
    window.resetUserPassword = function(username) {
        if(confirm('Reset password untuk user: ' + username + ' menjadi default (guru123)?')) {
            showNotification('Memproses reset...', 'info');
            setTimeout(() => {
                showNotification('Sukses! Password direset.', 'success');
            }, 1500);
        }
    }

    // Sidebar Toggle
    const adminSidebar = document.getElementById('adminSidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (adminSidebar && sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            adminSidebar.classList.toggle('active');
        });
    }

    // Animate Stats
    const statElements = document.querySelectorAll('.stat-info h3');
    if (statElements.length > 0) {
        statElements.forEach(el => {
            const val = parseInt(el.textContent.replace(/,/g, ''));
            if (!isNaN(val)) {
                el.textContent = '0';
                let start = 0;
                const duration = 1500;
                const step = (ts) => {
                    if (!start) start = ts;
                    const prog = Math.min((ts - start) / duration, 1);
                    el.textContent = Math.floor(prog * val);
                    if (prog < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
            }
        });
    }

    // Fade Out Loading
    document.body.style.opacity = '1';
    // ======================================================
    // 7. HALAMAN PUBLIK: LOAD BERITA DENGAN PAGINATION
    // ======================================================
    
    const publicNewsList = document.getElementById('publicNewsList');
    const paginationContainer = document.getElementById('paginationContainer');
    
    // Konfigurasi Pagination
    let currentNewsPage = 1;
    const newsPerPage = 5; // Ubah angka ini jika ingin jumlah berita per halaman berbeda
    let allNewsData = []; 

    // Cek apakah kita sedang di halaman berita
    if (publicNewsList) {
        loadPublicNews();
    }

    function loadPublicNews() {
        const urlParams = new URLSearchParams(window.location.search);
        const filterKategori = urlParams.get('kategori');

        fetch(API_URL + 'berita/read.php')
        .then(res => res.json())
        .then(data => {
            // 1. Filter Data (Hanya Published)
            let publishedNews = data.filter(item => item.status === 'published');

            // 2. Filter Kategori (Jika ada)
            if (filterKategori) {
                publishedNews = publishedNews.filter(item => item.kategori.toLowerCase() === filterKategori.toLowerCase());
                
                const pageTitle = document.querySelector('.page-header h1');
                if(pageTitle) pageTitle.innerText = 'Kategori: ' + filterKategori.toUpperCase();
            }

            // 3. Simpan ke variabel global untuk dipotong-potong nanti
            allNewsData = publishedNews;

            // 4. Cek kekosongan
            if(allNewsData.length === 0) {
                publicNewsList.innerHTML = `
                    <div style="text-align:center; padding: 40px; width:100%;">
                        <p>Tidak ada berita ditemukan.</p>
                        ${filterKategori ? '<a href="berita.html" class="btn btn-sm btn-outline">Lihat Semua</a>' : ''}
                    </div>`;
                if(paginationContainer) paginationContainer.innerHTML = ''; 
                return;
            }

            // 5. Render Halaman Pertama
            renderNewsPage(currentNewsPage);
        })
        .catch(err => {
            console.error(err);
            publicNewsList.innerHTML = '<p style="text-align:center; color:red;">Gagal memuat berita.</p>';
        });
    }

    // --- FUNGSI RENDER ITEM BERITA (POTONG ARRAY) ---
    function renderNewsPage(page) {
        const start = (page - 1) * newsPerPage;
        const end = start + newsPerPage;
        const pageItems = allNewsData.slice(start, end);
        
        let html = '';
        pageItems.forEach(item => {
            const date = new Date(item.created_at).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
            const plainText = item.konten.replace(/<[^>]*>?/gm, ''); 
            const excerpt = plainText.substring(0, 150) + '...';

            html += `
                <article class="news-item">
                    <div class="news-item-image">
                        <img src="${UPLOAD_URL}berita/${item.thumbnail}" alt="${item.judul}"
                             onerror="this.src='https://via.placeholder.com/800x450/3498DB/ffffff?text=No+Image'">
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
                        <a href="berita-detail.html?id=${item.id}" class="read-more">
                            Baca Selengkapnya <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </article>
            `;
        });

        publicNewsList.innerHTML = html;
        window.scrollTo({ top: 300, behavior: 'smooth' });
        renderPaginationControls(page);
    }

    // --- FUNGSI RENDER TOMBOL PAGINATION ---
    function renderPaginationControls(activePage) {
        if (!paginationContainer) return;

        const totalPages = Math.ceil(allNewsData.length / newsPerPage);
        
        if(totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let buttonsHTML = '';

        // Tombol Previous
        if(activePage > 1) {
            buttonsHTML += `<a href="#" class="page-link" onclick="changePage(${activePage - 1}); return false;"><i class="fas fa-chevron-left"></i></a>`;
        }

        // Tombol Angka
        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === activePage ? 'active' : '';
            buttonsHTML += `<a href="#" class="page-link ${activeClass}" onclick="changePage(${i}); return false;">${i}</a>`;
        }

        // Tombol Next
        if(activePage < totalPages) {
            buttonsHTML += `<a href="#" class="page-link" onclick="changePage(${activePage + 1}); return false;"><i class="fas fa-chevron-right"></i></a>`;
        }

        paginationContainer.innerHTML = buttonsHTML;
    }

    // Helper Global untuk onclick di HTML
    window.changePage = function(pageNumber) {
        currentNewsPage = pageNumber;
        renderNewsPage(pageNumber);
    };
    // ======================================================
    // 8. HALAMAN DETAIL BERITA
    // ======================================================
    
    const newsDetailContainer = document.getElementById('newsDetailContainer');
    
    if (newsDetailContainer) {
        // Ambil ID dari URL (contoh: berita-detail.html?id=5)
        const urlParams = new URLSearchParams(window.location.search);
        const newsId = urlParams.get('id');

        if (newsId) {
            fetch(API_URL + 'berita/read_single.php?id=' + newsId) // Kita butuh API baru ini
            .then(res => res.json())
            .then(item => {
                if(item.status === 'error') {
                    newsDetailContainer.innerHTML = '<p class="text-center">Berita tidak ditemukan.</p>';
                    return;
                }

                const date = new Date(item.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                });

                newsDetailContainer.innerHTML = `
                    <div class="news-detail-header">
                        <span class="news-category-badge">${item.kategori}</span>
                        <h1>${item.judul}</h1>
                        <div class="news-meta">
                            <span><i class="far fa-calendar"></i> ${date}</span>
                            <span><i class="far fa-user"></i> Admin</span>
                            <span><i class="far fa-eye"></i> ${item.views} views</span>
                        </div>
                    </div>

                    <div class="news-detail-image">
                        <img src="${UPLOAD_URL}berita/${item.thumbnail}" alt="${item.judul}" onerror="this.src='https://via.placeholder.com/1200x600/3498DB/ffffff?text=No+Image'">
                    </div>

                    <div class="news-detail-content">
                        ${item.konten} 
                    </div>
                    
                    <div style="margin-top:30px;">
                        <a href="berita.html" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Kembali ke Berita</a>
                    </div>
                `;
            });
        }
    }
    // ======================================================
    // 9. SIDEBAR DINAMIS (Kategori & Recent News)
    // ======================================================
    
    // Cek apakah ada sidebar di halaman ini
    if (document.getElementById('sidebarCategoryList')) {
        loadSidebarData();
    }

    function loadSidebarData() {
        fetch(API_URL + 'berita/read.php')
        .then(res => res.json())
        .then(data => {
            // --- A. LOGIKA KATEGORI & COUNTER ---
            const categories = {
                'kegiatan': 0,
                'prestasi': 0,
                'pengumuman': 0,
                'artikel': 0
            };

            // Hitung jumlah per kategori
            data.forEach(item => {
                // Pastikan kategori lowercase agar cocok dengan key
                const kat = item.kategori.toLowerCase(); 
                if (categories[kat] !== undefined && item.status === 'published') {
                    categories[kat]++;
                }
            });

            // Render List Kategori
            const catList = document.getElementById('sidebarCategoryList');
            let catHTML = '';
            
            // Mapping nama label agar lebih rapi (huruf besar)
            const labels = {
                'kegiatan': 'Kegiatan Sekolah',
                'prestasi': 'Prestasi',
                'pengumuman': 'Pengumuman',
                'artikel': 'Artikel'
            };

            for (const [key, count] of Object.entries(categories)) {
                catHTML += `
                    <li>
                        <a href="berita.html?kategori=${key}">
                            ${labels[key] || key} 
                            <span>${count}</span>
                        </a>
                    </li>
                `;
            }
            catList.innerHTML = catHTML;


            // --- B. LOGIKA BERITA TERBARU (RECENT NEWS) ---
            const recentList = document.getElementById('sidebarRecentNews');
            let recentHTML = '';

            // Ambil 3 berita teratas (data sudah urut DESC dari backend)
            const recentItems = data.filter(i => i.status === 'published').slice(0, 3);

            recentItems.forEach(item => {
                const date = new Date(item.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric'
                });

                recentHTML += `
                    <div class="recent-item">
                        <img src="${UPLOAD_URL}berita/${item.thumbnail}" 
                             alt="${item.judul}" 
                             onerror="this.src='https://via.placeholder.com/80x80/eee/999?text=News'">
                        <div class="recent-content">
                            <h4><a href="berita-detail.html?id=${item.id}">${item.judul}</a></h4>
                            <span><i class="far fa-calendar"></i> ${date}</span>
                        </div>
                    </div>
                `;
            });

            if(recentItems.length === 0) {
                recentHTML = '<small>Belum ada berita terbaru.</small>';
            }
            
            recentList.innerHTML = recentHTML;
        })
        .catch(err => console.error("Gagal memuat sidebar:", err));
    }

    // --- C. FUNGSI PENCARIAN BERITA ---
    window.searchNews = function(form) {
        const query = form.querySelector('input').value.toLowerCase();
        // Redirect ke halaman berita dengan parameter search
        // (Logika filter di halaman berita perlu penyesuaian jika ingin search client-side)
        alert("Fitur pencarian: " + query + " (Akan dikembangkan lebih lanjut)");
    };
    // ======================================================
    // 10. HALAMAN GALERI PUBLIK (Dinamis)
    // ======================================================
    
    const galleryGrid = document.getElementById('publicGalleryGrid');
    
    // Cek apakah kita di halaman galeri
    if (galleryGrid) {
        loadPublicGallery();
    }

    function loadPublicGallery() {
        fetch(API_URL + 'galeri/read.php')
        .then(res => res.json())
        .then(data => {
            let html = '';

            if (data.length === 0) {
                galleryGrid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 50px;">
                        <i class="fas fa-images" style="font-size: 40px; color: #ccc; margin-bottom:10px;"></i>
                        <p>Belum ada foto di galeri.</p>
                    </div>`;
                return;
            }

            data.forEach(item => {
                // Pastikan kategori lowercase agar filter berfungsi
                const category = item.kategori ? item.kategori.toLowerCase() : 'kegiatan';
                
                html += `
                    <div class="gallery-item" data-category="${category}">
                        <div class="gallery-image">
                            <img src="${UPLOAD_URL}galeri/${item.file_gambar}" 
                                 alt="${item.judul || 'Galeri Foto'}" 
                                 loading="lazy"
                                 onerror="this.src='https://via.placeholder.com/400x300/3498DB/ffffff?text=No+Image'">
                            
                            <div class="gallery-overlay">
                                <div class="gallery-info">
                                    <h4>${item.judul || 'Dokumentasi Sekolah'}</h4>
                                    <p>${item.kategori || 'Umum'}</p>
                                </div>
                                <button class="gallery-zoom" onclick="openModalGallery(this)">
                                    <i class="fas fa-search-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });

            galleryGrid.innerHTML = html;
        })
        .catch(err => {
            console.error(err);
            galleryGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Gagal memuat galeri.</p>';
        });
    }
    // ======================================================
    // 11. MANAJEMEN GALERI (DASHBOARD)
    // ======================================================

    // --- A. LOAD DATA GALERI ADMIN ---
    // ======================================================
    // LOGIKA GALERI DASHBOARD (REVISI)
    // ======================================================

    // 1. LOAD DATA (Tampilkan Judul & Kategori)
    function loadGaleriData() {
        const grid = document.getElementById('adminGalleryGrid');
        if (!grid) return;

        fetch(API_URL + 'galeri/read.php')
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                grid.innerHTML = '<p>Belum ada foto.</p>';
                return;
            }
            let html = '';
            data.forEach(item => {
                // Warna badge sesuai kategori
                let badgeColor = 'blue';
                if(item.kategori === 'prestasi') badgeColor = 'purple';
                if(item.kategori === 'fasilitas') badgeColor = 'orange';

                html += `
                    <div class="gallery-admin-item" style="position:relative; margin-bottom:15px;">
                        <img src="${UPLOAD_URL}galeri/${item.file_gambar}" 
                             style="width:100%; height:150px; object-fit:cover; border-radius:8px;"
                             onerror="this.src='https://via.placeholder.com/150?text=Err'">
                        
                        <div style="padding: 10px; background: #fff; border:1px solid #eee; border-radius:0 0 8px 8px;">
                            <span class="badge ${badgeColor}" style="font-size:10px; margin-bottom:5px; display:inline-block;">${item.kategori}</span>
                            <div style="font-weight:bold; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.judul}</div>
                        </div>

                        <button class="btn-delete" onclick="deleteGaleri(${item.id})" 
                                style="position:absolute; top:5px; right:5px; background:red; color:white; border:none; border-radius:4px; padding:5px 8px; cursor:pointer;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
            });
            grid.innerHTML = html;
        });
    }

    // 2. HANDLE SUBMIT FORM UPLOAD MANUAL
    const formGaleri = document.getElementById('formGaleriManual');
    if (formGaleri) {
        formGaleri.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(formGaleri);

            // Tampilkan loading di tombol
            const btn = formGaleri.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Mengupload...';
            btn.disabled = true;

            fetch(API_URL + 'galeri/create_manual.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification('Foto berhasil ditambahkan!', 'success');
                    closeModal('modalTambahGaleri');
                    formGaleri.reset();
                    loadGaleriData(); // Refresh grid
                } else {
                    showNotification(data.message, 'error');
                }
            })
            .catch(err => {
                console.error(err);
                showNotification('Gagal koneksi server', 'error');
            })
            .finally(() => {
                btn.innerText = originalText;
                btn.disabled = false;
            });
        });
    }

    // --- B. FUNGSI HAPUS GALERI ---
    window.deleteGaleri = function(id) {
        if (confirm('Yakin ingin menghapus foto ini?')) {
            const formData = new FormData();
            formData.append('id', id);

            fetch(API_URL + 'galeri/delete.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification('Foto berhasil dihapus', 'success');
                    loadGaleriData(); // Refresh grid
                } else {
                    showNotification('Gagal hapus: ' + data.message, 'error');
                }
            });
        }
    };

    // --- C. FUNGSI UPLOAD GALERI (Override handleFiles) ---
    // Kita modifikasi fungsi handleFiles global yang sudah ada sebelumnya
    // Cari fungsi handleFiles di file ini, dan UPDATE isinya menjadi seperti di bawah:
    // ======================================================
    // FIX: TOMBOL SILANG GALERI (WAJIB ADA)
    // ======================================================
    const galleryModal = document.getElementById('galleryModal');
    
    if (galleryModal) {
        // 1. Cari tombol silang (X) di dalam modal
        // Pastikan di HTML galeri.html ada <span class="modal-close">&times;</span>
        const closeBtn = galleryModal.querySelector('.modal-close'); 
        const modalImg = document.getElementById('modalImage');

        // Fungsi Tutup yang Benar (Hapus class active)
        const forceCloseGallery = () => {
            galleryModal.classList.remove('active');
            
            // Bersihkan gambar biar hemat memori
            setTimeout(() => { 
                if(modalImg) modalImg.src = ''; 
            }, 300);
        };

        // 2. Event Klik Tombol Silang (X)
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Biar gak lari ke atas
                e.stopPropagation(); // Biar gak tabrakan event
                forceCloseGallery();
            });
        }

        // 3. Event Klik Area Gelap (Background)
        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) {
                forceCloseGallery();
            }
        });

        // 4. Event Tombol ESC di Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && galleryModal.classList.contains('active')) {
                forceCloseGallery();
            }
        });
    }
    // ======================================================
    // 12. MANAJEMEN GURU (CRUD + DRAG & DROP)
    // ======================================================

    // Cek modul guru
    if (document.getElementById('staffPool')) {
        loadGuruData();
        setupDragAndDrop();
    }

    // --- A. LOAD DATA & RENDER KARTU ---
    function loadGuruData() {
        fetch(API_URL + 'guru/read.php')
        .then(res => res.json())
        .then(data => {
            // 1. Bersihkan semua slot dulu
            document.getElementById('staffPool').innerHTML = '';
            document.querySelectorAll('.role-slot').forEach(slot => {
                // Jangan hapus label kecil (misal: <small>1A</small>)
                const label = slot.querySelector('small');
                slot.innerHTML = ''; 
                if(label) slot.appendChild(label);
            });

            if (data.length === 0) {
                document.getElementById('staffPool').innerHTML = '<p>Belum ada data guru.</p>';
                return;
            }

            // 2. Loop data dan buat kartu
            data.forEach(guru => {
                const card = document.createElement('div');
                card.className = 'guru-card draggable';
                card.setAttribute('draggable', 'true');
                card.id = 'guru-' + guru.id; // Penting untuk identifikasi saat save
                card.dataset.id = guru.id;

                card.innerHTML = `
                    <img src="${UPLOAD_URL}guru/${guru.foto}" onerror="this.src='https://via.placeholder.com/40'">
                    <div class="guru-info">
                        <strong>${guru.nama}</strong>
                        <small>${guru.posisi_default}</small>
                    </div>
                    <button class="btn-delete-guru" onclick="deleteGuru(${guru.id}, '${guru.nama}')">&times;</button>
                `;

                // 3. Tentukan dimana kartu ini harus muncul
                const targetSlotId = guru.lokasi_slot && guru.lokasi_slot !== 'pool' 
                                     ? 'slot-' + guru.lokasi_slot 
                                     : 'staffPool';
                
                const targetContainer = document.getElementById(targetSlotId);
                
                // Jika slot tujuan ada, masukkan. Jika tidak, masukkan ke pool.
                if (targetContainer) {
                    targetContainer.appendChild(card);
                } else {
                    document.getElementById('staffPool').appendChild(card);
                }

                // Pasang event listener drag pada elemen baru
                addDragEvents(card); 
            });
        });
    }

    // --- B. TAMBAH GURU BARU ---
    const formGuru = document.getElementById('formTambahGuru');
    if (formGuru) {
        formGuru.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(formGuru);

            fetch(API_URL + 'guru/create.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification('Guru berhasil ditambahkan', 'success');
                    closeModal('modalTambahGuru');
                    formGuru.reset();
                    loadGuruData();
                } else {
                    showNotification('Gagal: ' + data.message, 'error');
                }
            });
        });
    }

    // --- C. HAPUS GURU ---
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

    // --- D. SIMPAN POSISI STRUKTUR ---
    window.saveGuruPositions = function() {
        const positions = [];
        
        // 1. Scan semua slot jabatan
        document.querySelectorAll('.role-slot').forEach(slot => {
            const slotName = slot.getAttribute('data-slot');
            const card = slot.querySelector('.guru-card');
            
            if (card) {
                positions.push({ guru_id: card.dataset.id, slot: slotName });
            }
        });

        // 2. Scan staff pool (sisanya dianggap di pool)
        document.getElementById('staffPool').querySelectorAll('.guru-card').forEach(card => {
            positions.push({ guru_id: card.dataset.id, slot: 'pool' });
        });

        // 3. Kirim ke Backend
        fetch(API_URL + 'guru/update_posisi.php', {
            method: 'POST',
            body: JSON.stringify(positions),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === 'success') showNotification('Struktur tersimpan!', 'success');
            else showNotification('Gagal simpan struktur', 'error');
        });
    };

    // --- E. LOGIKA DRAG & DROP HELPER ---
    function setupDragAndDrop() {
        const slots = document.querySelectorAll('.role-slot, .staff-pool');
        
        slots.forEach(slot => {
            slot.addEventListener('dragover', e => {
                e.preventDefault();
                slot.classList.add('drag-over');
            });
            slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
            slot.addEventListener('drop', e => {
                e.preventDefault();
                slot.classList.remove('drag-over');
                
                const draggable = document.querySelector('.dragging');
                if (draggable) {
                    // Jika slot jabatan sudah ada isinya, pindahkan isi lama ke pool dulu
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
}); // END DOMContentLoaded

// ======================================================
// HELPER FUNCTIONS (Global Scope)
// ======================================================

// Navigasi Sidebar (SPA)
function switchModule(moduleId, element) {
    const modules = document.querySelectorAll('.module-section');
    modules.forEach(mod => mod.style.display = 'none');
    const selected = document.getElementById('modul-' + moduleId);
    if(selected) selected.style.display = 'block';

    const titles = {
        'dashboard': 'Dashboard',
        'guru': 'Manajemen Guru & Staff',
        'galeri': 'Manajemen Galeri',
        'prestasi': 'Data Prestasi',
        'berita': 'Manajemen Berita',
        'pengaturan': 'Pengaturan'
    };
    const pageTitle = document.getElementById('pageTitle');
    if(pageTitle) pageTitle.innerText = titles[moduleId] || 'Dashboard';

    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    if(element) element.classList.add('active');
}

// Modal System
function openModal(id) {
    const el = document.getElementById(id);
    if(el) el.style.display = 'flex';
    
    // Gallery Logic specific
    if(id === 'galleryModal') {
        // ... (Gallery logic if needed globally)
    }
}

function closeModal(id) {
    const el = document.getElementById(id);
    if(el) el.style.display = 'none';
}

// Upload Zone Logic
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
            if(input) input.files = e.dataTransfer.files; // Assign to input
            handleFiles(e.dataTransfer.files, isMultiple, previewId);
        }
    });
    
    if(input) {
        input.addEventListener('change', () => {
            handleFiles(input.files, isMultiple, previewId);
        });
    }
}

// UPDATE FUNGSI INI DI BAGIAN BAWAH FILE
function handleFiles(files, isMultiple, previewId) {
    // 1. LOGIKA UPLOAD GALERI (MULTIPLE)
    if (isMultiple) {
        // Tampilkan loading sederhana
        showNotification(`Sedang mengupload ${files.length} foto...`, 'info');

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files[]', files[i]);
        }

        // Kirim ke Backend
        // Pastikan variabel API_URL bisa diakses disini. 
        // Jika error "API_URL is not defined", ganti 'http://localhost/kpajiz/api/' manual.
        const UPLOAD_API = 'http://localhost/kpajiz/api/'; 

        fetch(UPLOAD_API + 'galeri/upload.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                showNotification(data.message, 'success');
                // Refresh data galeri jika fungsi tersedia
                if (typeof loadGaleriData === "function") { 
                    loadGaleriData(); // Panggil fungsi di dalam scope utama jika bisa
                } else {
                    // Fallback reload halaman jika scope function sulit dijangkau
                    setTimeout(() => location.reload(), 1000);
                }
            } else {
                showNotification('Upload gagal', 'error');
            }
        })
        .catch(err => console.error(err));
    } 
    
    // 2. LOGIKA PREVIEW IMAGE (SINGLE - Berita/Guru/Prestasi)
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

// Gallery Navigation Helper (Global)
let currentGalleryIndex = 0;
let visibleGalleryItems = [];

window.changeImage = function(n) {
    const items = document.querySelectorAll('.gallery-item:not(.hide)');
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
        window.changeImage(0); // Load initial image
    }
}