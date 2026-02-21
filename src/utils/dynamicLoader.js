/**
 * dynamicLoader.js
 * 
 * Handles loading dynamic content from Firebase Firestore
 * and rendering it into the main website DOM.
 */
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// Collection Names
const COLLECTIONS = {
    SERVICES: 'services',
    PROJECTS: 'projects',
    TESTIMONIALS: 'testimonials',
    WEBSITES: 'websites'
};

// Helper: Fetch Data from Firestore
const fetchCollection = async (collectionName) => {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const items = [];
        querySnapshot.forEach((doc) => {
            // Include ID but purely for reference, rendering uses data fields
            items.push({ id: doc.id, ...doc.data() });
        });
        return items;
    } catch (error) {
        console.error(`Error loading ${collectionName} from Firebase:`, error);
        return [];
    }
};

// 1. Render Services
const renderServices = async () => {
    const services = await fetchCollection(COLLECTIONS.SERVICES);
    if (!services || services.length === 0) return;

    const container = document.querySelector('.services-grid');
    if (!container) return;

    // Preserve existing structure but inject data
    container.innerHTML = services.map(service => `
        <div class="service-card glass-panel fade-in-section is-visible">
            <div class="icon-box glow-cyan">
                ${getIcon(service.icon)}
            </div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <div class="service-metrics">
                ${service.metrics ? service.metrics.map(m => `
                    <div class="s-metric"><span>${m.icon ? getIconEmoji(m.icon) : '⚡'}</span> ${m.value} ${m.label}</div>
                `).join('') : ''}
            </div>
            <a href="#contact" class="service-link">${service.ctaText || 'Learn More'} →</a>
        </div>
    `).join('');
};

// 2. Render Projects
const renderProjects = async () => {
    const projects = await fetchCollection(COLLECTIONS.PROJECTS);
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
                    ${project.metrics ? project.metrics.map(m => `
                        <div class="metric-item">
                            <span class="metric-value">${m.value}</span>
                            <span class="metric-label">${m.label}</span>
                        </div>
                    `).join('') : ''}
                </div>
            </div>
        </div>
    `).join('');
};

// 3. Render Testimonials
const renderTestimonials = async () => {
    const testimonials = await fetchCollection(COLLECTIONS.TESTIMONIALS);
    if (!testimonials || testimonials.length === 0) return;

    const container = document.querySelector('.testimonial-track');
    if (!container) return;

    container.innerHTML = testimonials.map(t => `
        <div class="testimonial-card">
            <div class="quote-icon">“</div>
            <p class="t-text">${t.text}</p>
            <div class="t-author">
                <div class="t-avatar">${t.initials || (t.name ? t.name.substring(0, 2).toUpperCase() : 'UR')}</div>
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

// 4. Render Websites (Portfolio page)
const renderWebsites = async () => {
    const websites = await fetchCollection(COLLECTIONS.WEBSITES);
    if (!websites || websites.length === 0) return;

    const container = document.querySelector('.websites-portfolio-grid');
    if (!container) return;

    container.innerHTML = websites.map(w => {
        const tags = Array.isArray(w.tags) ? w.tags : [];
        const tagsHtml = tags.map(t => `<span class="project-category" style="position:relative;top:auto;left:auto;display:inline-block;margin-right:6px;">${t.toUpperCase()}</span>`).join('');
        const metricsHtml = (w.metrics || []).map(m => `
            <div class="metric-item">
                <span class="metric-value">${m.value}</span>
                <span class="metric-label">${m.label}</span>
            </div>
        `).join('');

        return `
        <div class="portfolio-card fade-in-section is-visible">
            <div class="project-thumbnail">
                <div class="project-overlay-gradient"></div>
                <div class="project-category">WEBSITE</div>
                <div class="thumb-icon-container">
                    <i class="fas ${w.icon || 'fa-globe'}"></i>
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${(w.name || '').toUpperCase()}</h3>
                <p class="project-description">${w.description || ''}</p>
                ${metricsHtml ? `<div class="project-metrics">${metricsHtml}</div>` : ''}
                <a href="${w.url}" target="_blank" rel="noopener noreferrer" class="view-case-study">
                    Visit Website <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>`;
    }).join('');
};

// Main Init Function
export const initDynamicContent = async () => {
    console.log('Connecting to Global Database...');
    await Promise.all([
        renderServices(),
        renderProjects(),
        renderTestimonials(),
        renderWebsites()
    ]);
    console.log('Global Content Loaded.');

    window.dispatchEvent(new Event('contentLoaded'));
};
