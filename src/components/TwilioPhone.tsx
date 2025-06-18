import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Phone, MessageSquare, PhoneCall, Send } from 'lucide-react';
import { getTwilioToken, sendSMS, makeCall, initializeTwilioDevice } from '@/lib/twilio';
import { useToast } from '@/hooks/use-toast';

export default function TwilioPhone() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [device, setDevice] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize Twilio device on component mount
    const initDevice = async () => {
      try {
        const twilioDevice = await initializeTwilioDevice();
        setDevice(twilioDevice);
        setIsConnected(true);
        toast({
          title: "Twilio Connected",
          description: "Phone system is ready for calls and SMS",
        });
      } catch (error) {
        console.error('Failed to initialize Twilio device:', error);
        // Don't show error toast immediately, let user try manually
        setIsConnected(false);
      }
    };

    initDevice();

    // Cleanup on unmount
    return () => {
      if (device) {
        device.destroy();
      }
    };
  }, []);

  const handleSendSMS = async () => {
    if (!phoneNumber || !smsMessage) {
      toast({
        title: "Missing Information",
        description: "Please enter both phone number and message",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const result = await sendSMS(phoneNumber, smsMessage);
      if (result.success) {
        toast({
          title: "SMS Sent",
          description: `Message sent successfully to ${phoneNumber}`,
        });
        setSmsMessage('');
      } else {
        throw new Error(result.error || 'Failed to send SMS');
      }
    } catch (error) {
      console.error('SMS Error:', error);
      toast({
        title: "SMS Failed",
        description: "Unable to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleMakeCall = async () => {
    if (!phoneNumber) {
      toast({
        title: "Missing Phone Number",
        description: "Please enter a phone number to call",
        variant: "destructive",
      });
      return;
    }

    setIsCalling(true);
    try {
      await makeCall(phoneNumber);
      toast({
        title: "Call Initiated",
        description: `Calling ${phoneNumber} via Twilio`,
      });
    } catch (error) {
      console.error('Call Error:', error);
      toast({
        title: "Call Failed",
        description: "Unable to make call. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCalling(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Twilio Phone System
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <Input
              type="tel"
              placeholder="Enter phone number (e.g., +1234567890)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <Tabs defaultValue="sms" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sms" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                SMS
              </TabsTrigger>
              <TabsTrigger value="call" className="flex items-center gap-1">
                <PhoneCall className="h-4 w-4" />
                Call
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sms" className="space-y-4">
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Enter your message..."
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  rows={4}
                />
              </div>
              <Button 
                onClick={handleSendSMS} 
                disabled={isSending || !isConnected}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSending ? 'Sending...' : 'Send SMS'}
              </Button>
            </TabsContent>

            <TabsContent value="call" className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>Calls will be routed through Twilio number:</p>
                <p className="font-mono">+1 (804) 409-2778</p>
              </div>
              <Button 
                onClick={handleMakeCall} 
                disabled={isCalling || !isConnected}
                className="w-full"
              >
                <PhoneCall className="h-4 w-4 mr-2" />
                {isCalling ? 'Calling...' : 'Make Call'}
              </Button>
            </TabsContent>
          </Tabs>

          {!isConnected && (
            <div className="text-sm text-muted-foreground text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="font-medium text-yellow-800">API Configuration Required</p>
              <p className="text-yellow-700">
                To enable calling and SMS features, please configure your Twilio API endpoints:
              </p>
              <ul className="text-xs text-yellow-600 mt-2 space-y-1">
                <li>• https://orderlybite.com/token</li>
                <li>• https://orderlybite.com/sms</li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}