export interface PRFormData {
  id?: string;
  prNumber?: string;
  title: string;
  department: string;
  category: string;
  items: PRItem[];
  justification: string;
  suggestedVendor?: string;
  estimatedCost: number;
  currency: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requiredDate?: Date;
  attachments: Attachment[];
  status: 'draft' | 'pending' | 'in_progress' | 'approved' | 'rejected' | 'cancelled';
  createdAt?: Date;
  createdBy?: string;
}

export interface PRItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  specifications?: string;
}

export interface MemoFormData {
  id?: string;
  memoNumber?: string;
  subject: string;
  addressedTo: string;
  addressedToDesignation?: string;
  from: string;
  fromDesignation?: string;
  department: string;
  referenceNumber?: string;
  body: string;
  priority: 'normal' | 'urgent' | 'confidential';
  attachments: Attachment[];
  status: 'draft' | 'pending' | 'in_progress' | 'approved' | 'rejected' | 'cancelled';
  createdAt?: Date;
  createdBy?: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface WorkflowNode {
  id: string;
  type: 'start' | 'approval' | 'committee' | 'condition' | 'notification' | 'end';
  label: string;
  position: { x: number; y: number };
  config?: ApprovalConfig | ConditionConfig | NotificationConfig;
}

export interface ApprovalConfig {
  approvers: Approver[];
  requireAll: boolean;
  signatureRequired: boolean;
  timeLimit?: number;
  escalationTo?: string;
}

export interface Approver {
  id: string;
  name: string;
  designation: string;
  department: string;
}

export interface ConditionConfig {
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains';
  value: string | number;
}

export interface NotificationConfig {
  type: 'email' | 'sms' | 'in_app';
  recipients: string[];
  template: string;
}

export interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  type: 'pr' | 'memo' | 'custom';
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  status: 'draft' | 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}
