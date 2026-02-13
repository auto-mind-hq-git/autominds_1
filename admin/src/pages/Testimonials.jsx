import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { Plus, Edit2, Trash2, X, Save, MessageSquare, Quote } from 'lucide-react';

const TestimonialModal = ({ isOpen, onClose, testimonial, onSave, isSubmitting }) => {
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        company: '',
        text: '',
        initials: ''
    });

    useEffect(() => {
        if (testimonial) {
            setFormData(testimonial);
        } else {
            setFormData({
                name: '',
                position: '',
                company: '',
                text: '',
                initials: ''
            });
        }
    }, [testimonial, isOpen]);

    useEffect(() => {
        if (formData.name && !testimonial) {
            const initials = formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            setFormData(prev => ({ ...prev, initials }));
        }
    }, [formData.name, testimonial]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white font-orbitron">
                        {testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                    </h2>
                    <button onClick={onClose} disabled={isSubmitting} className="text-slate-400 hover:text-white transition-colors disabled:opacity-50">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Client Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Position</label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Company</label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Testimonial Text</label>
                        <textarea
                            name="text"
                            value={formData.text}
                            onChange={handleChange}
                            rows="4"
                            maxLength="300"
                            required
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-500"
                        ></textarea>
                        <p className="text-xs text-slate-500 text-right mt-1">{formData.text.length}/300</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Initials Badge</label>
                        <input
                            type="text"
                            name="initials"
                            value={formData.initials}
                            onChange={handleChange}
                            maxLength="2"
                            className="w-20 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-500 uppercase text-center font-bold tracking-widest"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-slate-300 bg-transparent border border-slate-600 rounded-lg hover:bg-slate-800 hover:text-white transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 shadow-lg shadow-cyan-500/20 flex items-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(null);

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            // Ensure DB has data
            await DataService.checkAndSeedDatabase();

            const data = await DataService.getTestimonials();
            setTestimonials(data || []);
        } catch (error) {
            console.error("Error fetching testimonials:", error);
            alert("Failed to load testimonials.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleAdd = () => {
        setCurrentTestimonial(null);
        setIsModalOpen(true);
    };

    const handleEdit = (testimonial) => {
        setCurrentTestimonial(testimonial);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this testimonial?')) return;

        try {
            await DataService.deleteTestimonial(id);
            setTestimonials(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error("Error deleting testimonial:", error);
            alert("Failed to delete testimonial.");
            fetchTestimonials();
        }
    };

    const handleSave = async (data) => {
        setIsSubmitting(true);
        try {
            await DataService.saveTestimonial(data);
            setIsModalOpen(false);
            fetchTestimonials();
        } catch (error) {
            console.error("Error saving testimonial:", error);
            alert("Failed to save testimonial.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white font-orbitron tracking-wide">Testimonials</h1>
                <button
                    onClick={handleAdd}
                    className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 shadow-lg shadow-cyan-500/20 transition-all font-medium"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Testimonial
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 flex flex-col relative group hover:border-cyan-500/30 transition-all shadow-lg">
                            <div className="absolute top-6 right-6 text-slate-700 group-hover:text-cyan-500/20 transition-colors">
                                <Quote className="h-8 w-8" />
                            </div>

                            <div className="flex items-center mb-4">
                                <div className="h-10 w-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold text-sm border border-cyan-500/20">
                                    {testimonial.initials}
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-bold text-white tracking-wide">{testimonial.name}</h3>
                                    <p className="text-xs text-slate-400">{testimonial.position}, {testimonial.company}</p>
                                </div>
                            </div>

                            <p className="text-slate-300 text-sm flex-1 mb-6 italic leading-relaxed">"{testimonial.text}"</p>

                            <div className="flex justify-end space-x-2 pt-4 border-t border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(testimonial)}
                                    className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-colors"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(testimonial.id)}
                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {testimonials.length === 0 && (
                        <div className="col-span-full py-16 text-center text-slate-500 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                            <MessageSquare className="h-12 w-12 mx-auto text-slate-600 mb-3" />
                            <p>No testimonials yet. Add your first one!</p>
                        </div>
                    )}
                </div>
            )}

            <TestimonialModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                testimonial={currentTestimonial}
                onSave={handleSave}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default Testimonials;
