import { Shield, Eye, Lock, Users, Database, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how Orderly Bite collects, uses, and protects your personal information.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: May 31, 2025</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Quick Overview */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Quick Summary:</strong> We collect minimal data necessary to provide our food ordering service. We never sell your information and use industry-standard security measures to protect your data.
            </AlertDescription>
          </Alert>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Name and contact information (phone, email, address)</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                  <li>Order history and preferences</li>
                  <li>Delivery instructions and special requests</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Technical Information</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Device information and browser type</li>
                  <li>IP address and location data (for delivery purposes)</li>
                  <li>Usage patterns and website interaction data</li>
                  <li>SMS and voice call logs (for order processing)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">AI and Personalization Data</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Food preferences and dietary restrictions</li>
                  <li>Order patterns and timing preferences</li>
                  <li>Feedback and ratings on meals</li>
                  <li>Communication preferences (SMS, voice, web)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Service Delivery</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Processing and fulfilling your orders</li>
                    <li>• Coordinating delivery logistics</li>
                    <li>• Providing customer support</li>
                    <li>• Sending order confirmations and updates</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">AI Personalization</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Generating personalized meal recommendations</li>
                    <li>• Improving our AI algorithms</li>
                    <li>• Customizing your ordering experience</li>
                    <li>• Predicting delivery preferences</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Communication</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• SMS order confirmations and updates</li>
                    <li>• Voice call order processing</li>
                    <li>• Email receipts and notifications</li>
                    <li>• Marketing communications (with consent)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Business Operations</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Fraud prevention and security</li>
                    <li>• Analytics and service improvement</li>
                    <li>• Legal compliance and dispute resolution</li>
                    <li>• Platform development and testing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Data Protection & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Technical Safeguards</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• SSL/TLS encryption for all data transmission</li>
                    <li>• Secure payment processing through certified providers</li>
                    <li>• Regular security audits and updates</li>
                    <li>• Access controls and authentication systems</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Operational Safeguards</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Limited employee access to personal data</li>
                    <li>• Data minimization and retention policies</li>
                    <li>• Regular staff training on privacy practices</li>
                    <li>• Incident response and breach notification procedures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Data Sharing & Third Parties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  <strong>We never sell your personal information.</strong> We only share data with trusted partners necessary for service delivery.
                </AlertDescription>
              </Alert>

              <div>
                <h4 className="font-semibold mb-3">Service Partners</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Payment processors (for secure transactions)</li>
                  <li>• Delivery partners (for order fulfillment)</li>
                  <li>• SMS and voice service providers (for communications)</li>
                  <li>• Cloud hosting providers (for data storage)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Legal Requirements</h4>
                <p className="text-sm text-gray-700">
                  We may disclose information when required by law, to protect our rights, or to ensure the safety of our users and the public.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Access & Control</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Request a copy of your personal data</li>
                    <li>• Update or correct your information</li>
                    <li>• Delete your account and associated data</li>
                    <li>• Opt out of marketing communications</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Communication Preferences</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Choose SMS, email, or voice preferences</li>
                    <li>• Control AI recommendation settings</li>
                    <li>• Manage notification frequency</li>
                    <li>• Opt out of promotional messages</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookies & Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>Cookies & Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3">Types of Cookies We Use</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h5 className="font-medium">Essential Cookies</h5>
                    <p className="text-sm text-gray-600">Required for basic website functionality and order processing</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h5 className="font-medium">Performance Cookies</h5>
                    <p className="text-sm text-gray-600">Help us understand how users interact with our platform</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h5 className="font-medium">Personalization Cookies</h5>
                    <p className="text-sm text-gray-600">Enable AI recommendations and customized experiences</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h5 className="font-medium">Marketing Cookies</h5>
                    <p className="text-sm text-gray-600">Deliver relevant offers and track campaign effectiveness</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy Questions & Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Privacy Officer</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="text-sm">privacy@orderlybite.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span className="text-sm">804-360-1129</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Mailing Address</h4>
                  <p className="text-sm text-gray-700">
                    Orderly Bite Privacy Department<br />
                    2807 Hampton Drive<br />
                    Henrico, VA 23233
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <h4 className="font-semibold mb-2">Updates to This Policy</h4>
                <p className="text-sm text-gray-700">
                  We may update this privacy policy from time to time. We will notify you of significant changes via email or through our platform. 
                  Continued use of our services after changes constitutes acceptance of the updated policy.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}