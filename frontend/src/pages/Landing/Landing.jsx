import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Sparkles, GitBranch, Database, Zap, Shield, ArrowRight, Check } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';

const Feature = ({ icon: Icon, title, desc, color }) => (
  <div className="p-6 rounded-2xl" style={{ background: '#1e1e35', border: '1px solid rgba(255,255,255,0.06)' }}>
    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}15` }}>
      <Icon size={18} style={{ color }} />
    </div>
    <h3 className="font-display font-semibold text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

const Landing = () => (
  <div className="min-h-screen" style={{ background: '#0f0f1a' }}>
    <Navbar />

    {/* Hero */}
    <section className="pt-32 pb-24 px-6 text-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-3xl mx-auto relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
          style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc' }}>
          <Sparkles size={12} /> AI-Powered System Design
        </div>

        <h1 className="text-5xl sm:text-6xl font-display font-bold text-white mb-6 leading-tight">
          Generate production-ready
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #818cf8, #6366f1)' }}>
            {' '}architectures
          </span>
        </h1>

        <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
          Describe your product idea and AI generates complete system design — microservices, databases, APIs, diagrams, and scaling strategies in seconds.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/signup"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}
          >
            Start for free <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-slate-300 hover:text-white transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            Sign in
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-500">
          {['Free tier available', 'No credit card', 'Instant generation'].map((t, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <Check size={13} className="text-green-500" /> {t}
            </span>
          ))}
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="max-w-6xl mx-auto px-6 pb-24">
      <h2 className="text-center font-display font-bold text-2xl text-white mb-12">Everything you need</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Feature icon={GitBranch} color="#6366f1" title="HLD & LLD" desc="Complete High Level and Low Level Design with component interactions and data flow." />
        <Feature icon={Database} color="#3b82f6" title="Database Schema" desc="Auto-generated schemas for each service following database-per-service pattern." />
        <Feature icon={Cpu} color="#10b981" title="Microservices" desc="Properly decomposed microservices with clear boundaries and responsibilities." />
        <Feature icon={Sparkles} color="#f59e0b" title="Visual Diagrams" desc="Interactive React Flow diagrams you can drag, edit, and customize to your needs." />
        <Feature icon={Zap} color="#f97316" title="Scaling Strategies" desc="Load balancing, caching, sharding, and message queue recommendations." />
        <Feature icon={Shield} color="#ef4444" title="Security" desc="Built-in security best practices: JWT, HTTPS, rate limiting, input validation." />
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-white/5 py-8 text-center text-sm text-slate-600">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Cpu size={14} className="text-brand-500" />
        <span className="font-display font-semibold text-slate-400">ArchiGen</span>
      </div>
      <p>AI-Powered System Architecture Generator</p>
    </footer>
  </div>
);

export default Landing;
