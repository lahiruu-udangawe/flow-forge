import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Circle,
  ShieldCheck,
  MessageSquare,
  User,
  CalendarDays,
  Building2,
  DollarSign,
  FileText,
  Tag,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ApprovalActions from "@/components/approval/ApprovalActions";
import ExportActions from "@/components/approval/ExportActions";

interface ApprovalStep {
  id: string;
  order: number;
  approverName: string;
  designation: string;
  status: "approved" | "rejected" | "pending" | "upcoming";
  timestamp?: string;
  signatureVerified?: boolean;
  comment?: string;
}

const mockPRDetail = {
  id: "PR-2025-001",
  title: "IT Equipment Purchase - Q1",
  department: "IT",
  category: "IT Equipment",
  status: "in_progress",
  amount: 15400,
  currency: "USD",
  priority: "high",
  createdAt: "2025-01-28",
  createdBy: "John Doe",
  description: "Purchase of laptops, monitors, and peripherals for new hires in Q1 2025.",
};

const mockApprovalSteps: ApprovalStep[] = [
  {
    id: "step-1",
    order: 1,
    approverName: "Sarah Johnson",
    designation: "Department Head – IT",
    status: "approved",
    timestamp: "Jan 28, 2025 at 10:30 AM",
    signatureVerified: true,
    comment: "Approved. Budget allocated from IT capex.",
  },
  {
    id: "step-2",
    order: 2,
    approverName: "David Williams",
    designation: "Finance Manager",
    status: "approved",
    timestamp: "Jan 28, 2025 at 2:15 PM",
    signatureVerified: true,
    comment: "Financial review complete. Within budget limits.",
  },
  {
    id: "step-3",
    order: 3,
    approverName: "Michael Chen",
    designation: "General Manager",
    status: "pending",
    timestamp: "Awaiting action since Jan 28, 2025",
  },
  {
    id: "step-4",
    order: 4,
    approverName: "Emily Brown",
    designation: "Chief Financial Officer",
    status: "upcoming",
  },
];

const statusConfig = {
  approved: {
    icon: CheckCircle2,
    color: "text-primary",
    bg: "bg-primary",
    ring: "ring-primary/20",
    lineColor: "bg-primary",
    label: "Approved",
    badgeCls: "bg-primary/10 text-primary border-primary/30",
  },
  rejected: {
    icon: XCircle,
    color: "text-destructive",
    bg: "bg-destructive",
    ring: "ring-destructive/20",
    lineColor: "bg-destructive",
    label: "Rejected",
    badgeCls: "bg-destructive/10 text-destructive border-destructive/30",
  },
  pending: {
    icon: Clock,
    color: "text-chart-1",
    bg: "bg-chart-1",
    ring: "ring-chart-1/20",
    lineColor: "bg-chart-1/40",
    label: "Pending",
    badgeCls: "bg-chart-1/10 text-chart-1 border-chart-1/30",
  },
  upcoming: {
    icon: Circle,
    color: "text-muted-foreground",
    bg: "bg-muted-foreground/40",
    ring: "ring-muted/40",
    lineColor: "bg-border",
    label: "Upcoming",
    badgeCls: "bg-muted/50 text-muted-foreground border-muted",
  },
};

const getOverallStatusBadge = (status: string) => {
  switch (status) {
    case "draft":
      return <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-muted">Draft</Badge>;
    case "pending":
      return <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/30">Pending</Badge>;
    case "approved":
      return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">Approved</Badge>;
    case "in_progress":
      return <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/30">In Progress</Badge>;
    case "rejected":
      return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">Rejected</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "urgent":
      return <Badge className="bg-destructive text-destructive-foreground">Urgent</Badge>;
    case "high":
      return <Badge className="bg-chart-1 text-primary-foreground">High</Badge>;
    case "medium":
      return <Badge className="bg-chart-2 text-primary-foreground">Medium</Badge>;
    case "low":
      return <Badge className="bg-muted text-muted-foreground">Low</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const PRDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pr = mockPRDetail;
  const steps = mockApprovalSteps;

  const historyEntries = steps.filter((s) => s.status === "approved" || s.status === "rejected");

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/purchase-requisitions")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">{pr.id}</h1>
              {getOverallStatusBadge(pr.status)}
              {getPriorityBadge(pr.priority)}
            </div>
            <p className="text-muted-foreground mt-1">{pr.title}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left – PR Summary */}
          <Card className="border-border lg:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Requisition Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {[
                { icon: DollarSign, label: "Amount", value: `${pr.currency} ${pr.amount.toLocaleString()}` },
                { icon: Building2, label: "Department", value: pr.department },
                { icon: Tag, label: "Category", value: pr.category },
                { icon: User, label: "Requested By", value: pr.createdBy },
                { icon: CalendarDays, label: "Date Created", value: pr.createdAt },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">{item.label}</p>
                    <p className="font-medium text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
              {pr.description && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Description</p>
                      <p className="text-foreground">{pr.description}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Right – Approval Timeline */}
          <Card className="border-border lg:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Approval Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-0">
                {steps.map((step, idx) => {
                  const cfg = statusConfig[step.status];
                  const Icon = cfg.icon;
                  const isLast = idx === steps.length - 1;
                  const isCurrent = step.status === "pending";

                  return (
                    <div key={step.id} className="relative flex gap-4">
                      {/* Vertical line + icon */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full ring-4 ${cfg.ring} ${
                            isCurrent ? "animate-pulse" : ""
                          }`}
                        >
                          <div className={`h-9 w-9 rounded-full ${cfg.bg} flex items-center justify-center`}>
                            <Icon className="h-4 w-4 text-primary-foreground" />
                          </div>
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 flex-1 min-h-[40px] ${cfg.lineColor}`} />
                        )}
                      </div>

                      {/* Content */}
                      <div className={`pb-8 flex-1 ${isLast ? "pb-0" : ""}`}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className={cfg.badgeCls}>
                            {cfg.label}
                          </Badge>
                          {isCurrent && (
                            <span className="text-xs font-medium text-chart-1">
                              — Next responsible approver
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-foreground mt-1.5">{step.approverName}</p>
                        <p className="text-xs text-muted-foreground">{step.designation}</p>

                        {step.timestamp && (
                          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                            <CalendarDays className="h-3 w-3" />
                            {step.timestamp}
                          </p>
                        )}

                        {step.signatureVerified !== undefined && (
                          <p className="text-xs mt-1 flex items-center gap-1.5 text-primary">
                            <ShieldCheck className="h-3 w-3" />
                            Signature: Verified
                          </p>
                        )}

                        {step.comment && (
                          <div className="mt-2 rounded-md bg-muted/50 border border-border p-2.5 text-xs text-foreground flex items-start gap-2">
                            <MessageSquare className="h-3 w-3 mt-0.5 text-muted-foreground shrink-0" />
                            <span>"{step.comment}"</span>
                          </div>
                        )}

                        {step.status === "upcoming" && (
                          <p className="text-xs text-muted-foreground mt-2 italic">Not yet reached</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Approval Actions */}
        {steps.some((s) => s.status === "pending") && (
          <ApprovalActions
            currentApprover={steps.find((s) => s.status === "pending")!.approverName}
            itemId={pr.id}
            itemType="PR"
          />
        )}

        {/* Export / Print Actions */}
        <ExportActions itemType="PR" detail={pr} steps={steps} />

        {/* Approval History Table */}
        {historyEntries.length > 0 && (
          <Card className="border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Approval History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Step</TableHead>
                    <TableHead className="text-muted-foreground">Approver</TableHead>
                    <TableHead className="text-muted-foreground">Action</TableHead>
                    <TableHead className="text-muted-foreground">Timestamp</TableHead>
                    <TableHead className="text-muted-foreground">Comment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyEntries.map((entry) => (
                    <TableRow key={entry.id} className="border-border">
                      <TableCell className="font-medium">{entry.order}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{entry.approverName}</p>
                          <p className="text-xs text-muted-foreground">{entry.designation}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusConfig[entry.status].badgeCls}>
                          {statusConfig[entry.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{entry.timestamp}</TableCell>
                      <TableCell className="text-sm max-w-[250px] truncate">{entry.comment || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default PRDetail;
