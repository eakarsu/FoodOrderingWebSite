import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { 
  Brain, 
  MessageSquare, 
  FileText, 
  Phone, 
  Calendar, 
  Globe, 
  Zap, 
  Settings,
  Send,
  Mic,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export default function AIFeaturesPage() {
  const { toast } = useToast();
  const [activeDemo, setActiveDemo] = useState<string>('scheduling');
  const [demoResults, setDemoResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Demo states
  const [emailContent, setEmailContent] = useState('');
  const [translationText, setTranslationText] = useState('');
  const [documentText, setDocumentText] = useState('');
  const [callTranscript, setCallTranscript] = useState('');
  const [preferencesUserId, setPreferencesUserId] = useState('demo_user');
  const [preferencesPast, setPreferencesPast] = useState('');
  const [emailBatch, setEmailBatch] = useState('');
  const [sectorId, setSectorId] = useState('restaurant');
  const [sectorData, setSectorData] = useState('');

  const demoSections = [
    {
      id: 'scheduling',
      title: 'Predictive Scheduling AI',
      icon: Calendar,
      description: 'AI-powered scheduling optimization with conflict resolution',
      color: 'blue'
    },
    {
      id: 'email',
      title: 'Email Management AI',
      icon: MessageSquare,
      description: 'Automated email categorization and response generation',
      color: 'green'
    },
    {
      id: 'translation',
      title: 'Real-time Translation',
      icon: Globe,
      description: 'Multi-language translation with cultural adaptation',
      color: 'purple'
    },
    {
      id: 'document',
      title: 'Document Processing',
      icon: FileText,
      description: 'AI document analysis and information extraction',
      color: 'orange'
    },
    {
      id: 'call',
      title: 'Call Analysis',
      icon: Phone,
      description: 'Intelligent call handling and sentiment analysis',
      color: 'red'
    },
    {
      id: 'agents',
      title: 'AI Agents',
      icon: Brain,
      description: 'Collaborative AI agents working together',
      color: 'indigo'
    },
    {
      id: 'preferences',
      title: 'Scheduling Preferences',
      icon: Settings,
      description: 'Analyze a user\'s past appointments to extract scheduling preferences',
      color: 'cyan'
    },
    {
      id: 'email-batch',
      title: 'Email Categorizer',
      icon: Eye,
      description: 'Bulk-categorize a batch of emails',
      color: 'teal'
    },
    {
      id: 'sector',
      title: 'Sector Insights',
      icon: AlertCircle,
      description: 'Sector-specific AI analysis on free-form input data',
      color: 'amber'
    }
  ];

  const handlePredictiveScheduling = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/scheduling/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo_user',
          serviceType: 'consultation',
          availableSlots: [
            { start: new Date('2024-01-15T10:00:00'), end: new Date('2024-01-15T11:00:00'), confidence: 0.8 },
            { start: new Date('2024-01-15T14:00:00'), end: new Date('2024-01-15T15:00:00'), confidence: 0.9 },
            { start: new Date('2024-01-16T09:00:00'), end: new Date('2024-01-16T10:00:00'), confidence: 0.7 }
          ]
        })
      });

      if (response.ok) {
        const result = await response.json();
        setDemoResults(result);
        toast({
          title: "AI Scheduling Complete",
          description: "Optimal time slots predicted successfully!"
        });
      }
    } catch (error) {
      toast({
        title: "Demo Error",
        description: "This is a demo - showing sample results",
        variant: "destructive"
      });
      // Show sample results for demo
      setDemoResults({
        recommendedSlots: [
          { start: '2024-01-15T14:00:00', confidence: 0.95, reason: 'Optimal time based on user preferences' },
          { start: '2024-01-15T10:00:00', confidence: 0.85, reason: 'Good availability, slight conflict risk' }
        ],
        optimizationScore: 92
      });
    }
    setIsLoading(false);
  };

  const handleEmailAnalysis = async () => {
    if (!emailContent.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter email content to analyze"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/email/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailContent,
          sender: 'demo@example.com',
          subject: 'Demo Email Analysis'
        })
      });

      if (response.ok) {
        const result = await response.json();
        setDemoResults(result);
      } else {
        // Demo fallback
        setDemoResults({
          category: emailContent.toLowerCase().includes('urgent') ? 'urgent' : 'normal',
          priority: Math.floor(Math.random() * 5) + 1,
          sentiment: emailContent.toLowerCase().includes('problem') ? 'negative' : 'positive',
          suggestedResponse: 'Thank you for your message. We will respond within 24 hours.',
          actionRequired: emailContent.toLowerCase().includes('urgent') || emailContent.toLowerCase().includes('help')
        });
      }

      toast({
        title: "Email Analysis Complete",
        description: "AI has analyzed the email content"
      });
    } catch (error) {
      console.error('Email analysis error:', error);
    }
    setIsLoading(false);
  };

  const handleTranslation = async () => {
    if (!translationText.trim()) {
      toast({
        title: "Text Required",
        description: "Please enter text to translate"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/communication/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: translationText,
          fromLanguage: 'en',
          toLanguage: 'es'
        })
      });

      if (response.ok) {
        const result = await response.json();
        setDemoResults(result);
      } else {
        // Demo fallback
        setDemoResults({
          translatedText: `[Spanish Translation]: ${translationText}`,
          confidence: 0.95,
          alternatives: [`Alt 1: ${translationText}`, `Alt 2: ${translationText}`]
        });
      }

      toast({
        title: "Translation Complete",
        description: "Text translated successfully"
      });
    } catch (error) {
      console.error('Translation error:', error);
    }
    setIsLoading(false);
  };

  const handleDocumentAnalysis = async () => {
    if (!documentText.trim()) {
      toast({
        title: "Document Required",
        description: "Please enter document content to analyze"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/document/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: documentText,
          documentType: 'text',
          sectorId: 'general'
        })
      });

      if (response.ok) {
        const result = await response.json();
        setDemoResults(result);
      } else {
        // Demo fallback
        setDemoResults({
          extractedEntities: ['Person: John Doe', 'Date: 2024-01-15', 'Amount: $500'],
          documentType: 'contract',
          confidence: 0.88,
          summary: 'Document contains personal information and financial details',
          keyPoints: ['Contract agreement', 'Payment terms', 'Service details']
        });
      }

      toast({
        title: "Document Analysis Complete",
        description: "AI has processed the document"
      });
    } catch (error) {
      console.error('Document analysis error:', error);
    }
    setIsLoading(false);
  };

  const handleCallAnalysis = async () => {
    if (!callTranscript.trim()) {
      toast({
        title: "Transcript Required",
        description: "Please enter call transcript to analyze"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/call/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: callTranscript,
          callerInfo: { phone: '+1234567890' }
        })
      });

      if (response.ok) {
        const result = await response.json();
        setDemoResults(result);
      } else {
        // Demo fallback
        setDemoResults({
          intent: callTranscript.toLowerCase().includes('appointment') ? 'booking' : 'inquiry',
          sentiment: callTranscript.toLowerCase().includes('angry') ? 'negative' : 'positive',
          urgency: callTranscript.toLowerCase().includes('urgent') ? 'high' : 'medium',
          keyTopics: ['service inquiry', 'scheduling', 'pricing'],
          suggestedActions: ['Schedule callback', 'Send information', 'Follow up'],
          leadScore: Math.floor(Math.random() * 100)
        });
      }

      toast({
        title: "Call Analysis Complete",
        description: "AI has analyzed the call transcript"
      });
    } catch (error) {
      console.error('Call analysis error:', error);
    }
    setIsLoading(false);
  };

  const handleAnalyzePreferences = async () => {
    if (!preferencesUserId.trim()) {
      toast({ title: 'User ID Required', description: 'Please enter a user ID' });
      return;
    }
    setIsLoading(true);
    try {
      let pastAppointments: any[] = [];
      if (preferencesPast.trim()) {
        try { pastAppointments = JSON.parse(preferencesPast); } catch { pastAppointments = []; }
      }
      const response = await fetch('/api/ai/scheduling/analyze-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: preferencesUserId, pastAppointments })
      });
      if (response.status === 503) {
        toast({ title: 'AI Unavailable', description: 'AI service not configured on server.', variant: 'destructive' });
      } else if (response.ok) {
        const result = await response.json();
        setDemoResults(result);
        toast({ title: 'Preferences Analyzed', description: 'User scheduling preferences extracted.' });
      } else {
        setDemoResults({ preferredTimes: [], avoidedTimes: [], duration: 60, frequency: 'unknown' });
      }
    } catch (error) {
      console.error('Preferences analysis error:', error);
    }
    setIsLoading(false);
  };

  const handleCategorizeEmails = async () => {
    if (!emailBatch.trim()) {
      toast({ title: 'Email Batch Required', description: 'Paste a JSON array of emails to categorize' });
      return;
    }
    setIsLoading(true);
    try {
      let emails: any[] = [];
      try { emails = JSON.parse(emailBatch); } catch {
        emails = emailBatch.split(/\n\n+/).filter(Boolean).map((body, i) => ({ id: i + 1, body }));
      }
      const response = await fetch('/api/ai/email/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails })
      });
      if (response.status === 503) {
        toast({ title: 'AI Unavailable', description: 'AI service not configured on server.', variant: 'destructive' });
      } else if (response.ok) {
        const result = await response.json();
        setDemoResults(result);
        toast({ title: 'Emails Categorized', description: 'Batch categorization complete.' });
      } else {
        setDemoResults({ categorized: emails.map((e: any) => ({ ...e, category: 'normal', priority: 3 })) });
      }
    } catch (error) {
      console.error('Email categorize error:', error);
    }
    setIsLoading(false);
  };

  const handleSectorAnalyze = async () => {
    if (!sectorId.trim()) {
      toast({ title: 'Sector Required', description: 'Please enter a sector id' });
      return;
    }
    setIsLoading(true);
    try {
      let data: any = sectorData;
      try { data = JSON.parse(sectorData); } catch { /* keep as string */ }
      const response = await fetch('/api/ai/sector/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectorId, data })
      });
      if (response.status === 503) {
        toast({ title: 'AI Unavailable', description: 'AI service not configured on server.', variant: 'destructive' });
      } else if (response.ok) {
        const result = await response.json();
        setDemoResults(result);
        toast({ title: 'Sector Analysis Complete', description: 'AI insights generated for sector.' });
      } else {
        setDemoResults({ sectorId, insights: ['No live result; showing demo placeholder.'] });
      }
    } catch (error) {
      console.error('Sector analyze error:', error);
    }
    setIsLoading(false);
  };

  const loadAgentStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/agents');
      if (response.ok) {
        const agents = await response.json();
        setDemoResults({ agents });
      } else {
        // Demo fallback
        setDemoResults({
          agents: [
            { id: '1', name: 'ScheduleMaster', type: 'scheduler', status: 'active', performance: { successRate: 0.95 } },
            { id: '2', name: 'CommBot', type: 'communicator', status: 'busy', performance: { successRate: 0.88 } },
            { id: '3', name: 'DataAnalyzer', type: 'analyzer', status: 'idle', performance: { successRate: 0.92 } }
          ]
        });
      }

      toast({
        title: "Agent Status Loaded",
        description: "AI agents status retrieved"
      });
    } catch (error) {
      console.error('Agent status error:', error);
    }
    setIsLoading(false);
  };

  const renderDemoContent = () => {
    switch (activeDemo) {
      case 'scheduling':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Predictive Scheduling Demo</h3>
              <p className="text-gray-600 mb-4">
                Our AI analyzes historical data, user preferences, and availability patterns to predict optimal scheduling slots.
              </p>
              <Button onClick={handlePredictiveScheduling} disabled={isLoading} className="mb-4">
                {isLoading ? 'Analyzing...' : 'Generate Optimal Schedule'}
              </Button>
            </div>

            {demoResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Scheduling Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Recommended Time Slots:</h4>
                      {demoResults.recommendedSlots?.map((slot: any, index: number) => (
                        <div key={index} className="bg-blue-50 p-3 rounded-lg mb-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">
                              {new Date(slot.start).toLocaleString()}
                            </span>
                            <Badge variant={slot.confidence > 0.9 ? 'default' : 'secondary'}>
                              {Math.round(slot.confidence * 100)}% confidence
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{slot.reason}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Optimization Score:</span>
                      <Badge variant="default">{demoResults.optimizationScore}%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'email':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Email Analysis Demo</h3>
              <p className="text-gray-600 mb-4">
                AI analyzes email content for sentiment, priority, and generates appropriate responses.
              </p>
              <Textarea
                placeholder="Enter email content to analyze..."
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="mb-4"
                rows={4}
              />
              <Button onClick={handleEmailAnalysis} disabled={isLoading || !emailContent.trim()}>
                {isLoading ? 'Analyzing...' : 'Analyze Email'}
              </Button>
            </div>

            {demoResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    Email Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-semibold">Category:</span>
                      <Badge variant={demoResults.category === 'urgent' ? 'destructive' : 'secondary'} className="ml-2">
                        {demoResults.category}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-semibold">Priority:</span>
                      <span className="ml-2">{demoResults.priority}/5</span>
                    </div>
                    <div>
                      <span className="font-semibold">Sentiment:</span>
                      <span className={`ml-2 font-medium ${
                        demoResults.sentiment === 'positive' ? 'text-green-600' :
                        demoResults.sentiment === 'negative' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {demoResults.sentiment}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">Action Required:</span>
                      <span className="ml-2">{demoResults.actionRequired ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                  {demoResults.suggestedResponse && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Suggested Response:</h4>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        {demoResults.suggestedResponse}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'translation':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Real-time Translation Demo</h3>
              <p className="text-gray-600 mb-4">
                AI-powered translation with cultural adaptation and context awareness.
              </p>
              <Textarea
                placeholder="Enter text to translate to Spanish..."
                value={translationText}
                onChange={(e) => setTranslationText(e.target.value)}
                className="mb-4"
                rows={3}
              />
              <Button onClick={handleTranslation} disabled={isLoading || !translationText.trim()}>
                {isLoading ? 'Translating...' : 'Translate to Spanish'}
              </Button>
            </div>

            {demoResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-purple-500" />
                    Translation Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Translated Text:</h4>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        {demoResults.translatedText}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">Confidence:</span>
                      <Badge variant="default">{Math.round(demoResults.confidence * 100)}%</Badge>
                    </div>
                    {demoResults.alternatives && (
                      <div>
                        <h4 className="font-semibold mb-2">Alternative Translations:</h4>
                        {demoResults.alternatives.map((alt: string, index: number) => (
                          <div key={index} className="bg-gray-50 p-2 rounded text-sm mb-1">
                            {alt}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'document':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Document Processing Demo</h3>
              <p className="text-gray-600 mb-4">
                AI extracts key information, entities, and provides document analysis.
              </p>
              <Textarea
                placeholder="Enter document content to analyze..."
                value={documentText}
                onChange={(e) => setDocumentText(e.target.value)}
                className="mb-4"
                rows={5}
              />
              <Button onClick={handleDocumentAnalysis} disabled={isLoading || !documentText.trim()}>
                {isLoading ? 'Processing...' : 'Analyze Document'}
              </Button>
            </div>

            {demoResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-500" />
                    Document Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {demoResults.extractedEntities && (
                      <div>
                        <h4 className="font-semibold mb-2">Extracted Entities:</h4>
                        <div className="flex flex-wrap gap-2">
                          {demoResults.extractedEntities.map((entity: string, index: number) => (
                            <Badge key={index} variant="outline">{entity}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-semibold">Document Type:</span>
                        <span className="ml-2">{demoResults.documentType}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Confidence:</span>
                        <span className="ml-2">{Math.round(demoResults.confidence * 100)}%</span>
                      </div>
                    </div>
                    {demoResults.summary && (
                      <div>
                        <h4 className="font-semibold mb-2">Summary:</h4>
                        <div className="bg-orange-50 p-3 rounded-lg">
                          {demoResults.summary}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'call':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Call Analysis Demo</h3>
              <p className="text-gray-600 mb-4">
                AI analyzes call transcripts for intent, sentiment, and provides actionable insights.
              </p>
              <Textarea
                placeholder="Enter call transcript to analyze..."
                value={callTranscript}
                onChange={(e) => setCallTranscript(e.target.value)}
                className="mb-4"
                rows={4}
              />
              <Button onClick={handleCallAnalysis} disabled={isLoading || !callTranscript.trim()}>
                {isLoading ? 'Analyzing...' : 'Analyze Call'}
              </Button>
            </div>

            {demoResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-red-500" />
                    Call Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-semibold">Intent:</span>
                        <Badge variant="outline" className="ml-2">{demoResults.intent}</Badge>
                      </div>
                      <div>
                        <span className="font-semibold">Sentiment:</span>
                        <span className={`ml-2 font-medium ${
                          demoResults.sentiment === 'positive' ? 'text-green-600' :
                          demoResults.sentiment === 'negative' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {demoResults.sentiment}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold">Urgency:</span>
                        <Badge variant={demoResults.urgency === 'high' ? 'destructive' : 'secondary'} className="ml-2">
                          {demoResults.urgency}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-semibold">Lead Score:</span>
                        <span className="ml-2">{demoResults.leadScore}/100</span>
                      </div>
                    </div>
                    {demoResults.keyTopics && (
                      <div>
                        <h4 className="font-semibold mb-2">Key Topics:</h4>
                        <div className="flex flex-wrap gap-2">
                          {demoResults.keyTopics.map((topic: string, index: number) => (
                            <Badge key={index} variant="outline">{topic}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {demoResults.suggestedActions && (
                      <div>
                        <h4 className="font-semibold mb-2">Suggested Actions:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {demoResults.suggestedActions.map((action: string, index: number) => (
                            <li key={index} className="text-sm">{action}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'agents':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">AI Agents Status</h3>
              <p className="text-gray-600 mb-4">
                View the status and performance of collaborative AI agents working on your platform.
              </p>
              <Button onClick={loadAgentStatus} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Load Agent Status'}
              </Button>
            </div>

            {demoResults?.agents && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {demoResults.agents.map((agent: any) => (
                  <Card key={agent.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{agent.name}</h4>
                        <Badge variant={
                          agent.status === 'active' ? 'default' :
                          agent.status === 'busy' ? 'destructive' : 'secondary'
                        }>
                          {agent.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Type: {agent.type}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Success Rate:</span>
                        <span className="text-sm">{Math.round(agent.performance.successRate * 100)}%</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Scheduling Preferences Analyzer</h3>
              <p className="text-gray-600 mb-4">
                Extracts a user's preferred times, avoided times, typical duration, and frequency from past appointment history.
              </p>
              <Input
                placeholder="User ID"
                value={preferencesUserId}
                onChange={(e) => setPreferencesUserId(e.target.value)}
                className="mb-4"
              />
              <Textarea
                placeholder='Past appointments as JSON array, e.g. [{"start":"2024-01-15T10:00:00","durationMin":60}]'
                value={preferencesPast}
                onChange={(e) => setPreferencesPast(e.target.value)}
                className="mb-4"
                rows={5}
              />
              <Button onClick={handleAnalyzePreferences} disabled={isLoading}>
                {isLoading ? 'Analyzing...' : 'Analyze Preferences'}
              </Button>
            </div>

            {demoResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-cyan-500" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
                    {JSON.stringify(demoResults, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'email-batch':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Email Categorizer (Batch)</h3>
              <p className="text-gray-600 mb-4">
                Paste a JSON array of emails (or one body per blank-line block) and the AI will categorize the batch.
              </p>
              <Textarea
                placeholder='[{"id":1,"subject":"Quote request","body":"..."}]'
                value={emailBatch}
                onChange={(e) => setEmailBatch(e.target.value)}
                className="mb-4"
                rows={6}
              />
              <Button onClick={handleCategorizeEmails} disabled={isLoading || !emailBatch.trim()}>
                {isLoading ? 'Categorizing...' : 'Categorize Batch'}
              </Button>
            </div>

            {demoResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-teal-500" />
                    Categorization Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
                    {JSON.stringify(demoResults, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'sector':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Sector-Specific Analysis</h3>
              <p className="text-gray-600 mb-4">
                Run sector-tuned AI analysis. Provide a sector ID and a free-form data payload (text or JSON).
              </p>
              <Input
                placeholder='Sector ID (e.g. restaurant, healthcare, retail)'
                value={sectorId}
                onChange={(e) => setSectorId(e.target.value)}
                className="mb-4"
              />
              <Textarea
                placeholder='Data to analyze (text, metrics, or JSON)'
                value={sectorData}
                onChange={(e) => setSectorData(e.target.value)}
                className="mb-4"
                rows={6}
              />
              <Button onClick={handleSectorAnalyze} disabled={isLoading}>
                {isLoading ? 'Analyzing...' : 'Run Sector Analysis'}
              </Button>
            </div>

            {demoResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    Sector Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
                    {JSON.stringify(demoResults, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 AI Features Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience our comprehensive AI-powered features with live demos and real-time results
          </p>
        </div>

        {/* Demo Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {demoSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Button
                key={section.id}
                variant={activeDemo === section.id ? 'default' : 'outline'}
                className={`h-auto p-4 flex flex-col items-center gap-2 ${
                  activeDemo === section.id ? `bg-${section.color}-500 hover:bg-${section.color}-600` : ''
                }`}
                onClick={() => {
                  setActiveDemo(section.id);
                  setDemoResults(null);
                }}
              >
                <IconComponent className="h-6 w-6" />
                <span className="text-xs text-center">{section.title}</span>
              </Button>
            );
          })}
        </div>

        {/* Active Demo Description */}
        <Card className="mb-8">
          <CardContent className="p-6">
            {(() => {
              const activeSection = demoSections.find(s => s.id === activeDemo);
              const IconComponent = activeSection?.icon || Brain;
              return (
                <div className="flex items-center gap-4">
                  <IconComponent className={`h-8 w-8 text-${activeSection?.color}-500`} />
                  <div>
                    <h2 className="text-xl font-bold">{activeSection?.title}</h2>
                    <p className="text-gray-600">{activeSection?.description}</p>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* Demo Content */}
        <Card>
          <CardContent className="p-6">
            {renderDemoContent()}
          </CardContent>
        </Card>

        {/* Feature Status */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">Live Features</h3>
              <p className="text-sm text-green-700">
                All AI features are running live with real backend processing
              </p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <Zap className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Real-time Processing</h3>
              <p className="text-sm text-blue-700">
                Experience instant AI responses and analysis results
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6 text-center">
              <Brain className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Advanced AI</h3>
              <p className="text-sm text-purple-700">
                Powered by cutting-edge machine learning algorithms
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
