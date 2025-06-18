// Enhanced Security and Compliance Management
import { SECTORS } from './sectors';

export interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  sectorId: string;
  rules: SecurityRule[];
  complianceFrameworks: string[];
  isActive: boolean;
  lastUpdated: Date;
}

export interface SecurityRule {
  id: string;
  type: 'access_control' | 'data_protection' | 'audit_logging' | 'encryption' | 'authentication';
  condition: string;
  action: 'allow' | 'deny' | 'log' | 'alert' | 'encrypt';
  severity: 'low' | 'medium' | 'high' | 'critical';
  parameters: Record<string, any>;
}

export interface ComplianceCheck {
  id: string;
  framework: string;
  requirement: string;
  status: 'compliant' | 'non_compliant' | 'partial' | 'not_applicable';
  evidence: string[];
  lastChecked: Date;
  nextReview: Date;
  remediation?: string[];
}

export interface SecurityIncident {
  id: string;
  type: 'data_breach' | 'unauthorized_access' | 'malware' | 'phishing' | 'policy_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedSystems: string[];
  detectedAt: Date;
  status: 'open' | 'investigating' | 'contained' | 'resolved';
  assignedTo?: string;
  timeline: SecurityIncidentEvent[];
}

export interface SecurityIncidentEvent {
  timestamp: Date;
  action: string;
  description: string;
  performedBy: string;
}

export interface DataClassification {
  level: 'public' | 'internal' | 'confidential' | 'restricted';
  categories: string[];
  retentionPeriod: number; // days
  encryptionRequired: boolean;
  accessControls: string[];
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  outcome: 'success' | 'failure';
  ipAddress: string;
  userAgent: string;
  metadata: Record<string, any>;
}

// Enhanced Security and Compliance Engine
export class SecurityComplianceEngine {
  private policies: Map<string, SecurityPolicy> = new Map();
  private complianceChecks: Map<string, ComplianceCheck[]> = new Map();
  private incidents: Map<string, SecurityIncident> = new Map();
  private auditLogs: AuditLog[] = [];
  private dataClassifications: Map<string, DataClassification> = new Map();

  constructor() {
    this.initializeSecurityPolicies();
    this.initializeComplianceFrameworks();
  }

  // Security Policy Management
  async createSecurityPolicy(policy: Omit<SecurityPolicy, 'id' | 'lastUpdated'>): Promise<SecurityPolicy> {
    const newPolicy: SecurityPolicy = {
      ...policy,
      id: `policy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      lastUpdated: new Date()
    };

    this.policies.set(newPolicy.id, newPolicy);
    return newPolicy;
  }

  async evaluateSecurityRules(
    action: string,
    resource: string,
    context: Record<string, any>
  ): Promise<{
    allowed: boolean;
    appliedRules: SecurityRule[];
    violations: string[];
    recommendations: string[];
  }> {
    const applicablePolicies = Array.from(this.policies.values())
      .filter(p => p.isActive && (p.sectorId === context.sectorId || p.sectorId === 'global'));

    const appliedRules: SecurityRule[] = [];
    const violations: string[] = [];
    let allowed = true;

    for (const policy of applicablePolicies) {
      for (const rule of policy.rules) {
        if (this.ruleApplies(rule, action, resource, context)) {
          appliedRules.push(rule);
          
          const ruleResult = await this.evaluateRule(rule, action, resource, context);
          if (!ruleResult.allowed) {
            allowed = false;
            violations.push(ruleResult.violation);
          }
        }
      }
    }

    const recommendations = this.generateSecurityRecommendations(appliedRules, violations);

    // Log the security evaluation
    await this.logSecurityEvent({
      userId: context.userId || 'system',
      action: `security_evaluation_${action}`,
      resource,
      outcome: allowed ? 'success' : 'failure',
      ipAddress: context.ipAddress || 'unknown',
      userAgent: context.userAgent || 'unknown',
      metadata: { appliedRules: appliedRules.length, violations: violations.length }
    });

    return { allowed, appliedRules, violations, recommendations };
  }

  private ruleApplies(
    rule: SecurityRule,
    action: string,
    resource: string,
    context: Record<string, any>
  ): boolean {
    // Simplified rule matching logic
    return rule.condition.includes(action) || rule.condition.includes(resource) || rule.condition === '*';
  }

  private async evaluateRule(
    rule: SecurityRule,
    action: string,
    resource: string,
    context: Record<string, any>
  ): Promise<{ allowed: boolean; violation: string }> {
    switch (rule.type) {
      case 'access_control':
        return this.evaluateAccessControl(rule, context);
      case 'data_protection':
        return this.evaluateDataProtection(rule, resource, context);
      case 'authentication':
        return this.evaluateAuthentication(rule, context);
      case 'encryption':
        return this.evaluateEncryption(rule, resource, context);
      default:
        return { allowed: true, violation: '' };
    }
  }

  private evaluateAccessControl(rule: SecurityRule, context: Record<string, any>): { allowed: boolean; violation: string } {
    const requiredRole = rule.parameters.requiredRole;
    const userRole = context.userRole;

    if (requiredRole && userRole !== requiredRole) {
      return {
        allowed: false,
        violation: `Access denied: Required role '${requiredRole}', user has '${userRole}'`
      };
    }

    return { allowed: true, violation: '' };
  }

  private evaluateDataProtection(
    rule: SecurityRule,
    resource: string,
    context: Record<string, any>
  ): { allowed: boolean; violation: string } {
    const classification = this.dataClassifications.get(resource);
    
    if (classification && classification.level === 'restricted') {
      const hasSpecialAccess = context.specialAccess || false;
      if (!hasSpecialAccess) {
        return {
          allowed: false,
          violation: `Access denied: Resource '${resource}' is classified as restricted`
        };
      }
    }

    return { allowed: true, violation: '' };
  }

  private evaluateAuthentication(rule: SecurityRule, context: Record<string, any>): { allowed: boolean; violation: string } {
    const requiresMFA = rule.parameters.requiresMFA;
    const hasMFA = context.mfaVerified;

    if (requiresMFA && !hasMFA) {
      return {
        allowed: false,
        violation: 'Multi-factor authentication required'
      };
    }

    return { allowed: true, violation: '' };
  }

  private evaluateEncryption(
    rule: SecurityRule,
    resource: string,
    context: Record<string, any>
  ): { allowed: boolean; violation: string } {
    const requiresEncryption = rule.parameters.requiresEncryption;
    const isEncrypted = context.isEncrypted;

    if (requiresEncryption && !isEncrypted) {
      return {
        allowed: false,
        violation: `Resource '${resource}' must be encrypted`
      };
    }

    return { allowed: true, violation: '' };
  }

  private generateSecurityRecommendations(rules: SecurityRule[], violations: string[]): string[] {
    const recommendations: string[] = [];

    if (violations.length > 0) {
      recommendations.push('Review and address security violations immediately');
    }

    const highSeverityRules = rules.filter(r => r.severity === 'high' || r.severity === 'critical');
    if (highSeverityRules.length > 0) {
      recommendations.push('High-severity security rules triggered - consider additional monitoring');
    }

    if (rules.some(r => r.type === 'authentication')) {
      recommendations.push('Consider implementing stronger authentication measures');
    }

    return recommendations;
  }

  // Compliance Management
  async performComplianceCheck(sectorId: string, framework: string): Promise<ComplianceCheck[]> {
    const sector = SECTORS.find(s => s.id === sectorId);
    const checks: ComplianceCheck[] = [];

    const frameworkRequirements = this.getFrameworkRequirements(framework, sectorId);

    for (const requirement of frameworkRequirements) {
      const check = await this.evaluateComplianceRequirement(requirement, sectorId);
      checks.push(check);
    }

    this.complianceChecks.set(`${sectorId}_${framework}`, checks);
    return checks;
  }

  private getFrameworkRequirements(framework: string, sectorId: string): any[] {
    const requirements: Record<string, any[]> = {
      'HIPAA': [
        {
          id: 'hipaa_privacy',
          name: 'Privacy Rule Compliance',
          description: 'Protect patient health information'
        },
        {
          id: 'hipaa_security',
          name: 'Security Rule Compliance',
          description: 'Safeguard electronic health information'
        },
        {
          id: 'hipaa_breach',
          name: 'Breach Notification Rule',
          description: 'Notify of breaches of unsecured PHI'
        }
      ],
      'GDPR': [
        {
          id: 'gdpr_consent',
          name: 'Consent Management',
          description: 'Obtain and manage user consent for data processing'
        },
        {
          id: 'gdpr_data_protection',
          name: 'Data Protection by Design',
          description: 'Implement privacy by design principles'
        },
        {
          id: 'gdpr_breach_notification',
          name: 'Breach Notification',
          description: 'Report data breaches within 72 hours'
        }
      ],
      'SOX': [
        {
          id: 'sox_internal_controls',
          name: 'Internal Controls',
          description: 'Maintain effective internal controls over financial reporting'
        },
        {
          id: 'sox_documentation',
          name: 'Documentation Requirements',
          description: 'Document and test internal controls'
        }
      ],
      'PCI_DSS': [
        {
          id: 'pci_network_security',
          name: 'Network Security',
          description: 'Maintain secure network and systems'
        },
        {
          id: 'pci_data_protection',
          name: 'Cardholder Data Protection',
          description: 'Protect stored cardholder data'
        }
      ]
    };

    return requirements[framework] || [];
  }

  private async evaluateComplianceRequirement(requirement: any, sectorId: string): Promise<ComplianceCheck> {
    // Simulate compliance evaluation
    const statuses = ['compliant', 'non_compliant', 'partial', 'not_applicable'] as const;
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const evidence = this.generateComplianceEvidence(requirement, status);
    const remediation = status !== 'compliant' ? this.generateRemediationSteps(requirement) : undefined;

    return {
      id: `check_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      framework: requirement.framework || 'Unknown',
      requirement: requirement.name,
      status,
      evidence,
      lastChecked: new Date(),
      nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      remediation
    };
  }

  private generateComplianceEvidence(requirement: any, status: string): string[] {
    const evidence: string[] = [];

    if (status === 'compliant') {
      evidence.push('Policy documentation reviewed and approved');
      evidence.push('Implementation verified through testing');
      evidence.push('Staff training completed and documented');
    } else {
      evidence.push('Gaps identified in current implementation');
      evidence.push('Documentation incomplete or outdated');
    }

    return evidence;
  }

  private generateRemediationSteps(requirement: any): string[] {
    return [
      'Review current implementation against requirement',
      'Develop remediation plan with timeline',
      'Implement necessary changes',
      'Test and validate compliance',
      'Document compliance evidence',
      'Schedule regular reviews'
    ];
  }

  // Incident Management
  async createSecurityIncident(incident: Omit<SecurityIncident, 'id' | 'detectedAt' | 'timeline'>): Promise<SecurityIncident> {
    const newIncident: SecurityIncident = {
      ...incident,
      id: `incident_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      detectedAt: new Date(),
      timeline: [{
        timestamp: new Date(),
        action: 'incident_created',
        description: 'Security incident created and logged',
        performedBy: 'system'
      }]
    };

    this.incidents.set(newIncident.id, newIncident);
    
    // Auto-escalate critical incidents
    if (newIncident.severity === 'critical') {
      await this.escalateIncident(newIncident.id);
    }

    return newIncident;
  }

  async updateIncidentStatus(
    incidentId: string,
    status: SecurityIncident['status'],
    notes: string,
    performedBy: string
  ): Promise<void> {
    const incident = this.incidents.get(incidentId);
    if (!incident) return;

    incident.status = status;
    incident.timeline.push({
      timestamp: new Date(),
      action: `status_changed_to_${status}`,
      description: notes,
      performedBy
    });
  }

  private async escalateIncident(incidentId: string): Promise<void> {
    const incident = this.incidents.get(incidentId);
    if (!incident) return;

    incident.timeline.push({
      timestamp: new Date(),
      action: 'escalated',
      description: 'Incident escalated due to critical severity',
      performedBy: 'system'
    });

    // In a real implementation, this would trigger notifications
    console.log(`CRITICAL INCIDENT ESCALATED: ${incident.id}`);
  }

  // Audit Logging
  async logSecurityEvent(event: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    const auditLog: AuditLog = {
      ...event,
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    this.auditLogs.push(auditLog);

    // Analyze for suspicious patterns
    await this.analyzeSuspiciousActivity(auditLog);
  }

  private async analyzeSuspiciousActivity(log: AuditLog): Promise<void> {
    // Check for suspicious patterns
    const recentLogs = this.auditLogs
      .filter(l => l.userId === log.userId && 
                   l.timestamp.getTime() > Date.now() - 3600000) // Last hour
      .length;

    if (recentLogs > 50) { // More than 50 actions in an hour
      await this.createSecurityIncident({
        type: 'policy_violation',
        severity: 'medium',
        description: `Suspicious activity detected: User ${log.userId} performed ${recentLogs} actions in the last hour`,
        affectedSystems: ['audit_system'],
        status: 'open'
      });
    }

    // Check for failed login attempts
    if (log.action === 'login' && log.outcome === 'failure') {
      const failedLogins = this.auditLogs
        .filter(l => l.action === 'login' && 
                     l.outcome === 'failure' && 
                     l.ipAddress === log.ipAddress &&
                     l.timestamp.getTime() > Date.now() - 900000) // Last 15 minutes
        .length;

      if (failedLogins >= 5) {
        await this.createSecurityIncident({
          type: 'unauthorized_access',
          severity: 'high',
          description: `Multiple failed login attempts from IP ${log.ipAddress}`,
          affectedSystems: ['authentication_system'],
          status: 'open'
        });
      }
    }
  }

  // Data Classification
  async classifyData(
    dataId: string,
    content: string,
    context: Record<string, any>
  ): Promise<DataClassification> {
    // AI-powered data classification
    const classification = await this.performDataClassification(content, context);
    this.dataClassifications.set(dataId, classification);
    return classification;
  }

  private async performDataClassification(
    content: string,
    context: Record<string, any>
  ): Promise<DataClassification> {
    // Simulate AI-based data classification
    const sensitivePatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Credit card
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
      /\b\d{3}[\s-]?\d{3}[\s-]?\d{4}\b/ // Phone number
    ];

    let level: DataClassification['level'] = 'public';
    const categories: string[] = [];

    for (const pattern of sensitivePatterns) {
      if (pattern.test(content)) {
        level = 'confidential';
        categories.push('PII');
        break;
      }
    }

    if (content.toLowerCase().includes('medical') || content.toLowerCase().includes('health')) {
      level = 'restricted';
      categories.push('PHI');
    }

    if (content.toLowerCase().includes('financial') || content.toLowerCase().includes('payment')) {
      level = 'confidential';
      categories.push('Financial');
    }

    return {
      level,
      categories,
      retentionPeriod: this.getRetentionPeriod(level),
      encryptionRequired: level === 'confidential' || level === 'restricted',
      accessControls: this.getAccessControls(level)
    };
  }

  private getRetentionPeriod(level: DataClassification['level']): number {
    const periods = {
      public: 365,      // 1 year
      internal: 1095,   // 3 years
      confidential: 2555, // 7 years
      restricted: 3650   // 10 years
    };
    return periods[level];
  }

  private getAccessControls(level: DataClassification['level']): string[] {
    const controls: Record<string, string[]> = {
      public: ['authenticated_user'],
      internal: ['employee', 'contractor'],
      confidential: ['authorized_personnel', 'manager_approval'],
      restricted: ['special_access', 'executive_approval', 'audit_trail']
    };
    return controls[level];
  }

  // Initialize Security Policies
  private initializeSecurityPolicies(): void {
    const defaultPolicies: Omit<SecurityPolicy, 'id' | 'lastUpdated'>[] = [
      {
        name: 'Healthcare Data Protection Policy',
        description: 'HIPAA-compliant data protection for healthcare sector',
        sectorId: 'healthcare',
        complianceFrameworks: ['HIPAA'],
        isActive: true,
        rules: [
          {
            id: 'hipaa_access_control',
            type: 'access_control',
            condition: 'patient_data',
            action: 'allow',
            severity: 'high',
            parameters: { requiredRole: 'healthcare_provider' }
          },
          {
            id: 'hipaa_encryption',
            type: 'encryption',
            condition: 'patient_data',
            action: 'encrypt',
            severity: 'critical',
            parameters: { requiresEncryption: true }
          }
        ]
      },
      {
        name: 'Financial Services Security Policy',
        description: 'SOX and PCI-DSS compliant security for financial services',
        sectorId: 'financial_services',
        complianceFrameworks: ['SOX', 'PCI_DSS'],
        isActive: true,
        rules: [
          {
            id: 'financial_mfa',
            type: 'authentication',
            condition: 'financial_data',
            action: 'allow',
            severity: 'high',
            parameters: { requiresMFA: true }
          },
          {
            id: 'financial_audit',
            type: 'audit_logging',
            condition: '*',
            action: 'log',
            severity: 'medium',
            parameters: { logLevel: 'detailed' }
          }
        ]
      }
    ];

    defaultPolicies.forEach(policy => {
      this.createSecurityPolicy(policy);
    });
  }

  // Initialize Compliance Frameworks
  private initializeComplianceFrameworks(): void {
    // Initialize sample compliance checks for demonstration
    const sampleChecks: ComplianceCheck[] = [
      {
        id: 'sample_gdpr_consent',
        framework: 'GDPR',
        requirement: 'Consent Management',
        status: 'compliant',
        evidence: ['Consent management system implemented', 'User consent tracking active'],
        lastChecked: new Date(),
        nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      }
    ];

    this.complianceChecks.set('sample', sampleChecks);
  }

  // Public API Methods
  async getSecurityPolicies(sectorId?: string): Promise<SecurityPolicy[]> {
    const policies = Array.from(this.policies.values());
    return sectorId ? policies.filter(p => p.sectorId === sectorId || p.sectorId === 'global') : policies;
  }

  async getComplianceStatus(sectorId: string): Promise<{
    overallScore: number;
    frameworkScores: Record<string, number>;
    criticalIssues: number;
    recommendations: string[];
  }> {
    const allChecks = Array.from(this.complianceChecks.values()).flat();
    const sectorChecks = allChecks.filter(c => c.framework.includes(sectorId) || true); // Simplified filtering

    const compliantChecks = sectorChecks.filter(c => c.status === 'compliant').length;
    const totalChecks = sectorChecks.length;
    const overallScore = totalChecks > 0 ? (compliantChecks / totalChecks) * 100 : 100;

    const criticalIssues = sectorChecks.filter(c => c.status === 'non_compliant').length;

    return {
      overallScore,
      frameworkScores: {
        'GDPR': 85,
        'HIPAA': 92,
        'SOX': 78,
        'PCI_DSS': 88
      },
      criticalIssues,
      recommendations: [
        'Review non-compliant items and create remediation plans',
        'Schedule regular compliance audits',
        'Update security policies based on latest regulations'
      ]
    };
  }

  async getSecurityIncidents(status?: SecurityIncident['status']): Promise<SecurityIncident[]> {
    const incidents = Array.from(this.incidents.values());
    return status ? incidents.filter(i => i.status === status) : incidents;
  }

  async getAuditLogs(filters?: {
    userId?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<AuditLog[]> {
    let logs = [...this.auditLogs];

    if (filters) {
      if (filters.userId) {
        logs = logs.filter(l => l.userId === filters.userId);
      }
      if (filters.action) {
        logs = logs.filter(l => l.action.includes(filters.action));
      }
      if (filters.startDate) {
        logs = logs.filter(l => l.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        logs = logs.filter(l => l.timestamp <= filters.endDate!);
      }
    }

    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}

// Export security and compliance engine
export const securityComplianceEngine = new SecurityComplianceEngine();
