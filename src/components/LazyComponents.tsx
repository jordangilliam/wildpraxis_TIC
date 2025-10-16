// Lazy-loaded components for code splitting
// Improves initial load time

import { lazy } from 'react';

// Phase 1 Components (Large)
export const AIMacroIdentifier = lazy(() => import('./AIMacroIdentifier').then(m => ({ default: m.AIMacroIdentifier })));
export const BrookAIChat = lazy(() => import('./BrookAIChat').then(m => ({ default: m.BrookAIChat })));
export const VirtualTroutLifeCycle = lazy(() => import('./VirtualTroutLifeCycle').then(m => ({ default: m.VirtualTroutLifeCycle })));
export const CrisisScenarios = lazy(() => import('./CrisisScenarios').then(m => ({ default: m.CrisisScenarios })));

// Phase 2 Components (Large)
export const VideoLibrary = lazy(() => import('./VideoLibrary').then(m => ({ default: m.VideoLibrary })));
export const PodcastPlayer = lazy(() => import('./PodcastPlayer').then(m => ({ default: m.PodcastPlayer })));
export const ARTroutAnatomy = lazy(() => import('./ARTroutAnatomy').then(m => ({ default: m.ARTroutAnatomy })));
export const ParentPortal = lazy(() => import('./ParentPortal').then(m => ({ default: m.ParentPortal })));
export const AccessibilityPanel = lazy(() => import('./AccessibilityPanel').then(m => ({ default: m.AccessibilityPanel })));

// Data Features
export const LiveDataDashboard = lazy(() => import('./LiveDataDashboard').then(m => ({ default: m.LiveDataDashboard })));
export const DataVisualization = lazy(() => import('./DataVisualization').then(m => ({ default: m.DataVisualization })));
export const MobileFieldApp = lazy(() => import('./MobileFieldApp').then(m => ({ default: m.MobileFieldApp })));
export const InteractiveLearning = lazy(() => import('./InteractiveLearning').then(m => ({ default: m.InteractiveLearning })));

// Games
export const RobloxStyleGames = lazy(() => import('./RobloxStyleGames').then(m => ({ default: m.RobloxStyleGames })));

