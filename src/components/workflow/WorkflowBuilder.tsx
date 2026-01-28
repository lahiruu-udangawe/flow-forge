import { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { 
  Play, 
  CheckCircle, 
  Users, 
  GitBranch, 
  Bell, 
  Square, 
  Plus, 
  Trash2,
  Settings,
  GripVertical,
  ChevronRight,
  Save,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface WorkflowStep {
  id: string;
  type: 'start' | 'approval' | 'committee' | 'condition' | 'notification' | 'end';
  label: string;
  config?: {
    approvers?: string[];
    requireAll?: boolean;
    signatureRequired?: boolean;
    timeLimit?: number;
    notificationType?: 'email' | 'sms' | 'in_app';
    conditionField?: string;
    conditionOperator?: string;
    conditionValue?: string;
  };
}

const stepTemplates = [
  { type: 'approval' as const, label: 'Single Approval', icon: CheckCircle, description: 'One person approves' },
  { type: 'committee' as const, label: 'Committee', icon: Users, description: 'Multiple approvers' },
  { type: 'condition' as const, label: 'Condition', icon: GitBranch, description: 'Branch workflow' },
  { type: 'notification' as const, label: 'Notification', icon: Bell, description: 'Send alerts' },
];

const mockApprovers = [
  { id: '1', name: 'Sarah Johnson', designation: 'Department Head', department: 'Finance' },
  { id: '2', name: 'Michael Chen', designation: 'General Manager', department: 'Operations' },
  { id: '3', name: 'Emily Brown', designation: 'CFO', department: 'Executive' },
  { id: '4', name: 'David Wilson', designation: 'Procurement Manager', department: 'Procurement' },
  { id: '5', name: 'Lisa Anderson', designation: 'IT Director', department: 'IT' },
];

interface WorkflowBuilderProps {
  initialSteps?: WorkflowStep[];
  workflowName?: string;
  onSave?: (name: string, steps: WorkflowStep[]) => void;
}

export function WorkflowBuilder({ 
  initialSteps, 
  workflowName: initialName = "New Workflow",
  onSave 
}: WorkflowBuilderProps) {
  const [workflowName, setWorkflowName] = useState(initialName);
  const [steps, setSteps] = useState<WorkflowStep[]>(
    initialSteps || [
      { id: 'start', type: 'start', label: 'Start' },
      { id: 'end', type: 'end', label: 'End' }
    ]
  );
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const getStepIcon = (type: WorkflowStep['type']) => {
    switch (type) {
      case 'start': return Play;
      case 'approval': return CheckCircle;
      case 'committee': return Users;
      case 'condition': return GitBranch;
      case 'notification': return Bell;
      case 'end': return Square;
      default: return Square;
    }
  };

  const getStepColor = (type: WorkflowStep['type']) => {
    switch (type) {
      case 'start': return 'bg-chart-1 text-foreground';
      case 'approval': return 'bg-primary text-primary-foreground';
      case 'committee': return 'bg-secondary text-secondary-foreground';
      case 'condition': return 'bg-chart-5 text-card';
      case 'notification': return 'bg-chart-3 text-foreground';
      case 'end': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    // If dragging from palette to workflow
    if (source.droppableId === 'palette' && destination.droppableId === 'workflow') {
      const templateIndex = source.index;
      const template = stepTemplates[templateIndex];
      
      const newStep: WorkflowStep = {
        id: `step-${Date.now()}`,
        type: template.type,
        label: template.label,
        config: {},
      };

      const newSteps = [...steps];
      // Insert before the end node (or at destination if not at end)
      const insertIndex = Math.min(destination.index, steps.length - 1);
      newSteps.splice(insertIndex, 0, newStep);
      setSteps(newSteps);
      return;
    }

    // If reordering within workflow
    if (source.droppableId === 'workflow' && destination.droppableId === 'workflow') {
      // Don't allow moving start or end nodes
      const movingStep = steps[source.index];
      if (movingStep.type === 'start' || movingStep.type === 'end') return;
      
      // Don't allow placing before start or after end
      if (destination.index === 0 || destination.index === steps.length) return;

      const newSteps = Array.from(steps);
      const [removed] = newSteps.splice(source.index, 1);
      newSteps.splice(destination.index, 0, removed);
      setSteps(newSteps);
    }
  }, [steps]);

  const removeStep = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (step?.type === 'start' || step?.type === 'end') return;
    setSteps(steps.filter(s => s.id !== stepId));
  };

  const updateStepConfig = (stepId: string, config: WorkflowStep['config']) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, config: { ...step.config, ...config } } : step
    ));
  };

  const updateStepLabel = (stepId: string, label: string) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, label } : step
    ));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(workflowName, steps);
    }
    toast({
      title: "Workflow Saved",
      description: `"${workflowName}" has been saved successfully.`,
    });
  };

  return (
    <div className="flex h-full gap-6">
      {/* Left Panel - Palette */}
      <Card className="w-72 flex-shrink-0 border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Workflow Steps</CardTitle>
          <p className="text-sm text-muted-foreground">
            Drag steps to the canvas
          </p>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="palette" isDropDisabled>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-2"
                >
                  {stepTemplates.map((template, index) => {
                    const Icon = template.icon;
                    return (
                      <Draggable key={template.type} draggableId={template.type} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              "flex items-center gap-3 rounded-lg border border-border bg-background p-3 cursor-grab transition-shadow",
                              snapshot.isDragging && "shadow-lg ring-2 ring-primary"
                            )}
                          >
                            <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", getStepColor(template.type))}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{template.label}</p>
                              <p className="text-xs text-muted-foreground">{template.description}</p>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* Center Panel - Workflow Canvas */}
            <div className="flex-1 min-w-0 mt-6">
              <div className="mb-4 flex items-center justify-between">
                <Input
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  className="max-w-xs text-lg font-semibold bg-transparent border-transparent hover:border-border focus:border-border"
                />
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Workflow
                  </Button>
                </div>
              </div>

              <Card className="border-border min-h-[500px] bg-background/50">
                <CardContent className="p-6">
                  <Droppable droppableId="workflow">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                          "relative space-y-0 min-h-[400px]",
                          snapshot.isDraggingOver && "bg-primary/5 rounded-lg"
                        )}
                      >
                        {steps.map((step, index) => {
                          const Icon = getStepIcon(step.type);
                          const isTerminal = step.type === 'start' || step.type === 'end';
                          
                          return (
                            <Draggable 
                              key={step.id} 
                              draggableId={step.id} 
                              index={index}
                              isDragDisabled={isTerminal}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="relative"
                                >
                                  {/* Connection line */}
                                  {index > 0 && (
                                    <div className="absolute left-1/2 -top-6 h-6 w-0.5 -translate-x-1/2 bg-border" />
                                  )}
                                  
                                  {/* Connector arrow */}
                                  {index < steps.length - 1 && (
                                    <div className="absolute left-1/2 -bottom-6 z-10 -translate-x-1/2">
                                      <ChevronRight className="h-4 w-4 rotate-90 text-muted-foreground" />
                                    </div>
                                  )}

                                  <div
                                    className={cn(
                                      "group relative flex items-center justify-center py-4",
                                      snapshot.isDragging && "z-50"
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        "flex items-center gap-3 rounded-xl border-2 bg-card p-4 transition-all",
                                        snapshot.isDragging ? "shadow-xl border-primary" : "border-border",
                                        !isTerminal && "hover:border-primary cursor-pointer"
                                      )}
                                      onClick={() => {
                                        if (!isTerminal) {
                                          setSelectedStep(step);
                                          setIsConfigOpen(true);
                                        }
                                      }}
                                    >
                                      {!isTerminal && (
                                        <div
                                          {...provided.dragHandleProps}
                                          className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                      )}
                                      
                                      <div className={cn(
                                        "flex h-12 w-12 items-center justify-center rounded-xl",
                                        getStepColor(step.type)
                                      )}>
                                        <Icon className="h-6 w-6" />
                                      </div>
                                      
                                      <div className="min-w-[120px]">
                                        <p className="font-medium">{step.label}</p>
                                        {step.config?.approvers && step.config.approvers.length > 0 && (
                                          <p className="text-xs text-muted-foreground">
                                            {step.config.approvers.length} approver(s)
                                          </p>
                                        )}
                                        {step.config?.notificationType && (
                                          <Badge variant="outline" className="text-xs mt-1">
                                            {step.config.notificationType}
                                          </Badge>
                                        )}
                                      </div>

                                      {!isTerminal && (
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedStep(step);
                                              setIsConfigOpen(true);
                                            }}
                                          >
                                            <Settings className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              removeStep(step.id);
                                            }}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}

                        {/* Empty state */}
                        {steps.length === 2 && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center text-muted-foreground">
                              <Plus className="mx-auto h-12 w-12 mb-2 opacity-50" />
                              <p>Drag steps here to build your workflow</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            </div>
          </DragDropContext>
        </CardContent>
      </Card>

      {/* Step Configuration Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card">
          <DialogHeader>
            <DialogTitle>Configure Step</DialogTitle>
          </DialogHeader>
          {selectedStep && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Step Name</Label>
                <Input
                  value={selectedStep.label}
                  onChange={(e) => {
                    updateStepLabel(selectedStep.id, e.target.value);
                    setSelectedStep({ ...selectedStep, label: e.target.value });
                  }}
                />
              </div>

              {(selectedStep.type === 'approval' || selectedStep.type === 'committee') && (
                <>
                  <div className="space-y-2">
                    <Label>Approvers</Label>
                    <Select
                      onValueChange={(value) => {
                        const currentApprovers = selectedStep.config?.approvers || [];
                        if (!currentApprovers.includes(value)) {
                          const newApprovers = [...currentApprovers, value];
                          updateStepConfig(selectedStep.id, { approvers: newApprovers });
                          setSelectedStep({
                            ...selectedStep,
                            config: { ...selectedStep.config, approvers: newApprovers }
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Add approver" />
                      </SelectTrigger>
                      <SelectContent className="bg-card">
                        {mockApprovers.map((approver) => (
                          <SelectItem key={approver.id} value={approver.id}>
                            {approver.name} - {approver.designation}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedStep.config?.approvers && selectedStep.config.approvers.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedStep.config.approvers.map((approverId) => {
                        const approver = mockApprovers.find(a => a.id === approverId);
                        return approver ? (
                          <Badge key={approverId} variant="secondary" className="gap-1">
                            {approver.name}
                            <button
                              onClick={() => {
                                const newApprovers = selectedStep.config?.approvers?.filter(id => id !== approverId) || [];
                                updateStepConfig(selectedStep.id, { approvers: newApprovers });
                                setSelectedStep({
                                  ...selectedStep,
                                  config: { ...selectedStep.config, approvers: newApprovers }
                                });
                              }}
                              className="ml-1 hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Digital Signature</Label>
                      <p className="text-sm text-muted-foreground">
                        Approvers must digitally sign
                      </p>
                    </div>
                    <Switch
                      checked={selectedStep.config?.signatureRequired || false}
                      onCheckedChange={(checked) => {
                        updateStepConfig(selectedStep.id, { signatureRequired: checked });
                        setSelectedStep({
                          ...selectedStep,
                          config: { ...selectedStep.config, signatureRequired: checked }
                        });
                      }}
                    />
                  </div>

                  {selectedStep.type === 'committee' && (
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Require All Approvers</Label>
                        <p className="text-sm text-muted-foreground">
                          All committee members must approve
                        </p>
                      </div>
                      <Switch
                        checked={selectedStep.config?.requireAll || false}
                        onCheckedChange={(checked) => {
                          updateStepConfig(selectedStep.id, { requireAll: checked });
                          setSelectedStep({
                            ...selectedStep,
                            config: { ...selectedStep.config, requireAll: checked }
                          });
                        }}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Time Limit (hours)</Label>
                    <Input
                      type="number"
                      placeholder="No limit"
                      value={selectedStep.config?.timeLimit || ''}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || undefined;
                        updateStepConfig(selectedStep.id, { timeLimit: value });
                        setSelectedStep({
                          ...selectedStep,
                          config: { ...selectedStep.config, timeLimit: value }
                        });
                      }}
                    />
                  </div>
                </>
              )}

              {selectedStep.type === 'notification' && (
                <div className="space-y-2">
                  <Label>Notification Type</Label>
                  <Select
                    value={selectedStep.config?.notificationType || 'email'}
                    onValueChange={(value: 'email' | 'sms' | 'in_app') => {
                      updateStepConfig(selectedStep.id, { notificationType: value });
                      setSelectedStep({
                        ...selectedStep,
                        config: { ...selectedStep.config, notificationType: value }
                      });
                    }}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="in_app">In-App</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedStep.type === 'condition' && (
                <>
                  <div className="space-y-2">
                    <Label>Condition Field</Label>
                    <Select
                      value={selectedStep.config?.conditionField || ''}
                      onValueChange={(value) => {
                        updateStepConfig(selectedStep.id, { conditionField: value });
                        setSelectedStep({
                          ...selectedStep,
                          config: { ...selectedStep.config, conditionField: value }
                        });
                      }}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent className="bg-card">
                        <SelectItem value="amount">Amount</SelectItem>
                        <SelectItem value="department">Department</SelectItem>
                        <SelectItem value="category">Category</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Operator</Label>
                      <Select
                        value={selectedStep.config?.conditionOperator || ''}
                        onValueChange={(value) => {
                          updateStepConfig(selectedStep.id, { conditionOperator: value });
                          setSelectedStep({
                            ...selectedStep,
                            config: { ...selectedStep.config, conditionOperator: value }
                          });
                        }}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-card">
                          <SelectItem value="equals">Equals</SelectItem>
                          <SelectItem value="greater_than">Greater Than</SelectItem>
                          <SelectItem value="less_than">Less Than</SelectItem>
                          <SelectItem value="contains">Contains</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Value</Label>
                      <Input
                        value={selectedStep.config?.conditionValue || ''}
                        onChange={(e) => {
                          updateStepConfig(selectedStep.id, { conditionValue: e.target.value });
                          setSelectedStep({
                            ...selectedStep,
                            config: { ...selectedStep.config, conditionValue: e.target.value }
                          });
                        }}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end">
                <Button onClick={() => setIsConfigOpen(false)}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
