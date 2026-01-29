import { Draggable, Droppable } from "@hello-pangea/dnd";
import { 
  Play, 
  CheckCircle, 
  Users, 
  GitBranch, 
  Bell, 
  Square 
} from "lucide-react";
import { cn } from "@/lib/utils";

const stepTemplates = [
  { type: 'start' as const, label: 'Start', icon: Play, description: 'Workflow entry point' },
  { type: 'end' as const, label: 'End', icon: Square, description: 'Workflow completion' },
  { type: 'approval' as const, label: 'Approval', icon: CheckCircle, description: 'Single approver step' },
  { type: 'committee' as const, label: 'Committee', icon: Users, description: 'Multiple approvers' },
  { type: 'condition' as const, label: 'Condition', icon: GitBranch, description: 'Conditional branch' },
  { type: 'notification' as const, label: 'Notification', icon: Bell, description: 'Send notifications' },
];

const getStepColor = (type: string) => {
  switch (type) {
    case 'start': return 'bg-chart-1/20 text-chart-1 border-chart-1/30';
    case 'approval': return 'bg-primary/20 text-primary border-primary/30';
    case 'committee': return 'bg-chart-2/20 text-chart-2 border-chart-2/30';
    case 'condition': return 'bg-chart-5/20 text-chart-5 border-chart-5/30';
    case 'notification': return 'bg-chart-3/20 text-chart-3 border-chart-3/30';
    case 'end': return 'bg-muted text-muted-foreground border-border';
    default: return 'bg-muted text-muted-foreground border-border';
  }
};

export function ComponentPalette() {
  return (
    <div className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-sm text-foreground">Components</h3>
        <p className="text-xs text-muted-foreground mt-1">Drag to canvas</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
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
                  <Draggable 
                    key={template.type} 
                    draggableId={`palette-${template.type}`} 
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border p-3 cursor-grab transition-all",
                          getStepColor(template.type),
                          snapshot.isDragging && "shadow-lg ring-2 ring-primary opacity-90"
                        )}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-background/50">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{template.label}</p>
                          <p className="text-xs opacity-70 truncate">{template.description}</p>
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
      </div>
    </div>
  );
}

export { stepTemplates };
