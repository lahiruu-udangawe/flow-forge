import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import {
  Download,
  FileText,
  Mail,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

// --- Mock Data ---

const prMonthlyData = [
  { month: "Jan", submitted: 18, approved: 14, rejected: 3, pending: 1 },
  { month: "Feb", submitted: 22, approved: 19, rejected: 2, pending: 1 },
  { month: "Mar", submitted: 15, approved: 12, rejected: 2, pending: 1 },
  { month: "Apr", submitted: 28, approved: 22, rejected: 4, pending: 2 },
  { month: "May", submitted: 20, approved: 16, rejected: 3, pending: 1 },
  { month: "Jun", submitted: 25, approved: 20, rejected: 3, pending: 2 },
];

const memoMonthlyData = [
  { month: "Jan", submitted: 12, approved: 10, rejected: 1, pending: 1 },
  { month: "Feb", submitted: 15, approved: 13, rejected: 1, pending: 1 },
  { month: "Mar", submitted: 10, approved: 8, rejected: 1, pending: 1 },
  { month: "Apr", submitted: 20, approved: 17, rejected: 2, pending: 1 },
  { month: "May", submitted: 14, approved: 11, rejected: 2, pending: 1 },
  { month: "Jun", submitted: 18, approved: 15, rejected: 2, pending: 1 },
];

const prByDepartment = [
  { department: "IT", count: 32, amount: 245000 },
  { department: "Admin", count: 18, amount: 89000 },
  { department: "Marketing", count: 24, amount: 156000 },
  { department: "Finance", count: 12, amount: 78000 },
  { department: "HR", count: 15, amount: 62000 },
  { department: "Operations", count: 20, amount: 134000 },
];

const prStatusDistribution = [
  { name: "Approved", value: 103, color: "hsl(var(--primary))" },
  { name: "Pending", value: 18, color: "hsl(var(--chart-1))" },
  { name: "In Progress", value: 12, color: "hsl(var(--chart-2))" },
  { name: "Rejected", value: 14, color: "hsl(var(--destructive))" },
];

const memoStatusDistribution = [
  { name: "Approved", value: 74, color: "hsl(var(--primary))" },
  { name: "Pending", value: 10, color: "hsl(var(--chart-1))" },
  { name: "In Progress", value: 8, color: "hsl(var(--chart-2))" },
  { name: "Rejected", value: 9, color: "hsl(var(--destructive))" },
];

const systemUsageData = [
  { month: "Jan", logins: 320, prCreated: 18, memosCreated: 12, approvals: 28 },
  { month: "Feb", logins: 345, prCreated: 22, memosCreated: 15, approvals: 35 },
  { month: "Mar", logins: 298, prCreated: 15, memosCreated: 10, approvals: 22 },
  { month: "Apr", logins: 410, prCreated: 28, memosCreated: 20, approvals: 42 },
  { month: "May", logins: 380, prCreated: 20, memosCreated: 14, approvals: 30 },
  { month: "Jun", logins: 425, prCreated: 25, memosCreated: 18, approvals: 38 },
];

const topApprovers = [
  { name: "Sarah Johnson", role: "Department Head", approved: 34, avgTime: "4.2 hrs" },
  { name: "Michael Chen", role: "General Manager", approved: 28, avgTime: "6.8 hrs" },
  { name: "Emily Brown", role: "CFO", approved: 22, avgTime: "3.1 hrs" },
  { name: "David Wilson", role: "VP Operations", approved: 19, avgTime: "5.5 hrs" },
  { name: "Lisa Anderson", role: "HR Director", approved: 15, avgTime: "7.2 hrs" },
];

const recentPRReport = [
  { id: "PR-2025-001", title: "IT Equipment Purchase", department: "IT", amount: "$15,400", status: "pending", date: "2025-06-15" },
  { id: "PR-2025-002", title: "Office Furniture Renewal", department: "Admin", amount: "$8,200", status: "approved", date: "2025-06-14" },
  { id: "PR-2025-003", title: "Software Licenses - Q1", department: "IT", amount: "$24,000", status: "in_progress", date: "2025-06-13" },
  { id: "PR-2025-004", title: "Marketing Materials", department: "Marketing", amount: "$3,500", status: "rejected", date: "2025-06-12" },
  { id: "PR-2025-005", title: "Server Infrastructure", department: "IT", amount: "$45,000", status: "approved", date: "2025-06-11" },
  { id: "PR-2025-006", title: "Training Programs", department: "HR", amount: "$12,000", status: "approved", date: "2025-06-10" },
  { id: "PR-2025-007", title: "Office Supplies Q2", department: "Admin", amount: "$2,800", status: "approved", date: "2025-06-09" },
  { id: "PR-2025-008", title: "Conference Sponsorship", department: "Marketing", amount: "$7,500", status: "pending", date: "2025-06-08" },
];

const recentMemoReport = [
  { id: "MEMO-2025-001", subject: "Policy Update: Remote Work", from: "HR", status: "approved", date: "2025-06-15" },
  { id: "MEMO-2025-002", subject: "Q4 Budget Review", from: "Finance", status: "approved", date: "2025-06-14" },
  { id: "MEMO-2025-003", subject: "System Maintenance Notice", from: "IT", status: "in_progress", date: "2025-06-13" },
  { id: "MEMO-2025-004", subject: "Annual Leave Policy", from: "HR", status: "pending", date: "2025-06-12" },
  { id: "MEMO-2025-005", subject: "Security Audit Results", from: "IT", status: "approved", date: "2025-06-11" },
  { id: "MEMO-2025-006", subject: "Vendor Onboarding Process", from: "Operations", status: "approved", date: "2025-06-10" },
];

// --- Helpers ---

const getStatusBadge = (status: string) => {
  switch (status) {
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

function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(",")
    ),
  ];
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success(`${filename}.csv exported successfully`);
}

// --- Chart Configs ---

const prChartConfig = {
  submitted: { label: "Submitted", color: "hsl(var(--chart-1))" },
  approved: { label: "Approved", color: "hsl(var(--primary))" },
  rejected: { label: "Rejected", color: "hsl(var(--destructive))" },
};

const memoChartConfig = {
  submitted: { label: "Submitted", color: "hsl(var(--chart-2))" },
  approved: { label: "Approved", color: "hsl(var(--primary))" },
  rejected: { label: "Rejected", color: "hsl(var(--destructive))" },
};

const usageChartConfig = {
  logins: { label: "Logins", color: "hsl(var(--chart-1))" },
  prCreated: { label: "PRs Created", color: "hsl(var(--chart-2))" },
  memosCreated: { label: "Memos Created", color: "hsl(var(--chart-3))" },
  approvals: { label: "Approvals", color: "hsl(var(--primary))" },
};

const deptChartConfig = {
  amount: { label: "Amount ($)", color: "hsl(var(--primary))" },
};

// --- Component ---

const Reports = () => {
  const [period, setPeriod] = useState("6months");

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Reports</h1>
            <p className="text-muted-foreground">Analytics and exportable reports for PRs, Memos & system usage.</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[160px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                exportToCSV(
                  [
                    ...recentPRReport.map((r) => ({ ...r, type: "PR" })),
                    ...recentMemoReport.map((r) => ({ ...r, type: "Memo" })),
                  ],
                  "full_report"
                );
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total PRs</p>
                  <p className="text-3xl font-bold text-foreground">147</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-primary" /> +12% vs last period
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-chart-1/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-chart-1" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Memos</p>
                  <p className="text-3xl font-bold text-foreground">101</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-primary" /> +8% vs last period
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-chart-2/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-chart-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Approval Time</p>
                  <p className="text-3xl font-bold text-foreground">5.4h</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-chart-5" /> -18% improvement
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-chart-5/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-chart-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-3xl font-bold text-foreground">86</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Users className="h-3 w-3 text-primary" /> 92% engagement
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pr" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pr">Purchase Requisitions</TabsTrigger>
            <TabsTrigger value="memo">Memos</TabsTrigger>
            <TabsTrigger value="usage">System Usage</TabsTrigger>
          </TabsList>

          {/* PR Tab */}
          <TabsContent value="pr" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* PR Monthly Trend */}
              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">PR Monthly Trend</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => exportToCSV(prMonthlyData, "pr_monthly_trend")}>
                    <Download className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={prChartConfig} className="h-[280px] w-full">
                    <BarChart data={prMonthlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="submitted" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="approved" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="rejected" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* PR Status Distribution */}
              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">PR Status Distribution</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => exportToCSV(prStatusDistribution.map(({ name, value }) => ({ name, value })), "pr_status_distribution")}>
                    <Download className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={prStatusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                          {prStatusDistribution.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 mt-2">
                    {prStatusDistribution.map((s) => (
                      <div key={s.name} className="flex items-center gap-1.5 text-xs">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-muted-foreground">{s.name}: {s.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* PR by Department */}
              <Card className="border-border lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">PR Spend by Department</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => exportToCSV(prByDepartment, "pr_by_department")}>
                    <Download className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={deptChartConfig} className="h-[280px] w-full">
                    <BarChart data={prByDepartment} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} className="text-muted-foreground" />
                      <YAxis dataKey="department" type="category" width={90} className="text-muted-foreground" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* PR Data Table */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">PR Detail Report</CardTitle>
                <Button variant="outline" size="sm" onClick={() => exportToCSV(recentPRReport, "pr_detail_report")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PR ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPRReport.map((pr) => (
                      <TableRow key={pr.id}>
                        <TableCell className="font-medium">{pr.id}</TableCell>
                        <TableCell>{pr.title}</TableCell>
                        <TableCell>{pr.department}</TableCell>
                        <TableCell className="font-semibold">{pr.amount}</TableCell>
                        <TableCell>{getStatusBadge(pr.status)}</TableCell>
                        <TableCell className="text-muted-foreground">{pr.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Memo Tab */}
          <TabsContent value="memo" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">Memo Monthly Trend</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => exportToCSV(memoMonthlyData, "memo_monthly_trend")}>
                    <Download className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={memoChartConfig} className="h-[280px] w-full">
                    <BarChart data={memoMonthlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="submitted" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="approved" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="rejected" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">Memo Status Distribution</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => exportToCSV(memoStatusDistribution.map(({ name, value }) => ({ name, value })), "memo_status_distribution")}>
                    <Download className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={memoStatusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                          {memoStatusDistribution.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 mt-2">
                    {memoStatusDistribution.map((s) => (
                      <div key={s.name} className="flex items-center gap-1.5 text-xs">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-muted-foreground">{s.name}: {s.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Memo Detail Report</CardTitle>
                <Button variant="outline" size="sm" onClick={() => exportToCSV(recentMemoReport, "memo_detail_report")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Memo ID</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentMemoReport.map((memo) => (
                      <TableRow key={memo.id}>
                        <TableCell className="font-medium">{memo.id}</TableCell>
                        <TableCell>{memo.subject}</TableCell>
                        <TableCell>{memo.from}</TableCell>
                        <TableCell>{getStatusBadge(memo.status)}</TableCell>
                        <TableCell className="text-muted-foreground">{memo.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Usage Tab */}
          <TabsContent value="usage" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">System Activity Overview</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => exportToCSV(systemUsageData, "system_usage")}>
                    <Download className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={usageChartConfig} className="h-[300px] w-full">
                    <LineChart data={systemUsageData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="logins" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="prCreated" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="memosCreated" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="approvals" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Approvers */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Top Approvers</CardTitle>
                <Button variant="outline" size="sm" onClick={() => exportToCSV(topApprovers, "top_approvers")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Items Approved</TableHead>
                      <TableHead>Avg. Approval Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topApprovers.map((approver) => (
                      <TableRow key={approver.name}>
                        <TableCell className="font-medium">{approver.name}</TableCell>
                        <TableCell className="text-muted-foreground">{approver.role}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle className="h-4 w-4 text-primary" />
                            {approver.approved}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {approver.avgTime}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* System Usage Table */}
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Monthly Usage Breakdown</CardTitle>
                <Button variant="outline" size="sm" onClick={() => exportToCSV(systemUsageData, "monthly_usage_breakdown")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Logins</TableHead>
                      <TableHead>PRs Created</TableHead>
                      <TableHead>Memos Created</TableHead>
                      <TableHead>Approvals</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {systemUsageData.map((row) => (
                      <TableRow key={row.month}>
                        <TableCell className="font-medium">{row.month}</TableCell>
                        <TableCell>{row.logins}</TableCell>
                        <TableCell>{row.prCreated}</TableCell>
                        <TableCell>{row.memosCreated}</TableCell>
                        <TableCell>{row.approvals}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Reports;
