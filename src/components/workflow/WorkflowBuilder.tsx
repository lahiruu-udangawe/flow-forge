import { useState, useCallback } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Save, CheckCircle, Upload, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ComponentPalette, stepTemplates } from "./ComponentPalette";
import { WorkflowCanvas } from "./WorkflowCanvas";
import { WorkflowSettingsPanel } from "./WorkflowSettingsPanel";
import { WorkflowStep, WorkflowSettings } from "./types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface WorkflowBuilderProps {
  initialSteps?: WorkflowStep[];
  workflowName?: string;
  onSave?: (name: string, steps: WorkflowStep[]) => void;
  onCancel?: () => void;
}

export function WorkflowBuilder({ 
  initialSteps, 
  workflowName: initialName = "New Workflow",
  onSave,
  onCancel
}: WorkflowBuilderProps) {
  const [steps, setSteps] = useState<WorkflowStep[]>(
    initialSteps || [
      { id: 'start', type: 'start', label: 'Start' },
      { id: 'end', type: 'end', label: 'End' }
    ]
  );
  
  const [settings, setSettings] = useState<WorkflowSettings>({
    name: initialName,
    appliesTo: 'pr',
    departmentScope: 'All Departments',
    description: '',
  });

  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidationDialog, setShowValidationDialog] = useState(false);

  const selectedStep = steps.find(s => s.id === selectedStepId) || null;

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    // If dragging from palette to workflow
    if (source.droppableId === 'palette' && destination.droppableId === 'workflow') {
      const templateType = result.draggableId.replace('palette-', '');
      const template = stepTemplates.find(t => t.type === templateType);
      
      if (!template) return;

      // For start/end, check if already exists
      if (template.type === 'start' && steps.some(s => s.type === 'start')) {
        toast({
          title: "Start already exists",
          description: "A workflow can only have one Start node.",
          variant: "destructive",
        });
        return;
      }
      
      if (template.type === 'end' && steps.some(s => s.type === 'end')) {
        toast({
          title: "End already exists",
          description: "A workflow can only have one End node.",
          variant: "destructive",
        });
        return;
      }

      const newStep: WorkflowStep = {
        id: `step-${Date.now()}`,
        type: template.type,
        label: template.label,
        config: undefined,
      };

      const newSteps = [...steps];
      // Insert at destination index, but ensure start stays first and end stays last
      let insertIndex = destination.index;
      
      if (template.type === 'start') {
        insertIndex = 0;
      } else if (template.type === 'end') {
        insertIndex = newSteps.length;
      } else {
        // For other steps, don't insert before start or after end
        const startIndex = newSteps.findIndex(s => s.type === 'start');
        const endIndex = newSteps.findIndex(s => s.type === 'end');
        
        if (startIndex !== -1 && insertIndex <= startIndex) {
          insertIndex = startIndex + 1;
        }
        if (endIndex !== -1 && insertIndex >= endIndex) {
          insertIndex = endIndex;
        }
      }

      newSteps.splice(insertIndex, 0, newStep);
      setSteps(newSteps);
      setSelectedStepId(newStep.id);
      return;
    }

    // If reordering within workflow
    if (source.droppableId === 'workflow' && destination.droppableId === 'workflow') {
      const movingStep = steps[source.index];
      if (movingStep.type === 'start' || movingStep.type === 'end') return;
      
      // Don't allow placing at position 0 (before start) or after end
      const endIndex = steps.findIndex(s => s.type === 'end');
      if (destination.index === 0) return;
      if (endIndex !== -1 && destination.index > endIndex) return;

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
    if (selectedStepId === stepId) {
      setSelectedStepId(null);
    }
  };

  const updateStepConfig = (stepId: string, config: WorkflowStep['config']) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, config } : step
    ));
  };

  const updateStepLabel = (stepId: string, label: string) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, label } : step
    ));
  };

  const validateWorkflow = (): string[] => {
    const errors: string[] = [];

    // Check for start and end nodes
    if (!steps.some(s => s.type === 'start')) {
      errors.push("Workflow must have a Start node");
    }
    if (!steps.some(s => s.type === 'end')) {
      errors.push("Workflow must have an End node");
    }

    // Check for at least one step between start and end
    const middleSteps = steps.filter(s => s.type !== 'start' && s.type !== 'end');
    if (middleSteps.length === 0) {
      errors.push("Workflow must have at least one step between Start and End");
    }

    // Check approval steps have approvers
    steps.filter(s => s.type === 'approval').forEach(step => {
      const config = step.config as any;
      if (!config?.approvers || config.approvers.length === 0) {
        errors.push(`Approval step "${step.label}" requires an approver`);
      }
    });

    // Check committee steps have members
    steps.filter(s => s.type === 'committee').forEach(step => {
      const config = step.config as any;
      if (!config?.members || config.members.length === 0) {
        errors.push(`Committee step "${step.label}" requires at least one member`);
      }
    });

    // Check workflow name
    if (!settings.name.trim()) {
      errors.push("Workflow name is required");
    }

    return errors;
  };

  const handleValidate = () => {
    const errors = validateWorkflow();
    setValidationErrors(errors);
    setShowValidationDialog(true);
  };

  const handleSaveDraft = () => {
    if (onSave) {
      onSave(settings.name, steps);
    }
    toast({
      title: "Draft Saved",
      description: `"${settings.name}" has been saved as draft.`,
    });
  };

  const handlePublish = () => {
    const errors = validateWorkflow();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationDialog(true);
      return;
    }

    if (onSave) {
      onSave(settings.name, steps);
    }
    toast({
      title: "Workflow Published",
      description: `"${settings.name}" is now active.`,
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="h-full flex flex-col bg-background rounded-lg border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{settings.name || "New Workflow"}</h2>
            <p className="text-xs text-muted-foreground">
              {settings.appliesTo === 'pr' ? 'Purchase Requisition' : 'Memo'} • {settings.departmentScope}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSaveDraft}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button variant="outline" size="sm" onClick={handleValidate}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Validate
            </Button>
            <Button size="sm" onClick={handlePublish}>
              <Upload className="mr-2 h-4 w-4" />
              Publish
            </Button>
            {onCancel && (
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Main Content - 3 Panel Layout */}
        <div className="flex-1 flex min-h-0">
          {/* Left Panel - Component Palette */}
          <ComponentPalette />

          {/* Center Panel - Canvas */}
          <WorkflowCanvas
            steps={steps}
            selectedStepId={selectedStepId}
            onSelectStep={(step) => setSelectedStepId(step?.id || null)}
            onRemoveStep={removeStep}
          />

          {/* Right Panel - Settings & Properties */}
          <WorkflowSettingsPanel
            settings={settings}
            selectedStep={selectedStep}
            onSettingsChange={setSettings}
            onStepConfigChange={updateStepConfig}
            onStepLabelChange={updateStepLabel}
          />
        </div>
      </div>

      {/* Validation Dialog */}
      <AlertDialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {validationErrors.length === 0 ? (
                <>
                  <CheckCircle className="h-5 w-5 text-chart-1" />
                  Validation Passed
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Validation Failed
                </>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                {validationErrors.length === 0 ? (
                  <p>Your workflow is valid and ready to publish.</p>
                ) : (
                  <ul className="list-disc list-inside space-y-1 text-destructive">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DragDropContext>
  );
}
