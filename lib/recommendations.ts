import type { OnboardAnswers, ModuleRecommendation, RelevanceLevel } from "./onboard-types";
import { MODULES } from "./modules-data";

interface ScoringRule {
  condition: (answers: OnboardAnswers) => boolean;
  moduleScores: Record<string, number>;
}

const RULES: ScoringRule[] = [
  // Industry-based rules
  {
    condition: (a) => a.industry === "retail",
    moduleScores: { inventory: 30, fastshop: 25, crm: 20, invoices: 15, analytics: 15 },
  },
  {
    condition: (a) => a.industry === "restaurant",
    moduleScores: { inventory: 30, crm: 20, invoices: 15, employees: 20, analytics: 15 },
  },
  {
    condition: (a) => a.industry === "salon",
    moduleScores: { crm: 30, employees: 25, rewards: 20, marketing: 15, analytics: 10 },
  },
  {
    condition: (a) => a.industry === "health",
    moduleScores: { crm: 25, employees: 25, rewards: 15, invoices: 15, analytics: 15 },
  },
  {
    condition: (a) => a.industry === "professional",
    moduleScores: { crm: 30, invoices: 25, analytics: 15, marketing: 10, employees: 10 },
  },
  {
    condition: (a) => a.industry === "ecommerce",
    moduleScores: { inventory: 30, fastshop: 30, marketing: 20, analytics: 20, rewards: 15 },
  },
  {
    condition: (a) => a.industry === "hospitality",
    moduleScores: { crm: 25, employees: 20, invoices: 15, rewards: 15, analytics: 15 },
  },

  // Operations-based rules
  {
    condition: (a) => a.sellsProducts,
    moduleScores: { inventory: 25, fastshop: 15, analytics: 10 },
  },
  {
    condition: (a) => a.offersServices,
    moduleScores: { crm: 20, employees: 15, invoices: 15 },
  },
  {
    condition: (a) => a.hasPhysicalStore,
    moduleScores: { inventory: 15, employees: 10, analytics: 10 },
  },
  {
    condition: (a) => a.sellsOnline === "yes" || a.sellsOnline === "planning",
    moduleScores: { fastshop: 25, inventory: 15, marketing: 10 },
  },
  {
    condition: (a) => a.hasEmployees,
    moduleScores: { employees: 30, analytics: 10 },
  },
  {
    condition: (a) => !a.hasEmployees,
    moduleScores: { employees: -50 },
  },

  // Pain point rules
  {
    condition: (a) => a.painPoints.includes("inventory"),
    moduleScores: { inventory: 25, analytics: 10 },
  },
  {
    condition: (a) => a.painPoints.includes("crm"),
    moduleScores: { crm: 25, marketing: 10 },
  },
  {
    condition: (a) => a.painPoints.includes("marketing"),
    moduleScores: { marketing: 25, rewards: 15 },
  },
  {
    condition: (a) => a.painPoints.includes("payments"),
    moduleScores: { invoices: 25, fastshop: 10 },
  },
  {
    condition: (a) => a.painPoints.includes("employees"),
    moduleScores: { employees: 25 },
  },
  {
    condition: (a) => a.painPoints.includes("online"),
    moduleScores: { fastshop: 25, marketing: 10 },
  },
  {
    condition: (a) => a.painPoints.includes("loyalty"),
    moduleScores: { rewards: 25, crm: 10, marketing: 10 },
  },
  {
    condition: (a) => a.painPoints.includes("orders"),
    moduleScores: { inventory: 15, fastshop: 10, analytics: 10 },
  },
  {
    condition: (a) => a.painPoints.includes("analytics"),
    moduleScores: { analytics: 25 },
  },
  {
    condition: (a) => a.painPoints.includes("agreements"),
    moduleScores: { agreements: 25 },
  },
  {
    condition: (a) => a.industry === "professional",
    moduleScores: { agreements: 25, estimates: 25 },
  },
  {
    condition: (a) => a.industry === "health",
    moduleScores: { agreements: 15, appointments: 25 },
  },
  {
    condition: (a) => a.industry === "salon",
    moduleScores: { appointments: 30 },
  },
  {
    condition: (a) => a.offersServices,
    moduleScores: { appointments: 20 },
  },
  {
    condition: (a) => a.industry === "professional" && a.offersServices,
    moduleScores: { estimates: 25 },
  },

  // Goal-based rules
  {
    condition: (a) => a.goals.includes("sales"),
    moduleScores: { fastshop: 15, marketing: 15, rewards: 10 },
  },
  {
    condition: (a) => a.goals.includes("customers"),
    moduleScores: { crm: 15, marketing: 20, rewards: 10 },
  },
  {
    condition: (a) => a.goals.includes("efficiency"),
    moduleScores: { inventory: 10, employees: 10, analytics: 10 },
  },
  {
    condition: (a) => a.goals.includes("online-store"),
    moduleScores: { fastshop: 25, inventory: 10 },
  },
  {
    condition: (a) => a.goals.includes("loyalty"),
    moduleScores: { rewards: 25, crm: 10 },
  },
  {
    condition: (a) => a.goals.includes("automate"),
    moduleScores: { marketing: 15, invoices: 10, employees: 10 },
  },
  {
    condition: (a) => a.goals.includes("data"),
    moduleScores: { analytics: 25 },
  },
  {
    condition: (a) => a.goals.includes("team"),
    moduleScores: { employees: 20 },
  },
];

function scoreToRelevance(score: number): RelevanceLevel {
  if (score >= 50) return "essential";
  if (score >= 25) return "recommended";
  return "optional";
}

function getReasonForModule(moduleId: string, answers: OnboardAnswers): string {
  const industry = answers.industry || "default";
  const mod = MODULES.find((m) => m.id === moduleId);
  if (!mod) return "";
  return mod.whyItMatters[industry] || mod.whyItMatters.default;
}

export function generateRecommendations(answers: OnboardAnswers): ModuleRecommendation[] {
  const scores: Record<string, number> = {};

  // Initialize all modules with a base score
  for (const mod of MODULES) {
    scores[mod.id] = 10; // baseline
  }

  // Apply rules
  for (const rule of RULES) {
    if (rule.condition(answers)) {
      for (const [moduleId, score] of Object.entries(rule.moduleScores)) {
        scores[moduleId] = (scores[moduleId] || 0) + score;
      }
    }
  }

  // Clamp scores to 0-100
  for (const key of Object.keys(scores)) {
    scores[key] = Math.max(0, Math.min(100, scores[key]));
  }

  // Convert to recommendations, sorted by score
  const recommendations: ModuleRecommendation[] = Object.entries(scores)
    .filter(([, score]) => score > 0)
    .map(([moduleId, score]) => ({
      moduleId,
      score,
      relevance: scoreToRelevance(score),
      reason: getReasonForModule(moduleId, answers),
    }))
    .sort((a, b) => b.score - a.score);

  return recommendations;
}

export function getDefaultOnboardState() {
  return {
    answers: {
      businessName: "",
      industry: "" as const,
      businessSize: "" as const,
      sellsProducts: false,
      offersServices: false,
      hasPhysicalStore: false,
      sellsOnline: "" as const,
      hasEmployees: false,
      painPoints: [] as string[],
      goals: [] as string[],
    },
    recommendations: [] as ModuleRecommendation[],
    moduleProgress: {} as Record<string, { stepsCompleted: string[] }>,
  };
}
