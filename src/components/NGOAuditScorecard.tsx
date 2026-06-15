import React, { useState } from 'react';
import { CheckSquare, Square, Award, ShieldAlert, Sparkles, HelpCircle, Activity, Gauge } from 'lucide-react';

interface AuditItem {
  id: number;
  category: 'outreach' | 'volunteer' | 'fundraising' | 'branding';
  question: string;
  weight: number;
}

const AUDIT_QUESTIONS: AuditItem[] = [
  {
    id: 1,
    category: 'outreach',
    question: "We run monthly video series (under 90 seconds) displaying direct grassroots human outcomes.",
    weight: 20
  },
  {
    id: 2,
    category: 'volunteer',
    question: "We offer micro-volunteering tasks (under 30-minute chunks) for remote/busy professionals.",
    weight: 20
  },
  {
    id: 3,
    category: 'fundraising',
    question: "Our online fundraising pages use unit-based visual matching elements (e.g. '$10 feeds 1 child').",
    weight: 20
  },
  {
    id: 4,
    category: 'branding',
    question: "Our audited physical financial worksheets and government trust certifications are fully public.",
    weight: 20
  },
  {
    id: 5,
    category: 'branding',
    question: "Our digital web presence loads completely under 2.5 seconds on low-tier mobile environments.",
    weight: 20
  }
];

export default function NGOAuditScorecard() {
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false
  });

  const [activeTab, setActiveTab ] = useState<'audit' | 'metrics'>('audit');

  const toggleCheck = (id: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const score = Object.entries(checkedItems).reduce((acc, [idStr, checked]) => {
    if (checked) {
      const q = AUDIT_QUESTIONS.find(item => item.id === parseInt(idStr));
      return acc + (q ? q.weight : 0);
    }
    return acc;
  }, 0);

  // Score feedback
  const getFeedback = (tScore: number) => {
    if (tScore === 100) return {
      title: "Elite Operational Model",
      desc: "Outstanding operational capacity. Your organization fully leverages digital channels, transparency indicators, and quick-action volunteering avenues. Focus now on local peer mentoring.",
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      indicator: "bg-emerald-500",
      praise: "Fully optimized structure"
    };
    if (tScore >= 60) return {
      title: "Active Structural Growth",
      desc: "Healthy baseline benchmarks established. You have robust programmatic structure but can gain massive traction by addressing mobile micro-channels and simplifying volunteer tasks.",
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      indicator: "bg-emerald-500",
      praise: "Moderate structural capacity"
    };
    if (tScore >= 40) return {
      title: "Emergent Public Impact",
      desc: "Initiatives exist but structural bottlenecks are slowing organic momentum. Implement transparent budget divisions and short emotional videos to capture modern digital stakeholders.",
      color: "text-amber-700 bg-amber-50 border-amber-200",
      indicator: "bg-amber-400",
      praise: "Initial baseline"
    };
    return {
      title: "Ad-hoc Development Stage",
      desc: "Operational methods are predominantly static/offline. Public trust parameters are undocumented, which restricts donor retention. Utilize our AI strategies checklist below to reform outreach workflows.",
      color: "text-rose-700 bg-rose-50 border-rose-200",
      indicator: "bg-rose-500",
      praise: "Critical action recommended"
    };
  };

  const feedback = getFeedback(score);

  return (
    <div id="ngo-audit-scorecard-section" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col gap-6 animate-fade-in no-print">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-slate-800 flex items-center gap-2">
            <Gauge className="text-emerald-600 w-5 h-5" />
            Social Readiness Diagnostic Scan
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Conduct a quick, comprehensive checklist audit to benchmark your NGO's presence, outreach, and operational agility.
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5 self-stretch md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`flex-1 md:flex-none text-2xs px-3.5 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'audit'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Readiness Audit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('metrics')}
            className={`flex-1 md:flex-none text-2xs px-3.5 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'metrics'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Strategic KPIs Explained
          </button>
        </div>
      </div>

      {activeTab === 'audit' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column - Assessment checklist (7 Columns) */}
          <div className="lg:col-span-7 space-y-3.5">
            <p className="text-2xs font-bold text-slate-400 uppercase tracking-wider mb-2">Check all parameters your NGO meets currently:</p>
            {AUDIT_QUESTIONS.map(q => {
              const isChecked = !!checkedItems[q.id];
              return (
                <div
                  key={q.id}
                  onClick={() => toggleCheck(q.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isChecked
                      ? 'border-emerald-200 bg-emerald-50/20 text-slate-800'
                      : 'border-slate-100 hover:border-slate-200 text-slate-600'
                  }`}
                >
                  <button type="button" className="flex-shrink-0 mt-0.5 text-emerald-600 outline-none">
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 fill-emerald-100" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300" />
                    )}
                  </button>
                  <div>
                    <span className="text-5xs font-bold uppercase tracking-widest block text-slate-400 mb-0.5">
                      {q.category}
                    </span>
                    <p className="text-xs font-semibold leading-relaxed">{q.question}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column - Visual meter score (5 Columns) */}
          <div className="lg:col-span-5 bg-slate-50/50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between items-stretch min-h-[300px]">
            <div className="text-center space-y-4">
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block">Assessment Audit Score</span>
              
              {/* Radial or Big number */}
              <div className="relative inline-flex items-center justify-center p-6 bg-white rounded-full shadow-inner border border-slate-100">
                <span className="font-display font-extrabold text-3xl md:text-4xl text-slate-800">
                  {score}%
                </span>
                
                {/* Glow badge according to score */}
                <div className={`absolute -right-2 -bottom-1 text-5xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white shadow-xs ${
                  score >= 80 ? 'bg-emerald-600' : score >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                }`}>
                  {feedback.praise}
                </div>
              </div>

              {/* Progress bar mapping */}
              <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden max-w-xs mx-auto">
                <div
                  className={`h-full transition-all duration-300 ${
                    score >= 80 ? 'bg-emerald-600' : score >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>

            {/* Strategic Diagnostic Statement */}
            <div className={`mt-5 p-4 rounded-xl border text-xs flex flex-col justify-between overflow-hidden relative shadow-xs ${feedback.color}`}>
              {/* Sparkle background item */}
              <div className="absolute right-2 top-2 opacity-5">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              
              <div className="space-y-1.5 relative z-10">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${feedback.indicator}`}></span>
                  <strong className="font-display font-bold uppercase tracking-wide">{feedback.title}</strong>
                </div>
                <p className="text-2xs leading-relaxed opacity-90">{feedback.desc}</p>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1">
              <span className="text-base text-indigo-500">📈</span> Outreach Engagement Rate
            </h4>
            <p className="text-slate-500 leading-normal text-2xs">
              Traditional outreach counts cumulative impressions. High-impact engagement looks strictly at <strong>Share-through rate</strong> on micro-videos. Content that drives action is saved/re-posted by local neighborhood networks rather than simply scrolled past.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1">
              <span className="text-base text-emerald-500">🤝</span> Volunteering Tasks Discretization
            </h4>
            <p className="text-slate-500 leading-normal text-2xs">
              Transition busy modern support bases from general open shifts to <strong>Task Milestones</strong>. Break organizational burdens into concrete 20-minute deliverables (like copy editing, graphic cropping, database inputs) to increase volunteer turnout by up to 2.5x.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1">
              <span className="text-base text-amber-500">💵</span> Transparent Unit Fundraising
            </h4>
            <p className="text-slate-500 leading-normal text-2xs">
              Eradicate generic 'Support general funds' appeals. Discretize donor contributions so that specific gift size values relate directly to material parameters (e.g. '$15 funds one localized clinical test kit'). Concrete visual outcomes increase immediate user conversion.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1">
              <span className="text-base text-sky-500">🔍</span> Mobile Performance Index
            </h4>
            <p className="text-slate-500 leading-normal text-2xs">
              Over 70% of local grassroot donors load NGO pages on high-latency mobile networks. Ensuring that critical assets are fully optimized directly drives high retention and checks bounce behavior on local contribution forms.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
