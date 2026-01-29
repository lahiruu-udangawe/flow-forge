import { Draggable, Droppable } from "@hello-pangea/dnd";
import { 
  Play, 
  CheckCircle, 
  Users, 
  GitBranch, 
  Bell, 
  Square,
  GripVertical,
  Trash2,
  ChevronDown,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WorkflowStep } from "./types";

interface WorkflowCanvasProps {
  steps: WorkflowStep[];
  selectedStepId: string | null;
  onSelectStep: (step: WorkflowStep | null) => void;
  onRemoveStep: (stepId: string) => void;
}

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

const getStepStyles = (type: WorkflowStep['type']) => {
  switch (type) {
    case 'start': 
      return { 
        bg: 'bg-chart-1/10', 
        border: 'border-chart-1/50', 
        icon: 'bg-chart-1 text-card',
        text: 'text-chart-1'
      };
    case 'approval': 
      return { 
        bg: 'bg-primary/10', 
        border: 'border-primary/50', 
        icon: 'bg-primary text-primary-foreground',
        text: 'text-primary'
      };
    case 'committee': 
      return { 
        bg: 'bg-chart-2/10', 
        border: 'border-chart-2/50', 
        icon: 'bg-chart-2 text-card',
        text: 'text-chart-2'
      };
    case 'condition': 
      return { 
        bg: 'bg-chart-5/10', 
        border: 'border-chart-5/50', 
        icon: 'bg-chart-5 text-card',
        text: 'text-chart-5'
      };
    case 'notification': 
      return { 
        bg: 'bg-chart-3/10', 
        border: 'border-chart-3/50', 
        icon: 'bg-chart-3 text-card',
        text: 'text-chart-3'
      };
    case 'end': 
      return { 
        bg: 'bg-muted/50', 
        border: 'border-muted-foreground/30', 
        icon: 'bg-muted-foreground text-card',
        text: 'text-muted-foreground'
      };
    default: 
      return { 
        bg: 'bg-muted', 
        border: 'border-border', 
        icon: 'bg-muted-foreground text-card',
        text: 'text-muted-foreground'
      };
  }
};

export function WorkflowCanvas({ 
  steps, 
  selectedStepId, 
  onSelectStep, 
  onRemoveStep 
}: WorkflowCanvasProps) {
  const hasSteps = steps.length > 0;
  const hasOnlyTerminals = steps.length === 2 && 
    steps.some(s => s.type === 'start') && 
    steps.some(s => s.type === 'end');

  return (
    <div className="flex-1 bg-muted/30 overflow-auto">
      <div className="min-h-full p-8">
        <Droppable droppableId="workflow">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "min-h-[500px] flex flex-col items-center py-8 transition-colors rounded-lg",
                snapshot.isDraggingOver && "bg-primary/5 ring-2 ring-primary/20 ring-dashed"
              )}
            >
              {steps.map((step, index) => {
                const Icon = getStepIcon(step.type);
                const styles = getStepStyles(step.type);
                const isTerminal = step.type === 'start' || step.type === 'end';
                const isSelected = selectedStepId === step.id;

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
                        className="flex flex-col items-center"
                      >
                        {/* Connection line from previous step */}
                        {index > 0 && (
                          <div className="flex flex-col items-center">
                            <div className="w-0.5 h-6 bg-border" />
                            <ChevronDown className="h-4 w-4 text-muted-foreground -my-1" />
                            <div className="w-0.5 h-4 bg-border" />
                          </div>
                        )}

                        {/* Step card */}
                        <div
                          className={cn(
                            "group relative flex items-center gap-3 rounded-xl border-2 px-4 py-3 min-w-[200px] max-w-[280px] transition-all cursor-pointer",
                            styles.bg,
                            isSelected ? "ring-2 ring-primary border-primary" : styles.border,
                            snapshot.isDragging && "shadow-xl opacity-90",
                            !isTerminal && "hover:shadow-md"
                          )}
                          onClick={() => onSelectStep(isTerminal ? null : step)}
                        >
                          {/* Drag handle */}
                          {!isTerminal && (
                            <div
                              {...provided.dragHandleProps}
                              className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab absolute -left-2"
                            >
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}

                          {/* Icon */}
                          <div className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-lg shrink-0",
                            styles.icon
                          )}>
                            <Icon className="h-5 w-5" />
                          </div>

                          {/* Label */}
                          <div className="flex-1 min-w-0">
                            <p className={cn("font-medium text-sm", styles.text)}>
                              {step.label}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {step.type}
                            </p>
                          </div>

                          {/* Delete button */}
                          {!isTerminal && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveStep(step.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}

              {/* Empty state */}
              {(!hasSteps || hasOnlyTerminals) && (
                <div className="flex-1 flex items-center justify-center text-center text-muted-foreground py-20">
                  <div>
                    <Plus className="mx-auto h-12 w-12 mb-3 opacity-40" />
                    <p className="font-medium">Drag components here</p>
                    <p className="text-sm opacity-70">Build your workflow step by step</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
}
