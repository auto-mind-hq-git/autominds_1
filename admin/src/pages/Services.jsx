import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { Plus, Edit2, Trash2, X, Save, Zap, Clock, Activity, TrendingUp, Target, Server, Bot, Globe, Brain } from 'lucide-react';

// Icon Mapper for display
const IconMap = {
    Bot, Globe, Brain, Zap, Clock, Activity, TrendingUp, Target, Server
};

const ServiceModal = ({ isOpen, onClose, service, onSave, isSubmitting }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        icon: 'Bot',
        ctaText: '',
        metrics: []
    });

    useEffect(() => {
        if (service) {
            setFormData({
                ...service,
                metrics: service.metrics || []
            });
        } else {
            setFormData({
                title: '',
                description: '',
                icon: 'Bot',
                ctaText: 'Learn More',
                metrics: [
                    { label: 'Metric 1', value: 'Value 1', icon: 'Zap' }
                ]
            });
        }
    }, [service, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMetricChange = (index, field, value) => {
        const newMetrics = [...formData.metrics];
        newMetrics[index] = { ...newMetrics[index], [field]: value };
        setFormData(prev => ({ ...prev, metrics: newMetrics }));
    };

    const addMetric = () => {
        setFormData(prev => ({
            ...prev,
            metrics: [...prev.metrics, { label: '', value: '', icon: 'Zap' }]
        }));
    };

    const removeMetric = (index) => {
        setFormData(prev => ({
            ...prev,
            metrics: prev.metrics.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white font-orbitron">
                        {service ? 'Edit Service' : 'Add New Service'}
                    </h2>
                    <button onClick={onClose} disabled={isSubmitting} className="text-slate-400 hover:text-white transition-colors disabled:opacity-50">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Service Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Icon Name (Lucide)</label>
                        <input
                            type="text"
                            name="icon"
                            value={formData.icon}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-500"
                            placeholder="e.g., Bot, Globe, Brain"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            required
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-500"
                        ></textarea>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-slate-300">Metrics (Key Performance Indicators)</label>
                            <button type="button" onClick={addMetric} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center">
                                <Plus className="h-3 w-3 mr-1" /> Add Metric
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {formData.metrics.map((metric, index) => (
                                <div key={index} className="space-y-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700 relative group">
                                    <button
                                        type="button"
                                        onClick={() => removeMetric(index)}
                                        className="absolute top-2 right-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    <h4 className="text-sm font-semibold text-cyan-400">Metric {index + 1}</h4>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">Label</label>
                                        <input
                                            type="text"
                                            value={metric.label}
                                            onChange={(e) => handleMetricChange(index, 'label', e.target.value)}
                                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-sm text-white focus:outline-none focus:border-cyan-500"
                                            placeholder="e.g. Savings"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">Value</label>
                                        <input
                                            type="text"
                                            value={metric.value}
                                            onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
                                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-sm text-white focus:outline-none focus:border-cyan-500"
                                            placeholder="e.g. 60%"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">CTA Text</label>
                        <input
                            type="text"
                            name="ctaText"
                            value={formData.ctaText}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-500"
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
                                    Save Service
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null);

    const fetchServices = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await DataService.getServices();
            setServices(data || []);
        } catch (error) {
            console.error("Error fetching services:", error);
            setError(error.message || "Failed to load services. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleAdd = () => {
        setCurrentService(null);
        setIsModalOpen(true);
    };

    const handleEdit = (service) => {
        setCurrentService(service);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;

        try {
            await DataService.deleteService(id);
            // Optimistic update
            setServices(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error("Error deleting service:", error);
            alert("Failed to delete service. Please try again.");
            fetchServices(); // Revert on error
        }
    };

    const handleSave = async (serviceData) => {
        setIsSubmitting(true);
        try {
            await DataService.saveService(serviceData);
            setIsModalOpen(false);
            fetchServices();
        } catch (error) {
            console.error("Error saving service:", error);
            alert("Failed to save service. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white font-orbitron tracking-wide">Services Management</h1>
                <button
                    onClick={handleAdd}
                    className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 shadow-lg shadow-cyan-500/20 transition-all font-medium"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Service
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-12 space-y-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500"></div>
                    <p className="text-sm text-slate-400">Loading services...</p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center p-12 space-y-4 bg-slate-800/30 rounded-xl border border-red-500/20">
                    <div className="text-red-400 text-center">
                        <svg className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                    <button
                        onClick={fetchServices}
                        className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => {
                        const Icon = IconMap[service.icon] || Bot;
                        return (
                            <div key={service.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden flex flex-col hover:border-cyan-500/30 transition-all group shadow-xl">
                                <div className="p-6 flex-1">
                                    <div className="h-12 w-12 bg-slate-700/50 rounded-lg flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                                        <Icon className="h-7 w-7" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2 font-orbitron tracking-wide">{service.title}</h3>
                                    <p className="text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed">{service.description}</p>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        {/* Ensure metrics is an array before mapping */}
                                        {(service.metrics || []).map((metric, idx) => (
                                            <div key={idx} className="bg-slate-900/50 p-3 rounded border border-slate-800">
                                                <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">{metric.label}</span>
                                                <span className="block text-sm font-bold text-cyan-400">{metric.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-slate-900/30 px-6 py-4 border-t border-slate-800 flex justify-between items-center">
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{service.ctaText}</span>
                                    <div className="flex space-x-2">
                                        <button
                                            aria-label="Edit Service"
                                            onClick={() => handleEdit(service)}
                                            className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-colors"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            aria-label="Delete Service"
                                            onClick={() => handleDelete(service.id)}
                                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            <ServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                service={currentService}
                onSave={handleSave}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default Services;
