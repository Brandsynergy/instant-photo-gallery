// Main JavaScript for Instant Photo Gallery

class InstantPhotoGallery {
    constructor() {
        this.uploadedPhotos = [];
        this.gallerySwiper = null;
        this.modal = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeGallery();
        this.createSampleGallery();
        this.setupModal();
        this.setupSmoothScrolling();
        this.setupMobileMenu();
    }

    setupEventListeners() {
        // Photo upload
        const photoUpload = document.getElementById('photoUpload');
        const fileInput = document.getElementById('fileInput');
        
        if (photoUpload && fileInput) {
            photoUpload.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
            
            // Drag and drop
            photoUpload.addEventListener('dragover', this.handleDragOver.bind(this));
            photoUpload.addEventListener('dragleave', this.handleDragLeave.bind(this));
            photoUpload.addEventListener('drop', this.handleDrop.bind(this));
        }

        // Global drag and drop
        document.addEventListener('dragenter', this.handleGlobalDragEnter.bind(this));
        document.addEventListener('dragleave', this.handleGlobalDragLeave.bind(this));
        document.addEventListener('dragover', (e) => e.preventDefault());
        document.addEventListener('drop', this.handleGlobalDrop.bind(this));

        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactSubmit.bind(this));
        }

        // CTA buttons
        document.querySelectorAll('.btn').forEach(btn => {
            if (btn.textContent.includes('Get Started') || btn.textContent.includes('Start Free')) {
                btn.addEventListener('click', () => {
                    this.showNotification('Welcome to Zno Instant™! Sign up feature coming soon.');
                });
            }
            if (btn.textContent.includes('Watch Demo')) {
                btn.addEventListener('click', () => {
                    this.showNotification('Demo video coming soon!');
                });
            }
        });
    }

    initializeGallery() {
        const gallerySwiper = document.querySelector('.gallery-swiper');
        if (gallerySwiper && typeof Swiper !== 'undefined') {
            this.gallerySwiper = new Swiper('.gallery-swiper', {
                slidesPerView: 1,
                spaceBetween: 20,
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    640: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 3,
                    },
                    1024: {
                        slidesPerView: 4,
                    },
                },
            });
        }
    }

    createSampleGallery() {
        // Create sample gallery images
        const sampleImages = [
            'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1418065460487-3956c3a9cbj1?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=400&h=300&fit=crop',
        ];

        const galleryWrapper = document.getElementById('galleryWrapper');
        if (galleryWrapper) {
            sampleImages.forEach((src, index) => {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';
                slide.innerHTML = `
                    <div class="gallery-item" onclick="instGallery.openModal('${src}')">
                        <img src="${src}" alt="Sample Photo ${index + 1}" loading="lazy">
                    </div>
                `;
                galleryWrapper.appendChild(slide);
            });
        }
    }

    handleFileSelect(event) {
        const files = Array.from(event.target.files);
        this.processFiles(files);
    }

    handleDragOver(event) {
        event.preventDefault();
        event.currentTarget.classList.add('dragover');
    }

    handleDragLeave(event) {
        event.currentTarget.classList.remove('dragover');
    }

    handleDrop(event) {
        event.preventDefault();
        event.currentTarget.classList.remove('dragover');
        const files = Array.from(event.dataTransfer.files);
        this.processFiles(files);
    }

    handleGlobalDragEnter(event) {
        if (this.isDraggingFiles(event)) {
            this.showDropZone();
        }
    }

    handleGlobalDragLeave(event) {
        if (!event.relatedTarget) {
            this.hideDropZone();
        }
    }

    handleGlobalDrop(event) {
        event.preventDefault();
        this.hideDropZone();
        
        if (event.target.closest('#photoUpload')) return;
        
        const files = Array.from(event.dataTransfer.files);
        if (files.length > 0 && files.some(file => file.type.startsWith('image/'))) {
            this.processFiles(files);
        }
    }

    isDraggingFiles(event) {
        return Array.from(event.dataTransfer.types).includes('Files');
    }

    showDropZone() {
        let dropZone = document.querySelector('.drop-external-files');
        if (!dropZone) {
            dropZone = document.createElement('div');
            dropZone.className = 'drop-external-files';
            dropZone.innerHTML = '<div class="text">Drop photos here to upload</div>';
            document.body.appendChild(dropZone);
        }
        dropZone.classList.add('active');
    }

    hideDropZone() {
        const dropZone = document.querySelector('.drop-external-files');
        if (dropZone) {
            dropZone.classList.remove('active');
        }
    }

    processFiles(files) {
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            this.showNotification('Please select valid image files.');
            return;
        }

        imageFiles.forEach(file => {
            this.addPhotoToGrid(file);
        });

        this.showNotification(`${imageFiles.length} photo(s) uploaded successfully!`);
    }

    addPhotoToGrid(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const photoData = {
                id: Date.now() + Math.random(),
                src: e.target.result,
                name: file.name,
                size: file.size,
                timestamp: new Date()
            };

            this.uploadedPhotos.push(photoData);
            this.renderPhotoGrid();
        };
        reader.readAsDataURL(file);
    }

    renderPhotoGrid() {
        const photoGrid = document.getElementById('photoGrid');
        if (!photoGrid) return;

        // Hide upload zone if photos exist
        const uploadZone = document.getElementById('photoUpload');
        if (this.uploadedPhotos.length > 0 && uploadZone) {
            uploadZone.style.display = 'none';
        }

        photoGrid.innerHTML = this.uploadedPhotos.map(photo => `
            <div class="photo-item fade-in" onclick="instGallery.openModal('${photo.src}')">
                <img src="${photo.src}" alt="${photo.name}" loading="lazy">
                <div class="photo-item-overlay">
                    <span>View</span>
                </div>
            </div>
        `).join('');
    }

    setupModal() {
        this.modal = document.getElementById('photoModal');
        const modalClose = document.querySelector('.modal-close');
        
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }

        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }

        // Modal action buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.modal-actions .btn')) {
                const btnText = e.target.textContent;
                if (btnText.includes('Add to Cart')) {
                    this.showNotification('Added to cart! (Demo feature)');
                } else if (btnText.includes('Download')) {
                    this.showNotification('Download started! (Demo feature)');
                } else if (btnText.includes('Share')) {
                    this.showNotification('Share link copied! (Demo feature)');
                }
            }
        });
    }

    openModal(imageSrc) {
        if (!this.modal) return;
        
        const modalImage = document.getElementById('modalImage');
        if (modalImage) {
            modalImage.src = imageSrc;
        }
        
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    handleContactSubmit(event) {
        event.preventDefault();
        const email = event.target.querySelector('input[type="email"]').value;
        
        if (this.validateEmail(email)) {
            this.showNotification('Thank you for your interest! We\'ll be in touch soon.');
            event.target.reset();
        } else {
            this.showNotification('Please enter a valid email address.');
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.nav');
        
        if (mobileMenuToggle && nav) {
            mobileMenuToggle.addEventListener('click', () => {
                nav.classList.toggle('active');
            });
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #3a3a3a;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            font-size: 14px;
            max-width: 300px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Public methods for global access
    shareGallery() {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: 'Check out my photo gallery',
                url: url
            });
        } else {
            navigator.clipboard.writeText(url);
            this.showNotification('Gallery link copied to clipboard!');
        }
    }

    generateQRCode() {
        this.showNotification('QR code generation coming soon!');
    }

    downloadAll() {
        this.showNotification('Download all feature coming soon!');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.instGallery = new InstantPhotoGallery();
    
    // Add some sample photos after a short delay to demonstrate the interface
    setTimeout(() => {
        if (window.instGallery.uploadedPhotos.length === 0) {
            // Create some demo photos
            const demoPhotos = [
                'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=300&h=300&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop&crop=center'
            ];
            
            demoPhotos.forEach((src, index) => {
                const photoData = {
                    id: `demo-${index}`,
                    src: src,
                    name: `Demo Photo ${index + 1}`,
                    size: 150000,
                    timestamp: new Date()
                };
                window.instGallery.uploadedPhotos.push(photoData);
            });
            
            window.instGallery.renderPhotoGrid();
        }
    }, 2000);
});

// Global functions for HTML onclick handlers
window.openModal = (src) => window.instGallery?.openModal(src);
window.shareGallery = () => window.instGallery?.shareGallery();
window.generateQRCode = () => window.instGallery?.generateQRCode();
window.downloadAll = () => window.instGallery?.downloadAll();

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to close modal
    if (e.key === 'Escape' && window.instGallery) {
        window.instGallery.closeModal();
    }
    
    // Ctrl/Cmd + U to trigger upload
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.click();
        }
    }
});

// Service worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}