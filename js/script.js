// ======================================================
// SD NEGERI 2 BAWANG - MAIN JAVASCRIPT (ALL IN ONE)
// ======================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // ======================================================
    // 1. GLOBAL UI & UTILITIES (Navbar, Scroll, Notify)
    // ======================================================
    
    // --- Navbar Sticky & Mobile Toggle ---
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    // Sticky Navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }
    });

    // Mobile Menu Toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Aksesibilitas (ARIA)
            const isOpened = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isOpened);
            navToggle.setAttribute('aria-label', isOpened ? 'Tutup Menu Navigasi' : 'Buka Menu Navigasi');
        });
    }

    // --- Back to Top Button ---
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Kembali ke atas');
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

    // --- Global Notification System (Toast) ---
    // Fungsi ini bisa dipanggil dari mana saja
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

    // Inject Animation Styles for Notification
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
    `;
    document.head.appendChild(style);

    // --- Scroll Reveal Animation ---
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
    // 2. HOMEPAGE: HERO SLIDER
    // ======================================================
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length > 0) {
        let currentSlide = 0;
        const heroPrev = document.querySelector('.hero-prev');
        const heroNext = document.querySelector('.hero-next');
        const heroDotsContainer = document.querySelector('.hero-dots');

        // Create dots
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
        
        // Auto slide
        setInterval(nextSlide, 5000);
    }

    // ======================================================
    // 3. GALLERY PAGE (DENGAN NAVIGASI NEXT/PREV)
    // ======================================================
    
    // Variabel Global untuk Galeri
    let currentGalleryIndex = 0;
    let visibleGalleryItems = []; // Menyimpan daftar foto yang sedang tampil (tidak ter-filter)

    const filterBtns = document.querySelectorAll('.filter-btn');
    
    if (filterBtns.length > 0) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Hapus kelas active dari semua tombol
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                // Tampilkan Item
                item.classList.remove('hide');
                item.style.display = 'block';
                // Timeout kecil agar transisi opacity berjalan
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                // Sembunyikan Item
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                item.classList.add('hide');
                // Tunggu animasi selesai baru display none
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});
    }

    // Fungsi Update Konten Modal (Gambar & Caption)
    function updateModalContent() {
        const modalImg = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');
        
        if (visibleGalleryItems.length > 0) {
            const currentItem = visibleGalleryItems[currentGalleryIndex];
            const img = currentItem.querySelector('.gallery-image img');
            const info = currentItem.querySelector('.gallery-info');

            // Efek fade out sebentar saat ganti gambar
            modalImg.style.opacity = '0.5';
            setTimeout(() => {
                modalImg.src = img.src;
                modalImg.style.opacity = '1';
            }, 200);

            if (info && modalCaption) {
                const title = info.querySelector('h4').textContent;
                const desc = info.querySelector('p').textContent;
                modalCaption.innerHTML = `<h4>${title}</h4><p>${desc}</p>`;
            }
        }
    }

    // Fungsi Buka Modal (Dipanggil dari HTML onclick)
    window.openModal = function(btn) {
        const modal = document.getElementById('galleryModal');
        
        // 1. Ambil semua item yang sedang terlihat (memperhatikan filter)
        // Jika tidak ada filter aktif, ambil semua .gallery-item
        // Kita cek style display block atau kosong
        const allItems = document.querySelectorAll('.gallery-item');
        visibleGalleryItems = Array.from(allItems).filter(item => {
            return item.style.display !== 'none';
        });

        // 2. Cari index item yang diklik
        const clickedItem = btn.closest('.gallery-item');
        currentGalleryIndex = visibleGalleryItems.indexOf(clickedItem);

        // 3. Tampilkan Modal
        if (modal && currentGalleryIndex !== -1) {
            modal.classList.add('active');
            updateModalContent();
        }
    };

    // Fungsi Ganti Gambar (Next/Prev)
    window.changeImage = function(n) {
        currentGalleryIndex += n;

        // Logika Loop (Jika di akhir, balik ke awal. Jika di awal, balik ke akhir)
        if (currentGalleryIndex >= visibleGalleryItems.length) {
            currentGalleryIndex = 0;
        } else if (currentGalleryIndex < 0) {
            currentGalleryIndex = visibleGalleryItems.length - 1;
        }

        updateModalContent();
    };

    // Navigasi Keyboard (Panah Kiri/Kanan)
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('galleryModal');
        if (modal && modal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') window.changeImage(-1);
            if (e.key === 'ArrowRight') window.changeImage(1);
        }
    });

    // Close Modal Logic
    const galleryModal = document.getElementById('galleryModal');
    if (galleryModal) {
        const closeModal = () => galleryModal.classList.remove('active');
        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal || e.target.classList.contains('modal-close')) {
                closeModal();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && galleryModal.classList.contains('active')) closeModal();
        });
    }

    // ======================================================
    // 4. CONTACT PAGE
    // ======================================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulasi pengiriman
            showNotification('Pesan berhasil dikirim! Kami akan menghubungi Anda segera.', 'success');
            contactForm.reset();
        });
    }

    // ======================================================
    // 5. ADMIN LOGIN PAGE
    // ======================================================
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // Toggle Password Visibility
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
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // VALIDASI SEDERHANA (HANYA UNTUK DEMO/TUGAS)
            if (username === 'admin' && password === 'admin123') {
                showNotification('Login berhasil! Mengalihkan...', 'success');
                setTimeout(() => window.location.href = 'dashboard.html', 1500);
            } else {
                showNotification('Username atau password salah!', 'error');
            }
        });
    }

    // ======================================================
    // 6. ADMIN DASHBOARD
    // ======================================================
    const adminSidebar = document.getElementById('adminSidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');

    if (adminSidebar && sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            adminSidebar.classList.toggle('active');
        });

        // Close sidebar on mobile click outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && adminSidebar.classList.contains('active')) {
                if (!adminSidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    adminSidebar.classList.remove('active');
                }
            }
        });
    }

    // Delete Confirmation
    const deleteBtns = document.querySelectorAll('.btn-icon[title="Hapus"]');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
                showNotification('Data berhasil dihapus', 'success');
                // Di sini nanti logika hapus baris tabel
            }
        });
    });

    // Animate Stats Numbers
    const statElements = document.querySelectorAll('.stat-info h3');
    if (statElements.length > 0) {
        const animateValue = (element, start, end, duration) => {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                element.textContent = Math.floor(progress * (end - start) + start);
                if (progress < 1) window.requestAnimationFrame(step);
            };
            window.requestAnimationFrame(step);
        };

        statElements.forEach(el => {
            const valueText = el.textContent.replace(/,/g, '');
            const value = parseInt(valueText);
            if (!isNaN(value)) {
                el.textContent = '0';
                setTimeout(() => animateValue(el, 0, value, 1500), 200);
            }
        });
    }

    // Loading Animation Fade Out
    document.body.style.opacity = '1';
});