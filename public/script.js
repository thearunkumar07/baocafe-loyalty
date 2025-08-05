// Global state
let currentLoyaltyData = null;

// Mobile menu functionality
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    
    if (mobileMenu.classList.contains('show')) {
        mobileMenu.classList.remove('show');
        menuIcon.textContent = '☰';
    } else {
        mobileMenu.classList.add('show');
        menuIcon.textContent = '✕';
    }
}

// Mobile input handling
document.addEventListener('DOMContentLoaded', function() {
    const mobileInput = document.getElementById('mobile');
    
    mobileInput.addEventListener('input', function(e) {
        // Remove any non-numeric characters
        let value = e.target.value.replace(/[^0-9]/g, '');
        // Limit to 10 digits
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        e.target.value = value;
    });
});

// Loyalty check functionality
async function checkLoyalty(event) {
    event.preventDefault();
    
    const mobile = document.getElementById('mobile').value;
    const submitBtn = document.getElementById('submit-btn');
    
    // Validate mobile number
    if (!/^\d{10}$/.test(mobile)) {
        showToast('Please enter a valid 10-digit mobile number', 'error');
        return;
    }

    // Show loading state
    showSection('loading-section');
    submitBtn.disabled = true;

    try {
        const response = await fetch(`/api/check-loyalty?mobile=${mobile}`);
        const data = await response.json();
        
        if (data.success) {
            currentLoyaltyData = data;
            displaySuccessState(data);
            showToast(`Welcome back, ${data.name}!`, 'success');
        } else {
            displayErrorState(data.message || 'Customer not found');
        }
    } catch (error) {
        console.error('Error checking loyalty:', error);
        displayErrorState('Unable to check loyalty points. Please try again later.');
        showToast('Error checking loyalty points', 'error');
    } finally {
        submitBtn.disabled = false;
    }
}

// Display success state
function displaySuccessState(data) {
    const customerName = document.getElementById('customer-name');
    const pointsDisplay = document.getElementById('points-display');

    // Set customer name
    customerName.textContent = data.name;

    // Set points with animation
    animateCounter(pointsDisplay, data.points);

    showSection('success-section');
}

// Display error state
function displayErrorState(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    showSection('error-section');
}

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    const sections = ['form-section', 'loading-section', 'error-section', 'success-section'];
    sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.add('hidden');
        }
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
}



// Animate counter
function animateCounter(element, target) {
    const duration = 1000; // 1 second
    const start = 0;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (target - start) * easedProgress);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Reset form
function resetForm() {
    document.getElementById('mobile').value = '';
    currentLoyaltyData = null;
    showSection('form-section');
}

// Toast notification system
function showToast(message, type = 'info') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    // Add styles
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        maxWidth: '300px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        backgroundColor: type === 'error' ? '#dc2626' : type === 'success' ? '#10b981' : '#3b82f6'
    });

    // Add to page
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 10);

    // Auto remove
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileMenu.classList.contains('show') && 
        !mobileMenu.contains(event.target) && 
        !menuBtn.contains(event.target)) {
        toggleMobileMenu();
    }
});

// Handle floating button clicks
document.addEventListener('DOMContentLoaded', function() {
    // Chat button
    const chatBtn = document.querySelector('[data-testid="button-chat"]');
    if (chatBtn) {
        chatBtn.addEventListener('click', function() {
            showToast('Chat feature coming soon!', 'info');
        });
    }

    // Call button
    const callBtn = document.querySelector('[data-testid="button-call"]');
    if (callBtn) {
        callBtn.addEventListener('click', function() {
            showToast('Call feature coming soon!', 'info');
        });
    }


});

