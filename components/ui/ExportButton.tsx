import * as React from "react";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";

export type ExportButtonProps = {
  filename: string;
  generateCsv: () => { headers: string[]; rows: (string | number)[][] };
  children?: React.ReactNode;
};

export function ExportButton({ filename, generateCsv, children }: ExportButtonProps) {
  const handleClick = React.useCallback(() => {
    const { headers, rows } = generateCsv();
    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => {
            const escaped = `${cell}`.replace(/"/g, '""');
            if (/[",\n]/.test(escaped)) {
              return `"${escaped}"`;
            }
            return escaped;
          })
          .join(',')
      )
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
  }, [filename, generateCsv]);

  return (
    <Button variant="outline" onClick={handleClick}>
      {children || "Export"}
    </Button>
  );
}
