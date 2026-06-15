export interface NGOProfile {
  name: string;
  cause: string;
  region: string;
  scale: string;
  budget: string;
  primaryGoal: string;
  challenges: string;
}

export interface Recommendation {
  id: string;
  title: string;
  category: 'outreach' | 'volunteer' | 'fundraising' | 'branding';
  impact: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeframe: string;
  summary: string;
  explanation: string;
  actionSteps: string[];
  metricsToTrack: string[];
}

export type CategoryTheme = {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
};

export interface SavedGrowthPlan {
  id: string;
  profile: NGOProfile;
  selectedRecommendations: Recommendation[];
  customNotes: { [key: string]: string };
  createdAt: string;
}
