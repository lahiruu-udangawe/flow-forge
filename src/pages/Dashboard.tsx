import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  ArrowRight,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    title: "Pending PRs",
    value: "12",
    change: "+3 today",
    icon: FileText,
    trend: "up",
    color: "text-chart-1"
  },
  {
    title: "Pending Memos",
    value: "8",
    change: "+2 today",
    icon: Mail,
    trend: "up",
    color: "text-chart-2"
  },
  {
    title: "Awaiting My Approval",
    value: "5",
    change: "3 urgent",
    icon: Clock,
    trend: "neutral",
    color: "text-chart-5"
  },
  {
    title: "Approved This Month",
    value: "47",
    change: "+15%",
    icon: CheckCircle,
    trend: "up",
    color: "text-primary"
  },
];

const recentPRs = [
  { id: "PR-2025-001", title: "IT Equipment Purchase", department: "IT", status: "pending", amount: "$15,400", date: "2 hours ago" },
  { id: "PR-2025-002", title: "Office Furniture Renewal", department: "Admin", status: "approved", amount: "$8,200", date: "5 hours ago" },
  { id: "PR-2025-003", title: "Software Licenses - Q1", department: "IT", status: "in_progress", amount: "$24,000", date: "1 day ago" },
  { id: "PR-2025-004", title: "Marketing Materials", department: "Marketing", status: "rejected", amount: "$3,500", date: "2 days ago" },
];

const recentMemos = [
  { id: "MEMO-2025-001", subject: "Policy Update: Remote Work Guidelines", from: "HR Department", status: "pending", date: "1 hour ago" },
  { id: "MEMO-2025-002", subject: "Q4 Budget Review Meeting", from: "Finance", status: "approved", date: "4 hours ago" },
  { id: "MEMO-2025-003", subject: "System Maintenance Notice", from: "IT Department", status: "in_progress", date: "1 day ago" },
];

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

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, John. Here's what's happening today.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/purchase-requisitions/new">
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                New PR
              </Button>
            </Link>
            <Link to="/memos/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Memo
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-primary" />}
                      {stat.change}
                    </p>
                  </div>
                  <div className={`h-12 w-12 rounded-xl bg-card flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent PRs */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg">Recent Purchase Requisitions</CardTitle>
              <Link to="/purchase-requisitions">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPRs.map((pr) => (
                  <div key={pr.id} className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{pr.title}</span>
                        {getStatusBadge(pr.status)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{pr.id}</span>
                        <span>•</span>
                        <span>{pr.department}</span>
                        <span>•</span>
                        <span>{pr.date}</span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{pr.amount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Memos */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg">Recent Memos</CardTitle>
              <Link to="/memos">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMemos.map((memo) => (
                  <div key={memo.id} className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{memo.subject}</span>
                        {getStatusBadge(memo.status)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{memo.id}</span>
                        <span>•</span>
                        <span>{memo.from}</span>
                        <span>•</span>
                        <span>{memo.date}</span>
                      </div>
                    </div>
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals Alert */}
        <Card className="border-chart-1/30 bg-chart-1/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-1/20">
                <AlertCircle className="h-6 w-6 text-chart-1" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">You have 5 items awaiting your approval</h3>
                <p className="text-sm text-muted-foreground">3 are marked as urgent and require immediate attention</p>
              </div>
              <Button variant="outline">
                Review Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
