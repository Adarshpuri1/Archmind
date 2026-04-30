import React, { useState } from 'react';
import { Sparkles, Loader2, ChevronRight, Lightbulb } from 'lucide-react';

const EXAMPLES = [
  'Build a ride-sharing system like Uber',
  'Design a real-time chat application like Slack',
  'Create an e-commerce platform like Amazon',
  'Build a video streaming service like Netflix',
  'Design a social media platform like Twitter/X',
  'Create a food delivery app like DoorDash',
];

const RequirementForm = ({ onGenerate, loading }) => {
  const [requirement, setRequirement] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (requirement.trim().length < 10) return;
    onGenerate({ requirement: requirement.trim(), title: title.trim() });
  };

  const useExample = (example) => {
    setRequirement(example);
    setTitle('');
  };

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
          style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc' }}>
          <Sparkles size={12} /> AI-Powered Architecture Generator
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-3">
          Describe your system
        </h1>
        <p className="text-slate-400 text-base">
          Enter your product idea and our AI will generate a complete, production-ready architecture.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-sm text-slate-400 mb-1.5 block">Project Title (optional)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Uber Clone Architecture"
            maxLength={100}
            className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all"
            style={{
              background: '#1e1e35',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
          />
        </div>

        {/* Main requirement */}
        <div>
          <label className="text-sm text-slate-400 mb-1.5 block">System Requirement *</label>
          <textarea
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            placeholder="Describe the system you want to build. Be specific about features, scale, and constraints..."
            rows={5}
            maxLength={2000}
            required
            className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all resize-none"
            style={{
              background: '#1e1e35',
              border: '1px solid rgba(255,255,255,0.08)',
              lineHeight: 1.7,
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-slate-600">Min 10 characters</span>
            <span className="text-xs text-slate-600">{requirement.length}/2000</span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || requirement.trim().length < 10}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: loading ? '#4338ca' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
            boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
          }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Generating Architecture...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Generate Architecture
              <ChevronRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Examples */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={14} className="text-yellow-500" />
          <span className="text-xs text-slate-500 uppercase tracking-widest font-medium">Try an example</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {EXAMPLES.map((example, i) => (
            <button
              key={i}
              onClick={() => useExample(example)}
              disabled={loading}
              className="text-left px-3 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-brand-600/10 transition-all border border-transparent hover:border-brand-500/20 disabled:opacity-50"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequirementForm;
