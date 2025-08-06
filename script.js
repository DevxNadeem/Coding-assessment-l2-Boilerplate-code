
// Product Bundle JavaScript
class ProductBundle {
    constructor() {
        this.bundle = [];
        this.maxItems = 3;
        this.discountRate = 0.30; // 30% discount
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateUI();
        this.clearHardcodedBundleItems();
    }

    // Remove hardcoded bundle items from the sidebar
    clearHardcodedBundleItems() {
        const marginContainer = document.querySelector('.margin-container');
        if (marginContainer) {
            marginContainer.innerHTML = '';
        }
    }

    bindEvents() {
        // Add event listeners to all "Add to Bundle" buttons
        const bundleButtons = document.querySelectorAll('.bundle-btn:not(.footer .bundle-btn)');
        bundleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleAddToBundle(e);
            });
        });

        // Add event listener to the proceed button
        const proceedButton = document.querySelector('.footer .bundle-btn');
        if (proceedButton) {
            proceedButton.addEventListener('click', () => {
                this.handleProceed();
            });
        }
    }

    handleAddToBundle(event) {
        const button = event.currentTarget;
        const productCard = button.closest('.product-card');
        
        if (!productCard) return;

        // Extract product information
        const productImage = productCard.querySelector('.product-image img');
        const productTitle = productCard.querySelector('.product-title');
        const productPrice = productCard.querySelector('.price-text');

        const product = {
            id: Date.now() + Math.random(), // Simple ID generation
            title: productTitle ? productTitle.textContent.trim() : 'Product',
            price: productPrice ? parseFloat(productPrice.textContent.replace('$', '')) : 150.00,
            image: productImage ? productImage.src : '',
            alt: productImage ? productImage.alt : 'product'
        };

        // Check if product is already in bundle
        const existingProduct = this.bundle.find(item => 
            item.title === product.title && item.image === product.image
        );

        if (existingProduct) {
            this.showMessage('This item is already in your bundle!', 'warning');
            return;
        }

        // Check if bundle is full
        if (this.bundle.length >= this.maxItems) {
            this.showMessage('Bundle is full! Remove an item to add a new one.', 'warning');
            return;
        }

        // Add product to bundle
        this.bundle.push(product);
        this.updateUI();
        this.updateButtonState(button, true);
        this.showMessage('Item added to bundle!', 'success');
    }

    removeFromBundle(productId) {
        this.bundle = this.bundle.filter(item => item.id !== productId);
        this.updateUI();
        this.resetAllButtonStates();
        this.showMessage('Item removed from bundle!', 'info');
    }

    updateUI() {
        this.updateBundleItems();
        this.updateProgress();
        this.updatePricing();
        this.updateProceedButton();
    }

    updateBundleItems() {
        const marginContainer = document.querySelector('.margin-container');
        if (!marginContainer) return;

        marginContainer.innerHTML = '';

        this.bundle.forEach(product => {
            const bundleItem = document.createElement('div');
            bundleItem.className = 'frm-1';
            bundleItem.innerHTML = `
                <div class="image-from-product">
                    <img src="${product.image}" alt="${product.alt}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;">
                </div>
                <div class="content-from-product">
                    <div style="font-weight: 500; margin-bottom: 4px;">${product.title}</div>
                    <div style="color: #666; font-size: 13px;">$${product.price.toFixed(2)}</div>
                    <button onclick="bundleManager.removeFromBundle(${product.id})" 
                            style="background: none; border: none; color: #ff4444; font-size: 12px; cursor: pointer; padding: 2px 0; margin-top: 4px;">
                        Remove
                    </button>
                </div>
            `;
            marginContainer.appendChild(bundleItem);
        });

        // Add placeholder items if bundle is not full
        for (let i = this.bundle.length; i < this.maxItems; i++) {
            const placeholderItem = document.createElement('div');
            placeholderItem.className = 'frm-1';
            placeholderItem.style.opacity = '0.3';
            placeholderItem.innerHTML = `
                <div class="image-from-product"></div>
                <div class="content-from-product">
                    <div style="color: #999; font-style: italic;">Add item ${i + 1}</div>
                </div>
            `;
            marginContainer.appendChild(placeholderItem);
        }
    }

    updateProgress() {
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            const progress = (this.bundle.length / this.maxItems) * 100;
            progressFill.style.width = `${progress}%`;
        }

        // Update progress text
        const headingMiddle = document.querySelector('.heading-middle-txt');
        if (headingMiddle) {
            const remaining = this.maxItems - this.bundle.length;
            if (remaining > 0) {
                headingMiddle.innerHTML = `Add <span>${remaining}</span> more products and <span>Save 30%</span>`;
            } else {
                headingMiddle.innerHTML = `<span>Bundle complete!</span> You'll save <span>30%</span>`;
            }
        }
    }

    updatePricing() {
        const subtotal = this.bundle.reduce((sum, product) => sum + product.price, 0);
        const discount = this.bundle.length >= this.maxItems ? subtotal * this.discountRate : 0;
        const total = subtotal - discount;

        // Update discount
        const discountPriceElement = document.querySelector('.discount-price .price-text');
        if (discountPriceElement) {
            discountPriceElement.textContent = `- $${discount.toFixed(2)}`;
        }

        // Update subtotal
        const subtotalElement = document.querySelector('.subtotal-price');
        if (subtotalElement) {
            subtotalElement.textContent = `$${total.toFixed(2)}`;
        }
    }

    updateProceedButton() {
        const proceedButton = document.querySelector('.footer .bundle-btn');
        if (!proceedButton) return;

        const btnLabel = proceedButton.querySelector('.btn-label');
        if (this.bundle.length >= this.maxItems) {
            btnLabel.textContent = 'Proceed to Checkout';
            proceedButton.style.backgroundColor = '#111';
            proceedButton.style.color = '#fff';
            proceedButton.disabled = false;
        } else {
            const remaining = this.maxItems - this.bundle.length;
            btnLabel.textContent = `Add ${remaining} More Item${remaining > 1 ? 's' : ''} to Proceed`;
            proceedButton.style.backgroundColor = '#ccc';
            proceedButton.style.color = '#666';
            proceedButton.disabled = true;
        }
    }

    updateButtonState(button, isAdded) {
        const btnLabel = button.querySelector('.btn-label');
        if (isAdded) {
            btnLabel.textContent = 'Added to Bundle';
            button.style.backgroundColor = '#28a745';
            button.style.color = '#fff';
            button.style.borderColor = '#28a745';
            button.disabled = true;
        }
    }

    resetAllButtonStates() {
        const bundleButtons = document.querySelectorAll('.bundle-btn:not(.footer .bundle-btn)');
        bundleButtons.forEach(button => {
            const btnLabel = button.querySelector('.btn-label');
            btnLabel.textContent = 'Add to Bundle';
            button.style.backgroundColor = '#FFFFFF';
            button.style.color = '#111111';
            button.style.borderColor = '#111111';
            button.disabled = false;
        });
    }

    handleProceed() {
        if (this.bundle.length >= this.maxItems) {
            this.showMessage('Proceeding to checkout...', 'success');
            // Here you would typically redirect to checkout or call checkout API
            console.log('Bundle contents:', this.bundle);
        } else {
            this.showMessage(`Please add ${this.maxItems - this.bundle.length} more items to proceed`, 'warning');
        }
    }

    showMessage(message, type = 'info') {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 16px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        // Set color based on type
        const colors = {
            success: '#28a745',
            warning: '#ffc107',
            error: '#dc3545',
            info: '#17a2b8'
        };
        toast.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Add CSS for toast animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .bundle-btn:disabled {
        cursor: not-allowed !important;
    }
`;
document.head.appendChild(style);

// Initialize the bundle manager when DOM is loaded
let bundleManager;
document.addEventListener('DOMContentLoaded', () => {
    bundleManager = new ProductBundle();
});

// Export for global access (if needed)
window.bundleManager = bundleManager;