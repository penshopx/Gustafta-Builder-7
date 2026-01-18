import {
  Briefcase,
  Heart,
  Palette,
  Scale,
  Stethoscope,
  Settings,
  DollarSign,
  GraduationCap,
  ShoppingBag,
  Radio,
  Megaphone,
  Lightbulb,
  Home,
  Users,
  UserCheck,
  Headphones,
  Church,
  TrendingUp,
  Phone,
  Monitor,
  ClipboardList,
  Building2,
  Utensils,
  Plane,
  Car,
  Leaf,
  Dumbbell,
  Music,
  Camera,
  Gamepad2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Subcategory {
  id: string;
  label: string;
}

export interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
  subcategories: Subcategory[];
}

export const categories: Category[] = [
  {
    id: "executive",
    label: "Executive Management",
    icon: Briefcase,
    subcategories: [
      { id: "ceo", label: "CEO / Director" },
      { id: "coo", label: "COO / Operations" },
      { id: "cfo", label: "CFO / Finance Director" },
      { id: "strategy", label: "Business Strategy" },
      { id: "leadership", label: "Leadership Coach" },
    ],
  },
  {
    id: "customer_success",
    label: "Customer Success",
    icon: Heart,
    subcategories: [
      { id: "account_manager", label: "Account Manager" },
      { id: "cs_manager", label: "CS Manager" },
      { id: "onboarding", label: "Onboarding Specialist" },
      { id: "retention", label: "Retention Specialist" },
      { id: "success_coach", label: "Success Coach" },
    ],
  },
  {
    id: "creative",
    label: "Creative",
    icon: Palette,
    subcategories: [
      { id: "graphic_design", label: "Graphic Designer" },
      { id: "ui_ux", label: "UI/UX Designer" },
      { id: "copywriter", label: "Copywriter" },
      { id: "content_creator", label: "Content Creator" },
      { id: "video_editor", label: "Video Editor" },
      { id: "animator", label: "Animator" },
    ],
  },
  {
    id: "legal",
    label: "Legal",
    icon: Scale,
    subcategories: [
      { id: "corporate_lawyer", label: "Corporate Lawyer" },
      { id: "contract_lawyer", label: "Contract Lawyer" },
      { id: "ip_lawyer", label: "IP Lawyer" },
      { id: "paralegal", label: "Paralegal" },
      { id: "compliance", label: "Compliance Officer" },
    ],
  },
  {
    id: "medical",
    label: "Medical",
    icon: Stethoscope,
    subcategories: [
      { id: "doctor", label: "Doctor / Physician" },
      { id: "nurse", label: "Nurse" },
      { id: "pharmacist", label: "Pharmacist" },
      { id: "therapist", label: "Therapist" },
      { id: "dentist", label: "Dentist" },
      { id: "nutritionist", label: "Nutritionist" },
    ],
  },
  {
    id: "engineering",
    label: "Engineering",
    icon: Settings,
    subcategories: [
      { id: "software_engineer", label: "Software Engineer" },
      { id: "data_engineer", label: "Data Engineer" },
      { id: "devops", label: "DevOps Engineer" },
      { id: "mechanical", label: "Mechanical Engineer" },
      { id: "electrical", label: "Electrical Engineer" },
      { id: "civil", label: "Civil Engineer" },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    icon: DollarSign,
    subcategories: [
      { id: "accountant", label: "Accountant" },
      { id: "financial_advisor", label: "Financial Advisor" },
      { id: "investment_analyst", label: "Investment Analyst" },
      { id: "tax_consultant", label: "Tax Consultant" },
      { id: "auditor", label: "Auditor" },
    ],
  },
  {
    id: "education",
    label: "Education",
    icon: GraduationCap,
    subcategories: [
      { id: "teacher", label: "Teacher" },
      { id: "professor", label: "Professor" },
      { id: "tutor", label: "Tutor" },
      { id: "curriculum_designer", label: "Curriculum Designer" },
      { id: "education_consultant", label: "Education Consultant" },
    ],
  },
  {
    id: "retail",
    label: "Retail",
    icon: ShoppingBag,
    subcategories: [
      { id: "store_manager", label: "Store Manager" },
      { id: "merchandiser", label: "Merchandiser" },
      { id: "buyer", label: "Buyer" },
      { id: "inventory_manager", label: "Inventory Manager" },
      { id: "retail_analyst", label: "Retail Analyst" },
    ],
  },
  {
    id: "media",
    label: "Media & Communications",
    icon: Radio,
    subcategories: [
      { id: "journalist", label: "Journalist" },
      { id: "pr_specialist", label: "PR Specialist" },
      { id: "broadcaster", label: "Broadcaster" },
      { id: "social_media_manager", label: "Social Media Manager" },
      { id: "communications_director", label: "Communications Director" },
    ],
  },
  {
    id: "public_relations",
    label: "Public Relations",
    icon: Megaphone,
    subcategories: [
      { id: "pr_manager", label: "PR Manager" },
      { id: "media_relations", label: "Media Relations" },
      { id: "crisis_manager", label: "Crisis Manager" },
      { id: "brand_ambassador", label: "Brand Ambassador" },
      { id: "publicist", label: "Publicist" },
    ],
  },
  {
    id: "entrepreneur",
    label: "Entrepreneur",
    icon: Lightbulb,
    subcategories: [
      { id: "startup_founder", label: "Startup Founder" },
      { id: "small_business", label: "Small Business Owner" },
      { id: "freelancer", label: "Freelancer" },
      { id: "consultant", label: "Business Consultant" },
      { id: "investor", label: "Investor" },
    ],
  },
  {
    id: "real_estate",
    label: "Real Estate",
    icon: Home,
    subcategories: [
      { id: "real_estate_agent", label: "Real Estate Agent" },
      { id: "property_manager", label: "Property Manager" },
      { id: "developer", label: "Property Developer" },
      { id: "appraiser", label: "Appraiser" },
      { id: "mortgage_broker", label: "Mortgage Broker" },
    ],
  },
  {
    id: "hr",
    label: "Human Resources",
    icon: Users,
    subcategories: [
      { id: "hr_manager", label: "HR Manager" },
      { id: "recruiter", label: "Recruiter" },
      { id: "training_specialist", label: "Training Specialist" },
      { id: "compensation_analyst", label: "Compensation Analyst" },
      { id: "hr_business_partner", label: "HR Business Partner" },
    ],
  },
  {
    id: "personal_dev",
    label: "Personal Development",
    icon: UserCheck,
    subcategories: [
      { id: "life_coach", label: "Life Coach" },
      { id: "career_coach", label: "Career Coach" },
      { id: "mindset_coach", label: "Mindset Coach" },
      { id: "productivity_coach", label: "Productivity Coach" },
      { id: "wellness_coach", label: "Wellness Coach" },
    ],
  },
  {
    id: "customer_service",
    label: "Customer Service",
    icon: Headphones,
    subcategories: [
      { id: "support_agent", label: "Support Agent" },
      { id: "call_center", label: "Call Center Rep" },
      { id: "help_desk", label: "Help Desk" },
      { id: "chat_support", label: "Chat Support" },
      { id: "technical_support", label: "Technical Support" },
    ],
  },
  {
    id: "religious",
    label: "Religious Services",
    icon: Church,
    subcategories: [
      { id: "pastor", label: "Pastor / Imam / Rabbi" },
      { id: "counselor", label: "Spiritual Counselor" },
      { id: "youth_leader", label: "Youth Leader" },
      { id: "community_leader", label: "Community Leader" },
      { id: "chaplain", label: "Chaplain" },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: TrendingUp,
    subcategories: [
      { id: "marketing_manager", label: "Marketing Manager" },
      { id: "digital_marketer", label: "Digital Marketer" },
      { id: "seo_specialist", label: "SEO Specialist" },
      { id: "brand_manager", label: "Brand Manager" },
      { id: "growth_hacker", label: "Growth Hacker" },
      { id: "email_marketer", label: "Email Marketer" },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    icon: Phone,
    subcategories: [
      { id: "sales_rep", label: "Sales Representative" },
      { id: "sales_manager", label: "Sales Manager" },
      { id: "business_dev", label: "Business Development" },
      { id: "account_exec", label: "Account Executive" },
      { id: "sales_director", label: "Sales Director" },
    ],
  },
  {
    id: "it",
    label: "Information Technology",
    icon: Monitor,
    subcategories: [
      { id: "it_manager", label: "IT Manager" },
      { id: "system_admin", label: "System Administrator" },
      { id: "network_engineer", label: "Network Engineer" },
      { id: "security_analyst", label: "Security Analyst" },
      { id: "database_admin", label: "Database Administrator" },
    ],
  },
  {
    id: "administrative",
    label: "Administrative",
    icon: ClipboardList,
    subcategories: [
      { id: "executive_assistant", label: "Executive Assistant" },
      { id: "office_manager", label: "Office Manager" },
      { id: "receptionist", label: "Receptionist" },
      { id: "admin_coordinator", label: "Admin Coordinator" },
      { id: "secretary", label: "Secretary" },
    ],
  },
  {
    id: "hospitality",
    label: "Hospitality",
    icon: Building2,
    subcategories: [
      { id: "hotel_manager", label: "Hotel Manager" },
      { id: "concierge", label: "Concierge" },
      { id: "event_planner", label: "Event Planner" },
      { id: "front_desk", label: "Front Desk" },
      { id: "housekeeping", label: "Housekeeping Manager" },
    ],
  },
  {
    id: "food_beverage",
    label: "Food & Beverage",
    icon: Utensils,
    subcategories: [
      { id: "chef", label: "Chef" },
      { id: "restaurant_manager", label: "Restaurant Manager" },
      { id: "barista", label: "Barista" },
      { id: "sommelier", label: "Sommelier" },
      { id: "food_critic", label: "Food Critic" },
    ],
  },
  {
    id: "travel",
    label: "Travel & Tourism",
    icon: Plane,
    subcategories: [
      { id: "travel_agent", label: "Travel Agent" },
      { id: "tour_guide", label: "Tour Guide" },
      { id: "flight_attendant", label: "Flight Attendant" },
      { id: "tourism_director", label: "Tourism Director" },
      { id: "travel_blogger", label: "Travel Blogger" },
    ],
  },
  {
    id: "automotive",
    label: "Automotive",
    icon: Car,
    subcategories: [
      { id: "mechanic", label: "Mechanic" },
      { id: "car_sales", label: "Car Sales" },
      { id: "service_advisor", label: "Service Advisor" },
      { id: "auto_parts", label: "Auto Parts Specialist" },
      { id: "fleet_manager", label: "Fleet Manager" },
    ],
  },
  {
    id: "agriculture",
    label: "Agriculture",
    icon: Leaf,
    subcategories: [
      { id: "farmer", label: "Farmer" },
      { id: "agronomist", label: "Agronomist" },
      { id: "agricultural_consultant", label: "Agricultural Consultant" },
      { id: "livestock_manager", label: "Livestock Manager" },
      { id: "farm_equipment", label: "Farm Equipment Specialist" },
    ],
  },
  {
    id: "fitness",
    label: "Fitness & Sports",
    icon: Dumbbell,
    subcategories: [
      { id: "personal_trainer", label: "Personal Trainer" },
      { id: "sports_coach", label: "Sports Coach" },
      { id: "gym_manager", label: "Gym Manager" },
      { id: "yoga_instructor", label: "Yoga Instructor" },
      { id: "physical_therapist", label: "Physical Therapist" },
    ],
  },
  {
    id: "entertainment",
    label: "Entertainment",
    icon: Music,
    subcategories: [
      { id: "musician", label: "Musician" },
      { id: "actor", label: "Actor" },
      { id: "producer", label: "Producer" },
      { id: "dj", label: "DJ" },
      { id: "talent_manager", label: "Talent Manager" },
    ],
  },
  {
    id: "photography",
    label: "Photography & Video",
    icon: Camera,
    subcategories: [
      { id: "photographer", label: "Photographer" },
      { id: "videographer", label: "Videographer" },
      { id: "photo_editor", label: "Photo Editor" },
      { id: "cinematographer", label: "Cinematographer" },
      { id: "drone_operator", label: "Drone Operator" },
    ],
  },
  {
    id: "gaming",
    label: "Gaming & Esports",
    icon: Gamepad2,
    subcategories: [
      { id: "game_developer", label: "Game Developer" },
      { id: "streamer", label: "Streamer" },
      { id: "esports_player", label: "Esports Player" },
      { id: "game_designer", label: "Game Designer" },
      { id: "community_manager", label: "Community Manager" },
    ],
  },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getSubcategoryLabel(categoryId: string, subcategoryId: string): string {
  const category = getCategoryById(categoryId);
  if (!category) return subcategoryId;
  const sub = category.subcategories.find((s) => s.id === subcategoryId);
  return sub?.label || subcategoryId;
}
