import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { WorkflowBuilder } from "@/components/workflow/WorkflowBuilder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  GitBranch, 
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Copy,
  FileText,
  Mail,
  Settings
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockWorkflows = [
  { 
    id: "WF-001", 
    name: "Standard PR Approval", 
    type: "pr",
    steps: 4,
    status: "active", 
    usageCount: 156,
    lastModified: "2025-01-25"
  },
  { 
    id: "WF-002", 
    name: "High Value PR (>$10,000)", 
    type: "pr",
    steps: 6,
    status: "active", 
    usageCount: 42,
    lastModified: "2025-01-20"
  },
  { 
    id: "WF-003", 
    name: "Internal Memo Circulation", 
    type: "memo",
    steps: 3,
    status: "active", 
    usageCount: 89,
    lastModified: "2025-01-18"
  },
  { 
    id: "WF-004", 
    name: "Executive Memo Approval", 
    type: "memo",
    steps: 5,
    status: "draft", 
    usageCount: 0,
    lastModified: "2025-01-28"
  },
  { 
    id: "WF-005", 
    name: "Urgent PR Fast Track", 
    type: "pr",
    steps: 2,
    status: "active", 
    usageCount: 23,
    lastModified: "2025-01-15"
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-primary/10 text-primary border-primary/30" variant="outline">Active</Badge>;
    case "draft":
      return <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-muted">Draft</Badge>;
    case "archived":
      return <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/30">Archived</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getTypeBadge = (type: string) => {
  switch (type) {
    case "pr":
      return (
        <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/30 gap-1">
          <FileText className="h-3 w-3" />
          PR
        </Badge>
      );
    case "memo":
      return (
        <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/30 gap-1">
          <Mail className="h-3 w-3" />
          Memo
        </Badge>
      );
    default:
      return <Badge variant="outline">Custom</Badge>;
  }
};

const WorkflowBuilderPage = () => {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWorkflows = mockWorkflows.filter(wf => 
    wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wf.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveWorkflow = (name: string, steps: any[]) => {
    console.log('Workflow saved:', { name, steps });
    setView('list');
  };

  if (view === 'create' || view === 'edit') {
    return (
      <AppLayout>
        <div className="h-[calc(100vh-2rem)]">
          <WorkflowBuilder 
            workflowName={view === 'edit' ? 'Standard PR Approval' : 'New Workflow'}
            onSave={handleSaveWorkflow}
            onCancel={() => setView('list')}
          />
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
            <h1 className="text-2xl font-bold text-foreground">Workflow Builder</h1>
            <p className="text-muted-foreground">Design and manage approval workflows</p>
          </div>
          <Button onClick={() => setView('create')}>
            <Plus className="mr-2 h-4 w-4" />
            New Workflow
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <GitBranch className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-muted-foreground">Active Workflows</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-chart-1/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">PR Workflows</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-chart-2/20 flex items-center justify-center">
                <Mail className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-muted-foreground">Memo Workflows</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search workflows..."
                  className="pl-9 bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorkflows.map((workflow) => (
            <Card key={workflow.id} className="border-border hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-semibold">{workflow.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getTypeBadge(workflow.type)}
                      {getStatusBadge(workflow.status)}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card">
                      <DropdownMenuItem onClick={() => setView('edit')}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>{workflow.steps} steps</span>
                    <span>•</span>
                    <span>{workflow.usageCount} uses</span>
                  </div>
                  <span>{workflow.lastModified}</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => setView('edit')}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View & Edit
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default WorkflowBuilderPage;
