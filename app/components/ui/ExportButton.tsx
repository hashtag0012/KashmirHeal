import React, { useState } from "react";
import { Button } from "./button";
import { Loader2, FileText } from "lucide-react";
import { useToast } from "../../hooks/use-toast";

/**
 * ExportButton – generic component to export an array of objects as an Excel file.
 * It derives column headers from the keys of the first item in `data`.
 * The generated file is a CSV but saved with a `.xlsx` extension so that Excel opens it directly.
 *
 * Props:
 * - `data`: array of objects to export.
 * - `fileName`: base name for the exported file (without extension).
 * - `label?`: optional button label. Defaults to "Export".
 */
interface ExportButtonProps {
  data: any[];
  fileName: string;
  label?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ data, fileName, label = "Export" }) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = () => {
    if (!data || data.length === 0) {
      toast({
        title: "No data",
        description: "There is nothing to export.",
        variant: "destructive",
      });
      return;
    }
    setIsExporting(true);
    try {
      // Derive headers from keys of first object
      const headers = Object.keys(data[0]);
      const rows = data.map((item) =>
        headers.map((key) => {
          const val = item[key];
          return `"${(val ?? "").toString().replace(/"/g, "\"\"")}"`;
        })
      );

      const csvString = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${fileName}.xlsx`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Success",
        description: `Exported ${data.length} records to ${fileName}.xlsx`,
      });
    } catch (e) {
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button onClick={handleExport} disabled={isExporting} className="flex items-center gap-2">
      {isExporting ? <Loader2 className="animate-spin w-4 h-4" /> : <FileText className="w-4 h-4" />}
      {label}
    </Button>
  );
};
