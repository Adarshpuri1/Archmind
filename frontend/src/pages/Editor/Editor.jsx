import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Download, Loader2, PanelRight, PanelRightClose, Info, Layers } from 'lucide-react';
import DiagramCanvas from '../../components/DiagramCanvas/DiagramCanvas';
import ArchitecturePanel from '../../components/ArchitecturePanel/ArchitecturePanel';
import { architectureAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Editor = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('diagram'); // 'diagram' | 'details'

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const { data } = await architectureAPI.get(projectId);
      setProject(data.project);
    } catch (err) {
      toast.error('Failed to load project');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDiagram = useCallback(async ({ nodes, edges }) => {
    setSaving(true);
    try {
      await architectureAPI.updateDiagram(projectId, { nodes, edges });
      toast.success('Diagram saved!');
    } catch {
      toast.error('Failed to save diagram');
    } finally {
      setSaving(false);
    }
  }, [projectId]);

  const handleExport = () => {
    if (!project) return;
    const exportData = {
      title: project.title,
      requirement: project.requirement,
      architecture: project.architecture,
      diagram: project.diagram,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/\s+/g, '-').toLowerCase()}-architecture.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Architecture exported!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f1a' }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-brand-400" />
          <p className="text-sm text-slate-500">Loading architecture...</p>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="h-screen flex flex-col" style={{ background: '#0f0f1a' }}>
      {/* Top bar */}
      <div className="h-14 flex items-center px-4 gap-3 shrink-0"
        style={{ background: '#161628', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Back */}
        <button onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={15} /> Back
        </button>

        <div className="w-px h-5 bg-white/10" />

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-white truncate">{project.title}</h1>
          <p className="text-xs text-slate-600 truncate hidden sm:block">{project.requirement}</p>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs"
          style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          {project.architecture?.estimatedComplexity || 'Generated'}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Download size={13} /> Export
          </button>

          {saving && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Loader2 size={13} className="animate-spin" /> Saving...
            </div>
          )}

          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            {panelOpen ? <PanelRightClose size={13} /> : <PanelRight size={13} />}
            {panelOpen ? 'Hide' : 'Details'}
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Diagram */}
        <div className="flex-1 relative overflow-hidden">
          {project.diagram?.nodes?.length > 0 ? (
            <DiagramCanvas
              initialNodes={project.diagram.nodes}
              initialEdges={project.diagram.edges || []}
              onSave={handleSaveDiagram}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Layers size={40} className="text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No diagram data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Side panel */}
        {panelOpen && (
          <div className="w-80 shrink-0 flex flex-col overflow-hidden"
            style={{ background: '#161628', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
            {/* Tabs */}
            <div className="flex border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              {[
                { key: 'details', icon: Info, label: 'Architecture' },
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors"
                  style={{ color: activeTab === key ? '#818cf8' : '#64748b', borderBottom: activeTab === key ? '2px solid #6366f1' : '2px solid transparent' }}
                >
                  <Icon size={13} /> {label}
                </button>
              ))}
            </div>

            {/* Overview card */}
            {project.architecture?.overview && (
              <div className="m-3 p-3 rounded-xl text-xs text-slate-400 leading-relaxed"
                style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
                {project.architecture.overview}
              </div>
            )}

            {/* Architecture details */}
            <div className="flex-1 overflow-hidden">
              <ArchitecturePanel architecture={project.architecture} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
