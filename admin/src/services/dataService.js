import { db } from '../../../src/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

// Collection Names
const COLLECTIONS = {
    SERVICES: 'services',
    PROJECTS: 'projects',
    TESTIMONIALS: 'testimonials',
    WEBSITES: 'websites'
};

// Cache Object
const cache = {
    services: null,
    projects: null,
    testimonials: null,
    websites: null,
    lastFetch: {
        services: 0,
        projects: 0,
        testimonials: 0,
        websites: 0
    }
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const FETCH_TIMEOUT = 45000; // 45 second timeout for Firestore calls

// Timeout wrapper - prevents Firestore calls from hanging forever
const withTimeout = (promise, ms = FETCH_TIMEOUT) => {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Firestore request timed out after ${ms / 1000}s. Check your internet connection.`)), ms)
        )
    ]);
};

// Default Data for Seeding
const defaultServices = [
    {
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
        name: 'Sarah Jenkins',
        position: 'CEO',
        company: 'TechCrop',
        text: 'Autominds transformed our customer support. The AI agent handles 80% of queries, saving us countless hours and significantly improving response times.',
        initials: 'SJ'
    },
    {
        name: 'David Chen',
        position: 'Director',
        company: 'FutureScale',
        text: 'The lead scoring system is a game changer. We only speak to qualified leads now, and our conversion rate has doubled in just two months.',
        initials: 'DC'
    },
    {
        name: 'Marcus Thorne',
        position: 'Founder',
        company: 'NextGen',
        text: "Best investment we've made this year. The content generator maintains our brand voice perfectly and scales our marketing efforts effortlessly.",
        initials: 'MT'
    },
    {
        name: 'Elena Rodriguez',
        position: 'COO',
        company: 'LogisticsPro',
        text: 'Autominds helped us scale our operations 10x without increasing headcount. The ROI was immediate and substantial.',
        initials: 'ER'
    },
    {
        name: 'Michael Chang',
        position: 'VP Product',
        company: 'FinTechOne',
        text: 'Their custom AI agents are indistinguishable from human support. Our customer satisfaction score hit an all-time high.',
        initials: 'MC'
    }
];

const defaultWebsites = [
    {
        name: 'Veltrix Studio',
        url: 'https://veltrixstudioai.in',
        description: 'Premium AI Production Studio — AI-generated imagery for forward-thinking brands, products, and businesses.',
        tags: ['AI Studio', 'Branding'],
        icon: 'fa-palette',
        metrics: [
            { label: 'STUDIO', value: 'AI' },
            { label: 'CUSTOM DESIGN', value: '100%' }
        ]
    }
];

// Helper: Fetch all documents from a collection
const fetchCollection = async (collectionName, cacheKey) => {
    // Check Cache
    const now = Date.now();
    if (cache[cacheKey] && (now - cache.lastFetch[cacheKey] < CACHE_DURATION)) {
        console.log(`Using cached ${collectionName}`);
        return cache[cacheKey];
    }

    try {
        console.log(`Fetching ${collectionName} from Firestore...`);
        const querySnapshot = await withTimeout(getDocs(collection(db, collectionName)));
        const items = [];
        querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
        });

        // Update Cache
        cache[cacheKey] = items;
        cache.lastFetch[cacheKey] = now;

        return items;
    } catch (error) {
        console.error(`Error fetching ${collectionName}:`, error);
        // Re-throw so the UI can show an error state instead of empty data
        throw error;
    }
};

// Helper: Invalidate Cache
const invalidateCache = (cacheKey) => {
    cache[cacheKey] = null;
    cache.lastFetch[cacheKey] = 0;
};

export const DataService = {
    isInitialized: false,

    // Seeding Function
    seedDatabase: async () => {
        try {
            console.log("Starting DB Seed...");
            const batchPromises = [];

            // Add Services
            for (const service of defaultServices) {
                batchPromises.push(addDoc(collection(db, COLLECTIONS.SERVICES), service));
            }

            // Add Projects
            for (const project of defaultProjects) {
                batchPromises.push(addDoc(collection(db, COLLECTIONS.PROJECTS), project));
            }

            // Add Testimonials
            for (const testimonial of defaultTestimonials) {
                batchPromises.push(addDoc(collection(db, COLLECTIONS.TESTIMONIALS), testimonial));
            }

            // Add Websites
            for (const website of defaultWebsites) {
                batchPromises.push(addDoc(collection(db, COLLECTIONS.WEBSITES), website));
            }

            await withTimeout(Promise.all(batchPromises), 30000);
            console.log("DB Seed Completed.");

            // Invalidate all caches after seed
            invalidateCache('services');
            invalidateCache('projects');
            invalidateCache('testimonials');
            invalidateCache('websites');

            return true;
        } catch (error) {
            console.error("Error seeding database:", error);
            throw error;
        }
    },

    // Check if DB is empty and seed if necessary
    checkAndSeedDatabase: async (forceCheck = false) => {
        try {
            // Check local storage AND database to be safe
            if (!forceCheck && localStorage.getItem('autominds_db_seeded') === 'all') {
                return false;
            }

            const servicesSnapshot = await withTimeout(getDocs(collection(db, COLLECTIONS.SERVICES)));
            let seededSomething = false;

            if (servicesSnapshot.empty) {
                console.log("Database appears empty. Auto-seeding default data...");
                await DataService.seedDatabase();
                seededSomething = true;
            } else {
                // If services exist, just check if websites exist (since we added it later)
                const websitesSnapshot = await withTimeout(getDocs(collection(db, COLLECTIONS.WEBSITES)));
                if (websitesSnapshot.empty) {
                    console.log("Websites collection empty. Seeding default websites...");
                    const batchPromises = [];
                    for (const website of defaultWebsites) {
                        batchPromises.push(addDoc(collection(db, COLLECTIONS.WEBSITES), website));
                    }
                    await withTimeout(Promise.all(batchPromises), 15000);
                    invalidateCache('websites');
                    seededSomething = true;
                }
            }

            // Ensure flag is set so we don't keep firing this check
            localStorage.setItem('autominds_db_seeded', 'all');

            return seededSomething;
        } catch (error) {
            console.error("Error checking database:", error);
            throw error;
        }
    },

    // Remove duplicates
    cleanupDuplicates: async () => {
        try {
            console.log("Starting cleanup...");
            const stats = { services: 0, projects: 0, testimonials: 0 };

            const cleanupCollection = async (collectionName, key) => {
                const snapshot = await withTimeout(getDocs(collection(db, collectionName)));
                const seen = new Set();
                const duplicates = [];

                snapshot.forEach(doc => {
                    const data = doc.data();
                    const identifier = data.title || data.name;
                    if (identifier) {
                        if (seen.has(identifier)) {
                            duplicates.push(doc.id);
                        } else {
                            seen.add(identifier);
                        }
                    }
                });

                for (const id of duplicates) {
                    await withTimeout(deleteDoc(doc(db, collectionName, id)));
                    stats[key]++;
                }
            };

            await cleanupCollection(COLLECTIONS.SERVICES, 'services');
            await cleanupCollection(COLLECTIONS.PROJECTS, 'projects');
            await cleanupCollection(COLLECTIONS.TESTIMONIALS, 'testimonials');

            // Invalidate caches
            invalidateCache('services');
            invalidateCache('projects');
            invalidateCache('testimonials');

            return stats;
        } catch (error) {
            console.error("Error cleaning duplicates:", error);
            throw error;
        }
    },

    // Services
    getServices: async () => {
        return await fetchCollection(COLLECTIONS.SERVICES, 'services');
    },

    saveService: async (service) => {
        try {
            let result;
            if (service.id) {
                const docRef = doc(db, COLLECTIONS.SERVICES, service.id);
                const { id, ...data } = service;
                await withTimeout(updateDoc(docRef, data));
                result = service;
            } else {
                const docRef = await withTimeout(addDoc(collection(db, COLLECTIONS.SERVICES), service));
                result = { id: docRef.id, ...service };
            }
            invalidateCache('services');
            return result;
        } catch (error) {
            console.error("Error saving service:", error);
            throw error;
        }
    },

    deleteService: async (id) => {
        try {
            await withTimeout(deleteDoc(doc(db, COLLECTIONS.SERVICES, id)));
            invalidateCache('services');
            return true;
        } catch (error) {
            console.error("Error deleting service:", error);
            throw error;
        }
    },

    // Projects
    getProjects: async () => {
        return await fetchCollection(COLLECTIONS.PROJECTS, 'projects');
    },

    saveProject: async (project) => {
        try {
            let result;
            if (project.id) {
                const docRef = doc(db, COLLECTIONS.PROJECTS, project.id);
                const { id, ...data } = project;
                await withTimeout(updateDoc(docRef, data));
                result = project;
            } else {
                const docRef = await withTimeout(addDoc(collection(db, COLLECTIONS.PROJECTS), project));
                result = { id: docRef.id, ...project };
            }
            invalidateCache('projects');
            return result;
        } catch (error) {
            console.error("Error saving project:", error);
            throw error;
        }
    },

    deleteProject: async (id) => {
        try {
            await withTimeout(deleteDoc(doc(db, COLLECTIONS.PROJECTS, id)));
            invalidateCache('projects');
            return true;
        } catch (error) {
            console.error("Error deleting project:", error);
            throw error;
        }
    },

    // Testimonials
    getTestimonials: async () => {
        return await fetchCollection(COLLECTIONS.TESTIMONIALS, 'testimonials');
    },

    saveTestimonial: async (testimonial) => {
        try {
            let result;
            if (testimonial.id) {
                const docRef = doc(db, COLLECTIONS.TESTIMONIALS, testimonial.id);
                const { id, ...data } = testimonial;
                await withTimeout(updateDoc(docRef, data));
                result = testimonial;
            } else {
                const docRef = await withTimeout(addDoc(collection(db, COLLECTIONS.TESTIMONIALS), testimonial));
                result = { id: docRef.id, ...testimonial };
            }
            invalidateCache('testimonials');
            return result;
        } catch (error) {
            console.error("Error saving testimonial:", error);
            throw error;
        }
    },

    deleteTestimonial: async (id) => {
        try {
            await withTimeout(deleteDoc(doc(db, COLLECTIONS.TESTIMONIALS, id)));
            invalidateCache('testimonials');
            return true;
        } catch (error) {
            console.error("Error deleting testimonial:", error);
            throw error;
        }
    },

    // Websites
    getWebsites: async () => {
        return await fetchCollection(COLLECTIONS.WEBSITES, 'websites');
    },

    saveWebsite: async (website) => {
        try {
            let result;
            if (website.id) {
                const docRef = doc(db, COLLECTIONS.WEBSITES, website.id);
                const { id, ...data } = website;
                await withTimeout(updateDoc(docRef, data));
                result = website;
            } else {
                const docRef = await withTimeout(addDoc(collection(db, COLLECTIONS.WEBSITES), website));
                result = { id: docRef.id, ...website };
            }
            invalidateCache('websites');
            return result;
        } catch (error) {
            console.error("Error saving website:", error);
            throw error;
        }
    },

    deleteWebsite: async (id) => {
        try {
            await withTimeout(deleteDoc(doc(db, COLLECTIONS.WEBSITES, id)));
            invalidateCache('websites');
            return true;
        } catch (error) {
            console.error("Error deleting website:", error);
            throw error;
        }
    }
};
