import React from "react";
import {
  GraduationCap,
  Bus,
  Wallet,
  ClipboardCheck,
  FileBadge2,
  Fingerprint,
  MessageSquareText,
  Building2,
  CalendarClock,
  Mic,
} from "lucide-react";
import ProjectCaseStudyLayout from "./ProjectCaseStudyLayout";

const data = {
  slug: "school-erp",
  category: "SaaS · Multi-School Education Platform",
  title: "School ERP System",
  tagline:
    "A multi-school SaaS platform covering academics, attendance, finance, transport, and communication for super admins, school admins, teachers, students, and parents — each with their own role-scoped experience.",
  techStack: ["React", "Node.js", "Prisma", "PostgreSQL", "Socket.io", "AWS S3"],
  role: "Full-Stack Developer", // EDIT ME
  duration: "Add duration", // EDIT ME
  team: "Solo project", // EDIT ME
  liveLabel: "eduabaccotech.com",
  link: "https://www.eduabaccotech.com/",

  features: [
    {
      icon: Building2,
      title: "Multi-School SuperAdmin Console",
      description:
        "SuperAdmins onboard new schools, manage school-level admins, and view platform-wide analytics from a single console.",
      points: ["School onboarding & configuration", "Cross-school analytics", "Admin account provisioning"],
    },
    {
      icon: ClipboardCheck,
      title: "Attendance & Exams",
      description:
        "Daily attendance capture for staff and students, plus a full exam lifecycle from timetable to results, including re-evaluation requests.",
      points: ["Class & subject-wise attendance", "Exam timetable & marks entry", "Structured re-evaluation/revaluation workflow"],
    },
    {
      icon: GraduationCap,
      title: "Role-Based Dashboards",
      description:
        "Teacher, Student, and Parent each get a dashboard scoped to what they need — assignments and grading for teachers, homework and results for students, progress and fees for parents.",
      points: ["Teacher: curriculum, timetable, live classes", "Student: homework, marks, certificates", "Parent: fees, attendance, syllabus progress"],
    },
    {
      icon: Wallet,
      title: "Finance & Multi-Group Payroll",
      description:
        "Tracks student fee collection alongside staff and teacher payroll, organised into finance groups for granular reporting.",
      points: ["Student finance & fee tracking", "Teacher & staff payroll", "Expense tracking by finance group"],
    },
    {
      icon: Bus,
      title: "GPS Transport Tracking",
      description:
        "A dedicated GPS ingestion service streams live bus locations to parents and transport heads via a map view.",
      points: ["Live bus location via Leaflet", "Dedicated GPS ingestion pipeline", "Bus-head role for fleet oversight"],
    },
    {
      icon: Fingerprint,
      title: "Biometric Attendance",
      description:
        "Integrates with biometric devices to capture staff and student attendance automatically, reducing manual entry.",
      points: ["Biometric device integration routes", "Automatic attendance sync", "Fallback manual entry"],
    },
    {
      icon: FileBadge2,
      title: "ID Cards & Certificates",
      description:
        "Generates student ID cards and certificates (achievement, participation, completion) as branded, ready-to-print PDFs.",
      points: ["Template-based ID card generation", "Puppeteer-rendered certificates", "Per-school branding"],
    },
    {
      icon: MessageSquareText,
      title: "WhatsApp & Voice Announcements",
      description:
        "Exam timetables and important notices go out over WhatsApp, with a voice-announcement module for on-campus PA-style alerts.",
      points: ["WhatsApp exam timetable notifications", "Voice announcement routes", "In-app chat support"],
    },
    {
      icon: CalendarClock,
      title: "Timetable & Curriculum Management",
      description:
        "Configurable class timetables and curriculum tracking, with bulk import/export for administrators.",
      points: ["Drag-friendly timetable builder", "Excel-based bulk import (ExcelJS)", "Curriculum progress tracking"],
    },
    {
      icon: Mic,
      title: "Live Classes & Backups",
      description:
        "Teachers can run and record live classes, and administrators can trigger scheduled system backups for data safety.",
      points: ["Teacher live-class scheduling", "Automated backup routes", "Activity logs per role"],
    },
  ],

  architecture: [
    { name: "Frontend", items: ["React + Vite, Tailwind CSS", "Capacitor (Android)", "Leaflet & Framer Motion"] },
    { name: "Backend", items: ["Node.js + Express", "Role-scoped route modules", "Socket.io"] },
    { name: "Database", items: ["PostgreSQL", "Prisma ORM & migrations", "Per-school data scoping"] },
    { name: "APIs & Integrations", items: ["Razorpay payments", "WhatsApp Business API", "Biometric device APIs"] },
    { name: "Cloud & Storage", items: ["AWS S3 (presigned URLs)", "Puppeteer report/certificate PDFs", "ExcelJS bulk import/export"] },
  ],

  challenges: [
    {
      challenge:
        "Seven distinct roles needed different permissions and views inside one codebase without turning into an unmanageable tangle of conditionals.",
      solution:
        "Organised the backend into role-scoped route folders (superAdmin, staffRoutes, parent, student, finance, busHead) with a shared auth/RBAC middleware, keeping each role's logic isolated but consistent.",
    },
    {
      challenge:
        "Live GPS bus tracking needed to stay reliable even with the intermittent connectivity common on school transport routes.",
      solution:
        "Split tracking into a dedicated GPS ingestion service that buffers location pings, broadcasting through Socket.io with polling as a fallback when the socket connection drops.",
    },
    {
      challenge:
        "Report cards and certificates needed to match each school's own branding and grading format, not a single fixed template.",
      solution:
        "Used Puppeteer to render HTML-to-PDF templates parameterised per school, pulling logo and grading configuration from each school's own settings.",
    },
    {
      challenge:
        "Bulk student and timetable imports risked corrupting live academic data if a sheet was malformed.",
      solution:
        "Built ExcelJS-based import validators that run inside a Prisma transaction, so a bad row rolls back the whole import instead of leaving partial data.",
    },
    {
      challenge:
        "Exam re-evaluation requests needed a clear audit trail as they moved between student, teacher, and admin.",
      solution:
        "Modelled re-evaluation as its own stateful workflow with dedicated routes at each stage, so every status change is recorded against the role that made it.",
    },
  ],

  contributions: [
    "Designed the role-based access architecture spanning seven distinct user roles.",
    "Built the core attendance, exam, and results modules from the ground up.",
    "Implemented the GPS bus tracking pipeline and live map view.",
    "Built the Puppeteer-based report card and certificate generation system.",
    "Set up ExcelJS bulk import/export with transactional validation.",
    "Integrated WhatsApp notifications for exam timetables and alerts.",
    "Implemented the finance module covering fees and multi-group payroll.",
  ],
};

export default function SchoolERP() {
  return <ProjectCaseStudyLayout data={data} />;
}