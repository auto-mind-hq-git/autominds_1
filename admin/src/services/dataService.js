// Mock Data Storage
const STORAGE_KEYS = {
    SERVICES: 'autominds_services',
    PROJECTS: 'autominds_projects',
    TESTIMONIALS: 'autominds_testimonials',
    STATS: 'autominds_stats',
    SETTINGS: 'autominds_settings'
};

// Initial Data Helper
const getInitialData = (key, defaultData) => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultData;
};

// Default Mock Data
const defaultServices = [
    {
        id: '1',
        title: 'AI Automation',
        description: 'Streamline operations with intelligent workflows that work 24/7.',
        icon: 'Zap',
        metrics: [
            { label: 'Workflows', value: '40+', icon: 'Zap' },
            { label: 'Savings', value: '60%', icon: 'Clock' }
        ],
        ctaText: 'Learn More'
    },
    {
        id: '2',
        title: 'Smart Web Solutions',
        description: 'Scalable websites that grow with your brand, powered by cutting-edge tech.',
        icon: 'Globe',
        metrics: [
            { label: 'Score', value: '99%', icon: 'Activity' },
            { label: 'Growth', value: '2x', icon: 'TrendingUp' }
        ],
        ctaText: 'Learn More'
    },
    {
        id: '3',
        title: 'Custom AI Agents',
        description: 'Tailored AI assistants that understand your business and serve your customers.',
        icon: 'Brain',
        metrics: [
            { label: 'Active', value: '24/7', icon: 'Bot' },
            { label: 'Reply', value: 'Instant', icon: 'MessageSquare' }
        ],
        ctaText: 'Learn More'
    }
];

const defaultProjects = [
    {
        id: '1',
        title: 'AI EMAIL AUTOMATION SYSTEM',
        category: 'AI AUTOMATION',
        description: 'A personalized outreach system that automatically generates, sends, and follows up on emails using AI. Analyzes recipient behavior to optimize timing and content for maximum engagement.',
        metrics: [
            { label: 'ENGAGEMENT RATE', value: '3x' },
            { label: 'TIME SAVED', value: '80%' }
        ],
        status: 'Active'
    },
    {
        id: '2',
        title: 'AI AD GENERATION AGENT',
        category: 'AI AGENT',
        description: 'An AI-powered agent that takes product images as input and automatically creates marketing ad creatives. Generates multiple variations of visuals and copy tailored to different platforms.',
        metrics: [
            { label: 'FASTER CREATION', value: '5x' },
            { label: 'AD VARIATIONS', value: '40+' }
        ],
        status: 'Active'
    },
    {
        id: '3',
        title: 'AI LEAD SCRAPING SYSTEM',
        category: 'AI AUTOMATION',
        description: 'An automated system that scrapes, cleans, and organizes lead data from multiple sources. AI filters and scores each lead before storing structured data directly into Google Sheets.',
        metrics: [
            { label: 'LEADS PER DAY', value: '500+' },
            { label: 'DATA ACCURACY', value: '90%' }
        ],
        status: 'Active'
    },
    {
        id: '4',
        title: 'AI YOUTUBE CONTENT ASSISTANT',
        category: 'CUSTOM AI AGENT',
        description: 'A Telegram-based AI assistant that researches YouTube trends, generates video topic ideas, creates outlines, and writes scripts. Automates the entire content planning workflow in one place.',
        metrics: [
            { label: 'RESEARCH SPEED', value: '10x' },
            { label: 'PLANNING TIME SAVED', value: '60%' }
        ],
        status: 'Active'
    },
    {
        id: '5',
        title: 'AI STOCK ANALYSIS AGENT',
        category: 'AI AGENT',
        description: 'An intelligent agent that performs real-time technical analysis on stocks. Scans market data, identifies patterns, generates reports, and provides data-driven insights to support investment decisions.',
        metrics: [
            { label: 'INDICATORS TRACKED', value: '15+' },
            { label: 'REPORT ACCURACY', value: '98%' }
        ],
        status: 'Active'
    }
];

const defaultTestimonials = [
    {
        id: '1',
        name: 'Sarah Jenkins',
        position: 'CEO',
        company: 'TechCrop',
        text: 'Autominds transformed our customer support. The AI agent handles 80% of queries, saving us countless hours and significantly improving response times.',
        initials: 'SJ'
    },
    {
        id: '2',
        name: 'David Chen',
        position: 'Director',
        company: 'FutureScale',
        text: 'The lead scoring system is a game changer. We only speak to qualified leads now, and our conversion rate has doubled in just two months.',
        initials: 'DC'
    },
    {
        id: '3',
        name: 'Marcus Thorne',
        position: 'Founder',
        company: 'NextGen',
        text: "Best investment we've made this year. The content generator maintains our brand voice perfectly and scales our marketing efforts effortlessly.",
        initials: 'MT'
    },
    {
        id: '4',
        name: 'Elena Rodriguez',
        position: 'COO',
        company: 'LogisticsPro',
        text: 'Autominds helped us scale our operations 10x without increasing headcount. The ROI was immediate and substantial.',
        initials: 'ER'
    },
    {
        id: '5',
        name: 'Michael Chang',
        position: 'VP Product',
        company: 'FinTechOne',
        text: 'Their custom AI agents are indistinguishable from human support. Our customer satisfaction score hit an all-time high.',
        initials: 'MC'
    }
];

export const DataService = {
    // Generic Helper
    _getItems: (key) => getInitialData(key, []),
    _saveItems: (key, items) => localStorage.setItem(key, JSON.stringify(items)),

    // Services
    getServices: async () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(getInitialData(STORAGE_KEYS.SERVICES, defaultServices)), 500);
        });
    },

    saveService: async (service) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let services = getInitialData(STORAGE_KEYS.SERVICES, defaultServices);
                if (service.id) {
                    services = services.map(s => s.id === service.id ? service : s);
                } else {
                    service.id = Date.now().toString();
                    services.push(service);
                }
                localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
                resolve(service);
            }, 500);
        });
    },

    deleteService: async (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let services = getInitialData(STORAGE_KEYS.SERVICES, defaultServices);
                services = services.filter(s => s.id !== id);
                localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
                resolve(true);
            }, 500);
        });
    },

    // Projects
    getProjects: async () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(getInitialData(STORAGE_KEYS.PROJECTS, defaultProjects)), 500);
        });
    },

    saveProject: async (project) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let projects = getInitialData(STORAGE_KEYS.PROJECTS, defaultProjects);
                if (project.id) {
                    projects = projects.map(p => p.id === project.id ? project : p);
                } else {
                    project.id = Date.now().toString();
                    projects.push(project);
                }
                localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
                resolve(project);
            }, 500);
        });
    },

    deleteProject: async (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let projects = getInitialData(STORAGE_KEYS.PROJECTS, defaultProjects);
                projects = projects.filter(p => p.id !== id);
                localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
                resolve(true);
            }, 500);
        });
    },

    // Testimonials
    getTestimonials: async () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(getInitialData(STORAGE_KEYS.TESTIMONIALS, defaultTestimonials)), 500);
        });
    },

    saveTestimonial: async (testimonial) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let testimonials = getInitialData(STORAGE_KEYS.TESTIMONIALS, defaultTestimonials);
                if (testimonial.id) {
                    testimonials = testimonials.map(t => t.id === testimonial.id ? testimonial : t);
                } else {
                    testimonial.id = Date.now().toString();
                    testimonials.push(testimonial);
                }
                localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
                resolve(testimonial);
            }, 500);
        });
    },

    deleteTestimonial: async (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let testimonials = getInitialData(STORAGE_KEYS.TESTIMONIALS, defaultTestimonials);
                testimonials = testimonials.filter(t => t.id !== id);
                localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
                resolve(true);
            }, 500);
        });
    }
};
