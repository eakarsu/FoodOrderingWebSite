import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MessageSquare, Phone, Send, Trash2, Settings, Mic, Video, Globe, Brain, Zap } from 'lucide-react';
import { sendSMS, makeCall, initializeTwilioDevice } from '../lib/twilio';
import { useToast } from '../hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'error';
  timestamp: string;
}

export default function ContactUsDirectly() {
  const [phoneNumber, setPhoneNumber] = useState('+18001234567');
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'hello',
      sender: 'error',
      timestamp: '21:48'
    },
    {
      id: '2', 
      content: 'hello',
      sender: 'user',
      timestamp: '21:51'
    },
    {
      id: '3',
      content: 'hi',
      sender: 'user', 
      timestamp: '22:51'
    }
  ]);
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<'sms' | 'call' | 'ai_features'>('sms');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [translationEnabled, setTranslationEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [voiceMode, setVoiceMode] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initDevice = async () => {
      try {
        await initializeTwilioDevice();
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to initialize Twilio device:', error);
        setIsConnected(false);
      }
    };

    initDevice();
  }, []);

  const handleSendSMS = async () => {
    if (!currentMessage.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message to send",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      // AI Analysis of message before sending
      await analyzeMessageWithAI(currentMessage);

      // Translate if enabled
      let messageToSend = currentMessage;
      if (translationEnabled) {
        messageToSend = await translateMessage(currentMessage, selectedLanguage);
      }

      const result = await sendSMS(phoneNumber, messageToSend);
      
      // Add user message to history
      const userMessage: Message = {
        id: Date.now().toString(),
        content: currentMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        })
      };
      setMessages(prev => [...prev, userMessage]);
      setCurrentMessage('');
      
      if (result.success) {
        // Extract message content from XML response
        const apiResult = result as any;
        let responseContent = apiResult.response || result.messageSid || 'Message sent successfully';
        
        // Parse XML to extract message content
        if (apiResult.response && apiResult.response.includes('<Message>')) {
          const messageMatch = apiResult.response.match(/<Message>(.*?)<\/Message>/);
          if (messageMatch) {
            responseContent = messageMatch[1];
          }
        }
        
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: responseContent,
          sender: 'user',
          timestamp: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          })
        };
        setMessages(prev => [...prev, responseMessage]);
        
        toast({
          title: "Message Sent",
          description: `SMS sent successfully to ${phoneNumber}${translationEnabled ? ` (translated to ${selectedLanguage})` : ''}`,
        });
      } else {
        throw new Error(result.error || 'Failed to send SMS');
      }
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: `Error: ${error instanceof Error ? error.message : 'Failed to send message'}`,
        sender: 'error',
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        })
      };
      setMessages(prev => [...prev, errorMessage]);
      toast({
        title: "Message Failed",
        description: "Unable to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const analyzeMessageWithAI = async (message: string) => {
    try {
      const response = await fetch('/api/ai/email/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailContent: message,
          sender: 'user',
          subject: 'SMS Message'
        })
      });
      
      if (response.ok) {
        const analysis = await response.json();
        setAiAnalysis(analysis);
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
    }
  };

  const translateMessage = async (message: string, targetLanguage: string): Promise<string> => {
    try {
      const response = await fetch('/api/communication/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: message,
          fromLanguage: 'en',
          toLanguage: targetLanguage
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        return result.translatedText;
      }
    } catch (error) {
      console.error('Translation failed:', error);
    }
    return message;
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setVoiceMode(true);
        toast({
          title: "Voice Input Active",
          description: "Speak your message now...",
        });
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCurrentMessage(transcript);
        setVoiceMode(false);
      };

      recognition.onerror = () => {
        setVoiceMode(false);
        toast({
          title: "Voice Input Error",
          description: "Failed to recognize speech. Please try again.",
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setVoiceMode(false);
      };

      recognition.start();
    } else {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice input.",
        variant: "destructive",
      });
    }
  };

  const handleMakeCall = async () => {
    setIsCalling(true);
    try {
      await makeCall(phoneNumber);
      toast({
        title: "Call Initiated",
        description: `Calling ${phoneNumber}`,
      });
    } catch (error) {
      toast({
        title: "Call Failed",
        description: "Unable to make call. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCalling(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (activeTab === 'sms') {
        handleSendSMS();
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-red-50 to-green-50 p-8 rounded-3xl max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-red-400 mb-4">Demo: Live Communication System</h2>
        <p className="text-gray-600 text-lg">
          Test our real SMS and voice call features! This demo system sends actual messages and makes real calls to showcase our food ordering platform's communication capabilities.
        </p>
      </div>

      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-red-400 text-xl">
            <Phone className="h-5 w-5" />
            Food Order Communications
            <Settings className="h-4 w-4 ml-auto text-gray-400" />
          </CardTitle>
          <p className="text-gray-600">Send SMS or call about your food order</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'sms' ? 'default' : 'outline'}
              className={`flex-1 ${activeTab === 'sms' ? 'bg-black text-white' : 'border-2 border-gray-300'}`}
              onClick={() => setActiveTab('sms')}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              SMS
            </Button>
            <Button
              variant={activeTab === 'call' ? 'default' : 'outline'}
              className={`flex-1 ${activeTab === 'call' ? 'bg-blue-100 text-blue-600 border-blue-200' : 'border-2 border-gray-300'}`}
              onClick={() => setActiveTab('call')}
              disabled={isCalling}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
            <Button
              variant={activeTab === 'ai_features' ? 'default' : 'outline'}
              className={`flex-1 ${activeTab === 'ai_features' ? 'bg-purple-100 text-purple-600 border-purple-200' : 'border-2 border-gray-300'}`}
              onClick={() => setActiveTab('ai_features')}
            >
              <Brain className="h-4 w-4 mr-2" />
              AI Features
            </Button>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Phone Number
            </label>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="text-lg font-mono"
              placeholder="+18001234567"
            />
            <p className="text-sm text-gray-500 mt-1">
              Using phone number: {phoneNumber}
            </p>
          </div>

          {/* Call Action */}
          {activeTab === 'call' && (
            <div className="text-center py-8">
              <Button
                onClick={handleMakeCall}
                disabled={isCalling || !isConnected}
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3"
              >
                <Phone className="h-5 w-5 mr-2" />
                {isCalling ? 'Calling...' : 'Call Now'}
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Calls will be routed through: +1 (804) 409-2778
              </p>
            </div>
          )}

          {/* SMS Interface */}
          {activeTab === 'sms' && (
            <>
              {/* AI Analysis Display */}
              {aiAnalysis && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-purple-800 mb-2 flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    AI Message Analysis
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <Badge variant={aiAnalysis.category === 'urgent' ? 'destructive' : 'secondary'}>
                        {aiAnalysis.category}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Priority:</span>
                      <span className="font-medium">{aiAnalysis.priority}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sentiment:</span>
                      <span className={`font-medium ${
                        aiAnalysis.sentiment === 'positive' ? 'text-green-600' :
                        aiAnalysis.sentiment === 'negative' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {aiAnalysis.sentiment}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Translation Controls */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-blue-800 flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Translation
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTranslationEnabled(!translationEnabled)}
                    className={translationEnabled ? 'bg-blue-100' : ''}
                  >
                    {translationEnabled ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                {translationEnabled && (
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full p-2 border border-blue-300 rounded text-sm"
                  >
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="zh">Chinese</option>
                    <option value="ja">Japanese</option>
                  </select>
                )}
              </div>

              {/* Message History */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Message History</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearMessages}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex justify-between items-start p-3 rounded-lg ${
                        message.sender === 'error' 
                          ? 'bg-red-50 border border-red-200' 
                          : 'bg-blue-50 border border-blue-200'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {message.sender === 'error' ? 'Error:' : 'You:'}
                          </span>
                          <span className="text-xs text-gray-500">{message.timestamp}</span>
                        </div>
                        <p className="text-gray-800">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No messages yet</p>
                  )}
                </div>
              </div>

              {/* New Message */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">New Message</h3>
                <div className="space-y-3">
                  <div className="relative">
                    <Textarea
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your message here..."
                      className="min-h-20 resize-none pr-12"
                      rows={3}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleVoiceInput}
                      disabled={voiceMode}
                      className="absolute top-2 right-2"
                    >
                      <Mic className={`h-4 w-4 ${voiceMode ? 'text-red-500' : 'text-gray-500'}`} />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Press Enter to send, Shift+Enter for new line, or click mic for voice input
                  </p>
                  <Button
                    onClick={handleSendSMS}
                    disabled={isSending || !isConnected || !currentMessage.trim()}
                    className="w-full bg-red-400 hover:bg-red-500 text-white"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSending ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* AI Features Tab */}
          {activeTab === 'ai_features' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">
                  Advanced AI Communication Features
                </h3>
                <p className="text-gray-600 mb-6">
                  Explore cutting-edge AI capabilities for enhanced communication
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <Brain className="h-5 w-5 text-purple-600 mr-2" />
                      <h4 className="font-medium">Smart Message Analysis</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      AI analyzes message sentiment, urgency, and intent for better communication
                    </p>
                    <Badge variant="secondary">Active</Badge>
                  </CardContent>
                </Card>

                <Card className="border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <Globe className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-medium">Real-time Translation</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Instant translation to 50+ languages with cultural adaptation
                    </p>
                    <Badge variant={translationEnabled ? "default" : "secondary"}>
                      {translationEnabled ? "Enabled" : "Available"}
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <Mic className="h-5 w-5 text-green-600 mr-2" />
                      <h4 className="font-medium">Voice Processing</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Speech-to-text and text-to-speech with emotion detection
                    </p>
                    <Badge variant="secondary">Available</Badge>
                  </CardContent>
                </Card>

                <Card className="border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <Video className="h-5 w-5 text-orange-600 mr-2" />
                      <h4 className="font-medium">Multi-Modal Input</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Support for text, voice, image, and video communication
                    </p>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </CardContent>
                </Card>

                <Card className="border-indigo-200">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <Zap className="h-5 w-5 text-indigo-600 mr-2" />
                      <h4 className="font-medium">Predictive Responses</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      AI suggests optimal responses based on context and history
                    </p>
                    <Badge variant="secondary">Beta</Badge>
                  </CardContent>
                </Card>

                <Card className="border-pink-200">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <Settings className="h-5 w-5 text-pink-600 mr-2" />
                      <h4 className="font-medium">Workflow Automation</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Automated follow-ups and task creation from conversations
                    </p>
                    <Badge variant="secondary">Enterprise</Badge>
                  </CardContent>
                </Card>
              </div>

              {/* AI Insights */}
              {aiAnalysis && (
                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-purple-800 mb-3">Latest AI Insights</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Suggested Response:</strong> {aiAnalysis.suggestedResponse}</p>
                      <p><strong>Action Required:</strong> {aiAnalysis.actionRequired ? 'Yes' : 'No'}</p>
                      <p><strong>Confidence:</strong> {Math.round((aiAnalysis.priority / 5) * 100)}%</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Connection Status */}
          {!isConnected && (
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-yellow-800 font-medium">API Configuration Required</p>
              <p className="text-yellow-700 text-sm mt-1">
                Communication features require Twilio API setup
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
