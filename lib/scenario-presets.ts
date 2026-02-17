import type { OnboardAnswers, Industry, BusinessSize, ThreeWay } from "./onboard-types";
import type { ModuleRecommendation } from "./onboard-types";

/**
 * Static demo presets - each scenario has pre-defined module recommendations.
 * No calculation - for demo/presentation only.
 */
export const SCENARIO_PRESETS: {
  name: string;
  businessName: string;
  description: string;
  answers: OnboardAnswers;
  recommendations: ModuleRecommendation[];
}[] = [
  {
    name: "Retail Store",
    businessName: "Corner Mart",
    description: "Retail • Small • Sells products, physical store, has employees • Challenges: Inventory, Analytics • Goals: Sales, Efficiency",
    answers: {
      businessName: "Corner Mart",
      industry: "retail" as Industry,
      businessSize: "small" as BusinessSize,
      sellsProducts: true,
      offersServices: false,
      hasPhysicalStore: true,
      sellsOnline: "no" as ThreeWay,
      hasEmployees: true,
      painPoints: ["inventory", "analytics"],
      goals: ["sales", "efficiency"],
    },
    recommendations: [
      { moduleId: "inventory", score: 70, relevance: "essential", reason: "Track stock and avoid stockouts." },
      { moduleId: "crm", score: 55, relevance: "essential", reason: "Manage customer relationships." },
      { moduleId: "employees", score: 60, relevance: "essential", reason: "Schedule shifts and manage your team." },
      { moduleId: "fastshop", score: 50, relevance: "essential", reason: "Sell in-store and online." },
      { moduleId: "invoices", score: 45, relevance: "recommended", reason: "Send invoices and get paid." },
      { moduleId: "analytics", score: 40, relevance: "recommended", reason: "Understand sales and performance." },
    ],
  },
  {
    name: "Restaurant",
    businessName: "Sunrise Cafe & Bakery",
    description: "Restaurant • Small • Products + services, physical store, employees • Challenges: Inventory, Employees, Orders • Goals: Sales, Team",
    answers: {
      businessName: "Sunrise Cafe & Bakery",
      industry: "restaurant" as Industry,
      businessSize: "small" as BusinessSize,
      sellsProducts: true,
      offersServices: true,
      hasPhysicalStore: true,
      sellsOnline: "no" as ThreeWay,
      hasEmployees: true,
      painPoints: ["inventory", "employees", "orders"],
      goals: ["sales", "team"],
    },
    recommendations: [
      { moduleId: "inventory", score: 70, relevance: "essential", reason: "Track ingredients and menu items." },
      { moduleId: "crm", score: 55, relevance: "essential", reason: "Know your regulars and preferences." },
      { moduleId: "employees", score: 65, relevance: "essential", reason: "Manage shifts and staff." },
      { moduleId: "invoices", score: 50, relevance: "essential", reason: "Bill B2B and catering orders." },
      { moduleId: "analytics", score: 45, relevance: "recommended", reason: "Track sales trends." },
    ],
  },
  {
    name: "Salon",
    businessName: "Glow Studio",
    description: "Salon • Small • Services only, physical store, employees • Challenges: CRM, Loyalty • Goals: Customers, Loyalty",
    answers: {
      businessName: "Glow Studio",
      industry: "salon" as Industry,
      businessSize: "small" as BusinessSize,
      sellsProducts: false,
      offersServices: true,
      hasPhysicalStore: true,
      sellsOnline: "no" as ThreeWay,
      hasEmployees: true,
      painPoints: ["crm", "loyalty"],
      goals: ["customers", "loyalty"],
    },
    recommendations: [
      { moduleId: "crm", score: 75, relevance: "essential", reason: "Appointments and client history." },
      { moduleId: "appointments", score: 70, relevance: "essential", reason: "Self-booking for services." },
      { moduleId: "employees", score: 65, relevance: "essential", reason: "Stylist schedules and commissions." },
      { moduleId: "rewards", score: 55, relevance: "essential", reason: "Loyalty rewards for repeat visits." },
      { moduleId: "marketing", score: 45, relevance: "recommended", reason: "Promote services and offers." },
      { moduleId: "analytics", score: 35, relevance: "recommended", reason: "Track retention and revenue." },
    ],
  },
  {
    name: "E-commerce",
    businessName: "TechHub Online",
    description: "E-commerce • Medium • Products, sells online, employees • Challenges: Inventory, Online, Marketing • Goals: Online Store, Sales, Data",
    answers: {
      businessName: "TechHub Online",
      industry: "ecommerce" as Industry,
      businessSize: "medium" as BusinessSize,
      sellsProducts: true,
      offersServices: false,
      hasPhysicalStore: false,
      sellsOnline: "yes" as ThreeWay,
      hasEmployees: true,
      painPoints: ["inventory", "online", "marketing"],
      goals: ["online-store", "sales", "data"],
    },
    recommendations: [
      { moduleId: "inventory", score: 75, relevance: "essential", reason: "Sync stock across channels." },
      { moduleId: "fastshop", score: 80, relevance: "essential", reason: "Your online storefront." },
      { moduleId: "crm", score: 50, relevance: "essential", reason: "Customer data and segments." },
      { moduleId: "marketing", score: 55, relevance: "essential", reason: "Email and promo campaigns." },
      { moduleId: "rewards", score: 45, relevance: "recommended", reason: "Repeat buyer incentives." },
      { moduleId: "analytics", score: 55, relevance: "essential", reason: "Traffic and conversion data." },
    ],
  },
  {
    name: "Solo Professional",
    businessName: "Alex Consulting",
    description: "Professional Services • Solo • Services only, no store, no employees • Challenges: CRM, Payments • Goals: Customers, Efficiency",
    answers: {
      businessName: "Alex Consulting",
      industry: "professional" as Industry,
      businessSize: "solo" as BusinessSize,
      sellsProducts: false,
      offersServices: true,
      hasPhysicalStore: false,
      sellsOnline: "no" as ThreeWay,
      hasEmployees: false,
      painPoints: ["crm", "payments"],
      goals: ["customers", "efficiency"],
    },
    recommendations: [
      { moduleId: "crm", score: 75, relevance: "essential", reason: "Leads and client management." },
      { moduleId: "invoices", score: 70, relevance: "essential", reason: "Send invoices and track payments." },
      { moduleId: "agreements", score: 65, relevance: "essential", reason: "Digital contracts and e-signatures." },
      { moduleId: "estimates", score: 60, relevance: "essential", reason: "Professional project quotes." },
      { moduleId: "analytics", score: 45, relevance: "recommended", reason: "Revenue and project insights." },
      { moduleId: "marketing", score: 40, relevance: "recommended", reason: "Simple outreach campaigns." },
    ],
  },
  {
    name: "Minimal Setup",
    businessName: "New Venture",
    description: "Other • Solo • No products, no services, no store, no employees • Challenges: (none) • Goals: (none)",
    answers: {
      businessName: "New Venture",
      industry: "other" as Industry,
      businessSize: "solo" as BusinessSize,
      sellsProducts: false,
      offersServices: false,
      hasPhysicalStore: false,
      sellsOnline: "no" as ThreeWay,
      hasEmployees: false,
      painPoints: [],
      goals: [],
    },
    recommendations: [
      { moduleId: "crm", score: 50, relevance: "essential", reason: "Start with customer contacts." },
      { moduleId: "invoices", score: 45, relevance: "recommended", reason: "Get paid for your work." },
      { moduleId: "analytics", score: 40, relevance: "recommended", reason: "Basic business insights." },
    ],
  },
];
