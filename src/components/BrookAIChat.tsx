// BrookAI Chat Integration
// Skillbuilder.io agent with privacy and security

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card';
import { Badge } from './badge';
import { MessageCircle, Shield, Lock } from 'lucide-react';

declare global {
  interface Window {
    chatConfig: {
      chatId: string;
      env: string;
    };
  }
}

export function BrookAIChat() {
  const [chatLoaded, setChatLoaded] = useState(false);

  useEffect(() => {
    // Set up chat configuration
    window.chatConfig = {
      chatId: "FX9IIOtCFx",
      env: "skl"
    };

    // Load Skillbuilder.io script
    const script = document.createElement('script');
    script.src = "https://d36ewmyb2wrx29.cloudfront.net/index.js";
    script.async = true;
    script.onload = () => {
      setChatLoaded(true);
    };
    
    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <MessageCircle className="w-8 h-8 text-blue-500" />
          BrookAI Assistant
        </h2>
        <p className="text-gray-600 mt-1">
          Ask me anything about trout care, water quality, or the TIC program!
        </p>
      </div>

      {/* Privacy Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="flex gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <Lock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">Privacy & Security</h3>
              <p className="text-sm text-blue-800">
                BrookAI is powered by Skillbuilder.io with built-in privacy and security. 
                Your conversations are protected and not shared with third parties.
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">🔒 Encrypted</Badge>
                <Badge variant="secondary">🛡️ Private</Badge>
                <Badge variant="secondary">✅ Secure</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Chat with BrookAI</CardTitle>
          <CardDescription>
            Get instant answers to your trout care questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!chatLoaded ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-600">Loading BrookAI chat interface...</p>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-600">
              Chat widget should appear in the bottom right corner →
            </div>
          )}

          {/* Suggested Questions */}
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-3">Suggested Questions:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                "What temperature should my tank be?",
                "How often should I change the water?",
                "What do I feed trout fry?",
                "How do I cycle my aquarium?",
                "What causes cloudy water?",
                "When should I release my trout?",
                "How do I test water quality?",
                "What is the nitrogen cycle?"
              ].map((question, i) => (
                <button
                  key={i}
                  className="p-3 text-left text-sm border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">BrookAI Can Help With:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span><strong>Water Quality:</strong> Temperature, pH, ammonia, nitrite, nitrate guidance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span><strong>Trout Care:</strong> Feeding schedules, growth stages, health monitoring</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span><strong>Equipment:</strong> Chiller setup, filter maintenance, troubleshooting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span><strong>Curriculum:</strong> Lesson ideas, PA standards alignment, activities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span><strong>Biology:</strong> Life cycles, anatomy, adaptations, species identification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span><strong>Release Day:</strong> Timing, site selection, acclimation procedures</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Expert Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Need More Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="font-semibold min-w-[120px]">Dr. Sara Mueller:</span>
              <span>Penn State Extension Aquaculture Specialist</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold min-w-[120px]">PFBC Liaison:</span>
              <span>Your assigned PA Fish & Boat Commission contact</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold min-w-[120px]">Trout Unlimited:</span>
              <span>Local chapter volunteers and mentors</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

