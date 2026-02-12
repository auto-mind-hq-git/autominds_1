import { db } from '../../../src/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, writeBatch } from 'firebase/firestore';

// Collection Names
const COLLECTIONS = {
    SERVICES: 'services',
    PROJECTS: 'projects',
    TESTIMONIALS: 'testimonials'
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


// Helper: Fetch all documents from a collection
const fetchCollection = async (collectionName) => {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const items = [];
        querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
        });
        return items;
    } catch (error) {
        console.error(`Error fetching ${collectionName}:`, error);
        return [];
    }
};

export const DataService = {
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

            await Promise.all(batchPromises);
            console.log("DB Seed Completed.");
            return true;
        } catch (error) {
            console.error("Error seeding database:", error);
            throw error;
        }
    },

    // Check if DB is empty and seed if necessary
    checkAndSeedDatabase: async () => {
        try {
            const servicesSnapshot = await getDocs(collection(db, COLLECTIONS.SERVICES));
            if (servicesSnapshot.empty) {
                console.log("Database appears empty. Auto-seeding default data...");
                await DataService.seedDatabase();
                return true; // Seeded
            }
            return false; // Already has data
        } catch (error) {
            console.error("Error checking database:", error);
            return false;
        }
    },

    // Services
    getServices: async () => {
        return await fetchCollection(COLLECTIONS.SERVICES);
    },

    saveService: async (service) => {
        try {
            if (service.id) {
                // Update
                const docRef = doc(db, COLLECTIONS.SERVICES, service.id);
                // Remove id from data to avoid redundancy
                const { id, ...data } = service;
                await updateDoc(docRef, data);
                return service;
            } else {
                // Add
                const docRef = await addDoc(collection(db, COLLECTIONS.SERVICES), service);
                return { id: docRef.id, ...service };
            }
        } catch (error) {
            console.error("Error saving service:", error);
            throw error;
        }
    },

    deleteService: async (id) => {
        try {
            await deleteDoc(doc(db, COLLECTIONS.SERVICES, id));
            return true;
        } catch (error) {
            console.error("Error deleting service:", error);
            throw error;
        }
    },

    // Projects
    getProjects: async () => {
        return await fetchCollection(COLLECTIONS.PROJECTS);
    },

    saveProject: async (project) => {
        try {
            if (project.id) {
                const docRef = doc(db, COLLECTIONS.PROJECTS, project.id);
                const { id, ...data } = project;
                await updateDoc(docRef, data);
                return project;
            } else {
                const docRef = await addDoc(collection(db, COLLECTIONS.PROJECTS), project);
                return { id: docRef.id, ...project };
            }
        } catch (error) {
            console.error("Error saving project:", error);
            throw error;
        }
    },

    deleteProject: async (id) => {
        try {
            await deleteDoc(doc(db, COLLECTIONS.PROJECTS, id));
            return true;
        } catch (error) {
            console.error("Error deleting project:", error);
            throw error;
        }
    },

    // Testimonials
    getTestimonials: async () => {
        return await fetchCollection(COLLECTIONS.TESTIMONIALS);
    },

    saveTestimonial: async (testimonial) => {
        try {
            if (testimonial.id) {
                const docRef = doc(db, COLLECTIONS.TESTIMONIALS, testimonial.id);
                const { id, ...data } = testimonial;
                await updateDoc(docRef, data);
                return testimonial;
            } else {
                const docRef = await addDoc(collection(db, COLLECTIONS.TESTIMONIALS), testimonial);
                return { id: docRef.id, ...testimonial };
            }
        } catch (error) {
            console.error("Error saving testimonial:", error);
            throw error;
        }
    },

    deleteTestimonial: async (id) => {
        try {
            await deleteDoc(doc(db, COLLECTIONS.TESTIMONIALS, id));
            return true;
        } catch (error) {
            console.error("Error deleting testimonial:", error);
            throw error;
        }
    }
};
