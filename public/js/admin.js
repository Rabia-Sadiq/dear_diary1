document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on admin login page
    const adminForm = document.getElementById('admin-form');
    if (adminForm) {
        adminForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const password = document.getElementById('password').value;
            const submitBtn = this.querySelector('button[type="submit"]');
            
            // Show loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Authenticating...';
            }
            
            try {
                const response = await fetch('/api/admin-auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ password })
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    // Redirect to admin panel
                    window.location.href = '/admin.html';
                } else {
                    showAlert(result.error || 'Authentication failed. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Auth error:', error);
                showAlert('Network error. Please check your connection and try again.', 'error');
            } finally {
                // Restore button state
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Access Admin Panel';
                }
            }
        });
        
        // Enter key support
        document.getElementById('password').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                adminForm.dispatchEvent(new Event('submit'));
            }
        });
    }
    
    // Check if we're on admin panel page
    if (window.location.pathname.includes('admin.html')) {
        loadThoughts();
    }
});

// Load thoughts for admin panel
async function loadThoughts() {
    const loading = document.getElementById('loading');
    const thoughtsContainer = document.getElementById('thoughts-container');
    const emptyState = document.getElementById('empty-state');
    const thoughtCount = document.getElementById('thought-count');
    
    try {
        const response = await fetch('/api/admin-thoughts');
        
        if (response.status === 401) {
            // Not authenticated, redirect to login
            window.location.href = '/admin-login.html';
            return;
        }
        
        const result = await response.json();
        
        if (response.ok) {
            const thoughts = result.thoughts;
            
            // Hide loading
            if (loading) loading.style.display = 'none';
            
            // Update count
            if (thoughtCount) {
                thoughtCount.textContent = `${thoughts.length} Total Thoughts`;
            }
            
            if (thoughts.length === 0) {
                // Show empty state
                if (emptyState) emptyState.style.display = 'block';
            } else {
                // Show thoughts
                displayThoughts(thoughts);
                if (thoughtsContainer) thoughtsContainer.style.display = 'block';
            }
        } else {
            throw new Error(result.error || 'Failed to load thoughts');
        }
    } catch (error) {
        console.error('Error loading thoughts:', error);
        if (loading) loading.style.display = 'none';
        showAlert('Error loading thoughts. Please refresh the page.', 'error');
    }
}

// Display thoughts in admin panel
function displayThoughts(thoughts) {
    const container = document.getElementById('thoughts-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="thoughts-list">
            ${thoughts.map(thought => `
                <div class="thought-card card mb-4">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <div>
                            <i class="fas fa-calendar-alt me-2 text-muted"></i>
                            <span class="text-muted">${thought.formatted_date}</span>
                        </div>
                        <small class="text-muted">#${thought.id}</small>
                    </div>
                    
                    <div class="card-body">
                        <div class="thought-content">
                            ${thought.content.replace(/\n/g, '<br>')}
                        </div>
                        
                        <div class="thought-meta mt-3 pt-3 border-top">
                            <small class="text-muted">
                                <i class="fas fa-align-left me-1"></i>
                                ${thought.content.length} characters
                            </small>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="text-center mt-4">
            <p class="text-muted">
                <em>All thoughts are displayed in reverse chronological order</em>
            </p>
        </div>
    `;
    
    // Add click-to-expand for long thoughts
    const thoughtContents = container.querySelectorAll('.thought-content');
    thoughtContents.forEach(content => {
        if (content.textContent.length > 300) {
            content.style.cursor = 'pointer';
            content.title = 'Click to expand/collapse';
            
            let isExpanded = false;
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
    
    // Add animation
    const cards = container.querySelectorAll('.thought-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Alert system (same as main.js)
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

// Admin logout function
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
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        }
    } catch (error) {
        console.error('Logout error:', error);
        showAlert('Error logging out. Please try again.', 'error');
    }
}