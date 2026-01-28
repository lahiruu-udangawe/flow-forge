import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MemoForm } from "@/components/memo/MemoForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Clock, 
  CheckCircle,
  XCircle,
  ArrowLeft,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  AlertTriangle
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

const mockMemos = [
  { 
    id: "MEMO-2025-001", 
    subject: "Policy Update: Remote Work Guidelines", 
    from: "HR Department", 
    to: "All Employees",
    department: "HR",
    status: "pending", 
    priority: "normal",
    createdAt: "2025-01-28",
    createdBy: "Sarah Johnson"
  },
  { 
    id: "MEMO-2025-002", 
    subject: "Q4 Budget Review Meeting Schedule", 
    from: "Finance Team", 
    to: "Department Heads",
    department: "Finance",
    status: "approved", 
    priority: "urgent",
    createdAt: "2025-01-27",
    createdBy: "Michael Chen"
  },
  { 
    id: "MEMO-2025-003", 
    subject: "System Maintenance Notice - Weekend", 
    from: "IT Department", 
    to: "All Staff",
    department: "IT",
    status: "in_progress", 
    priority: "normal",
    createdAt: "2025-01-26",
    createdBy: "David Wilson"
  },
  { 
    id: "MEMO-2025-004", 
    subject: "Confidential: Restructuring Plan", 
    from: "Executive Office", 
    to: "Senior Management",
    department: "Executive",
    status: "approved", 
    priority: "confidential",
    createdAt: "2025-01-25",
    createdBy: "Emily Brown"
  },
  { 
    id: "MEMO-2025-005", 
    subject: "Annual Leave Policy Clarification", 
    from: "HR Department", 
    to: "All Managers",
    department: "HR",
    status: "draft", 
    priority: "normal",
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
    case "confidential":
      return <Badge className="bg-secondary text-secondary-foreground">Confidential</Badge>;
    case "normal":
      return <Badge variant="outline" className="bg-muted/50 text-muted-foreground">Normal</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const Memos = () => {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMemos = mockMemos.filter(memo => 
    memo.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    memo.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    memo.from.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFormSubmit = (data: any, action: 'draft' | 'submit') => {
    console.log('Memo Form submitted:', { data, action });
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
              <h1 className="text-2xl font-bold text-foreground">New Memo</h1>
              <p className="text-muted-foreground">Create a new office memo for approval</p>
            </div>
          </div>
          <MemoForm onSubmit={handleFormSubmit} />
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
            <h1 className="text-2xl font-bold text-foreground">Memos</h1>
            <p className="text-muted-foreground">Manage and track all office memos</p>
          </div>
          <Button onClick={() => setView('create')}>
            <Plus className="mr-2 h-4 w-4" />
            New Memo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">18</p>
                <p className="text-xs text-muted-foreground">Total Memos</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-chart-1/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <p className="text-2xl font-bold">5</p>
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
                <p className="text-2xl font-bold">11</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-muted-foreground">Confidential</p>
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
                  placeholder="Search memos..."
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
                  <TableHead className="text-muted-foreground">Memo Number</TableHead>
                  <TableHead className="text-muted-foreground">Subject</TableHead>
                  <TableHead className="text-muted-foreground">From</TableHead>
                  <TableHead className="text-muted-foreground">To</TableHead>
                  <TableHead className="text-muted-foreground">Priority</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMemos.map((memo) => (
                  <TableRow key={memo.id} className="border-border">
                    <TableCell className="font-medium text-primary">{memo.id}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{memo.subject}</TableCell>
                    <TableCell>{memo.from}</TableCell>
                    <TableCell>{memo.to}</TableCell>
                    <TableCell>{getPriorityBadge(memo.priority)}</TableCell>
                    <TableCell>{getStatusBadge(memo.status)}</TableCell>
                    <TableCell className="text-muted-foreground">{memo.createdAt}</TableCell>
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

export default Memos;
