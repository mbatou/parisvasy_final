"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";

interface FinanceExportButtonProps {
  hotelId: string;
}

export function FinanceExportButton({ hotelId }: FinanceExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch(
        `/api/finance/export?hotel=${encodeURIComponent(hotelId)}`
      );
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `finance-export-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleExport} loading={exporting}>
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );
}
