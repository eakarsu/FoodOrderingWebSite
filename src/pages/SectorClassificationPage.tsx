import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { SECTORS } from "../lib/sectors";

export default function SectorClassificationPage() {
  const [, setLocation] = useLocation();
  
  // Get classification from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const classificationType = urlParams.get('type') as 'immediate' | 'consultation' | 'product' | 'experience';
  
  // Filter sectors by classification type
  const sectorsInClassification = SECTORS.filter(sector => sector.sectorType === classificationType);
  
  const getClassificationInfo = () => {
    switch (classificationType) {
      case 'immediate':
        return {
          title: 'Immediate Services',
          description: 'Services that provide real-time booking, quick response, and immediate assistance',
          icon: '⚡',
          color: '#FF6B35'
        };
      case 'consultation':
        return {
          title: 'Consultation Services',
          description: 'Professional consultation services with appointment scheduling and secure communication',
          icon: '💼',
          color: '#4169E1'
        };
      case 'product':
        return {
          title: 'Product & Retail',
          description: 'Product-based services with catalog browsing, inventory management, and order processing',
          icon: '📦',
          color: '#228B22'
        };
      case 'experience':
        return {
          title: 'Experience Services',
          description: 'Event-based services with scheduling, progress tracking, and community features',
          icon: '🎯',
          color: '#FF1493'
        };
      default:
        return {
          title: 'Services',
          description: 'Select a service sector',
          icon: '🔧',
          color: '#6B7280'
        };
    }
  };

  const classificationInfo = getClassificationInfo();

  if (!classificationType || sectorsInClassification.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Classification not found</h1>
          <Button onClick={() => setLocation('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <div className="flex items-center gap-3">
              <div 
                className="text-3xl p-3 rounded-lg"
                style={{ backgroundColor: `${classificationInfo.color}20`, color: classificationInfo.color }}
              >
                {classificationInfo.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{classificationInfo.title}</h1>
                <p className="text-gray-600">{classificationInfo.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold mb-2">
            Choose Your {classificationInfo.title} Sector
          </h2>
          <p className="text-gray-600">
            Select from {sectorsInClassification.length} available sectors in this category
          </p>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sectorsInClassification.map((sector) => (
            <Card key={sector.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full border-2 hover:border-primary/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div 
                    className="text-3xl p-3 rounded-lg shadow-sm"
                    style={{ backgroundColor: `${sector.primaryColor}20`, color: sector.primaryColor }}
                  >
                    {sector.icon}
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
                  {sector.displayName}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {sector.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3 mb-4">
                  <div 
                    className="text-xs px-3 py-1 rounded-full inline-block font-medium"
                    style={{ backgroundColor: `${sector.primaryColor}20`, color: sector.primaryColor }}
                  >
                    AI-Enabled
                  </div>
                </div>

                {/* Sector-Specific Action Buttons */}
                <div className="space-y-2">
                  {/* Immediate Service Buttons */}
                  {sector.sectorType === 'immediate' && (
                    <div className="grid grid-cols-1 gap-2">
                      <Button 
                        size="sm" 
                        className="w-full text-xs"
                        style={{ backgroundColor: sector.primaryColor }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setLocation(`/booking?sector=${sector.id}&feature=booking`);
                        }}
                      >
                        📅 Real-Time Booking
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full text-xs"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setLocation(`/booking?sector=${sector.id}&feature=booking&type=duration`);
                        }}
                      >
                        ⏱️ Service Duration
                      </Button>
                      {(sector.id === 'auto_repair' || sector.id === 'healthcare' || sector.id === 'home_services' || sector.id === 'pet_services') && (
                        <Button 
                          size="sm" 
                          variant="destructive"
                          className="w-full text-xs"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setLocation(`/booking?sector=${sector.id}&feature=emergency`);
                          }}
                        >
                          🚨 Emergency Service
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Consultation Service Buttons */}
                  {sector.sectorType === 'consultation' && (
                    <div className="grid grid-cols-1 gap-2">
                      <Button 
                        size="sm" 
                        className="w-full text-xs"
                        style={{ backgroundColor: sector.primaryColor }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setLocation(`/booking?sector=${sector.id}&feature=consultation`);
                        }}
                      >
                        📋 Schedule Consultation
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full text-xs"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setLocation(`/booking?sector=${sector.id}&feature=document`);
                        }}
                      >
                        📄 Upload Documents
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full text-xs"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setLocation(`/booking?sector=${sector.id}&feature=chat`);
                        }}
                      >
                        🔒 Start Secure Chat
                      </Button>
                    </div>
                  )}

                  {/* Product/Retail Buttons */}
                  {sector.sectorType === 'product' && (
                    <div className="grid grid-cols-1 gap-2">
                      <Button 
                        size="sm" 
                        className="w-full text-xs"
                        style={{ backgroundColor: sector.primaryColor }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setLocation(`/booking?sector=${sector.id}&feature=catalog`);
                        }}
                      >
                        📦 View Catalog
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full text-xs"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setLocation(`/booking?sector=${sector.id}&feature=inventory`);
                        }}
                      >
                        📊 Inventory Status
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full text-xs"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setLocation(`/booking?sector=${sector.id}&feature=order`);
                        }}
                      >
                        🛒 Place Order
                      </Button>
                    </div>
                  )}

                  {/* Experience Service Buttons */}
                  {sector.sectorType === 'experience' && (
                    <div className="grid grid-cols-1 gap-2">
                      <Button 
                        size="sm" 
                        className="w-full text-xs"
                        style={{ backgroundColor: sector.primaryColor }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setLocation(`/booking?sector=${sector.id}&feature=event`);
                        }}
                      >
                        📅 Schedule Event
                      </Button>
                      {(sector.id === 'education_tutoring' || sector.id === 'fitness_gym') && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="w-full text-xs"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setLocation(`/booking?sector=${sector.id}&feature=progress`);
                          }}
                        >
                          📈 Track Progress
                        </Button>
                      )}
                      {(sector.id === 'education_tutoring' || sector.id === 'fitness_gym' || sector.id === 'travel_hotel') && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="w-full text-xs"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setLocation(`/booking?sector=${sector.id}&feature=community`);
                          }}
                        >
                          👥 Join Community
                        </Button>
                      )}
                    </div>
                  )}

                  {/* View Services Button */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-xs mt-2 border hover:bg-gray-50"
                    onClick={() => setLocation(`/categories?sector=${sector.id}`)}
                  >
                    View All Services →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
