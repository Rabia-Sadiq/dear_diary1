document.addEventListener('DOMContentLoaded', function() {
    // Character counter for thought textarea
    const thoughtTextarea = document.getElementById('thought');
    const charCount = document.getElementById('char-count');
    
    if (thoughtTextarea && charCount) {
        // Update character count
        function updateCharCount() {
            const count = thoughtTextarea.value.length;
            charCount.textContent = count;
            
            // Change color based on character count
            if (count > 1800) {
                charCount.style.color = '#d32f2f'; // Red warning
            } else if (count > 1500) {
                charCount.style.color = '#ff9800'; // Orange warning
            } else {
                charCount.style.color = '#8b4513'; // Default brown
            }
        }
        
        // Update on input
        thoughtTextarea.addEventListener('input', updateCharCount);
        
        // Update on page load
        updateCharCount();
        
        // Auto-resize textarea
        function autoResize() {
            thoughtTextarea.style.height = 'auto';
            thoughtTextarea.style.height = thoughtTextarea.scrollHeight + 'px';
        }
        
        thoughtTextarea.addEventListener('input', autoResize);
        
        // Focus animation
        thoughtTextarea.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        thoughtTextarea.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    }
    
    // Form validation and submission
    const thoughtForm = document.querySelector('#thought-form');
    if (thoughtForm) {
        thoughtForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const content = thoughtTextarea.value.trim();
            
            if (!content) {
                showAlert('Please write something before submitting.', 'error');
                thoughtTextarea.focus();
                return;
            }
            
            if (content.length > 2000) {
                showAlert('Your thought is too long. Please keep it under 2000 characters.', 'error');
                thoughtTextarea.focus();
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sharing...';
            }
            
            try {
                const response = await fetch('/api/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ thought: content })
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    // Redirect to thank you page
                    window.location.href = '/thankyou.html';
                } else {
                    showAlert(result.error || 'An error occurred while submitting your thought.', 'error');
                }
            } catch (error) {
                console.error('Error submitting thought:', error);
                showAlert('Network error. Please check your connection and try again.', 'error');
            } finally {
                // Restore button state
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Share My Thought';
                }
            }
        });
    }
    
    // Auto-dismiss alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(function(alert) {
        setTimeout(function() {
            if (alert.classList.contains('show')) {
                const closeBtn = alert.querySelector('.btn-close');
                if (closeBtn) {
                    closeBtn.click();
                }
            }
        }, 5000);
    });
    
    // Smooth scroll for any anchor links
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
    
    // Add subtle animations to cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe thought cards for animation
    const thoughtCards = document.querySelectorAll('.thought-card');
    thoughtCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Admin panel enhancements
    if (document.querySelector('.admin-panel')) {
        // Add search/filter functionality if needed
        console.log('Admin panel loaded');
        
        // Add click-to-expand for long thoughts
        const thoughtContents = document.querySelectorAll('.thought-content');
        thoughtContents.forEach(content => {
            if (content.textContent.length > 300) {
                content.style.cursor = 'pointer';
                content.title = 'Click to expand/collapse';
                
                let isExpanded = false;
                const originalHeight = content.style.maxHeight || 'none';
                content.style.maxHeight = '150px';
                content.style.overflow = 'hidden';
                
                content.addEventListener('click', function() {
                    if (isExpanded) {
                        this.style.maxHeight = '150px';
                        isExpanded = false;
                    } else {
                        this.style.maxHeight = 'none';
                        isExpanded = true;
                    }
                });
            }
        });
    }
    
    // Password field enhancements
    const passwordField = document.getElementById('password');
    if (passwordField) {
        passwordField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                this.closest('form').submit();
            }
        });
    }
    
    // Add loading state to admin login
    const adminForm = document.querySelector('.admin-form');
    if (adminForm) {
        adminForm.addEventListener('submit', function() {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Authenticating...';
            }
        });
    }
    
    // Check admin authentication status
    checkAdminAuth();
});

// Alert system
function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) return;
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.appendChild(alertDiv);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Check admin authentication
function checkAdminAuth() {
    const adminLink = document.getElementById('admin-link');
    const logoutLink = document.getElementById('logout-link');
    
    if (document.cookie.includes('admin-auth=true')) {
        if (adminLink) adminLink.style.display = 'block';
        if (logoutLink) logoutLink.style.display = 'block';
    }
}

// Admin logout
async function adminLogout() {
    try {
        const response = await fetch('/api/admin-logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            showAlert('You have been logged out.', 'info');
            // Hide admin links
            const adminLink = document.getElementById('admin-link');
            const logoutLink = document.getElementById('logout-link');
            if (adminLink) adminLink.style.display = 'none';
            if (logoutLink) logoutLink.style.display = 'none';
            
            // Redirect to home if on admin page
            if (window.location.pathname.includes('admin')) {
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            }
        }
    } catch (error) {
        console.error('Logout error:', error);
        showAlert('Error logging out. Please try again.', 'error');
    }
}

// Utility function to format dates nicely
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

// Add some Easter eggs for fun
let konami = [];
const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', function(e) {
    konami.push(e.keyCode);
    if (konami.length > konamiCode.length) {
        konami.shift();
    }
    
    if (JSON.stringify(konami) === JSON.stringify(konamiCode)) {
        // Easter egg: Add some sparkles
        console.log('✨ Konami code activated! ✨');
        document.body.style.cursor = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 20 20\'%3E%3Ctext y=\'15\' font-size=\'15\'%3E✨%3C/text%3E%3C/svg%3E"), auto';
        
        setTimeout(() => {
            document.body.style.cursor = 'auto';
        }, 10000);
    }
});
