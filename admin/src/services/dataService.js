import { db } from '../../../src/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

// Collection Names
const COLLECTIONS = {
    SERVICES: 'services',
    PROJECTS: 'projects',
    TESTIMONIALS: 'testimonials'
};

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
