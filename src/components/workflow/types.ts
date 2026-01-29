export interface WorkflowStep {
  id: string;
  type: 'start' | 'approval' | 'committee' | 'condition' | 'notification' | 'end';
  label: string;
  config?: ApprovalConfig | CommitteeConfig | ConditionConfig | NotificationConfig;
}

export interface ApprovalConfig {
  approverType: 'specific' | 'role' | 'department_head';
  approvers: string[];
  executionMode: 'sequential' | 'parallel';
  slaHours: number;
  escalationTo?: string;
  signatureRequired: boolean;
  attachmentRule: 'optional' | 'required' | 'none';
}

export interface CommitteeConfig {
  members: string[];
  approvalRule: 'all' | 'majority' | 'any';
  signatureRequired: boolean;
}

export interface ConditionConfig {
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains';
  value: string;
  yesPath?: string;
  noPath?: string;
}

export interface NotificationConfig {
  trigger: 'on_submit' | 'on_approve' | 'on_reject' | 'on_complete';
  channel: 'email' | 'sms' | 'in_app';
  recipients: string[];
  messageTemplate: string;
}

export interface WorkflowSettings {
  name: string;
  appliesTo: 'pr' | 'memo';
  departmentScope: string;
  description: string;
}

export interface StepTemplate {
  type: WorkflowStep['type'];
  label: string;
  icon: string;
  description: string;
}

export const mockApprovers = [
  { id: '1', name: 'Sarah Johnson', designation: 'Department Head', department: 'Finance' },
  { id: '2', name: 'Michael Chen', designation: 'General Manager', department: 'Operations' },
  { id: '3', name: 'Emily Brown', designation: 'CFO', department: 'Executive' },
  { id: '4', name: 'David Wilson', designation: 'Procurement Manager', department: 'Procurement' },
  { id: '5', name: 'Lisa Anderson', designation: 'IT Director', department: 'IT' },
];

export const departments = [
  'All Departments',
  'Finance',
  'Operations',
  'Procurement',
  'IT',
  'HR',
  'Executive',
];
