import React, { useState, useEffect } from 'react';
import { NGOProfile, Recommendation } from './types';
import NGOProfileForm from './components/NGOProfileForm';
import RecommendationCard from './components/RecommendationCard';
import NGOAuditScorecard from './components/NGOAuditScorecard';
import { getClientFallbackRecommendations } from './data/curatedRecommendations';
import { 
  Building2, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Check, 
  Printer, 
  Copy, 
  RotateCcw, 
  ArrowRight, 
  Info,
  Layers,
  Heart,
  TrendingUp,
  Award,
  BookOpen,
  FolderLock
} from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<NGOProfile | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [customNotes, setCustomNotes] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingDocument, setIsGeneratingDocument] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'outreach' | 'volunteer' | 'fundraising' | 'branding'>('all');
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-fill some note placeholders when IDs are selected
  const handleSelectToggle = (id: string) => {
    setSelectedIds(prev => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        const next = prev.filter(item => item !== id);
        // Clear notes when unselected
        const updatedNotes = { ...customNotes };
        delete updatedNotes[id];
        setCustomNotes(updatedNotes);
        return next;
      } else {
        if (prev.length >= 5) {
          // Keep strict focus on the requested 5 recommendations limit
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const handleAddNote = (id: string, note: string) => {
    setCustomNotes(prev => ({
      ...prev,
      [id]: note
    }));
  };

  const handleProfileSubmit = async (submittedProfile: NGOProfile) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSelectedIds([]);
    setCustomNotes({});
    
    try {
      const response = await fetch('/api/generate-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submittedProfile),
      });

      if (!response.ok) {
        throw new Error('Server returned unsuccessful response status');
      }

      const data = await response.json();
      if (data.recommendations && Array.isArray(data.recommendations)) {
        setRecommendations(data.recommendations);
        setProfile(submittedProfile);
      } else {
        throw new Error('Invalid metadata array returned by growth optimizer service.');
      }
    } catch (err: any) {
      console.error('Failed to query strategies from server:', err);
      setErrorMessage(null);
      
      // Generate client-side recommendations instantly
      const adapted = getClientFallbackRecommendations(submittedProfile);
      setRecommendations(adapted);
      setProfile(submittedProfile);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-select first few elements to aid standard workflow
  useEffect(() => {
    if (recommendations.length > 0 && selectedIds.length === 0) {
      const initialBatch = recommendations.slice(0, 5).map(r => r.id);
      setSelectedIds(initialBatch);
    }
  }, [recommendations]);

  const handleReset = () => {
    setProfile(null);
    setRecommendations([]);
    setSelectedIds([]);
    setCustomNotes({});
    setErrorMessage(null);
  };

  const selectedRecommendations = recommendations.filter(r => selectedIds.includes(r.id));

  // Print execution handler
  const handlePrint = () => {
    window.print();
  };

  // Copy structured strategic plain text to clipboard for manual document generation
  const copyPreparedReportText = () => {
    if (!profile) return;
    
    let report = `====================================================\n`;
    report += `STRATEGIC DEVELOPMENT PLAN: ${profile.name.toUpperCase()}\n`;
    report += `====================================================\n\n`;
    report += `Date of Strategy: ${new Date().toLocaleDateString()}\n`;
    report += `Core Focus Cause: ${profile.cause}\n`;
    report += `Territorial Footprint: ${profile.region || 'Local Councils'}\n`;
    report += `Annual Resource Bracket: ${profile.budget}\n`;
    report += `Primary Goal Targeted: ${profile.primaryGoal}\n\n`;
    report += `----------------------------------------------------\n`;
    report += `5 SELECTED HIGH-IMPACT REFORMS\n`;
    report += `----------------------------------------------------\n\n`;

    selectedRecommendations.forEach((rec, idx) => {
      report += `POINT ${idx + 1}: ${rec.title}\n`;
      report += `Category: ${rec.category.toUpperCase()} | Scale Impact: ${rec.impact}\n`;
      report += `Summary Plan: ${rec.summary}\n`;
      report += `Justification: ${rec.explanation}\n`;
      report += `Action Steps:\n`;
      rec.actionSteps.forEach((step, sIdx) => {
        report += `  [${sIdx + 1}] ${step}\n`;
      });
      report += `Performance Indicators to Measure:\n`;
      rec.metricsToTrack.forEach((m) => {
        report += `  - ${m}\n`;
      });
      if (customNotes[rec.id]) {
        report += `Custom Organizer Notes:\n  ${customNotes[rec.id]}\n`;
      }
      report += `\n----------------------------------------------------\n\n`;
    });

    report += `Compiled & Prepared safely via NGO Growth Action Planner.`;

    navigator.clipboard.writeText(report);
    setCopiedNoteId("main-report");
    setTimeout(() => setCopiedNoteId(null), 2500);
  };

  // Filtering logic
  const filteredRecommendations = activeTab === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.category === activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      {/* Top Banner / Header (hidden in print) */}
      <header className="bg-white border-b border-slate-100 py-5 px-6 sticky top-0 z-40 no-print shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/10">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-slate-800 text-lg md:text-xl tracking-tight flex items-center gap-2">
                NGO Growth Action Planner
                <span className="text-3xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Interactive Strategy Suite
                </span>
              </h1>
              <p className="text-xs text-slate-500">
                Actionable practices & performance indicators to lift non-profits & grassroot initiatives.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Status:</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Development Active
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        {/* Intro Card (hidden in print) */}
        {!profile && (
          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden no-print animate-fade-in">
            {/* Background elements */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl"></div>
            <div className="absolute left-1/4 top-1/10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
            
            <div className="max-w-3xl relative z-10 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold text-indigo-300 border border-white/5">
                <Heart className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400 animate-pulse" />
                Empowering Social Visionaries
              </div>
              <h1 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-white leading-tight">
                Scale Your Outreach, Volunteering & Social Footprint.
              </h1>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Unlock 5 high-impact, tailored strategies designed for your organization's specific resource capabilities. Plan core actions, download a print-ready executive strategic report, and secure verified practices to strengthen community relationships.
              </p>
              
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 text-indigo-100 text-xs font-medium">
                <div className="flex items-center gap-2 bg-white/5 py-2 px-3 rounded-xl border border-white/5">
                  <span className="text-base">🚀</span> Outreach & Public Branding
                </div>
                <div className="flex items-center gap-2 bg-white/5 py-2 px-3 rounded-xl border border-white/5">
                  <span className="text-base">💎</span> High-Engagement Volunteering
                </div>
                <div className="flex items-center gap-2 bg-white/5 py-2 px-3 rounded-xl border border-white/5">
                  <span className="text-base">💰</span> Budget-aligned Fundraising
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic engine mode status banner (hidden in print) */}
        {errorMessage && (
          <div className="bg-slate-900 border border-slate-800 text-slate-200 px-5 py-3.5 rounded-2xl flex items-center justify-between gap-3.5 text-xs no-print animate-fade-in shadow-lg shadow-slate-950/5">
            <div className="flex items-center gap-2.5">
              <div className="p-1 bg-indigo-500/10 rounded-lg text-indigo-400">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <p className="font-medium tracking-tight whitespace-normal md:whitespace-nowrap">
                {errorMessage}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-3xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 uppercase tracking-wider">
              Optimal Performance Mode
            </div>
          </div>
        )}

        {/* Step 1: NGO Definition (hidden in print) */}
        <section className="no-print">
          {!profile ? (
            <NGOProfileForm onSubmit={handleProfileSubmit} isLoading={isLoading} />
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 animate-fade-in">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-center text-indigo-600 font-display font-bold text-lg select-none shadow-inner">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-800 font-display tracking-tight">{profile.name}</h2>
                    <span className="text-3xs px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-600 uppercase tracking-wider">{profile.scale}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Focused Cause: <span className="font-semibold text-slate-700">{profile.cause}</span> • Operating Budget: <span className="font-semibold text-slate-700">{profile.budget}</span>
                  </p>
                </div>
              </div>
              
              <button
                id="btn-edit-profile-reset"
                type="button"
                onClick={handleReset}
                className="text-xs px-3.5 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 font-semibold flex items-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Assess Another NGO or Reset
              </button>
            </div>
          )}
        </section>

        {/* Global Impact Assessment Audit Scorecard */}
        <section className="no-print">
          <NGOAuditScorecard />
        </section>

        {/* Step 2 & 3: Recommendations Framework (only if profile exists) */}
        {profile && recommendations.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start no-print animate-fade-in">
            
            {/* Left Hand: Strategy Selector Hub (7 Columns) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Category Filters Banner */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
                  <h3 id="recommendations-header" className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    Strategic Alternatives Directory
                  </h3>
                  
                  {/* Select status */}
                  <span id="selected-counter-badge" className={`text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                    selectedIds.length === 5 
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                  }`}>
                    {selectedIds.length === 5 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 fill-indigo-600 text-white" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    )}
                    Pinned: {selectedIds.length} of 5 required points
                  </span>
                </div>

                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Pin exactly <strong>5</strong> strategies below to populate your printable executive growth plan. Expand any strategy to view specific workflows, actions, and key performance markers.
                </p>

                {/* Tab selections */}
                <div id="category-tabs" className="flex gap-1 overflow-x-auto pb-1">
                  <button
                    id="tab-all"
                    onClick={() => setActiveTab('all')}
                    className={`text-xs px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'all'
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    All Strategies
                  </button>
                  <button
                    id="tab-outreach"
                    onClick={() => setActiveTab('outreach')}
                    className={`text-xs px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'outreach'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Outreach
                  </button>
                  <button
                    id="tab-volunteer"
                    onClick={() => setActiveTab('volunteer')}
                    className={`text-xs px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'volunteer'
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Volunteering
                  </button>
                  <button
                    id="tab-fundraising"
                    onClick={() => setActiveTab('fundraising')}
                    className={`text-xs px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'fundraising'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Fundraising
                  </button>
                  <button
                    id="tab-branding"
                    onClick={() => setActiveTab('branding')}
                    className={`text-xs px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'branding'
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Branding
                  </button>
                </div>
              </div>

              {/* Dynamic Strategy list */}
              <div className="space-y-4">
                {filteredRecommendations.map((rec) => (
                  <RecommendationCard
                    key={rec.id}
                    recommendation={rec}
                    isSelected={selectedIds.includes(rec.id)}
                    onSelectToggle={() => handleSelectToggle(rec.id)}
                    disableSelection={selectedIds.length >= 5}
                    onAddNote={handleAddNote}
                    customNote={customNotes[rec.id] || ""}
                  />
                ))}

                {filteredRecommendations.length === 0 && (
                  <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center text-slate-400">
                    <p className="text-sm">No alternative strategies generated in this category.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Hand: Action Plan Real-Time Executive Document Preview (5 Columns) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              
              {/* Highlight helper block */}
              <div className="bg-indigo-900 text-white rounded-2xl p-5 shadow-sm space-y-3.5">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-300" />
                  <h4 className="font-display font-bold text-sm">Compiled Growth Document Preview</h4>
                </div>
                <p className="text-xs text-indigo-100/90 leading-relaxed">
                  Below is the real-time visual rendered preview of your strategic document. To meet your requirements, pin exactly <strong>5 strategic recommendations</strong> from the list.
                </p>

                {/* Progress tracker bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-2xs font-semibold text-indigo-200">
                    <span>DOCUMENT INTEGRATED DRAFT PROGRESS</span>
                    <span>{selectedIds.length * 20}%</span>
                  </div>
                  <div className="w-full bg-indigo-950 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-indigo-400 h-full transition-all duration-300"
                      style={{ width: `${selectedIds.length * 20}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Executive Document Formatter Container */}
              <div id="doc-preview-wrapper" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col max-h-[600px]">
                
                {/* Preview Controls Header */}
                <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                    PLAN PREVIEW (PAGE OUTLINE)
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    {/* Plain Text copy button */}
                    <button
                      id="btn-copy-plan-text"
                      type="button"
                      onClick={copyPreparedReportText}
                      disabled={selectedIds.length === 0}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all title='Copy text content' disabled:opacity-50"
                    >
                      {copiedNoteId === "main-report" ? (
                        <Check className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    
                    {/* Real system print trigger */}
                    <button
                      id="btn-trigger-print"
                      type="button"
                      onClick={handlePrint}
                      disabled={selectedIds.length === 0}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print / PDF
                    </button>
                  </div>
                </div>

                {/* Inner Sheet Document Scroll View */}
                <div id="interactive-doc-sheet" className="p-6 overflow-y-auto space-y-6 font-sans text-xs bg-slate-50/50">
                  
                  {/* Styled sheet */}
                  <div className="bg-white p-6 shadow-sm border border-slate-200/60 rounded-lg space-y-5 relative">
                    
                    {/* Academic Style Border */}
                    <div className="absolute inset-2 border border-slate-100 pointer-events-none rounded"></div>
                    
                    {/* Seal / Emblem element */}
                    <div className="border-b-2 border-double border-slate-200 pb-4 text-center">
                      <div className="inline-flex items-center justify-center p-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 mb-1">
                        <Award className="w-5 h-5" />
                      </div>
                      <h4 className="font-display font-extrabold text-slate-800 text-xs tracking-wider uppercase">Strategic Growth Blueprint</h4>
                      <p className="text-4xs text-slate-400 font-medium uppercase tracking-widest mt-0.5">Capacity Reform & Outreach Strategy</p>
                    </div>

                    {/* Metadata list */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-4xs border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-slate-400 uppercase tracking-wider font-semibold block">Organization Name</span>
                        <strong className="text-slate-700">{profile.name}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase tracking-wider font-semibold block">Primary Sector Cause</span>
                        <strong className="text-slate-700">{profile.cause}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase tracking-wider font-semibold block">Focus Territory</span>
                        <strong className="text-slate-700">{profile.region || 'Local Municipal Districts'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase tracking-wider font-semibold block">Resource Tier</span>
                        <strong className="text-slate-700">{profile.budget}</strong>
                      </div>
                    </div>

                    {/* Exec Summary */}
                    <div className="space-y-1.5">
                      <h5 className="font-display font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-1">I. Executive Statement</h5>
                      <p className="text-slate-500 leading-relaxed text-4xs">
                        This administrative program outlines exactly 5 customized strategic pivots for <strong className="text-slate-700">{profile.name}</strong> to resolve structural friction. Our core focus centers on achieving our key goal: <em className="text-slate-700">"{profile.primaryGoal}"</em>, utilizing sustainable, budget-conscious capacity updates.
                      </p>
                    </div>

                    {/* Strategic points */}
                    <div className="space-y-3.5">
                      <h5 className="font-display font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-1">II. 5 Selected Outreach & Growth Steps</h5>
                      
                      {selectedRecommendations.length === 0 ? (
                        <div className="text-center py-6 border border-dashed border-slate-200 rounded-lg text-slate-400 text-4xs">
                          No strategic points pinned yet.<br />
                          Pin strategies from the list to populate the report.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedRecommendations.map((rec, index) => (
                            <div key={rec.id} className="space-y-1 bg-slate-50/50 p-2.5 rounded border border-slate-100">
                              <div className="flex justify-between items-center">
                                <span className="font-display font-bold text-slate-700 text-4xs uppercase tracking-tight">
                                  {index + 1}. {rec.title}
                                </span>
                                <span className="text-5xs bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-semibold uppercase">
                                  {rec.category}
                                </span>
                              </div>
                              <p className="text-slate-500 leading-normal text-4xs">{rec.summary}</p>
                              
                              <div className="pt-1 select-none">
                                <span className="text-5xs font-bold text-slate-400 block tracking-wider uppercase mb-0.5">Recommended Actions:</span>
                                <div className="space-y-0.5 pl-1.5">
                                  {rec.actionSteps.slice(0, 2).map((s, sIdx) => (
                                    <p key={sIdx} className="text-slate-600 text-4xs leading-normal">• {s}</p>
                                  ))}
                                </div>
                              </div>

                              {customNotes[rec.id] && (
                                <div className="mt-1 pt-1 border-t border-slate-200/50">
                                  <strong className="text-slate-700 text-5xs uppercase tracking-wider block">Internal Action Note:</strong>
                                  <p className="text-indigo-700 italic text-4xs mt-0.5">{customNotes[rec.id]}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer signature line */}
                    {selectedRecommendations.length === 5 && (
                      <div className="border-t border-slate-200/80 pt-4 flex justify-between items-end text-5xs">
                        <div>
                          <p className="text-slate-400">Validated Strategic Document</p>
                          <p className="font-bold text-slate-700 mt-0.5">NGO GROWTH STRATEGISTS</p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400">Date Prepared</p>
                          <p className="font-bold text-slate-700 mt-0.5">{new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Master Printable Screen Area */}
        {profile && selectedRecommendations.length > 0 && (
          <div className="hidden print:block print-page p-8 font-sans text-sm space-y-6">
            <div className="border-b-4 border-indigo-700 pb-4 flex justify-between items-end">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">STRATEGIC GROWTH DEVELOPMENT MASTERPLAN</h1>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">Organized Framework for NGO Capacity Upgrade</p>
              </div>
              <div className="text-right">
                <span className="inline-block bg-indigo-50 border border-indigo-100 text-indigo-800 text-xs uppercase tracking-widest px-3 py-1 font-bold rounded">
                  OFFICIAL AUDIT REPORT
                </span>
              </div>
            </div>

            {/* Profile specifications */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Subject Entity</span>
                <strong className="text-slate-800 text-sm block">{profile.name}</strong>
                <span className="text-slate-500 mt-0.5 block">{profile.scale} Capacity Scale</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Core Campaign Sector</span>
                <strong className="text-slate-800 text-sm block">{profile.cause}</strong>
                <span className="text-slate-500 mt-0.5 block">Territory: {profile.region || 'Local Urban Centers'}</span>
              </div>
              <div className="mt-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Primary Objective Pivotal Goal</span>
                <strong className="text-slate-800 block">"{profile.primaryGoal}"</strong>
              </div>
              <div className="mt-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Operating Resource Limits</span>
                <strong className="text-slate-800 block text-indigo-700">{profile.budget}</strong>
              </div>
            </div>

            {/* General Intro executive summary */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 uppercase tracking-wide border-b-2 border-slate-100 pb-1">I. Strategic Outline Intent</h3>
              <p className="text-slate-600 leading-relaxed text-xs">
                To maximize our long-term structural viability, this blueprint documents 5 major development strategies targeted at improving outreach actions, recruitment pipelines, trust-building initiatives, and fundraising parameters. Grounded in proven global nonprofit workflows, this plan addresses the current resource constraints of {profile.name} directly.
              </p>
            </div>

            {/* Main Recommendations list */}
            <div className="space-y-5">
              <h3 className="font-bold text-slate-900 uppercase tracking-wide border-b-2 border-slate-100 pb-1">II. 5 Integrated Development pillars</h3>
              <div className="space-y-4">
                {selectedRecommendations.map((rec, index) => (
                  <div key={rec.id} className="p-4 border border-slate-200 rounded-xl space-y-2.5 page-break-inside-avoid">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                      <h4 className="font-bold text-slate-900 text-sm uppercase">
                        {index + 1}. {rec.title}
                      </h4>
                      <span className="text-2xs bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full font-bold uppercase">
                        Category: {rec.category}
                      </span>
                    </div>
                    
                    <p className="text-slate-600 leading-relaxed text-xs">{rec.summary}</p>
                    <p className="text-slate-500 leading-relaxed text-2xs italic bg-slate-50/50 p-2.5 rounded border border-slate-100">{rec.explanation}</p>

                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div>
                        <span className="text-3xs font-bold text-slate-400 uppercase tracking-wide block mb-1">Specific Workflow Steps</span>
                        <ul className="space-y-1">
                          {rec.actionSteps.map((step, sIdx) => (
                            <li key={sIdx} className="text-3xs text-slate-600 leading-normal flex items-start gap-1">
                              <span className="font-bold text-indigo-600 font-display">{sIdx + 1}.</span> {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-3xs font-bold text-slate-400 uppercase tracking-wide block mb-1">Metrics & Performance Benchmarks</span>
                        <ul className="space-y-1">
                          {rec.metricsToTrack.map((m, mIdx) => (
                            <li key={mIdx} className="text-3xs text-slate-600 leading-normal flex items-start gap-1">
                              <span className="text-indigo-500 font-bold">•</span> {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {customNotes[rec.id] && (
                      <div className="bg-indigo-50/40 p-2.5 rounded border border-indigo-100/60 mt-1">
                        <span className="text-4xs font-bold tracking-wider text-indigo-800 uppercase block mb-0.5">Execution & Operational Assignment Notes:</span>
                        <p className="text-3xs text-indigo-900 italic leading-snug">{customNotes[rec.id]}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Validation signatures */}
            <div className="pt-8 mt-12 border-t-2 border-slate-200 flex justify-between items-start text-3xs text-slate-500">
              <div>
                <p>Strategic Counsel Certification</p>
                <div className="w-48 border-b border-slate-400 h-10 mt-2"></div>
                <p className="font-bold text-slate-700 mt-1 uppercase">Board Representative, {profile.name}</p>
              </div>
              <div className="text-right">
                <p>Strategic Development Directorate</p>
                <div className="w-48 ml-auto border-b border-slate-400 h-10 mt-2"></div>
                <p className="font-bold text-slate-700 mt-1 uppercase">Coordinator, Capacity Planning</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer System Panel */}
      <footer className="bg-white border-t border-slate-100 py-6 px-4 text-center text-xs text-slate-400 w-full mt-auto no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Social Organization Capacity Platform. Built to support non-profit objectives.</p>
          <div className="flex gap-4 font-semibold text-slate-500">
            <span className="text-indigo-600">InAmigos Foundation Program</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
