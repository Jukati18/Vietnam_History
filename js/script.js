// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Filter button interactions
    const filterButtons = document.querySelectorAll('.filter-btn');
    const eventCards = document.querySelectorAll('.event-card');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the selected period
            const period = this.dataset.period;
            
            // Filter event cards with animation
            eventCards.forEach((card, index) => {
                if (period === 'all' || card.dataset.period === period) {
                    card.style.display = 'block';
                    // Re-trigger animation with staggered delay
                    card.style.animation = 'none';
                    setTimeout(() => {
                        card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`;
                    }, 10);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // Enhanced hover effect for event cards
    eventCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .filter-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Navbar scroll effect
    let lastScroll = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(218, 37, 29, 0.3)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(218, 37, 29, 0.2)';
        }
        
        lastScroll = currentScroll;
    });

    // Count up animation for stats
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                statNumbers.forEach(stat => {
                    animateValue(stat);
                });
            }
        });
    }, observerOptions);

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    function animateValue(element) {
        const text = element.textContent;
        const hasPlus = text.includes('+');
        const number = parseInt(text.replace(/\D/g, ''));
        const duration = 2000;
        const increment = number / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                element.textContent = number + (hasPlus ? '+' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (hasPlus ? '+' : '');
            }
        }, 16);
    }

    // Add loading state to event cards
    eventCards.forEach(card => {
        const eventLink = card.querySelector('.event-link');
        if (eventLink) {
            eventLink.addEventListener('click', function(e) {
                e.preventDefault();
                this.innerHTML = 'Loading... ⏳';
                
                // Simulate loading - replace with actual navigation
                setTimeout(() => {
                    this.innerHTML = 'Read More →';
                    // window.location.href = this.getAttribute('href');
                }, 500);
            });
        }
    });

    // Log active period for debugging
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Active Period:', this.dataset.period);
        });
    });

    // Add keyboard navigation for filter buttons
    filterButtons.forEach((btn, index) => {
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextBtn = filterButtons[index + 1] || filterButtons[0];
                nextBtn.focus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevBtn = filterButtons[index - 1] || filterButtons[filterButtons.length - 1];
                prevBtn.focus();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Console welcome message
    console.log('%c🇻🇳 Vietnamese History Project', 'color: #da251d; font-size: 20px; font-weight: bold;');
    console.log('%cExploring 4000+ years of Vietnamese history', 'color: #64748b; font-size: 14px;');
});

// CSS for ripple effect (to be added via JavaScript)
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);