// INSTANT PICS - Event Photography Monetization App

class InstantPics {
    constructor() {
        this.uploadedPhotos = [];
        this.photoPrice = 5.00;
        this.selectedPhotos = new Set();
        this.galleryId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updatePricingCalculator();
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

        // Pricing calculator
        const photosSoldInput = document.getElementById('photosSold');
        const photoPriceSelect = document.getElementById('photoPrice');
        
        if (photosSoldInput) {
            photosSoldInput.addEventListener('input', () => this.updatePricingCalculator());
        }
        if (photoPriceSelect) {
            photoPriceSelect.addEventListener('change', () => this.updatePricingCalculator());
        }

        // Generate QR Code button
        const generateQRBtn = document.getElementById('generateQR');
        if (generateQRBtn) {
            generateQRBtn.addEventListener('click', () => this.generateQRCode());
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

    processFiles(files) {
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            this.showNotification('Please select valid image files.');
            return;
        }

        imageFiles.forEach(file => {
            this.addPhotoToGallery(file);
        });

        this.showNotification(`${imageFiles.length} photo(s) uploaded successfully!`);
        
        // Show QR generation section if photos exist
        if (this.uploadedPhotos.length > 0) {
            const generateQRBtn = document.getElementById('generateQR');
            if (generateQRBtn) {
                generateQRBtn.style.display = 'block';
            }
        }
    }

    addPhotoToGallery(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const photoData = {
                id: Date.now() + Math.random(),
                src: e.target.result,
                name: file.name,
                size: file.size,
                timestamp: new Date(),
                price: this.photoPrice
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
            uploadZone.style.minHeight = '100px';
            uploadZone.querySelector('p').textContent = `${this.uploadedPhotos.length} photos uploaded. Add more?`;
        }

        photoGrid.innerHTML = this.uploadedPhotos.map(photo => `
            <div class="photo-item" data-photo-id="${photo.id}">
                <img src="${photo.src}" alt="${photo.name}" loading="lazy">
                <div class="photo-overlay">
                    <span class="photo-price">$${this.photoPrice.toFixed(2)}</span>
                    <button class="remove-photo" onclick="instantPics.removePhoto('${photo.id}')">×</button>
                </div>
            </div>
        `).join('');
    }

    removePhoto(photoId) {
        this.uploadedPhotos = this.uploadedPhotos.filter(photo => photo.id !== photoId);
        this.renderPhotoGrid();
        
        if (this.uploadedPhotos.length === 0) {
            const uploadZone = document.getElementById('photoUpload');
            if (uploadZone) {
                uploadZone.style.minHeight = '';
                uploadZone.querySelector('p').textContent = 'Drop your event photos here or click to upload';
            }
        }
    }

    updatePricingCalculator() {
        const photosSoldInput = document.getElementById('photosSold');
        const photoPriceSelect = document.getElementById('photoPrice');
        
        if (!photosSoldInput || !photoPriceSelect) return;
        
        const photosSold = parseInt(photosSoldInput.value) || 0;
        const pricePerPhoto = parseFloat(photoPriceSelect.value) || 0;
        
        const totalSales = photosSold * pricePerPhoto;
        const platformFee = totalSales * 0.15;
        const yourEarnings = totalSales - platformFee;
        
        document.getElementById('totalSales').textContent = `$${totalSales.toFixed(2)}`;
        document.getElementById('platformFee').textContent = `$${platformFee.toFixed(2)}`;
        document.getElementById('yourEarnings').textContent = `$${yourEarnings.toFixed(2)}`;
    }

    setPrice(price) {
        this.photoPrice = price;
        document.getElementById('photoPrice').value = price.toFixed(2);
        
        // Update all photo prices
        this.uploadedPhotos.forEach(photo => {
            photo.price = price;
        });
        
        this.renderPhotoGrid();
        this.showNotification(`Price updated to $${price.toFixed(2)} per photo`);
    }

    generateQRCode() {
        if (this.uploadedPhotos.length === 0) {
            this.showNotification('Please upload some photos first!');
            return;
        }

        // Generate a unique gallery ID
        this.galleryId = 'gallery_' + Date.now();
        
        // Store gallery data (in real app, this would go to database)
        const galleryData = {
            id: this.galleryId,
            photos: this.uploadedPhotos,
            price: this.photoPrice,
            created: new Date().toISOString()
        };
        
        localStorage.setItem(this.galleryId, JSON.stringify(galleryData));
        
        // Create QR code URL (in real app, this would be your domain)
        const galleryUrl = `${window.location.origin}/gallery/${this.galleryId}`;
        
        // Show QR code (using a simple QR code pattern for demo)
        const qrDisplay = document.getElementById('qrDisplay');
        const qrCode = document.getElementById('qrCode');
        
        if (qrDisplay && qrCode) {
            // Create a simple QR code pattern (in production, use a real QR library)
            qrCode.innerHTML = this.generateQRPattern(galleryUrl);
            qrDisplay.style.display = 'block';
            
            this.showNotification('QR Code generated! Share this with event attendees.');
        }
    }

    generateQRPattern(url) {
        // Simple QR-like pattern for demo (use a real QR library in production)
        return `
            <div class="qr-pattern">
                <div class="qr-row">
                    <span class="qr-dot filled"></span>
                    <span class="qr-dot"></span>
                    <span class="qr-dot filled"></span>
                    <span class="qr-dot filled"></span>
                    <span class="qr-dot"></span>
                    <span class="qr-dot filled"></span>
                </div>
                <div class="qr-row">
                    <span class="qr-dot"></span>
                    <span class="qr-dot filled"></span>
                    <span class="qr-dot"></span>
                    <span class="qr-dot"></span>
                    <span class="qr-dot filled"></span>
                    <span class="qr-dot"></span>
                </div>
                <div class="qr-row">
                    <span class="qr-dot filled"></span>
                    <span class="qr-dot"></span>
                    <span class="qr-dot filled"></span>
                    <span class="qr-dot filled"></span>
                    <span class="qr-dot"></span>
                    <span class="qr-dot filled"></span>
                </div>
                <div class="qr-center">
                    <span>📸</span>
                </div>
                <div class="qr-url">${url}</div>
            </div>
        `;
    }

    // Customer-side functionality (what customers see when they scan QR)
    selectPhoto(photoElement) {
        const photoId = photoElement.dataset.photoId;
        
        if (this.selectedPhotos.has(photoId)) {
            this.selectedPhotos.delete(photoId);
            photoElement.classList.remove('selected');
        } else {
            this.selectedPhotos.add(photoId);
            photoElement.classList.add('selected');
        }
        
        this.updateCart();
    }

    updateCart() {
        const selectedCount = this.selectedPhotos.size;
        const totalPrice = selectedCount * this.photoPrice;
        
        document.getElementById('selectedCount').textContent = 
            `${selectedCount} photo${selectedCount !== 1 ? 's' : ''} selected`;
        document.getElementById('totalPrice').textContent = 
            `Total: $${totalPrice.toFixed(2)}`;
            
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.disabled = selectedCount === 0;
            if (selectedCount > 0) {
                checkoutBtn.textContent = `Purchase ${selectedCount} Photo${selectedCount !== 1 ? 's' : ''} - $${totalPrice.toFixed(2)}`;
            } else {
                checkoutBtn.textContent = 'Purchase & Download';
            }
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
            background: #2E8B57;
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
}

// Global functions
function setPrice(price) {
    window.instantPics?.setPrice(price);
}

function selectPhoto(photoElement) {
    window.instantPics?.selectPhoto(photoElement);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function downloadQR() {
    window.instantPics?.showNotification('QR code download feature coming soon!');
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.instantPics = new InstantPics();
    
    // Set up demo photo selection
    document.querySelectorAll('.customer-photo').forEach(photo => {
        photo.addEventListener('click', () => selectPhoto(photo));
    });
});