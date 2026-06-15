import React, { useState } from 'react';
import { NGOProfile } from '../types';
import { Building2, Globe, DollarSign, Target, Sparkles, AlertCircle, Heart } from 'lucide-react';

interface NGOProfileFormProps {
  onSubmit: (profile: NGOProfile) => void;
  isLoading: boolean;
}

const PRESETS = [
  {
    name: "EcoGuard Preservation",
    cause: "Environmental Protection",
    region: "Pacific Northwest Local Communes",
    scale: "Grassroots/Local",
    budget: "Micro (Under $15,000)",
    primaryGoal: "Raise public climate awareness and recruit young weekend volunteers for forestry restoration.",
    challenges: "Having a micro budget makes offline marketing too costly, and volunteer drop-off rate is close to 60% after the first event."
  },
  {
    name: "Spark Learning Alliance",
    cause: "Underprivileged Child Education",
    region: "Metropolitan Inner-City Districts",
    scale: "Regional/Statewide",
    budget: "Small ($15,000 - $60,000)",
    primaryGoal: "Secure recurring micro-sponsorships to fund learning kits and build corporate mentoring channels.",
    challenges: "Finding stable individual sponsors who renew, and recruiting professional designers and engineers for skills-based teaching programs."
  },
  {
    name: "HealGlobal Outreach",
    cause: "Rural Mobile Medical Access",
    region: "Southeastern Remote Settlements",
    scale: "National/International",
    budget: "Medium ($60,000 - $250,000)",
    primaryGoal: "Scale our remote mobile healthcare units, digitalize check-ups, and coordinate credentialed medical staff.",
    challenges: "Extremely difficult recruitment of specialized medical volunteers (doctors, certified nurses) and heavy logistics costs for remote transport."
  }
];

export default function NGOProfileForm({ onSubmit, isLoading }: NGOProfileFormProps) {
  const [formData, setFormData] = useState<NGOProfile>({
    name: '',
    cause: '',
    region: '',
    scale: 'Grassroots/Local',
    budget: 'Micro (Under $15,000)',
    primaryGoal: '',
    challenges: ''
  });

  const [activePreset, setActivePreset] = useState<number | null>(null);

  const applyPreset = (index: number) => {
    setActivePreset(index);
    setFormData(PRESETS[index]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setActivePreset(null); // Clear preset highlight if they manually edit
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.cause || !formData.primaryGoal) {
      alert("Please enter at least the Organization Name, Cause Theme, and Primary Goal.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div id="ngo-profile-form-container" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm md:p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 id="form-heading-title" className="font-display text-xl font-semibold text-slate-800 flex items-center gap-2">
            <Building2 className="text-emerald-600 w-5 h-5" />
            1. Define Your Social Organization
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Specify your structural parameters to build tailored, budget-conscious strategic advice.
          </p>
        </div>
        
        {/* Preset selections */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            Prefalls for testing:
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {PRESETS.map((p, index) => (
              <button
                key={index}
                id={`preset-btn-${index}`}
                type="button"
                onClick={() => applyPreset(index)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
                  activePreset === index
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Organization Name */}
          <div>
            <label id="lbl-org-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Organization Name *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
              <input
                id="inp-org-name"
                name="name"
                type="text"
                required
                placeholder="e.g. Alliance for Clean Waters"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm outline-none transition-all text-slate-800"
              />
            </div>
          </div>

          {/* Core Cause */}
          <div>
            <label id="lbl-org-cause" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Sector / Core Cause *
            </label>
            <div className="relative">
              <Heart className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
              <input
                id="inp-org-cause"
                name="cause"
                type="text"
                required
                placeholder="e.g. Wildlife Preservation, Food Security"
                value={formData.cause}
                onChange={handleInputChange}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm outline-none transition-all text-slate-800"
              />
            </div>
          </div>

          {/* Regional Territory */}
          <div>
            <label id="lbl-org-region" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Target Territory / Focus Domain
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
              <input
                id="inp-org-region"
                name="region"
                type="text"
                placeholder="e.g. South District Villages, Mid-Scale Towns"
                value={formData.region}
                onChange={handleInputChange}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm outline-none transition-all text-slate-800"
              />
            </div>
          </div>

          {/* Scale of Operations */}
          <div>
            <label id="lbl-org-scale" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Scale of Operations
            </label>
            <select
              id="sel-org-scale"
              name="scale"
              value={formData.scale}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm outline-none transition-all text-slate-800"
            >
              <option value="Grassroots/Local">Grassroots / Local (Neighborhood)</option>
              <option value="Regional/Statewide">Regional / Statewide (Citywide)</option>
              <option value="National">National (Countrywide)</option>
              <option value="National/International">International / Global</option>
            </select>
          </div>

          {/* Budget Resource Limit */}
          <div>
            <label id="lbl-org-budget" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Annual Operating Budget Category
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
              <select
                id="sel-org-budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm outline-none transition-all text-slate-800"
              >
                <option value="Micro (Under $15,000)">Micro (Under $15,000)</option>
                <option value="Small ($15,000 - $60,000)">Small ($15,000 - $60,000)</option>
                <option value="Medium ($60,000 - $250,000)">Medium ($60,000 - $250,000)</option>
                <option value="Large (Over $250,000)">Large (Over $250,000)</option>
              </select>
            </div>
          </div>

          {/* Primary Goal */}
          <div>
            <label id="lbl-org-goal" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Primary Outreach / Raising Goal *
            </label>
            <div className="relative">
              <Target className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
              <input
                id="inp-org-goal"
                name="primaryGoal"
                type="text"
                required
                placeholder="e.g. Acquire 100 new local monthly donors"
                value={formData.primaryGoal}
                onChange={handleInputChange}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm outline-none transition-all text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Primary Challenges */}
        <div>
          <label id="lbl-org-challenges" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            Main Obstacles or Structural Bottlenecks (Optional)
          </label>
          <textarea
            id="txt-org-challenges"
            name="challenges"
            rows={3}
            placeholder="e.g. Volunteers leave quickly; staff has no graphic design experience; donors drop off after recurring season..."
            value={formData.challenges}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm outline-none transition-all text-slate-800 resize-none"
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            id="btn-generate-insights"
            type="submit"
            disabled={isLoading}
            className={`w-full md:w-auto px-6 py-3 rounded-xl font-display font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-700/10 ${
              isLoading
                ? 'bg-emerald-100 text-emerald-400 cursor-not-allowed border border-emerald-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg hover:shadow-emerald-700/20 cursor-pointer active:scale-98'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing Profile & Practices...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-white animate-pulse" />
                Formulate Growth Insights
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
