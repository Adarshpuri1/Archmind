import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Clock, ChevronRight, Cpu, BarChart3, Loader2, AlertCircle } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import RequirementForm from '../../components/RequirementForm/RequirementForm';
import { architectureAPI, projectsAPI } from '../../services/api';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const ProjectCard = ({ project, onDelete, onClick }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm('Delete this project?')) return;
    setDeleting(true);
    try {
      await projectsAPI.delete(project._id);
      onDelete(project._id);
      toast.success('Project deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const nodeCount = project.diagram?.nodes?.length || 0;

  return (
    <div
      onClick={() => onClick(project._id)}
      className="group relative p-5 rounded-2xl cursor-pointer transition-all hover:-translate-y-0.5"
      style={{
        background: '#1e1e35',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
    >
      {/* Status dot */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${project.status === 'completed' ? 'bg-green-500' : project.status === 'generating' ? 'bg-yellow-500 animate-pulse' : 'bg-slate-500'}`} />
        <span className="text-xs text-slate-600 capitalize">{project.status}</span>
      </div>

      <div className="mb-4">
        <div className="w-9 h-9 rounded-xl bg-brand-600/15 flex items-center justify-center mb-3">
          <Cpu size={16} className="text-brand-400" />
        </div>
        <h3 className="font-semibold text-white text-sm mb-1 pr-20 line-clamp-2">{project.title}</h3>
        <p className="text-xs text-slate-500 line-clamp-2">{project.requirement}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span className="flex items-center gap-1"><Clock size={11} /> {new Date(project.createdAt).toLocaleDateString()}</span>
          {nodeCount > 0 && <span className="flex items-center gap-1"><BarChart3 size={11} /> {nodeCount} nodes</span>}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400/60 hover:text-red-400 transition-colors"
          >
            {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
          </button>
          <ChevronRight size={13} className="text-slate-500" />
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [view, setView] = useState('projects'); // 'projects' | 'new'
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await projectsAPI.list();
      setProjects(data.projects);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleGenerate = async ({ requirement, title }) => {
    setGenerating(true);
    try {
      const { data } = await architectureAPI.generate({ requirement, title });
      toast.success('Architecture generated!');
      navigate(`/editor/${data.project._id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Generation failed. Try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteProject = (id) => {
    setProjects((p) => p.filter((proj) => proj._id !== id));
  };

  return (
    <div className="min-h-screen" style={{ background: '#0f0f1a' }}>
      <Navbar />
      <div className="pt-20 max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">
              {view === 'new' ? 'New Architecture' : 'Dashboard'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {view === 'new' ? 'Describe your system below' : `${user?.generationsUsed || 0}/${user?.generationsLimit || 10} generations used`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {view === 'new' && (
              <button onClick={() => setView('projects')} className="text-sm text-slate-400 hover:text-white transition-colors">
                ← Back
              </button>
            )}
            <button
              onClick={() => setView(view === 'new' ? 'projects' : 'new')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
              style={{ background: view === 'new' ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: view === 'new' ? 'none' : '0 4px 16px rgba(99,102,241,0.3)' }}
            >
              <Plus size={16} /> New Architecture
            </button>
          </div>
        </div>

        {/* Content */}
        {view === 'new' ? (
          <RequirementForm onGenerate={handleGenerate} loading={generating} />
        ) : (
          <>
            {loadingProjects ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 size={28} className="animate-spin text-brand-400" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-24 animate-fade-in">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-600/10 mb-4">
                  <Cpu size={28} className="text-brand-400" />
                </div>
                <h2 className="text-xl font-display font-semibold text-white mb-2">No architectures yet</h2>
                <p className="text-slate-500 text-sm mb-6">Generate your first system architecture with AI</p>
                <button
                  onClick={() => setView('new')}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white mx-auto transition-all"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 8px 24px rgba(99,102,241,0.3)' }}
                >
                  <Plus size={18} /> Generate Architecture
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
                {/* New card */}
                <div
                  onClick={() => setView('new')}
                  className="p-5 rounded-2xl cursor-pointer border-dashed flex flex-col items-center justify-center gap-3 text-slate-600 hover:text-brand-400 hover:border-brand-500/30 transition-all min-h-[160px]"
                  style={{ border: '1.5px dashed rgba(255,255,255,0.1)', background: 'transparent' }}
                >
                  <div className="w-10 h-10 rounded-xl border border-dashed border-current flex items-center justify-center">
                    <Plus size={18} />
                  </div>
                  <span className="text-sm font-medium">New Architecture</span>
                </div>

                {projects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onDelete={handleDeleteProject}
                    onClick={(id) => navigate(`/editor/${id}`)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
