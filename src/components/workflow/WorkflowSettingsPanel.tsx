import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CheckCircle, 
  Users, 
  GitBranch, 
  Bell,
  Settings,
  FileText,
  Mail
} from "lucide-react";
import { 
  WorkflowStep, 
  WorkflowSettings, 
  ApprovalConfig, 
  CommitteeConfig, 
  ConditionConfig, 
  NotificationConfig,
  mockApprovers,
  departments 
} from "./types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface WorkflowSettingsPanelProps {
  settings: WorkflowSettings;
  selectedStep: WorkflowStep | null;
  onSettingsChange: (settings: WorkflowSettings) => void;
  onStepConfigChange: (stepId: string, config: WorkflowStep['config']) => void;
  onStepLabelChange: (stepId: string, label: string) => void;
}

export function WorkflowSettingsPanel({
  settings,
  selectedStep,
  onSettingsChange,
  onStepConfigChange,
  onStepLabelChange,
}: WorkflowSettingsPanelProps) {
  return (
    <div className="w-80 border-l border-border bg-card flex flex-col">
      <ScrollArea className="flex-1">
        {/* Workflow Settings Section */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Workflow Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workflow-name" className="text-xs">Workflow Name</Label>
              <Input
                id="workflow-name"
                value={settings.name}
                onChange={(e) => onSettingsChange({ ...settings, name: e.target.value })}
                placeholder="Enter workflow name"
                className="h-9"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="applies-to" className="text-xs">Applies To</Label>
              <Select 
                value={settings.appliesTo} 
                onValueChange={(value: 'pr' | 'memo') => onSettingsChange({ ...settings, appliesTo: value })}
              >
                <SelectTrigger id="applies-to" className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="pr">
                    <div className="flex items-center gap-2">
                      <FileText className="h-3 w-3" />
                      Purchase Requisition
                    </div>
                  </SelectItem>
                  <SelectItem value="memo">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      Memo
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-xs">Department Scope</Label>
              <Select 
                value={settings.departmentScope} 
                onValueChange={(value) => onSettingsChange({ ...settings, departmentScope: value })}
              >
                <SelectTrigger id="department" className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs">Description</Label>
              <Textarea
                id="description"
                value={settings.description}
                onChange={(e) => onSettingsChange({ ...settings, description: e.target.value })}
                placeholder="Describe this workflow..."
                className="min-h-[60px] resize-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Step Properties Section */}
        {selectedStep && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              {selectedStep.type === 'approval' && <CheckCircle className="h-4 w-4 text-primary" />}
              {selectedStep.type === 'committee' && <Users className="h-4 w-4 text-chart-2" />}
              {selectedStep.type === 'condition' && <GitBranch className="h-4 w-4 text-chart-5" />}
              {selectedStep.type === 'notification' && <Bell className="h-4 w-4 text-chart-3" />}
              <h3 className="font-semibold text-sm">Step Properties</h3>
              <Badge variant="outline" className="ml-auto text-xs capitalize">
                {selectedStep.type}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="step-name" className="text-xs">Step Name</Label>
                <Input
                  id="step-name"
                  value={selectedStep.label}
                  onChange={(e) => onStepLabelChange(selectedStep.id, e.target.value)}
                  className="h-9"
                />
              </div>

              <Separator />

              {/* Approval Step Config */}
              {selectedStep.type === 'approval' && (
                <ApprovalStepConfig 
                  step={selectedStep}
                  onConfigChange={(config) => onStepConfigChange(selectedStep.id, config)}
                />
              )}

              {/* Committee Step Config */}
              {selectedStep.type === 'committee' && (
                <CommitteeStepConfig 
                  step={selectedStep}
                  onConfigChange={(config) => onStepConfigChange(selectedStep.id, config)}
                />
              )}

              {/* Condition Step Config */}
              {selectedStep.type === 'condition' && (
                <ConditionStepConfig 
                  step={selectedStep}
                  onConfigChange={(config) => onStepConfigChange(selectedStep.id, config)}
                />
              )}

              {/* Notification Step Config */}
              {selectedStep.type === 'notification' && (
                <NotificationStepConfig 
                  step={selectedStep}
                  onConfigChange={(config) => onStepConfigChange(selectedStep.id, config)}
                />
              )}
            </div>
          </div>
        )}

        {/* No step selected */}
        {!selectedStep && (
          <div className="p-4">
            <div className="text-center text-muted-foreground py-8">
              <Settings className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Select a step to configure</p>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

// Approval Step Configuration
function ApprovalStepConfig({ 
  step, 
  onConfigChange 
}: { 
  step: WorkflowStep; 
  onConfigChange: (config: ApprovalConfig) => void;
}) {
  const config = (step.config as ApprovalConfig) || {
    approverType: 'specific',
    approvers: [],
    executionMode: 'sequential',
    slaHours: 24,
    signatureRequired: false,
    attachmentRule: 'optional',
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs">Approver Type</Label>
        <Select 
          value={config.approverType || 'specific'} 
          onValueChange={(value: 'specific' | 'role' | 'department_head') => 
            onConfigChange({ ...config, approverType: value })
          }
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card">
            <SelectItem value="specific">Specific Person</SelectItem>
            <SelectItem value="role">By Role</SelectItem>
            <SelectItem value="department_head">Department Head</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Approver</Label>
        <Select 
          value={config.approvers?.[0] || ''} 
          onValueChange={(value) => onConfigChange({ ...config, approvers: [value] })}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Select approver" />
          </SelectTrigger>
          <SelectContent className="bg-card">
            {mockApprovers.map((approver) => (
              <SelectItem key={approver.id} value={approver.id}>
                <div className="flex flex-col">
                  <span>{approver.name}</span>
                  <span className="text-xs text-muted-foreground">{approver.designation}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Execution Mode</Label>
        <Select 
          value={config.executionMode || 'sequential'} 
          onValueChange={(value: 'sequential' | 'parallel') => 
            onConfigChange({ ...config, executionMode: value })
          }
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card">
            <SelectItem value="sequential">Sequential</SelectItem>
            <SelectItem value="parallel">Parallel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">SLA (Hours)</Label>
        <Input
          type="number"
          value={config.slaHours || 24}
          onChange={(e) => onConfigChange({ ...config, slaHours: parseInt(e.target.value) || 24 })}
          className="h-9"
          min={1}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Escalation To</Label>
        <Select 
          value={config.escalationTo || ''} 
          onValueChange={(value) => onConfigChange({ ...config, escalationTo: value })}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Select escalation" />
          </SelectTrigger>
          <SelectContent className="bg-card">
            {mockApprovers.map((approver) => (
              <SelectItem key={approver.id} value={approver.id}>
                {approver.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-xs">Signature Required</Label>
        <Switch
          checked={config.signatureRequired || false}
          onCheckedChange={(checked) => onConfigChange({ ...config, signatureRequired: checked })}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Attachment Rule</Label>
        <Select 
          value={config.attachmentRule || 'optional'} 
          onValueChange={(value: 'optional' | 'required' | 'none') => 
            onConfigChange({ ...config, attachmentRule: value })
          }
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card">
            <SelectItem value="optional">Optional</SelectItem>
            <SelectItem value="required">Required</SelectItem>
            <SelectItem value="none">None</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Committee Step Configuration
function CommitteeStepConfig({ 
  step, 
  onConfigChange 
}: { 
  step: WorkflowStep; 
  onConfigChange: (config: CommitteeConfig) => void;
}) {
  const config = (step.config as CommitteeConfig) || {
    members: [],
    approvalRule: 'all',
    signatureRequired: false,
  };

  const toggleMember = (memberId: string) => {
    const members = config.members || [];
    const newMembers = members.includes(memberId)
      ? members.filter(id => id !== memberId)
      : [...members, memberId];
    onConfigChange({ ...config, members: newMembers });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs">Committee Members</Label>
        <div className="border border-border rounded-lg p-2 space-y-1 max-h-[150px] overflow-y-auto">
          {mockApprovers.map((approver) => (
            <div 
              key={approver.id}
              className="flex items-center gap-2 p-2 rounded hover:bg-muted/50"
            >
              <Checkbox
                checked={(config.members || []).includes(approver.id)}
                onCheckedChange={() => toggleMember(approver.id)}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{approver.name}</p>
                <p className="text-xs text-muted-foreground truncate">{approver.designation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Approval Rule</Label>
        <Select 
          value={config.approvalRule || 'all'} 
          onValueChange={(value: 'all' | 'majority' | 'any') => 
            onConfigChange({ ...config, approvalRule: value })
          }
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card">
            <SelectItem value="all">All Must Approve</SelectItem>
            <SelectItem value="majority">Majority (50%+)</SelectItem>
            <SelectItem value="any">Any One</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-xs">Signature Required</Label>
        <Switch
          checked={config.signatureRequired || false}
          onCheckedChange={(checked) => onConfigChange({ ...config, signatureRequired: checked })}
        />
      </div>
    </div>
  );
}

// Condition Step Configuration
function ConditionStepConfig({ 
  step, 
  onConfigChange 
}: { 
  step: WorkflowStep; 
  onConfigChange: (config: ConditionConfig) => void;
}) {
  const config = (step.config as ConditionConfig) || {
    field: 'amount',
    operator: 'greater_than',
    value: '',
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs">Field</Label>
        <Select 
          value={config.field || 'amount'} 
          onValueChange={(value) => onConfigChange({ ...config, field: value })}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card">
            <SelectItem value="amount">Amount</SelectItem>
            <SelectItem value="department">Department</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="category">Category</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Operator</Label>
        <Select 
          value={config.operator || 'greater_than'} 
          onValueChange={(value: ConditionConfig['operator']) => 
            onConfigChange({ ...config, operator: value })
          }
        >
          <SelectTrigger className="h-9">
            <SelectValue />
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
        <Label className="text-xs">Value</Label>
        <Input
          value={config.value || ''}
          onChange={(e) => onConfigChange({ ...config, value: e.target.value })}
          placeholder="Enter value"
          className="h-9"
        />
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs text-chart-1">Yes Path</Label>
          <div className="h-9 border border-chart-1/30 bg-chart-1/10 rounded-md flex items-center justify-center text-xs text-chart-1">
            Continue
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-destructive">No Path</Label>
          <div className="h-9 border border-destructive/30 bg-destructive/10 rounded-md flex items-center justify-center text-xs text-destructive">
            Alternative
          </div>
        </div>
      </div>
    </div>
  );
}

// Notification Step Configuration
function NotificationStepConfig({ 
  step, 
  onConfigChange 
}: { 
  step: WorkflowStep; 
  onConfigChange: (config: NotificationConfig) => void;
}) {
  const config = (step.config as NotificationConfig) || {
    trigger: 'on_submit',
    channel: 'email',
    recipients: [],
    messageTemplate: '',
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs">Trigger</Label>
        <Select 
          value={config.trigger || 'on_submit'} 
          onValueChange={(value: NotificationConfig['trigger']) => 
            onConfigChange({ ...config, trigger: value })
          }
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card">
            <SelectItem value="on_submit">On Submit</SelectItem>
            <SelectItem value="on_approve">On Approve</SelectItem>
            <SelectItem value="on_reject">On Reject</SelectItem>
            <SelectItem value="on_complete">On Complete</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Channel</Label>
        <Select 
          value={config.channel || 'email'} 
          onValueChange={(value: NotificationConfig['channel']) => 
            onConfigChange({ ...config, channel: value })
          }
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card">
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="in_app">In-App</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Message Template</Label>
        <Textarea
          value={config.messageTemplate || ''}
          onChange={(e) => onConfigChange({ ...config, messageTemplate: e.target.value })}
          placeholder="Enter notification message..."
          className="min-h-[80px] resize-none text-sm"
        />
      </div>
    </div>
  );
}
