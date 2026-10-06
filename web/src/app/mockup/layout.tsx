import type { Metadata } from "next";
import { MockupApp } from "@/components/mockup/app";
import "./mockup.css";

export const metadata: Metadata = { title: "DentalCare — Clinic mockup" };
export const dynamic = "force-dynamic";

export default function MockupLayout({ children }: { children: React.ReactNode }) {
  return <MockupApp initialTime={new Date().toISOString()}>{children}</MockupApp>;
}
