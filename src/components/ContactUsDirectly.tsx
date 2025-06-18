import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Phone, Send, Trash2, Settings } from 'lucide-react';
import { sendSMS, makeCall, initializeTwilioDevice } from '@/lib/twilio';
import { useToast } from '@/hooks/use-toast';

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
  const [activeTab, setActiveTab] = useState<'sms' | 'call'>('sms');
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
      const result = await sendSMS(phoneNumber, currentMessage);
      
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
          description: `SMS sent successfully to ${phoneNumber}`,
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
          <div className="flex gap-4">
            <Button
              variant={activeTab === 'sms' ? 'default' : 'outline'}
              className={`flex-1 ${activeTab === 'sms' ? 'bg-black text-white' : 'border-2 border-gray-300'}`}
              onClick={() => setActiveTab('sms')}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Send SMS
            </Button>
            <Button
              variant={activeTab === 'call' ? 'default' : 'outline'}
              className={`flex-1 ${activeTab === 'call' ? 'bg-blue-100 text-blue-600 border-blue-200' : 'border-2 border-gray-300'}`}
              onClick={() => setActiveTab('call')}
              disabled={isCalling}
            >
              <Phone className="h-4 w-4 mr-2" />
              {isCalling ? 'Calling...' : 'Make Call'}
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
                  <Textarea
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your message here..."
                    className="min-h-20 resize-none"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">
                    Press Enter to send, Shift+Enter for new line
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