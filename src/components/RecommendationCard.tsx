import React, { useState } from 'react';
import { Recommendation } from '../types';
import { Megaphone, Users, DollarSign, Globe, CheckCircle2, ChevronDown, ChevronUp, Star, Award, Zap } from 'lucide-react';

interface RecommendationCardProps {
  key?: string;
  recommendation: Recommendation;
  isSelected: boolean;
  onSelectToggle: () => void;
  disableSelection: boolean;
  onAddNote?: (id: string, note: string) => void;
  customNote?: string;
}

const CATEGORY_META = {
  outreach: {
    label: "Outreach & Impact",
    icon: Megaphone,
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    badgeColor: "bg-indigo-100 text-indigo-700",
    accentBorder: "hover:border-indigo-300 border-l-4 border-l-indigo-500"
  },
  volunteer: {
    label: "Volunteer Resource Hub",
    icon: Users,
    color: "text-violet-600 bg-violet-50 border-violet-100",
    badgeColor: "bg-violet-100 text-violet-700",
    accentBorder: "hover:border-violet-300 border-l-4 border-l-violet-500"
  },
  fundraising: {
    label: "Innovative Raising",
    icon: DollarSign,
    color: "text-amber-600 bg-amber-50 border-amber-100",
    badgeColor: "bg-amber-100 text-amber-700",
    accentBorder: "hover:border-amber-300 border-l-4 border-l-amber-500"
  },
  branding: {
    label: "Branding & Trust Platforms",
    icon: Globe,
    color: "text-sky-600 bg-sky-50 border-sky-100",
    badgeColor: "bg-sky-100 text-sky-700",
    accentBorder: "hover:border-sky-300 border-l-4 border-l-sky-500"
  }
};

export default function RecommendationCard({
  recommendation,
  isSelected,
  onSelectToggle,
  disableSelection,
  onAddNote,
  customNote = ""
}: RecommendationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const meta = CATEGORY_META[recommendation.category] || CATEGORY_META.outreach;
  const IconComponent = meta.icon;

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectToggle();
  };

  return (
    <div
      id={`recommendation-card-${recommendation.id}`}
      onClick={() => setIsExpanded(!isExpanded)}
      className={`bg-white rounded-xl border transition-all duration-200 cursor-pointer ${meta.accentBorder} ${
        isSelected 
          ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/5' 
          : 'border-slate-100 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div id={`category-badge-container-${recommendation.id}`} className={`p-2.5 rounded-xl border ${meta.color} flex-shrink-0 mt-0.5`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span id={`category-label-${recommendation.id}`} className={`text-2xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${meta.badgeColor}`}>
                  {meta.label}
                </span>
                
                {/* Metrics */}
                <span className="text-2xs font-medium text-slate-400 flex items-center gap-0.5">
                  <Star className="w-3 h-3 text-indigo-500 fill-indigo-500" /> Impact: {recommendation.impact}
                </span>
                <span className="text-2xs font-medium text-slate-400 flex items-center gap-0.5">
                  <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> Complexity: {recommendation.difficulty}
                </span>
              </div>
              <h3 id={`rec-title-${recommendation.id}`} className="font-display font-bold text-slate-800 text-base md:text-lg mt-2 tracking-tight">
                {recommendation.title}
              </h3>
            </div>
          </div>

          <button
            id={`btn-select-toggle-${recommendation.id}`}
            type="button"
            onClick={handleSelectClick}
            disabled={disableSelection && !isSelected}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all outline-none ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-sm'
                : disableSelection
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200'
            }`}
          >
            {isSelected ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-white fill-white" />
                Pinned
              </>
            ) : (
              'Pin Strategic Point'
            )}
          </button>
        </div>

        <p id={`rec-summary-${recommendation.id}`} className="text-slate-600 text-sm mt-3 ml-1 leading-relaxed">
          {recommendation.summary}
        </p>

        {/* Collapsible content */}
        {isExpanded && (
          <div id={`rec-expanded-details-${recommendation.id}`} className="mt-5 pt-4 border-t border-slate-100 space-y-4 animate-fade-in pl-1">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                Justification & Successful Practice Context
              </h4>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                {recommendation.explanation}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Action plan */}
              <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                  Action Steps Roadmap
                </h5>
                <ul className="space-y-1.5">
                  {recommendation.actionSteps.map((step, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                      <span className="font-display font-bold text-indigo-600 bg-indigo-50 rounded-full w-4 h-4 flex items-center justify-center text-3xs mt-0.5 flex-shrink-0">
                        {idx + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benchmarks to measure */}
              <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                  Performance Metrics
                </h5>
                <ul className="space-y-1.5">
                  {recommendation.metricsToTrack.map((metric, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5 leading-relaxed">
                      <span className="text-indigo-500 text-sm leading-none">•</span>
                      {metric}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Custom Notes editor */}
            {onAddNote && isSelected && (
              <div id={`notes-container-${recommendation.id}`} className="mt-4 pt-3 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Add custom organizer notes for this point (will appear in your exported plan):
                </label>
                <textarea
                  id={`note-input-${recommendation.id}`}
                  rows={2}
                  placeholder="e.g. Assigned to Mark; scheduled launch Date on Oct 1st..."
                  value={customNote}
                  onChange={(e) => onAddNote(recommendation.id, e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-all text-slate-700"
                />
              </div>
            )}
          </div>
        )}

        {/* Toggle icon at bottom */}
        <div className="flex justify-center mt-3 pt-2 text-slate-400 hover:text-slate-600 border-t border-slate-50">
          {isExpanded ? (
            <span className="text-2xs font-semibold flex items-center gap-1">Collapse Strategy <ChevronUp className="w-3.5 h-3.5" /></span>
          ) : (
            <span className="text-2xs font-semibold flex items-center gap-1">Expand Step-by-Step Instructions & Metrics <ChevronDown className="w-3.5 h-3.5" /></span>
          )}
        </div>
      </div>
    </div>
  );
}
