import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PRForm } from "@/components/pr/PRForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Clock, 
  CheckCircle,
  XCircle,
  ArrowLeft,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockPRs = [
  { 
    id: "PR-2025-001", 
    title: "IT Equipment Purchase - Q1", 
    department: "IT", 
    category: "IT Equipment",
    status: "pending", 
    amount: 15400, 
    currency: "USD",
    priority: "high",
    createdAt: "2025-01-28",
    createdBy: "John Doe"
  },
  { 
    id: "PR-2025-002", 
    title: "Office Furniture Renewal", 
    department: "Administration", 
    category: "Furniture",
    status: "approved", 
    amount: 8200, 
    currency: "USD",
    priority: "medium",
    createdAt: "2025-01-27",
    createdBy: "Sarah Johnson"
  },
  { 
    id: "PR-2025-003", 
    title: "Software Licenses - Annual Subscription", 
    department: "IT", 
    category: "Software & Licenses",
    status: "in_progress", 
    amount: 24000, 
    currency: "USD",
    priority: "urgent",
    createdAt: "2025-01-26",
    createdBy: "Michael Chen"
  },
  { 
    id: "PR-2025-004", 
    title: "Marketing Materials for Campaign", 
    department: "Marketing", 
    category: "Other",
    status: "rejected", 
    amount: 3500, 
    currency: "USD",
    priority: "low",
    createdAt: "2025-01-25",
    createdBy: "Emily Brown"
  },
  { 
    id: "PR-2025-005", 
    title: "Server Room Maintenance", 
    department: "IT", 
    category: "Maintenance",
    status: "draft", 
    amount: 12000, 
    currency: "USD",
    priority: "medium",
    createdAt: "2025-01-24",
    createdBy: "John Doe"
  },
];

const getStatusBadge = (status: string) => {
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
      return <Badge className="bg-chart-1 text-foreground">High</Badge>;
    case "medium":
      return <Badge className="bg-chart-2 text-foreground">Medium</Badge>;
    case "low":
      return <Badge className="bg-muted text-muted-foreground">Low</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const PurchaseRequisitions = () => {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredPRs = mockPRs.filter(pr => 
    pr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pr.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pr.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFormSubmit = (data: any, action: 'draft' | 'submit') => {
    console.log('PR Form submitted:', { data, action });
    setView('list');
  };

  if (view === 'create') {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setView('list')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">New Purchase Requisition</h1>
              <p className="text-muted-foreground">Create a new purchase requisition for approval</p>
            </div>
          </div>
          <PRForm onSubmit={handleFormSubmit} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Purchase Requisitions</h1>
            <p className="text-muted-foreground">Manage and track all purchase requisitions</p>
          </div>
          <Button onClick={() => setView('create')}>
            <Plus className="mr-2 h-4 w-4" />
            New PR
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-xs text-muted-foreground">Total PRs</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-chart-1/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search PRs..."
                  className="pl-9 bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">PR Number</TableHead>
                  <TableHead className="text-muted-foreground">Title</TableHead>
                  <TableHead className="text-muted-foreground">Department</TableHead>
                  <TableHead className="text-muted-foreground">Amount</TableHead>
                  <TableHead className="text-muted-foreground">Priority</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPRs.map((pr) => (
                  <TableRow key={pr.id} className="border-border">
                    <TableCell
                      className="font-medium text-primary cursor-pointer hover:underline"
                      onClick={() => navigate(`/purchase-requisitions/${pr.id}`)}
                    >
                      {pr.id}
                    </TableCell>
                    <TableCell
                      className="max-w-[200px] truncate cursor-pointer hover:underline"
                      onClick={() => navigate(`/purchase-requisitions/${pr.id}`)}
                    >
                      {pr.title}
                    </TableCell>
                    <TableCell>{pr.department}</TableCell>
                    <TableCell className="font-medium">
                      {pr.currency} {pr.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{getPriorityBadge(pr.priority)}</TableCell>
                    <TableCell>{getStatusBadge(pr.status)}</TableCell>
                    <TableCell className="text-muted-foreground">{pr.createdAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PurchaseRequisitions;
