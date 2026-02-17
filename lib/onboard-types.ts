export type Industry =
  | "retail"
  | "restaurant"
  | "salon"
  | "health"
  | "professional"
  | "ecommerce"
  | "hospitality"
  | "other";

export type BusinessSize = "solo" | "small" | "medium" | "large";

export type ThreeWay = "yes" | "no" | "planning";

export interface OnboardAnswers {
  businessName: string;
  industry: Industry | "";
  businessSize: BusinessSize | "";
  sellsProducts: boolean;
  offersServices: boolean;
  hasPhysicalStore: boolean;
  sellsOnline: ThreeWay | "";
  hasEmployees: boolean;
  painPoints: string[];
  goals: string[];
}

export type ModuleStatus = "locked" | "ready" | "in_progress" | "complete";

export interface SetupStep {
  id: string;
  title: string;
  description: string;
  prerequisiteModuleId?: string;
  completed: boolean;
}

export interface ModuleDefinition {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  phase: number;
  prerequisites: string[];
  setupSteps: SetupStep[];
  features: string[];
  whyItMatters: Record<Industry | "default", string>;
}

export type RelevanceLevel = "essential" | "recommended" | "optional";

export interface ModuleRecommendation {
  moduleId: string;
  score: number;
  relevance: RelevanceLevel;
  reason: string;
}

export interface OnboardState {
  answers: OnboardAnswers;
  recommendations: ModuleRecommendation[];
  moduleProgress: Record<string, { stepsCompleted: string[] }>;
}

export const PAIN_POINTS = [
  { id: "inventory", label: "Tracking inventory across channels" },
  { id: "crm", label: "Managing customer relationships" },
  { id: "marketing", label: "Running marketing campaigns" },
  { id: "payments", label: "Processing payments & invoicing" },
  { id: "employees", label: "Managing employees & schedules" },
  { id: "online", label: "Building an online presence" },
  { id: "loyalty", label: "Customer loyalty & retention" },
  { id: "orders", label: "Streamlining order fulfillment" },
  { id: "analytics", label: "Understanding business analytics" },
  { id: "agreements", label: "Contract/agreement management" },
] as const;

export const GOALS = [
  { id: "sales", label: "Increase sales" },
  { id: "customers", label: "Grow customer base" },
  { id: "efficiency", label: "Improve operational efficiency" },
  { id: "online-store", label: "Launch or improve online store" },
  { id: "loyalty", label: "Build customer loyalty" },
  { id: "automate", label: "Automate repetitive tasks" },
  { id: "data", label: "Better understand business data" },
  { id: "team", label: "Manage team more effectively" },
] as const;

export const INDUSTRIES: { value: Industry; label: string }[] = [
  { value: "retail", label: "Retail" },
  { value: "restaurant", label: "Restaurant / Food" },
  { value: "salon", label: "Salon / Beauty" },
  { value: "health", label: "Health / Fitness" },
  { value: "professional", label: "Professional Services" },
  { value: "ecommerce", label: "E-commerce Only" },
  { value: "hospitality", label: "Hospitality" },
  { value: "other", label: "Other" },
];

export const BUSINESS_SIZES: { value: BusinessSize; label: string; description: string }[] = [
  { value: "solo", label: "Solo", description: "Just me" },
  { value: "small", label: "Small", description: "2-10 employees" },
  { value: "medium", label: "Medium", description: "11-50 employees" },
  { value: "large", label: "Large", description: "50+ employees" },
];
