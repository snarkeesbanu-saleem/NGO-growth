import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini safely to avoid app crash if key is missing on startup
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Using curated recommendation system.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Curated high-impact fallbacks (in case API is unavailable or environment key not supplied)
const CURATED_RECOMMENDATIONS = [
  {
    id: "out-1",
    title: "Eco-Storytelling: Video Micro-Narratives",
    category: "outreach",
    impact: "High",
    difficulty: "Medium",
    timeframe: "2-3 weeks",
    summary: "Produce short, focus-framed 60-second video portraits of project beneficiaries to drive emotional connection on social platforms.",
    explanation: "NGO communications frequently focus too heavily on statistics rather than human elements. Emphasizing individual story paths humanizes work, creating highly shareable content that establishes brand authenticity.",
    actionSteps: [
      "Select one focal beneficiary or field worker willing to share their 1-minute journey.",
      "Record using simple mobile equipment with clear natural lighting and high-quality lapel sound.",
      "Create high-contrast captions (captions are critical as 80% of feeds are watched on mute).",
      "Deploy across major micro-video platforms with standard location and topic tags."
    ],
    metricsToTrack: [
      "Engagement and share rate (benchmark target: 3.5%+)",
      "New inbound message inquiries",
      "Average view-through duration"
    ]
  },
  {
    id: "vol-1",
    title: "Micro-Activity Volunteering Framework",
    category: "volunteer",
    impact: "High",
    difficulty: "Easy",
    timeframe: "1-2 weeks",
    summary: "Establish ultra-low commitment tasks (15-30 mins) to enable busy working professionals to contribute immediately.",
    explanation: "Standard volunteer models require long, structured shifts which screen out top skill talent. Structuring tasks into micro-deliverables lowers entry barriers, significantly enlarging the active resource pool.",
    actionSteps: [
      "Deconstruct manual operational routines into micro-chunks (such as 250-word proofreads or 10-slide visual edits).",
      "Create a dedicated 'Micro-Task Board' on the primary portal.",
      "Host a simple 10-minute automated orientation guide.",
      "Recognize completed items immediately on active social boards."
    ],
    metricsToTrack: [
      "Monthly active volunteer count",
      "Average task completion speed",
      "New volunteer retention rate (30-day index)"
    ]
  },
  {
    id: "fun-1",
    title: "Sponsor-A-Module Visual Campaign",
    category: "fundraising",
    impact: "High",
    difficulty: "Medium",
    timeframe: "3-4 weeks",
    summary: "Discretize general operating budgets into tangible micro-projects (e.g., $15 pays for 1 learning kit) to clarify impact.",
    explanation: "Donors hesitate when contributions go to broad, ambiguous funds. Discretizing investments to exact, visual modules increases conversion rate, boosting long-term average gift size.",
    actionSteps: [
      "Audit annual operating budgets to divide overall numbers into direct unit impact math.",
      "Adopt a visual slider on fundraising pages indicating exactly what various investment levels purchase.",
      "Ensure receipt confirmations immediately note the specific project unit sponsored.",
      "Send a closing visual report showing the direct result of that specific batch of sponsor units."
    ],
    metricsToTrack: [
      "Fundraising page donor conversion rate",
      "Average online gift size",
      "Recurring monthly donor commitment retention"
    ]
  },
  {
    id: "bra-1",
    title: "Local Search Optimization & Trust Seals",
    category: "branding",
    impact: "High",
    difficulty: "Easy",
    timeframe: "1-2 weeks",
    summary: "Establish complete directory accuracy and prominent transparency badges to maximize organic search authority.",
    explanation: "Many prospective volunteers or local foundation heads search using local queries. Verification, local coordinates, and distinct transparency badges provide search confidence, elevating active local status.",
    actionSteps: [
      "Register and verify the physical headquarters and active territory coordinates on global map rosters.",
      "Gather and publish annual audited financials and tax certificates in a central, visible transparency panel.",
      "Optimize search headers with geographical search descriptors (e.g., 'Child Literacy Program in North District').",
      "Request verified testimonials from original board members and long-term direct sponsors."
    ],
    metricsToTrack: [
      "Organic local search visibility metrics",
      "Monthly unique web visits",
      "Inbound partnerships generated through direct searches"
    ]
  },
  {
    id: "out-2",
    title: "Hyper-Local Community Dialogue Series",
    category: "outreach",
    impact: "Medium",
    difficulty: "Easy",
    timeframe: "2 weeks",
    summary: "Host regular, highly structured neighborhood workshops to discuss local challenges and gather direct input.",
    explanation: "Top-down NGO models often fail to foster local trust. Facilitating interactive town halls builds grassroot support and deepens local community alignment, boosting local credibility.",
    actionSteps: [
      "Identify a local municipal hall or public space for a 90-minute feedback workshop.",
      "Construct a highly participative agenda focused on active brainstorming rather than organizational lectures.",
      "Incorporate local regional leaders as panels to validate neighborhood concerns.",
      "Distribute quick feedback leaflets at the exit to gather structured participant data."
    ],
    metricsToTrack: [
      "Event attendance numbers",
      "Percentage of first-time contacts captured",
      "Post-event local satisfaction index"
    ]
  },
  {
    id: "vol-2",
    title: "Academic Skill-Matching Internship Program",
    category: "volunteer",
    impact: "High",
    difficulty: "Medium",
    timeframe: "4 weeks",
    summary: "Partner with regional colleges to provide certified academic credits for advanced technical contributions.",
    explanation: "Undergraduate students require concrete, real-world portfolio outcomes. Offering formal internships with distinct skill matching (e.g. Graphic Design, Data Analytics) delivers heavy corporate-grade capacity.",
    actionSteps: [
      "Structure specific 80-hour volunteer modules highlighting clear career-skill goals and deliverables.",
      "Contact regional collegiate department leads to align tasks with academic credit standards.",
      "Establish a streamlined student tracker to record and review professional growth parameters.",
      "Issue formalized recommendation letters and LinkedIn portfolio recommendations upon achievement."
    ],
    metricsToTrack: [
      "Academic organization partnerships signed",
      "Advanced project hours contributed",
      "Student volunteer conversion to recurring advocates"
    ]
  },
  {
    id: "fun-2",
    title: "Impact Milestone Micro-Challenge",
    category: "fundraising",
    impact: "Medium",
    difficulty: "Medium",
    timeframe: "3 weeks",
    summary: "Launch dynamic match-challenges matching key operational milestones (e.g. 'Help us reach 500 children, every dollar matched').",
    explanation: "Urgency and specificity drive impulsive, highly-engaged digital donors. Framing challenges surrounding short-term outcomes backed by a focal matching donor leverages collective crowd resources.",
    actionSteps: [
      "Secure a major primary pledge from a key private donor to act as a match anchor.",
      "Develop high-clarity progress tracking bars to display real-time donor milestones on active pipelines.",
      "Schedule high-tempo update notices to keep matches active and maintain crowd urgency.",
      "Celebrate milestone completion with video footage showing direct material distributions."
    ],
    metricsToTrack: [
      "Campaign completion velocity",
      "Individual donor growth percentage",
      "Matching donor contract fulfillment rate"
    ]
  },
  {
    id: "bra-2",
    title: "Accessibility, Mobile Tuning & Speed Auditing",
    category: "branding",
    impact: "Medium",
    difficulty: "Easy",
    timeframe: "1 week",
    summary: "Audit and resolve web responsiveness, slow load speeds, and screen reader structures to capture mobile stakeholders.",
    explanation: "Over 65% of local digital traffic connects via low-tier mobile devices. An optimized, fast-loading interface with clear structures ensures that user bounce rates stay low.",
    actionSteps: [
      "Optimize and compress all online vector assets and high-res imagery.",
      "Implement simple keyboard navigability and clear document hierarchy guidelines.",
      "Simplify donation forms to a single-screen responsive panel.",
      "Verify load velocity across multiple average standard cellular environments."
    ],
    metricsToTrack: [
      "Average page load speed benchmarks",
      "Mobile checkout complete percentage",
      "Visual layout bounce rates"
    ]
  }
];

// POST route: Dynamic tailormade recommendation builder powered by Gemini
app.post("/api/generate-insights", async (req, res) => {
  const profile = req.body;

  if (!profile || !profile.name) {
    return res.status(400).json({ error: "Missing required NGO profile data" });
  }

  const ai = getGeminiClient();
  if (!ai) {
    // If API key is missing, filter & adapt our curated list specifically to match their Cause & Category
    console.log("No Gemini API key. Generating personalized recommendations from base repository.");
    const adapted = CURATED_RECOMMENDATIONS.map((rec) => {
      // Modify terms based on their specific profile input to make it customized
      let adaptedTitle = rec.title;
      let adaptedExplanation = rec.explanation;
      let adaptedSummary = rec.summary;

      // Replace generic causes with user's specific cause/name
      if (profile.cause) {
        adaptedTitle = adaptedTitle.replace(/Eco-Storytelling|Child Literacy/gi, `${profile.cause} Advocacy`);
        adaptedExplanation = adaptedExplanation.replace(/environmental causes|child literacy/gi, `${profile.cause.toLowerCase()} efforts`);
      }
      
      return {
        ...rec,
        title: adaptedTitle,
        summary: adaptedSummary.replace("beneficiaries", `${profile.cause.toLowerCase()} focus domains`),
        explanation: adaptedExplanation + ` Tailored especially for '${profile.name}', addressing regional needs in ${profile.region || 'local centers'}.`
      };
    });

    return res.json({ recommendations: adapted });
  }

  try {
    const prompt = `You are a world-class strategic consultant for Non-Governmental Organizations (NGOs). 
Generate Exactly 5 highly tailored, innovative, and practical growth strategies or practices customized specifically for the following NGO profile:

- Name: "${profile.name}"
- Sector/Cause/Theme: "${profile.cause}"
- Target Region / Focus Area: "${profile.region}"
- Scale of Operations: "${profile.scale}"
- Budget / Resource Category: "${profile.budget}"
- Primary Goals & Focus: "${profile.primaryGoal}"
- Primary Challenges Faced: "${profile.challenges}"

To ensure an overview across administrative concerns, generate exactly 5 strategies distributed across:
- outreach (Strategies to improve public awareness, community relationships)
- volunteer (Strategies to optimize recruitment or retention of volunteers)
- fundraising (Strategies to launch creative, realistic donation loops or matched grants aligned to their budget)
- branding (Strategies to enhance digital presence, mobile responsiveness, or trust badges)

Ensure there is at least one recommendation for each of the four categories above.
For each strategy, make it deeply realistic, hyper-tailored to their budget level of "${profile.budget}", and fully actionable. Avoid empty buzzwords. Keep descriptions high-impact but concise to allow real-time analysis within 6 seconds.

Provide the response in raw JSON adhering strictly to the schema requested. Return ONLY the JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert NGO growth strategist. Provide actionable, high-quality, concise strategies that are tailored to the organization's scale, resource limits, and cause. Ensure high speed and low latency by outputting maximum 1-2 sentences per explanation, exactly 3 action steps, and 2 metrics per strategy.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              description: "List of exactly 5 customized recommendations.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "A unique short id (e.g. 'rec-1', 'rec-2')" },
                  title: { type: Type.STRING, description: "Clear innovative name of the strategy" },
                  category: { type: Type.STRING, description: "Must be exactly one of: 'outreach', 'volunteer', 'fundraising', 'branding'" },
                  impact: { type: Type.STRING, description: "Must be exactly one of: 'High', 'Medium', 'Low'" },
                  difficulty: { type: Type.STRING, description: "Must be exactly one of: 'Easy', 'Medium', 'Hard'" },
                  timeframe: { type: Type.STRING, description: "e.g., '1-2 weeks', '3 weeks'" },
                  summary: { type: Type.STRING, description: "Strong one-sentence summary of the recommendation" },
                  explanation: { type: Type.STRING, description: "Concise 1-2 sentence strategic justification" },
                  actionSteps: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "Exactly 3 sequential, concrete steps to achieve this strategy."
                  },
                  metricsToTrack: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "Exactly 2 concrete metrics or indicators to measure achievement."
                  }
                },
                required: ["id", "title", "category", "impact", "difficulty", "timeframe", "summary", "explanation", "actionSteps", "metricsToTrack"]
              }
            }
          },
          required: ["recommendations"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.json(parsedData);
  } catch (err: any) {
    console.error("Gemini Generation Error:", err);
    return res.status(500).json({ 
      error: "Failed to generate dynamic recommendations", 
      details: err.message,
      recommendations: CURATED_RECOMMENDATIONS.slice(0, 5) // Graceful fallback even under 500 error
    });
  }
});

// Serve Vite files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NGO Growth Insight Planner backend server listening on host 0.0.0.0, port ${PORT}`);
  });
}

startServer();
