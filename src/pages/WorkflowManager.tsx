import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Eye,
  Edit,
  Trash2,
  Workflow,
  Bot,
  Zap,
  Activity
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function WorkflowManager() {
  const { toast } = useToast();
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [executions, setExecutions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'workflows' | 'agents' | 'executions'>('workflows');
  const [selectedSector, setSelectedSector] = useState('healthcare');

  const sectors = [
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'legal_services', name: 'Legal Services' },
    { id: 'financial_services', name: 'Financial Services' },
    { id: 'auto_repair', name: 'Auto Repair' }
  ];

  const loadWorkflows = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/workflow/templates/${selectedSector}`);
      if (response.ok) {
        const data = await response.json();
        setWorkflows(data);
      } else {
        // Demo data
        setWorkflows([
          {
            id: 'expense_approval',
            name: 'Expense Approval Process',
            description: 'Automated expense report approval workflow',
            sectorId: selectedSector,
            isActive: true,
            steps: [
              { id: 'validate', name: 'Validate Expense', type: 'condition' },
              { id: 'approve', name: 'Manager Approval', type: 'approval' },
              { id: 'process', name: 'Process Payment', type: 'api_call' }
            ]
          },
          {
            id: 'appointment_scheduling',
            name: 'Smart Appointment Scheduling',
            description: 'AI-powered appointment scheduling with conflict resolution',
            sectorId: selectedSector,
            isActive: true,
            steps: [
              { id: 'check', name: 'Check Availability', type: 'api_call' },
              { id: 'optimize', name: 'Optimize Schedule', type: 'condition' },
              { id: 'confirm', name: 'Send Confirmation', type: 'notification' }
            ]
          }
        ]);
      }
    } catch (error) {
      console.error('Workflow loading error:', error);
    }
    setIsLoading(false);
  };

  const loadAgents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/agents');
      if (response.ok) {
        const data = await response.json();
        setAgents(data);
      } else {
        // Demo data
        setAgents([
          {
            id: '1',
            name: 'ScheduleMaster',
            type: 'scheduler',
            status: 'active',
            capabilities: ['check_availability', 'optimize_schedule', 'handle_conflicts'],
            performance: { tasksCompleted: 156, successRate: 0.95, averageResponseTime: 2.3 }
          },
          {
            id: '2',
            name: 'CommBot',
            type: 'communicator',
            status: 'busy',
            capabilities: ['send_email', 'send_sms', 'translate_messages'],
            performance: { tasksCompleted: 89, successRate: 0.88, averageResponseTime: 1.8 }
          },
          {
            id: '3',
            name: 'DataAnalyzer',
            type: 'analyzer',
            status: 'idle',
            capabilities: ['analyze_data', 'generate_insights', 'predict_trends'],
            performance: { tasksCompleted: 234, successRate: 0.92, averageResponseTime: 4.1 }
          }
        ]);
      }
    } catch (error) {
      console.error('Agents loading error:', error);
    }
    setIsLoading(false);
  };

  const loadExecutions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/agents/tasks/active');
      if (response.ok) {
        const data = await response.json();
        setExecutions(data);
      } else {
        // Demo data
        setExecutions([
          {
            id: 'exec_1',
            templateId: 'expense_approval',
            status: 'in_progress',
            currentStep: 'manager_approval',
            startedAt: new Date(Date.now() - 3600000),
            progress: [
              { step: 'validate_expense', status: 'completed', timestamp: new Date(Date.now() - 3000000) },
              { step: 'manager_approval', status: 'in_progress', timestamp: new Date(Date.now() - 1800000) }
            ]
          },
          {
            id: 'exec_2',
            templateId: 'appointment_scheduling',
            status: 'completed',
            currentStep: 'send_confirmation',
            startedAt: new Date(Date.now() - 7200000),
            completedAt: new Date(Date.now() - 1800000),
            progress: [
              { step: 'check_availability', status: 'completed', timestamp: new Date(Date.now() - 6600000) },
              { step: 'optimize_schedule', status: 'completed', timestamp: new Date(Date.now() - 3600000) },
              { step: 'send_confirmation', status: 'completed', timestamp: new Date(Date.now() - 1800000) }
            ]
          }
        ]);
      }
    } catch (error) {
      console.error('Executions loading error:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'workflows') {
      loadWorkflows();
    } else if (activeTab === 'agents') {
      loadAgents();
    } else if (activeTab === 'executions') {
      loadExecutions();
    }
  }, [activeTab, selectedSector]);

  const executeWorkflow = async (workflowId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/workflow/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: workflowId,
          initialData: {
            userId: 'demo_user',
            timestamp: new Date().toISOString()
          }
        })
      });

      if (response.ok) {
        const execution = await response.json();
        toast({
          title: "Workflow Started",
          description: `Workflow execution ${execution.id} has been started`
        });
        loadExecutions();
      } else {
        toast({
          title: "Workflow Started",
          description: "Demo workflow execution initiated"
        });
      }
    } catch (error) {
      console.error('Workflow execution error:', error);
    }
    setIsLoading(false);
  };

  const assignTaskToAgents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/agents/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'customer_service_resolution',
          description: 'Handle customer inquiry and provide resolution',
          requiredCapabilities: ['communication', 'analysis', 'problem_solving'],
          priority: 3
        })
      });

      if (response.ok) {
        const task = await response.json();
        toast({
          title: "Task Assigned",
          description: `Task ${task.id} assigned to AI agents`
        });
        loadExecutions();
      } else {
        toast({
          title: "Task Assigned",
          description: "Demo task assigned to collaborative AI agents"
        });
      }
    } catch (error) {
      console.error('Task assignment error:', error);
    }
    setIsLoading(false);
  };

  const WorkflowCard = ({ workflow }: { workflow: any }) => (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{workflow.name}</CardTitle>
          <Badge variant={workflow.isActive ? 'default' : 'secondary'}>
            {workflow.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{workflow.description}</p>
        <div className="space-y-2 mb-4">
          <h4 className="font-medium text-sm">Workflow Steps:</h4>
          {workflow.steps.map((step: any, index: number) => (
            <div key={step.id} className="flex items-center gap-2 text-sm">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                {index + 1}
              </div>
              <span>{step.name}</span>
              <Badge variant="outline" className="text-xs">
                {step.type}
              </Badge>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={() => executeWorkflow(workflow.id)}
            disabled={isLoading}
            className="flex-1"
          >
            <Play className="h-4 w-4 mr-1" />
            Execute
          </Button>
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const AgentCard = ({ agent }: { agent: any }) => (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{agent.name}</CardTitle>
          <Badge variant={
            agent.status === 'active' ? 'default' :
            agent.status === 'busy' ? 'destructive' : 'secondary'
          }>
            {agent.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium">Type:</span>
            <span className="ml-2 text-sm">{agent.type}</span>
          </div>
          <div>
            <span className="text-sm font-medium">Capabilities:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {agent.capabilities.slice(0, 3).map((cap: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {cap.replace('_', ' ')}
                </Badge>
              ))}
              {agent.capabilities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{agent.capabilities.length - 3} more
                </Badge>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Tasks:</span>
              <span className="ml-1">{agent.performance.tasksCompleted}</span>
            </div>
            <div>
              <span className="font-medium">Success:</span>
              <span className="ml-1">{Math.round(agent.performance.successRate * 100)}%</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${agent.performance.successRate * 100}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ExecutionCard = ({ execution }: { execution: any }) => (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {workflows.find(w => w.id === execution.templateId)?.name || 'Unknown Workflow'}
          </CardTitle>
          <Badge variant={
            execution.status === 'completed' ? 'default' :
            execution.status === 'in_progress' ? 'destructive' :
            execution.status === 'failed' ? 'destructive' : 'secondary'
          }>
            {execution.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm">
            <span className="font-medium">Started:</span>
            <span className="ml-2">{new Date(execution.startedAt).toLocaleString()}</span>
          </div>
          {execution.completedAt && (
            <div className="text-sm">
              <span className="font-medium">Completed:</span>
              <span className="ml-2">{new Date(execution.completedAt).toLocaleString()}</span>
            </div>
          )}
          <div>
            <h4 className="font-medium text-sm mb-2">Progress:</h4>
            <div className="space-y-1">
              {execution.progress.map((step: any, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {step.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {step.status === 'in_progress' && <Clock className="h-4 w-4 text-blue-500" />}
                  {step.status === 'failed' && <AlertCircle className="h-4 w-4 text-red-500" />}
                  <span className={step.status === 'completed' ? 'line-through text-gray-500' : ''}>
                    {step.step.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              ⚙️ Workflow Manager
            </h1>
            <p className="text-gray-600">
              Manage automated workflows and collaborative AI agents
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={assignTaskToAgents} disabled={isLoading}>
              <Bot className="h-4 w-4 mr-2" />
              Assign Task to Agents
            </Button>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              New Workflow
            </Button>
          </div>
        </div>

        {/* Sector Selection */}
        <div className="flex gap-4 mb-8">
          {sectors.map((sector) => (
            <Button
              key={sector.id}
              variant={selectedSector === sector.id ? 'default' : 'outline'}
              onClick={() => setSelectedSector(sector.id)}
            >
              {sector.name}
            </Button>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <Button
            variant={activeTab === 'workflows' ? 'default' : 'outline'}
            onClick={() => setActiveTab('workflows')}
            className="flex items-center gap-2"
          >
            <Workflow className="h-4 w-4" />
            Workflows ({workflows.length})
          </Button>
          <Button
            variant={activeTab === 'agents' ? 'default' : 'outline'}
            onClick={() => setActiveTab('agents')}
            className="flex items-center gap-2"
          >
            <Bot className="h-4 w-4" />
            AI Agents ({agents.length})
          </Button>
          <Button
            variant={activeTab === 'executions' ? 'default' : 'outline'}
            onClick={() => setActiveTab('executions')}
            className="flex items-center gap-2"
          >
            <Activity className="h-4 w-4" />
            Executions ({executions.length})
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'workflows' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Workflow Templates</h2>
              <Badge variant="outline">{workflows.filter(w => w.isActive).length} Active</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflows.map((workflow) => (
                <WorkflowCard key={workflow.id} workflow={workflow} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">AI Agents</h2>
              <Badge variant="outline">{agents.filter(a => a.status === 'active').length} Active</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'executions' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Workflow Executions</h2>
              <Badge variant="outline">{executions.filter(e => e.status === 'in_progress').length} Running</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {executions.map((execution) => (
                <ExecutionCard key={execution.id} execution={execution} />
              ))}
            </div>
          </div>
        )}

        {/* Status Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <Workflow className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Automated Workflows</h3>
              <p className="text-sm text-blue-700">
                Multi-step process automation with intelligent decision making
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6 text-center">
              <Bot className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">Collaborative AI</h3>
              <p className="text-sm text-green-700">
                Multiple AI agents working together on complex tasks
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6 text-center">
              <Zap className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Real-time Execution</h3>
              <p className="text-sm text-purple-700">
                Live workflow monitoring with instant status updates
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
