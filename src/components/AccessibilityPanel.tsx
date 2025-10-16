// Accessibility Settings Panel
// User-facing controls for all accessibility options

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card';
import { Button } from './button';
import { Label } from './label';
import { Switch } from './switch';
import { Badge } from './badge';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { 
  Eye, Moon, Sun, Type, Zap, Headphones, Keyboard, 
  Contrast, Accessibility as AccessibilityIcon 
} from 'lucide-react';

export function AccessibilityPanel() {
  const { settings, updateSettings } = useAccessibility();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <AccessibilityIcon className="w-8 h-8" />
          Accessibility Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Customize your experience for better accessibility
        </p>
      </div>

      {/* Visual Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Visual Settings
          </CardTitle>
          <CardDescription>
            Adjust colors, contrast, and display options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.darkMode ? (
                <Moon className="w-5 h-5 text-blue-500" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
              )}
              <div>
                <Label htmlFor="dark-mode" className="font-semibold">
                  Dark Mode
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Reduce eye strain in low light
                </p>
              </div>
            </div>
            <Switch
              id="dark-mode"
              checked={settings.darkMode}
              onCheckedChange={(checked) => updateSettings({ darkMode: checked })}
            />
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Contrast className="w-5 h-5 text-gray-700" />
              <div>
                <Label htmlFor="high-contrast" className="font-semibold">
                  High Contrast Mode
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enhance text and interface visibility
                </p>
              </div>
            </div>
            <Switch
              id="high-contrast"
              checked={settings.highContrast}
              onCheckedChange={(checked) => updateSettings({ highContrast: checked })}
            />
          </div>

          {/* Font Size */}
          <div>
            <Label className="font-semibold mb-3 block">Text Size</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={settings.fontSize === 'normal' ? 'default' : 'outline'}
                onClick={() => updateSettings({ fontSize: 'normal' })}
                className="text-sm"
              >
                Normal
              </Button>
              <Button
                variant={settings.fontSize === 'large' ? 'default' : 'outline'}
                onClick={() => updateSettings({ fontSize: 'large' })}
                className="text-base"
              >
                Large
              </Button>
              <Button
                variant={settings.fontSize === 'x-large' ? 'default' : 'outline'}
                onClick={() => updateSettings({ fontSize: 'x-large' })}
                className="text-lg"
              >
                X-Large
              </Button>
            </div>
          </div>

          {/* Dyslexia Font */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Type className="w-5 h-5 text-purple-500" />
              <div>
                <Label htmlFor="dyslexia-font" className="font-semibold">
                  Dyslexia-Friendly Font
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use OpenDyslexic font for easier reading
                </p>
              </div>
            </div>
            <Switch
              id="dyslexia-font"
              checked={settings.dyslexiaFont}
              onCheckedChange={(checked) => updateSettings({ dyslexiaFont: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Motion & Animation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Motion Settings
          </CardTitle>
          <CardDescription>
            Control animations and transitions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-orange-500" />
              <div>
                <Label htmlFor="reduce-motion" className="font-semibold">
                  Reduce Motion
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Minimize animations and transitions
                </p>
              </div>
            </div>
            <Switch
              id="reduce-motion"
              checked={settings.reduceMotion}
              onCheckedChange={(checked) => updateSettings({ reduceMotion: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Screen Reader & Audio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="w-5 h-5" />
            Audio & Screen Reader
          </CardTitle>
          <CardDescription>
            Settings for screen reader users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Headphones className="w-5 h-5 text-green-500" />
              <div>
                <Label htmlFor="screen-reader" className="font-semibold">
                  Screen Reader Announcements
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enable live region updates
                </p>
              </div>
            </div>
            <Switch
              id="screen-reader"
              checked={settings.screenReaderAnnouncements}
              onCheckedChange={(checked) => updateSettings({ screenReaderAnnouncements: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Navigation
          </CardTitle>
          <CardDescription>
            Keyboard shortcuts and navigation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Keyboard className="w-5 h-5 text-blue-500" />
              <div>
                <Label htmlFor="keyboard-shortcuts" className="font-semibold">
                  Keyboard Shortcuts
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enable quick navigation shortcuts
                </p>
              </div>
            </div>
            <Switch
              id="keyboard-shortcuts"
              checked={settings.keyboardShortcutsEnabled}
              onCheckedChange={(checked) => updateSettings({ keyboardShortcutsEnabled: checked })}
            />
          </div>

          {/* Shortcut Guide */}
          {settings.keyboardShortcutsEnabled && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold mb-3">Available Shortcuts:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Open AI Macro ID</span>
                  <Badge variant="secondary">Alt + M</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Open BrookAI Chat</span>
                  <Badge variant="secondary">Alt + B</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Open Life Cycle</span>
                  <Badge variant="secondary">Alt + L</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Open Crisis Training</span>
                  <Badge variant="secondary">Alt + C</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Show all shortcuts</span>
                  <Badge variant="secondary">?</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Navigate forward</span>
                  <Badge variant="secondary">Tab</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Navigate backward</span>
                  <Badge variant="secondary">Shift + Tab</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Close modal/dialog</span>
                  <Badge variant="secondary">Esc</Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reset to Defaults */}
      <Card>
        <CardContent className="pt-6">
          <Button
            variant="outline"
            onClick={() => updateSettings({
              darkMode: false,
              highContrast: false,
              fontSize: 'normal',
              reduceMotion: false,
              dyslexiaFont: false,
              screenReaderAnnouncements: true,
              keyboardShortcutsEnabled: true,
            })}
            className="w-full"
          >
            Reset to Default Settings
          </Button>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Need Additional Help?
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
            We're committed to making this app accessible to everyone. If you encounter
            any accessibility barriers or have suggestions for improvement, please let
            us know.
          </p>
          <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
            <div>
              <strong>WCAG Compliance:</strong> We aim for WCAG 2.1 Level AA
            </div>
            <div>
              <strong>Screen Readers:</strong> Tested with NVDA, JAWS, and VoiceOver
            </div>
            <div>
              <strong>Feedback:</strong> accessibility@wildpraxis.org
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

