interface TwilioToken {
  token: string;
  identity?: string;
}

interface SMSRequest {
  to: string;
  message: string;
}

interface SMSResponse {
  success: boolean;
  messageSid?: string;
  error?: string;
  response?: string;
  contentType?: string;
}

// Get Twilio access token from your API
export async function getTwilioToken(): Promise<TwilioToken> {
  const tokenUrl = import.meta.env.VITE_TOKEN_WEBHOOK_URL || 'https://omniassistai.com/token';
  try { 
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get Twilio token: ${error.message}`);
    }
    throw new Error('Failed to get Twilio token: Unknown error');
  }
}

// Send SMS via your API
export async function sendSMS(to: string, message: string): Promise<SMSResponse> {
    console.log(`sendSMS sending ${message} to ${to}`)
    const smsUrl = import.meta.env.VITE_SMS_WEBHOOK_URL || 'https://omniassistai.com/sms';
    try {
        // ✅ Send form data directly to Python backend
        const formData = new URLSearchParams();
        formData.append('From', to);
        formData.append('Body', message);
        formData.append('MessageSid', `SM${Date.now()}${Math.random().toString(36).substr(2, 9)}`);

        const response = await fetch(smsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',  // ✅ Form data
            },
            body: formData.toString(),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Handle XML response from Python backend
        const responseText = await response.text();
        let botResponse = '';
        
        if (responseText.includes('<?xml')) {
            const messageMatch = responseText.match(/<Message>(.*?)<\/Message>/s);
            botResponse = messageMatch ? messageMatch[1].trim() : 'Response received';
        } else {
            botResponse = responseText;
        }

        return {
            success: true,
            response: botResponse
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to send SMS: ${error.message}`);
        }
        throw new Error('Failed to send SMS: Unknown error');
    }
}

// Send SMS via your API
export async function sendSMS_backup(to: string, message: string): Promise<SMSResponse> {
  console.log (` sendSMS sending 2 ${message} to ${to}`)
  const smsUrl = import.meta.env.VITE_SMS_WEBHOOK_URL || 'https://omniassistai.com/sms';
  try { 
    const response = await fetch(smsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, message }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
    throw new Error('Failed to send SMS: Unknown error');
  }
}

// Make a call using Twilio Voice SDK
export async function makeCall(to: string): Promise<void> {
  try {
    // Import Twilio Voice SDK dynamically
    const { Device } = await import('@twilio/voice-sdk');
    
    // Get access token
    const tokenData = await getTwilioToken();
    
    // Initialize Twilio Device
    const device = new Device(tokenData.token);
    
    // Set up device event listeners
    device.on('ready', () => {
      console.log('Twilio Device is ready');
    });
    
    device.on('error', (error) => {
      console.error('Twilio Device error:', error);
    });
    
    device.on('incoming', (call) => {
      console.log('Incoming call:', call);
    });
    
    // Register the device
    await device.register();
    
    // Make the call to the Twilio number
    const call = await device.connect({
      params: {
        To: '18044092778', // Your Twilio number
        From: to // The number to call from
      }
    });
    
    console.log('Call initiated:', call);
    
  } catch (error) {
    console.error('Error making call:', error);
    throw error;
  }
}  

// Initialize Twilio Device for incoming calls
export async function initializeTwilioDevice(): Promise<any> {
  try {
    const { Device } = await import('@twilio/voice-sdk');
    const tokenData = await getTwilioToken();
    
    console.log('Initializing Twilio Device with token...');
    
    const device = new Device(tokenData.token, {
      logLevel: 'debug',
      allowIncomingWhileBusy: true
    });
    
    device.on('ready', () => {
      console.log('Twilio Device ready for incoming calls');
    });
    
    device.on('incoming', (call) => {
      console.log('Incoming call from:', call.parameters?.From || 'Unknown');
      // Auto-accept incoming calls or show UI to accept/reject
      call.accept();
    });
    
    device.on('error', (error) => {
      console.error('Twilio Device error:', error);
    });
    
    device.on('tokenWillExpire', () => {
      console.log('Token will expire, refreshing...');
      // Refresh token if needed
    });
    
    await device.register();
    console.log('Twilio Device registered successfully');
    return device;
    
  } catch (error) {
    console.error('Error initializing Twilio device:', error);
    throw error;
  }
}
