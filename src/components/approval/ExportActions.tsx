import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer, Download, FileText, CheckCircle2, ShieldCheck, CalendarDays, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ApprovalStep {
  order: number;
  approverName: string;
  designation: string;
  status: string;
  timestamp?: string;
  signatureVerified?: boolean;
  comment?: string;
}

interface ExportDetail {
  id: string;
  title?: string;
  subject?: string;
  department: string;
  createdBy: string;
  createdAt: string;
  description?: string;
  amount?: number;
  currency?: string;
  category?: string;
  from?: string;
  to?: string;
  priority?: string;
}

interface ExportActionsProps {
  itemType: "PR" | "Memo";
  detail: ExportDetail;
  steps: ApprovalStep[];
}

const generatePrintContent = (itemType: string, detail: ExportDetail, steps: ApprovalStep[]) => {
  const approvedSteps = steps.filter((s) => s.status === "approved" || s.status === "rejected");
  const title = itemType === "PR" ? "Purchase Requisition" : "Internal Memo";
  const itemTitle = detail.title || detail.subject || "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${detail.id} - ${title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto; }
        .header { text-align: center; border-bottom: 2px solid #1a1a1a; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { font-size: 22px; margin-bottom: 4px; }
        .header .ref { font-size: 14px; color: #555; }
        .header .status { display: inline-block; margin-top: 8px; padding: 4px 14px; border-radius: 4px; font-size: 12px; font-weight: 600; background: #d1fae5; color: #065f46; }
        .section { margin-bottom: 24px; }
        .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 12px; }
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .detail-item label { font-size: 11px; color: #6b7280; display: block; }
        .detail-item span { font-size: 13px; font-weight: 500; }
        .description { font-size: 13px; line-height: 1.6; color: #374151; margin-top: 8px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th { background: #f3f4f6; text-align: left; padding: 8px 10px; font-weight: 600; border: 1px solid #e5e7eb; }
        td { padding: 8px 10px; border: 1px solid #e5e7eb; vertical-align: top; }
        .sig-row { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #065f46; margin-top: 4px; }
        .comment { font-style: italic; color: #6b7280; font-size: 11px; margin-top: 4px; }
        .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 16px; }
        .approved-badge { color: #065f46; font-weight: 600; }
        .rejected-badge { color: #991b1b; font-weight: 600; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <div class="ref">${detail.id} — ${itemTitle}</div>
        <div class="status">✓ All Approvals Complete</div>
      </div>

      <div class="section">
        <div class="section-title">${itemType === "PR" ? "Requisition" : "Memo"} Details</div>
        <div class="detail-grid">
          ${itemType === "PR" ? `
            <div class="detail-item"><label>Amount</label><span>${detail.currency} ${detail.amount?.toLocaleString()}</span></div>
            <div class="detail-item"><label>Category</label><span>${detail.category || "—"}</span></div>
          ` : `
            <div class="detail-item"><label>From</label><span>${detail.from || "—"}</span></div>
            <div class="detail-item"><label>To</label><span>${detail.to || "—"}</span></div>
          `}
          <div class="detail-item"><label>Department</label><span>${detail.department}</span></div>
          <div class="detail-item"><label>Priority</label><span>${(detail.priority || "normal").charAt(0).toUpperCase() + (detail.priority || "normal").slice(1)}</span></div>
          <div class="detail-item"><label>Created By</label><span>${detail.createdBy}</span></div>
          <div class="detail-item"><label>Date Created</label><span>${detail.createdAt}</span></div>
        </div>
        ${detail.description ? `<div class="description"><strong>Description:</strong> ${detail.description}</div>` : ""}
      </div>

      <div class="section">
        <div class="section-title">Approval Signatures & History</div>
        <table>
          <thead>
            <tr>
              <th>Step</th>
              <th>Approver</th>
              <th>Action</th>
              <th>Timestamp</th>
              <th>Signature</th>
            </tr>
          </thead>
          <tbody>
            ${approvedSteps.map((step) => `
              <tr>
                <td>${step.order}</td>
                <td>
                  <strong>${step.approverName}</strong><br/>
                  <span style="font-size:11px;color:#6b7280">${step.designation}</span>
                </td>
                <td><span class="${step.status === "approved" ? "approved-badge" : "rejected-badge"}">${step.status === "approved" ? "✓ Approved" : "✗ Rejected"}</span></td>
                <td>${step.timestamp || "—"}</td>
                <td>${step.signatureVerified ? "✓ Verified" : "—"}</td>
              </tr>
              ${step.comment ? `<tr><td colspan="5" class="comment">"${step.comment}"</td></tr>` : ""}
            `).join("")}
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p>This document was generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
        <p>Document Reference: ${detail.id} | Electronically signed and verified</p>
      </div>
    </body>
    </html>
  `;
};

const ExportActions = ({ itemType, detail, steps }: ExportActionsProps) => {
  const allComplete = steps.every((s) => s.status === "approved" || s.status === "rejected");

  const handlePrint = () => {
    const content = generatePrintContent(itemType, detail, steps);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const handleExportPDF = () => {
    const content = generatePrintContent(itemType, detail, steps);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
    toast.success("PDF export opened. Use your browser's Save as PDF option.");
  };

  const handleExportCSV = () => {
    const completedSteps = steps.filter((s) => s.status === "approved" || s.status === "rejected");
    const headers = ["Step", "Approver", "Designation", "Action", "Timestamp", "Signature Verified", "Comment"];
    const rows = completedSteps.map((s) => [
      s.order,
      s.approverName,
      s.designation,
      s.status,
      s.timestamp || "",
      s.signatureVerified ? "Yes" : "No",
      s.comment || "",
    ]);

    const csvContent = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${detail.id}_approval_history.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully.");
  };

  if (!allComplete) return null;

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-base flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          All Approvals Complete
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          This {itemType === "PR" ? "purchase requisition" : "memo"} has been fully approved. You can now print or export the final document with all signatures.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 flex-wrap">
          <Button onClick={handlePrint} variant="outline">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleExportPDF}>
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportCSV}>
                <FileText className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportActions;
