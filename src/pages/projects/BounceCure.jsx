import React from "react";
import {
  MailCheck,
  Inbox,
  Send,
  Users,
  Workflow,
  BarChart3,
  PhoneCall,
  CreditCard,
  ShieldCheck,
  Bell,
} from "lucide-react";
import ProjectCaseStudyLayout from "./ProjectCaseStudyLayout";

const data = {
  slug: "bounce-cure",
  category: "SaaS · Email Deliverability & Marketing",
  title: "Bounce Cure",
  tagline:
    "An email verification and marketing automation platform that helps businesses keep sender reputation healthy — bulk verification, a unified inbox, campaign automation, and integrated billing in one product.",
  techStack: ["React", "Node.js", "Express", "Prisma", "MySQL", "Redis", "Stripe"],
  role: "Full-Stack Developer", // EDIT ME
  duration: "Add duration", // EDIT ME
  team: "Solo project", // EDIT ME
  liveLabel: "bouncecure.com",
  link: "https://www.bouncecure.com/",

  features: [
    {
      icon: MailCheck,
      title: "Bulk & Real-Time Verification",
      description:
        "Upload a CSV or call the API to verify addresses through a layered pipeline: syntax, MX/DNS lookup, SMTP handshake, and disposable-domain checks.",
      points: ["CSV import via PapaParse & fast-csv", "Queued bulk jobs with BullMQ + Redis", "Single-address API for live form validation"],
    },
    {
      icon: Inbox,
      title: "Unified Inbox",
      description:
        "Connects Gmail and Outlook accounts via OAuth and syncs conversations into one inbox so replies never get lost across providers.",
      points: ["IMAP sync via imapflow & mailparser", "Google & Microsoft OAuth (msal, google-auth-library)", "Threaded conversation view"],
    },
    {
      icon: Send,
      title: "Campaign Builder & Automation",
      description:
        "Drag-together multimedia campaigns with scheduling, and set up automation workflows that trigger on list or contact events.",
      points: ["Multimedia campaign editor", "Scheduled & triggered sends", "Per-campaign performance tracking"],
    },
    {
      icon: Users,
      title: "Contact & List Management",
      description:
        "Segments contacts into lists, tracks verification status per contact, and keeps lists in sync as bounces and complaints roll in.",
      points: ["List segmentation", "Verification status per contact", "Auto-suppression on hard bounce"],
    },
    {
      icon: Workflow,
      title: "Automation Workflows",
      description:
        "Background job queues run multi-step automations — verification, tagging, and follow-up sends — without blocking the main API.",
      points: ["BullMQ-backed workflow engine", "Retry & backoff on failed steps", "Event-driven triggers"],
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Visualises verification results, campaign open/click/bounce rates, and list health trends over time.",
      points: ["Recharts & Chart.js visualisations", "Campaign-level breakdowns", "Exportable reports"],
    },
    {
      icon: PhoneCall,
      title: "Phone Number Validation",
      description:
        "A companion validator checks phone number formatting and line type alongside email verification for cleaner contact records.",
      points: ["libphonenumber-js formatting", "Line-type detection", "Bulk & single-lookup modes"],
    },
    {
      icon: CreditCard,
      title: "Billing & Subscriptions",
      description:
        "Stripe and Razorpay power tiered subscription plans, with generated invoices for every billing cycle.",
      points: ["Stripe + Razorpay integration", "PDF invoices via pdfkit/pdfmake", "Usage-based plan tiers"],
    },
    {
      icon: ShieldCheck,
      title: "Auth & Account Security",
      description:
        "Standard email/password auth is backed by OTP verification and two-factor authentication for account protection.",
      points: ["JWT sessions", "OTP via otp-generator", "TOTP two-factor with speakeasy"],
    },
    {
      icon: Bell,
      title: "Bounce & Complaint Webhooks",
      description:
        "SendGrid webhook events update suppression lists automatically the moment a bounce or spam complaint comes in.",
      points: ["Real-time SendGrid webhook ingestion", "Automatic suppression list updates", "Push notifications via web-push"],
    },
  ],

  architecture: [
    { name: "Frontend", items: ["React + Vite, Tailwind CSS", "Framer Motion", "Chart.js / Recharts dashboards"] },
    { name: "Backend", items: ["Node.js + Express", "Redis + BullMQ job queues", "Socket.io"] },
    { name: "Database", items: ["MySQL", "Prisma ORM & migrations", "Suppression & verification-status tables"] },
    { name: "APIs & Integrations", items: ["Stripe & Razorpay", "Google / Microsoft OAuth", "SendGrid webhooks"] },
    { name: "Cloud & Storage", items: ["AWS S3", "AWS SES", "Resend / Nodemailer transactional mail"] },
  ],

  challenges: [
    {
      challenge:
        "Verifying large lists risked overwhelming target mail servers or getting the sending IP blacklisted.",
      solution:
        "Queued verification jobs through BullMQ and Redis with concurrency caps (p-limit) and exponential backoff, spreading SMTP checks over time instead of firing them all at once.",
    },
    {
      challenge:
        "Syncing a unified inbox across Gmail and Outlook meant handling two very different OAuth and IMAP quirks.",
      solution:
        "Abstracted provider differences behind a common sync layer using imapflow, with msal and google-auth-library handling token refresh separately underneath.",
    },
    {
      challenge:
        "Distinguishing genuinely invalid addresses from disposable, role-based, and catch-all domains needed more than a single check.",
      solution:
        "Layered checks in order of cost — syntax first, then MX/DNS, then an SMTP handshake, then a disposable-domain and deep-validator pass — short-circuiting as soon as an address is confidently classified.",
    },
    {
      challenge:
        "Bounce and complaint data arriving late meant campaigns kept emailing addresses that had already gone bad.",
      solution:
        "Wired SendGrid webhook events directly into the suppression list, so a hard bounce or spam complaint removes an address from future sends within seconds.",
    },
  ],

  contributions: [
    "Designed and built the layered email verification pipeline end to end.",
    "Set up BullMQ/Redis job queues for scalable bulk verification.",
    "Implemented OAuth-based Gmail/Outlook sync for the unified inbox.",
    "Built the campaign builder and automation workflow engine.",
    "Integrated Stripe and Razorpay for subscription billing.",
    "Wired SendGrid webhook events into automatic list suppression.",
    "Implemented OTP and two-factor authentication for account security.",
  ],
};

export default function BounceCure() {
  return <ProjectCaseStudyLayout data={data} />;
}