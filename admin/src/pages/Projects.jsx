import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { Plus, Edit2, Trash2, X, Save, Search, Filter, Briefcase } from 'lucide-react';

const ProjectModal = ({ isOpen, onClose, project, onSave, isSubmitting }) => {
    const [formData, setFormData] = useState({
        title: '',
        category: 'AI Automation',
        description: '',
        metrics: [],
        status: 'Active'
    });

    useEffect(() => {
        if (project) {
            setFormData({
                ...project,
                metrics: project.metrics || []
            });
        } else {
            setFormData({
                title: '',
                category: 'AI Automation',
                description: '',
                metrics: [
                    { label: 'Metric 1', value: '' }
                ],
                status: 'Active'
            });
        }
    }, [project, isOpen]);

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
            metrics: [...prev.metrics, { label: '', value: '' }]
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
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white font-orbitron">
                        {project ? 'Edit Project' : 'Add New Project'}
                    </h2>
                    <button onClick={onClose} disabled={isSubmitting} className="text-slate-400 hover:text-white transition-colors disabled:opacity-50">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Project Title</label>
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
                            <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            >
                                <option>AI Automation</option>
                                <option>AI Agent</option>
                                <option>Custom AI Agent</option>
                                <option>Web Solution</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            required
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-500"
                        ></textarea>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-slate-300">Metrics (Results & Impact)</label>
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
                                            placeholder="e.g. Time Saved"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">Value</label>
                                        <input
                                            type="text"
                                            value={metric.value}
                                            onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
                                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-sm text-white focus:outline-none focus:border-cyan-500"
                                            placeholder="e.g. 50%"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        >
                            <option>Active</option>
                            <option>Draft</option>
                            <option>Archived</option>
                        </select>
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
                                    Save Project
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchProjects = async () => {
        try {
            setLoading(true);

            // Try fetching data first (fastest path)
            let data = await DataService.getProjects();

            // Only check seeding if data is empty
            if (!data || data.length === 0) {
                const seeded = await DataService.checkAndSeedDatabase();
                if (seeded) {
                    data = await DataService.getProjects();
                }
            }

            setProjects(data || []);
        } catch (error) {
            console.error("Error fetching projects:", error);
            alert("Failed to load projects.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleAdd = () => {
        setCurrentProject(null);
        setIsModalOpen(true);
    };

    const handleEdit = (project) => {
        setCurrentProject(project);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;

        try {
            await DataService.deleteProject(id);
            setProjects(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error("Error deleting project:", error);
            alert("Failed to delete project.");
            fetchProjects();
        }
    };

    const handleSave = async (projectData) => {
        setIsSubmitting(true);
        try {
            await DataService.saveProject(projectData);
            setIsModalOpen(false);
            fetchProjects();
        } catch (error) {
            console.error("Error saving project:", error);
            alert("Failed to save project.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-white font-orbitron tracking-wide">Portfolio Projects</h1>
                <button
                    onClick={handleAdd}
                    className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 shadow-lg shadow-cyan-500/20 transition-all font-medium"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Project
                </button>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-700 flex items-center">
                    <Search className="h-5 w-5 text-slate-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search projects by title or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm text-white placeholder-slate-500"
                    />
                    <Filter className="h-5 w-5 text-slate-400 ml-4 cursor-pointer hover:text-white transition-colors" />
                </div>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-700">
                            <thead className="bg-slate-900/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Project</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Key Metrics</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700 bg-transparent">
                                {filteredProjects.length > 0 ? (
                                    filteredProjects.map((project) => (
                                        <tr key={project.id} className="hover:bg-slate-700/30 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 bg-slate-700 rounded-lg flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                                                        <Briefcase className="h-5 w-5" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-white">{project.title}</div>
                                                        <div className="text-sm text-slate-400 truncate max-w-xs">{project.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    {project.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-white font-medium">
                                                    {(project.metrics && project.metrics[0]) ? (
                                                        <>
                                                            {project.metrics[0].value} <span className="text-slate-500 text-xs font-normal">({project.metrics[0].label})</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-slate-500 text-xs">No metrics</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${project.status === 'Active'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-slate-700/50 text-slate-400 border-slate-600'
                                                    }`}>
                                                    {project.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    aria-label="Edit project"
                                                    onClick={() => handleEdit(project)}
                                                    className="text-slate-400 hover:text-cyan-400 mr-4 transition-colors p-1"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    aria-label="Delete project"
                                                    onClick={() => handleDelete(project.id)}
                                                    className="text-slate-400 hover:text-red-400 transition-colors p-1"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                            No projects found. Add one to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} project={currentProject} onSave={handleSave} isSubmitting={isSubmitting} />
        </div>
    );
};

export default Projects;
