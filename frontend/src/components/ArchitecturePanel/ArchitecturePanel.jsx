import React, { useState } from 'react';
import { FileText, Database, Zap, Shield, Server, BookOpen, ChevronDown, ChevronUp, Code2 } from 'lucide-react';

const Section = ({ title, icon: Icon, children, color = '#6366f1' }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-2xl overflow-hidden mb-3" style={{ background: '#1e1e35', border: '1px solid rgba(255,255,255,0.06)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
            <Icon size={14} style={{ color }} />
          </div>
          <span className="text-sm font-semibold text-slate-200">{title}</span>
        </div>
        {open ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
};

const Tag = ({ children, color = '#6366f1' }) => (
  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium mr-1.5 mb-1.5"
    style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}>
    {children}
  </span>
);

const ArchitecturePanel = ({ architecture }) => {
  if (!architecture) return null;

  const { hld, lld, databaseSchema, apis = [], scaling = {}, security = [], techStack = {}, services = [], databases = [] } = architecture;

  return (
    <div className="h-full overflow-y-auto p-4" style={{ scrollbarWidth: 'thin' }}>
      {/* Tech Stack */}
      {Object.keys(techStack).length > 0 && (
        <Section title="Tech Stack" icon={Server} color="#10b981">
          {Object.entries(techStack).map(([category, techs]) => (
            <div key={category} className="mb-3">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5 font-medium">{category}</p>
              <div className="flex flex-wrap">
                {(Array.isArray(techs) ? techs : [techs]).map((tech, i) => (
                  <Tag key={i} color="#10b981">{tech}</Tag>
                ))}
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* HLD */}
      {hld && (
        <Section title="High Level Design" icon={BookOpen} color="#6366f1">
          <p className="text-sm text-slate-400 leading-relaxed">{hld}</p>
        </Section>
      )}

      {/* LLD */}
      {lld && (
        <Section title="Low Level Design" icon={FileText} color="#8b5cf6">
          <p className="text-sm text-slate-400 leading-relaxed">{lld}</p>
        </Section>
      )}

      {/* Database Schema */}
      {databaseSchema && (
        <Section title="Database Schema" icon={Database} color="#3b82f6">
          <pre className="text-xs text-slate-400 font-mono leading-relaxed whitespace-pre-wrap bg-black/20 rounded-xl p-3 overflow-x-auto">
            {databaseSchema}
          </pre>
        </Section>
      )}

      {/* APIs */}
      {apis.length > 0 && (
        <Section title={`API Endpoints (${apis.length})`} icon={Code2} color="#f59e0b">
          <div className="space-y-2">
            {apis.map((api, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md shrink-0"
                  style={{
                    background: api.method === 'GET' ? '#10b98115' : api.method === 'POST' ? '#6366f115' : api.method === 'DELETE' ? '#ef444415' : '#f59e0b15',
                    color: api.method === 'GET' ? '#10b981' : api.method === 'POST' ? '#818cf8' : api.method === 'DELETE' ? '#ef4444' : '#f59e0b',
                  }}>
                  {api.method}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-mono text-slate-300 truncate">{api.endpoint}</p>
                  {api.description && <p className="text-xs text-slate-500 mt-0.5">{api.description}</p>}
                </div>
                {api.auth && (
                  <span className="text-xs text-yellow-500/70 shrink-0">🔒</span>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Scaling */}
      {(scaling.strategies?.length > 0 || scaling.loadBalancing) && (
        <Section title="Scaling Strategies" icon={Zap} color="#f97316">
          {scaling.strategies?.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-medium">Strategies</p>
              <div className="space-y-1.5">
                {scaling.strategies.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-1 h-1 rounded-full bg-orange-500 shrink-0" />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}
          {scaling.caching && (
            <div className="mb-3">
              <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-medium">Caching</p>
              <p className="text-xs text-slate-400">{scaling.caching}</p>
            </div>
          )}
          {scaling.loadBalancing && (
            <div>
              <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-medium">Load Balancing</p>
              <p className="text-xs text-slate-400">{scaling.loadBalancing}</p>
            </div>
          )}
        </Section>
      )}

      {/* Security */}
      {security.length > 0 && (
        <Section title="Security Measures" icon={Shield} color="#ef4444">
          <div className="flex flex-wrap">
            {security.map((s, i) => <Tag key={i} color="#ef4444">{s}</Tag>)}
          </div>
        </Section>
      )}
    </div>
  );
};

export default ArchitecturePanel;
