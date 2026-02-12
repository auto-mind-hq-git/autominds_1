/**
 * dynamicLoader.js
 * 
 * Handles loading dynamic content from localStorage (shared with Admin Panel)
 * and rendering it into the main website DOM.
 */

// Storage Keys matching Admin DataService
const STORAGE_KEYS = {
    SERVICES: 'autominds_services',
    PROJECTS: 'autominds_projects',
    TESTIMONIALS: 'autominds_testimonials'
};

// Helper: Get Data
const getData = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

// 1. Render Services
const renderServices = () => {
    const services = getData(STORAGE_KEYS.SERVICES);
    if (!services || services.length === 0) return;

    const container = document.querySelector('.services-grid');
    if (!container) return;

    container.innerHTML = services.map(service => `
        <div class="service-card glass-panel fade-in-section is-visible">
            <div class="icon-box glow-cyan">
                ${getIcon(service.icon)}
            </div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <div class="service-metrics">
                ${service.metrics.map(m => `
                    <div class="s-metric"><span>${m.icon ? getIconEmoji(m.icon) : '⚡'}</span> ${m.value} ${m.label}</div>
                `).join('')}
            </div>
            <a href="#contact" class="service-link">${service.ctaText || 'Learn More'} →</a>
        </div>
    `).join('');
};

// 2. Render Projects
const renderProjects = () => {
    const projects = getData(STORAGE_KEYS.PROJECTS);
    if (!projects || projects.length === 0) return;

    const container = document.querySelector('.portfolio-grid');
    if (!container) return;

    container.innerHTML = projects.map(project => `
        <div class="portfolio-card fade-in-section is-visible">
            <div class="project-thumbnail">
                <div class="project-overlay-gradient"></div>
                <div class="project-category">${project.category || 'AI SOLUTION'}</div>
                <div class="thumb-icon-container">
                    <i class="fas fa-rocket"></i>
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-metrics">
                    ${project.metrics.map(m => `
                        <div class="metric-item">
                            <span class="metric-value">${m.value}</span>
                            <span class="metric-label">${m.label}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');
};

// 3. Render Testimonials
const renderTestimonials = () => {
    const testimonials = getData(STORAGE_KEYS.TESTIMONIALS);
    if (!testimonials || testimonials.length === 0) return;

    const container = document.querySelector('.testimonial-track');
    if (!container) return;

    container.innerHTML = testimonials.map(t => `
        <div class="testimonial-card">
            <div class="quote-icon">“</div>
            <p class="t-text">${t.text}</p>
            <div class="t-author">
                <div class="t-avatar">${t.initials || t.name.substring(0, 2).toUpperCase()}</div>
                <div class="t-info">
                    <h4>${t.name}</h4>
                    <p>${t.position}, ${t.company}</p>
                </div>
            </div>
        </div>
    `).join('');
};

// Helper: Icon Mapping (Simple mapping for now)
const getIcon = (iconName) => {
    // Return emoji or SVG based on string
    const map = {
        'Bot': '🤖',
        'Zap': '⚡',
        'Globe': '🌐',
        'Brain': '🧠',
        'Activity': '📈',
        'Clock': '⏱️',
        'Target': '🎯',
        'Server': '🖥️',
        'MessageSquare': '💬'
    };
    return map[iconName] || '⚙️';
};

const getIconEmoji = (iconName) => {
    return getIcon(iconName);
};

// Main Init Function
export const initDynamicContent = () => {
    // Only run if we actually have data, otherwise keep static HTML (SEO fallback)
    if (localStorage.getItem(STORAGE_KEYS.SERVICES)) {
        console.log('Loading Dynamic Services...');
        renderServices();
    }

    if (localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
        console.log('Loading Dynamic Projects...');
        renderProjects();
    }

    if (localStorage.getItem(STORAGE_KEYS.TESTIMONIALS)) {
        console.log('Loading Dynamic Testimonials...');
        renderTestimonials();
    }

    // Dispatch event to re-initialize observers or carousels if needed
    window.dispatchEvent(new Event('contentLoaded'));
};
