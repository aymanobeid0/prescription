"use client";

import { Button } from "@/components/ui/button";

export default function PrintButton() {
  return (
    <Button 
      className="bg-sky-600 hover:bg-sky-700 text-white" 
      onClick={() => window.print()}
    >
      طباعة المستند
    </Button>
  );
}





