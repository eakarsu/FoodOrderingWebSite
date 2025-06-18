// Workflow Automation and Cross-Platform Integration
import { SECTORS } from './sectors';

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'notification' | 'data_entry' | 'api_call' | 'condition' | 'delay';
  config: Record<string, any>;
  nextSteps: string[];
  conditions?: WorkflowCondition[];
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  sectorId: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  isActive: boolean;
}

export interface WorkflowTrigger {
  type: 'manual' | 'scheduled' | 'event' | 'api_webhook';
  config: Record<string, any>;
}

export interface WorkflowExecution {
  id: string;
  templateId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  currentStep: string;
  data: Record<string, any>;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface IntegrationConfig {
  platform: string;
  apiKey: string;
  baseUrl: string;
  authType: 'api_key' | 'oauth' | 'basic_auth';
  credentials: Record<string, string>;
}

// Workflow Automation Engine
export class WorkflowAutomationEngine {
  private executions: Map<string, WorkflowExecution> = new Map();
  private templates: Map<string, WorkflowTemplate> = new Map();
  private integrations: Map<string, IntegrationConfig> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
  }

  // Template Management
  async createTemplate(template: Omit<WorkflowTemplate, 'id'>): Promise<WorkflowTemplate> {
    const newTemplate: WorkflowTemplate = {
      ...template,
      id: `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    this.templates.set(newTemplate.id, newTemplate);
    return newTemplate;
  }

  async getTemplate(templateId: string): Promise<WorkflowTemplate | undefined> {
    return this.templates.get(templateId);
  }

  async getTemplatesBySector(sectorId: string): Promise<WorkflowTemplate[]> {
    return Array.from(this.templates.values()).filter(t => t.sectorId === sectorId);
  }

  // Workflow Execution
  async executeWorkflow(templateId: string, initialData: Record<string, any>): Promise<WorkflowExecution> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const execution: WorkflowExecution = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      templateId,
      status: 'running',
      currentStep: template.steps[0]?.id || '',
      data: { ...initialData },
      startedAt: new Date()
    };

    this.executions.set(execution.id, execution);
    
    try {
      await this.processWorkflowStep(execution, template.steps[0]);
      return execution;
    } catch (error) {
      execution.status = 'failed';
      execution.error = error instanceof Error ? error.message : 'Unknown error';
      execution.completedAt = new Date();
      return execution;
    }
  }

  private async processWorkflowStep(execution: WorkflowExecution, step: WorkflowStep): Promise<void> {
    const template = this.templates.get(execution.templateId);
    if (!template) return;

    // Check conditions
    if (step.conditions && !this.evaluateConditions(step.conditions, execution.data)) {
      await this.moveToNextStep(execution, step, template);
      return;
    }

    try {
      switch (step.type) {
        case 'approval':
          await this.handleApprovalStep(execution, step);
          break;
        case 'notification':
          await this.handleNotificationStep(execution, step);
          break;
        case 'data_entry':
          await this.handleDataEntryStep(execution, step);
          break;
        case 'api_call':
          await this.handleApiCallStep(execution, step);
          break;
        case 'delay':
          await this.handleDelayStep(execution, step);
          break;
        default:
          console.warn(`Unknown step type: ${step.type}`);
      }

      await this.moveToNextStep(execution, step, template);
    } catch (error) {
      execution.status = 'failed';
      execution.error = error instanceof Error ? error.message : 'Step execution failed';
      execution.completedAt = new Date();
    }
  }

  private async moveToNextStep(execution: WorkflowExecution, currentStep: WorkflowStep, template: WorkflowTemplate): Promise<void> {
    if (currentStep.nextSteps.length === 0) {
      // Workflow completed
      execution.status = 'completed';
      execution.completedAt = new Date();
      return;
    }

    // For simplicity, take the first next step
    const nextStepId = currentStep.nextSteps[0];
    const nextStep = template.steps.find(s => s.id === nextStepId);
    
    if (nextStep) {
      execution.currentStep = nextStepId;
      await this.processWorkflowStep(execution, nextStep);
    } else {
      execution.status = 'completed';
      execution.completedAt = new Date();
    }
  }

  private evaluateConditions(conditions: WorkflowCondition[], data: Record<string, any>): boolean {
    return conditions.every(condition => {
      const fieldValue = data[condition.field];
      
      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value;
        case 'not_equals':
          return fieldValue !== condition.value;
        case 'greater_than':
          return Number(fieldValue) > Number(condition.value);
        case 'less_than':
          return Number(fieldValue) < Number(condition.value);
        case 'contains':
          return String(fieldValue).includes(String(condition.value));
        default:
          return false;
      }
    });
  }

  // Step Handlers
  private async handleApprovalStep(execution: WorkflowExecution, step: WorkflowStep): Promise<void> {
    // In a real implementation, this would send approval requests
    console.log(`Approval step: ${step.name}`, step.config);
    
    // Simulate approval process
    execution.data.approvalStatus = 'pending';
    execution.data.approvalRequestedAt = new Date().toISOString();
    
    // For demo purposes, auto-approve after a short delay
    setTimeout(() => {
      execution.data.approvalStatus = 'approved';
      execution.data.approvedAt = new Date().toISOString();
    }, 1000);
  }

  private async handleNotificationStep(execution: WorkflowExecution, step: WorkflowStep): Promise<void> {
    const { recipients, message, channel } = step.config;
    
    console.log(`Sending notification via ${channel}:`, {
      recipients,
      message: this.interpolateMessage(message, execution.data)
    });

    // Simulate notification sending
    execution.data.notificationsSent = (execution.data.notificationsSent || 0) + 1;
  }

  private async handleDataEntryStep(execution: WorkflowExecution, step: WorkflowStep): Promise<void> {
    const { fields, source } = step.config;
    
    // Simulate data entry from various sources
    if (source === 'user_input') {
      // In real implementation, this would pause for user input
      execution.status = 'paused';
    } else if (source === 'api') {
      // Fetch data from API
      const apiData = await this.fetchDataFromAPI(step.config.apiEndpoint);
      Object.assign(execution.data, apiData);
    }
  }

  private async handleApiCallStep(execution: WorkflowExecution, step: WorkflowStep): Promise<void> {
    const { endpoint, method, headers, body } = step.config;
    
    try {
      const response = await fetch(endpoint, {
        method: method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(this.interpolateData(body, execution.data)) : undefined
      });

      const responseData = await response.json();
      execution.data.apiResponse = responseData;
      execution.data.apiCallSuccess = response.ok;
    } catch (error) {
      execution.data.apiCallSuccess = false;
      execution.data.apiError = error instanceof Error ? error.message : 'API call failed';
    }
  }

  private async handleDelayStep(execution: WorkflowExecution, step: WorkflowStep): Promise<void> {
    const { duration } = step.config;
    
    return new Promise(resolve => {
      setTimeout(resolve, duration * 1000); // duration in seconds
    });
  }

  // Utility Methods
  private interpolateMessage(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  private interpolateData(obj: any, data: Record<string, any>): any {
    if (typeof obj === 'string') {
      return this.interpolateMessage(obj, data);
    } else if (Array.isArray(obj)) {
      return obj.map(item => this.interpolateData(item, data));
    } else if (typeof obj === 'object' && obj !== null) {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = this.interpolateData(value, data);
      }
      return result;
    }
    return obj;
  }

  private async fetchDataFromAPI(endpoint: string): Promise<Record<string, any>> {
    // Simulate API data fetching
    return {
      timestamp: new Date().toISOString(),
      source: 'external_api',
      data: { status: 'success' }
    };
  }

  // Integration Management
  async addIntegration(platform: string, config: IntegrationConfig): Promise<void> {
    this.integrations.set(platform, config);
  }

  async getIntegration(platform: string): Promise<IntegrationConfig | undefined> {
    return this.integrations.get(platform);
  }

  // Default Templates
  private initializeDefaultTemplates(): void {
    // Expense Approval Workflow
    const expenseApprovalTemplate: WorkflowTemplate = {
      id: 'expense_approval',
      name: 'Expense Approval Process',
      description: 'Automated expense report approval workflow',
      sectorId: 'financial_services',
      trigger: {
        type: 'event',
        config: { event: 'expense_submitted' }
      },
      steps: [
        {
          id: 'validate_expense',
          name: 'Validate Expense Data',
          type: 'condition',
          config: { validation_rules: ['amount_limit', 'receipt_required'] },
          nextSteps: ['manager_approval'],
          conditions: [
            { field: 'amount', operator: 'less_than', value: 1000 }
          ]
        },
        {
          id: 'manager_approval',
          name: 'Manager Approval',
          type: 'approval',
          config: { 
            approver_role: 'manager',
            timeout_hours: 48,
            escalation_enabled: true
          },
          nextSteps: ['finance_review']
        },
        {
          id: 'finance_review',
          name: 'Finance Department Review',
          type: 'approval',
          config: { 
            approver_role: 'finance',
            auto_approve_threshold: 500
          },
          nextSteps: ['payment_processing']
        },
        {
          id: 'payment_processing',
          name: 'Process Payment',
          type: 'api_call',
          config: {
            endpoint: '/api/payments/process',
            method: 'POST',
            body: {
              amount: '{{amount}}',
              recipient: '{{employee_id}}',
              reference: '{{expense_id}}'
            }
          },
          nextSteps: ['notification']
        },
        {
          id: 'notification',
          name: 'Send Completion Notification',
          type: 'notification',
          config: {
            recipients: ['{{employee_email}}', '{{manager_email}}'],
            message: 'Expense report {{expense_id}} has been processed and payment initiated.',
            channel: 'email'
          },
          nextSteps: []
        }
      ],
      isActive: true
    };

    // Appointment Scheduling Workflow
    const appointmentSchedulingTemplate: WorkflowTemplate = {
      id: 'appointment_scheduling',
      name: 'Smart Appointment Scheduling',
      description: 'AI-powered appointment scheduling with conflict resolution',
      sectorId: 'healthcare',
      trigger: {
        type: 'event',
        config: { event: 'appointment_requested' }
      },
      steps: [
        {
          id: 'check_availability',
          name: 'Check Provider Availability',
          type: 'api_call',
          config: {
            endpoint: '/api/calendar/availability',
            method: 'GET'
          },
          nextSteps: ['conflict_resolution']
        },
        {
          id: 'conflict_resolution',
          name: 'Resolve Scheduling Conflicts',
          type: 'condition',
          config: { ai_optimization: true },
          nextSteps: ['book_appointment'],
          conditions: [
            { field: 'conflicts_found', operator: 'equals', value: false }
          ]
        },
        {
          id: 'book_appointment',
          name: 'Book Appointment',
          type: 'api_call',
          config: {
            endpoint: '/api/appointments/create',
            method: 'POST',
            body: {
              patient_id: '{{patient_id}}',
              provider_id: '{{provider_id}}',
              datetime: '{{selected_datetime}}',
              type: '{{appointment_type}}'
            }
          },
          nextSteps: ['send_confirmations']
        },
        {
          id: 'send_confirmations',
          name: 'Send Appointment Confirmations',
          type: 'notification',
          config: {
            recipients: ['{{patient_email}}', '{{provider_email}}'],
            message: 'Appointment confirmed for {{selected_datetime}} with {{provider_name}}.',
            channel: 'email_and_sms'
          },
          nextSteps: ['schedule_reminders']
        },
        {
          id: 'schedule_reminders',
          name: 'Schedule Appointment Reminders',
          type: 'delay',
          config: {
            duration: 86400, // 24 hours before
            action: 'send_reminder'
          },
          nextSteps: []
        }
      ],
      isActive: true
    };

    this.templates.set(expenseApprovalTemplate.id, expenseApprovalTemplate);
    this.templates.set(appointmentSchedulingTemplate.id, appointmentSchedulingTemplate);
  }

  // Execution Management
  async getExecution(executionId: string): Promise<WorkflowExecution | undefined> {
    return this.executions.get(executionId);
  }

  async getExecutionsByTemplate(templateId: string): Promise<WorkflowExecution[]> {
    return Array.from(this.executions.values()).filter(e => e.templateId === templateId);
  }

  async pauseExecution(executionId: string): Promise<void> {
    const execution = this.executions.get(executionId);
    if (execution && execution.status === 'running') {
      execution.status = 'paused';
    }
  }

  async resumeExecution(executionId: string): Promise<void> {
    const execution = this.executions.get(executionId);
    if (execution && execution.status === 'paused') {
      execution.status = 'running';
      const template = this.templates.get(execution.templateId);
      if (template) {
        const currentStep = template.steps.find(s => s.id === execution.currentStep);
        if (currentStep) {
          await this.processWorkflowStep(execution, currentStep);
        }
      }
    }
  }
}

// Cross-Platform Integration Manager
export class CrossPlatformIntegrationManager {
  private integrations: Map<string, any> = new Map();

  // Calendar Integration
  async integrateCalendar(platform: 'google' | 'outlook' | 'apple', credentials: any): Promise<void> {
    const integration = {
      platform,
      credentials,
      syncEnabled: true,
      lastSync: new Date()
    };
    
    this.integrations.set(`calendar_${platform}`, integration);
  }

  async syncCalendarEvents(platform: string): Promise<any[]> {
    // Simulate calendar sync
    return [
      {
        id: 'cal_1',
        title: 'Team Meeting',
        start: new Date(),
        end: new Date(Date.now() + 3600000),
        platform
      }
    ];
  }

  // CRM Integration
  async integrateCRM(platform: 'salesforce' | 'hubspot' | 'pipedrive', credentials: any): Promise<void> {
    const integration = {
      platform,
      credentials,
      syncEnabled: true,
      lastSync: new Date()
    };
    
    this.integrations.set(`crm_${platform}`, integration);
  }

  async syncCRMContacts(platform: string): Promise<any[]> {
    // Simulate CRM contact sync
    return [
      {
        id: 'contact_1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        platform
      }
    ];
  }

  // Email Integration
  async integrateEmail(platform: 'gmail' | 'outlook' | 'yahoo', credentials: any): Promise<void> {
    const integration = {
      platform,
      credentials,
      syncEnabled: true,
      lastSync: new Date()
    };
    
    this.integrations.set(`email_${platform}`, integration);
  }

  async syncEmails(platform: string, folder: string = 'inbox'): Promise<any[]> {
    // Simulate email sync
    return [
      {
        id: 'email_1',
        subject: 'Meeting Request',
        from: 'client@example.com',
        body: 'Can we schedule a meeting?',
        received: new Date(),
        platform
      }
    ];
  }

  // Project Management Integration
  async integrateProjectManagement(platform: 'asana' | 'trello' | 'jira', credentials: any): Promise<void> {
    const integration = {
      platform,
      credentials,
      syncEnabled: true,
      lastSync: new Date()
    };
    
    this.integrations.set(`pm_${platform}`, integration);
  }

  async syncTasks(platform: string): Promise<any[]> {
    // Simulate task sync
    return [
      {
        id: 'task_1',
        title: 'Complete project proposal',
        status: 'in_progress',
        assignee: 'user@example.com',
        dueDate: new Date(Date.now() + 86400000),
        platform
      }
    ];
  }

  // Communication Platform Integration
  async integrateCommunication(platform: 'slack' | 'teams' | 'discord', credentials: any): Promise<void> {
    const integration = {
      platform,
      credentials,
      syncEnabled: true,
      lastSync: new Date()
    };
    
    this.integrations.set(`comm_${platform}`, integration);
  }

  async sendMessage(platform: string, channel: string, message: string): Promise<void> {
    console.log(`Sending message to ${platform} channel ${channel}: ${message}`);
    // Simulate message sending
  }

  // Document Storage Integration
  async integrateDocumentStorage(platform: 'gdrive' | 'onedrive' | 'dropbox', credentials: any): Promise<void> {
    const integration = {
      platform,
      credentials,
      syncEnabled: true,
      lastSync: new Date()
    };
    
    this.integrations.set(`docs_${platform}`, integration);
  }

  async syncDocuments(platform: string): Promise<any[]> {
    // Simulate document sync
    return [
      {
        id: 'doc_1',
        name: 'Project Proposal.docx',
        type: 'document',
        size: 1024000,
        modified: new Date(),
        platform
      }
    ];
  }

  // Get Integration Status
  getIntegrationStatus(): Record<string, any> {
    const status: Record<string, any> = {};
    
    for (const [key, integration] of this.integrations) {
      status[key] = {
        platform: integration.platform,
        connected: true,
        lastSync: integration.lastSync,
        syncEnabled: integration.syncEnabled
      };
    }
    
    return status;
  }
}

// Export instances
export const workflowEngine = new WorkflowAutomationEngine();
export const integrationManager = new CrossPlatformIntegrationManager();
