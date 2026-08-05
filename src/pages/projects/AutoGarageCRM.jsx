import React from "react";
import {
  ScanLine,
  MapPinned,
  ReceiptText,
  Users,
  BellRing,
  Boxes,
  Table2,
  Store,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import ProjectCaseStudyLayout from "./ProjectCaseStudyLayout";

const data = {
  slug: "auto-garage-crm",
  category: "SaaS · Workshop Management",
  title: "Auto Garage CRM — Motor Desk",
  tagline:
    "A unified workshop operating system that runs car service, bike service, and car wash operations from a single dashboard — intake, OCR document capture, GPS pickup tracking, billing, and staff payroll all in one place.",
  techStack: ["React", "Vite", "Node.js", "Express", "Prisma", "PostgreSQL", "Socket.io", "AWS S3"],
  role: "Full-Stack Developer", // EDIT ME: adjust if your role differed (e.g. "Lead Developer", "Frontend Engineer")
  duration: "Add duration", // EDIT ME: e.g. "6 months, 2024"
  team: "Solo project", // EDIT ME: e.g. "Team of 3"
  liveLabel: "themotordesk.com",
  link: "https://themotordesk.com/",

  features: [
    {
      icon: ScanLine,
      title: "OCR Document Scanning",
      description:
        "Camera-based capture of RC books, driving licences, and ID proofs, with on-device text extraction to auto-fill intake forms.",
      points: ["Tesseract.js-powered client-side OCR", "Manual override for low-confidence scans", "Separate flows for car and bike documents"],
    },
    {
      icon: MapPinned,
      title: "GPS Pickup & Drop Tracking",
      description:
        "Customers can request doorstep pickup; staff location and route are tracked live on an interactive map through delivery.",
      points: ["Google Places autocomplete for addresses", "Leaflet-based live map view", "Status updates pushed in real time"],
    },
    {
      icon: ReceiptText,
      title: "Automated Billing & Invoicing",
      description:
        "Service line items, spare parts, and labour charges roll up into a branded PDF invoice with integrated payment collection.",
      points: ["Razorpay payment integration", "PDF generation via jsPDF & Puppeteer", "Separate invoice flows per vertical"],
    },
    {
      icon: Boxes,
      title: "Inventory & Spare Parts",
      description:
        "Tracks spare-part stock levels per branch, deducts automatically against completed jobs, and flags low-stock items.",
      points: ["Branch-wise stock ledgers", "Usage tied directly to service jobs", "Excel import/export for bulk updates"],
    },
    {
      icon: Users,
      title: "Staff & Salary Management",
      description:
        "Manages technician profiles, attendance, and commission-based or fixed salary calculations across car, bike, and wash teams.",
      points: ["Role-based staff accounts", "Automated salary computation", "Team-wise performance view"],
    },
    {
      icon: BellRing,
      title: "Reminders & WhatsApp Alerts",
      description:
        "Scheduled service-due reminders and status updates delivered straight to the customer's WhatsApp, driven by a background job scheduler.",
      points: ["node-cron scheduled reminder engine", "Deduplicated, throttled messaging", "Per-vertical reminder templates"],
    },
    {
      icon: Table2,
      title: "Dynamic Data Tables",
      description:
        "A configurable table engine lets branches add custom columns and fields to job records without touching the schema.",
      points: ["Dynamic table/column/row API", "Branch-specific customisation", "No-code field configuration"],
    },
    {
      icon: Store,
      title: "Multi-Branch & Marketplace",
      description:
        "Garages can manage multiple branches under one account and list services on an internal marketplace for wider discovery.",
      points: ["Team accounts per branch", "Marketplace listing module", "Centralised owner dashboard"],
    },
    {
      icon: ShieldCheck,
      title: "KYC & Garage Verification",
      description:
        "Onboarding flow verifies garage ownership documents before activating billing and payment features, reducing fraud risk.",
      points: ["Document upload & review queue", "Staff KYC capture", "Gated access to payment features"],
    },
    {
      icon: Smartphone,
      title: "Native Android Companion App",
      description:
        "The workshop-facing app is packaged with Capacitor for Android, giving technicians camera, webcam, and QR access on the shop floor.",
      points: ["Capacitor-wrapped React build", "In-app camera & QR scanning", "Offline-friendly job updates"],
    },
  ],

  architecture: [
    { name: "Frontend", items: ["React + Vite, Tailwind CSS", "Capacitor (Android app)", "Leaflet maps & live dashboards"] },
    { name: "Backend", items: ["Node.js + Express", "JWT authentication", "Socket.io for real-time job status"] },
    { name: "Database", items: ["PostgreSQL", "Prisma ORM & migrations", "Dynamic custom-field engine"] },
    { name: "APIs & Integrations", items: ["Razorpay payments", "WhatsApp Business messaging", "Google Places & Maps"] },
    { name: "Cloud & Storage", items: ["AWS S3 (documents & photos)", "Cloudinary (image delivery)", "Puppeteer PDF rendering"] },
  ],

  challenges: [
    {
      challenge:
        "Car, bike, and wash services needed different fields and workflows, but maintaining three separate codebases would have been unsustainable.",
      solution:
        "Built a dynamic table/column/row engine so each vertical could define its own custom fields on top of a shared job-lifecycle core, avoiding schema duplication.",
    },
    {
      challenge:
        "OCR accuracy on vehicle documents varied a lot depending on lighting, angle, and paper condition.",
      solution:
        "Added client-side pre-processing before running Tesseract.js, with a manual-correction step so low-confidence scans never blocked the intake flow.",
    },
    {
      challenge:
        "Keeping job status in sync across the owner dashboard, technician view, and customer notifications in real time.",
      solution:
        "Used Socket.io rooms scoped per branch so status changes broadcast instantly to every connected client without polling.",
    },
    {
      challenge:
        "GPS pickup/drop tracking needed to stay usable on the patchy mobile connectivity common at workshop locations.",
      solution:
        "Combined periodic location pings with a retry queue, so tracking degrades gracefully to last-known-position instead of failing outright.",
    },
  ],

  contributions: [
    "Designed the shared job-lifecycle data model that powers car, bike, and wash verticals.",
    "Built the dynamic table/column/row engine for schema-less custom fields.",
    "Implemented OCR-assisted intake and the document verification flow.",
    "Built the GPS pickup/drop tracking experience end to end.",
    "Set up the invoicing and Razorpay payment integration.",
    "Implemented the WhatsApp reminder scheduling system with node-cron.",
    "Packaged and configured the Android companion app with Capacitor.",
  ],
};

export default function AutoGarageCRM() {
  return <ProjectCaseStudyLayout data={data} />;
}