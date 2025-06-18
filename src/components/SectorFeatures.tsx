import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Clock, 
  Calendar, 
  AlertTriangle, 
  FileText, 
  Shield, 
  Package, 
  BarChart3, 
  ShoppingCart,
  Users,
  TrendingUp,
  Camera
} from 'lucide-react';
import type { Sector } from '../lib/sectors';

interface SectorFeaturesProps {
  sector: Sector;
}

export default function SectorFeatures({ sector }: SectorFeaturesProps) {
  const renderImmediateFeatures = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {sector.features.hasRealTimeBooking && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              Real-Time Booking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 mb-3">Book appointments instantly with live availability</p>
            <Button size="sm" className="w-full">Book Now</Button>
          </CardContent>
        </Card>
      )}
      
      {sector.features.hasServiceDuration && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              Service Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 mb-3">Accurate time estimates for all services</p>
            <Badge variant="outline">30-90 min</Badge>
          </CardContent>
        </Card>
      )}
      
      {sector.features.hasEmergencyFlag && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Emergency Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 mb-3">24/7 emergency support available</p>
            <Button size="sm" variant="destructive" className="w-full">Emergency Call</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderConsultationFeatures = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {sector.features.hasAppointmentScheduling && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              Appointment Scheduling
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 mb-3">Schedule consultations with professionals</p>
            <Button size="sm" className="w-full">Schedule Consultation</Button>
          </CardContent>
        </Card>
      )}
      
      {sector.features.hasDocumentUpload && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="h-4 w-4 text-orange-600" />
              Document Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 mb-3">Securely upload and share documents</p>
            <Button size="sm" variant="outline" className="w-full">Upload Files</Button>
          </CardContent>
        </Card>
      )}
      
      {sector.features.hasSecureCommunication && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              Secure Communication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 mb-3">Encrypted messaging and calls</p>
            <Button size="sm" className="w-full">Start Secure Chat</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderProductFeatures = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {sector.features.hasProductCatalog && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-600" />
              Product Catalog
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 mb-3">Browse our complete product range</p>
            <Button size="sm" className="w-full">View Catalog</Button>
          </CardContent>
        </Card>
      )}
      
      {sector.features.hasInventoryManagement && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              Inventory Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 mb-3">Real-time stock availability</p>
            <Badge variant="outline" className="text-green-600">In Stock</Badge>
          </CardContent>
        </Card>
      )}
      
      {sector.features.hasOrderProcessing && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-orange-600" />
              Order Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 mb-3">Fast and reliable order fulfillment</p>
            <Button size="sm" className="w-full">Place Order</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderExperienceFeatures = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {sector.features.hasEventScheduling && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-600" />
              Event Scheduling
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 mb-3">Schedule classes, events, and sessions</p>
            <Button size="sm" className="w-full">View Schedule</Button>
          </CardContent>
        </Card>
      )}
      
      {sector.features.hasProgressTracking && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Progress Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 mb-3">Monitor your learning and achievements</p>
            <Button size="sm" variant="outline" className="w-full">View Progress</Button>
          </CardContent>
        </Card>
      )}
      
      {sector.features.hasCommunityFeatures && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              Community
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600 mb-3">Connect with other participants</p>
            <Button size="sm" className="w-full">Join Community</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          {sector.displayName} Features
        </h3>
        <div className="flex justify-center gap-2 mb-4">
          <Badge 
            variant="outline" 
            className="text-xs"
            style={{ borderColor: sector.primaryColor, color: sector.primaryColor }}
          >
            {sector.sectorType === 'immediate' && '⚡ Immediate Service'}
            {sector.sectorType === 'consultation' && '💼 Consultation-Based'}
            {sector.sectorType === 'product' && '📦 Product/Retail'}
            {sector.sectorType === 'experience' && '🎯 Experience-Based'}
          </Badge>
        </div>
      </div>

      {sector.sectorType === 'immediate' && renderImmediateFeatures()}
      {sector.sectorType === 'consultation' && renderConsultationFeatures()}
      {sector.sectorType === 'product' && renderProductFeatures()}
      {sector.sectorType === 'experience' && renderExperienceFeatures()}
    </div>
  );
}
