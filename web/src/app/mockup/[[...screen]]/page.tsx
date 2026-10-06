import { notFound } from "next/navigation";

export default async function MockupPage({ params }: { params: Promise<{ screen?: string[] }> }) {
  const { screen = [] } = await params;
  if (screen.length > 2 || (screen.length && !["patients", "requests", "billing", "settings"].includes(screen[0])) || (screen.length === 2 && screen[0] !== "patients")) notFound();
  return null;
}
