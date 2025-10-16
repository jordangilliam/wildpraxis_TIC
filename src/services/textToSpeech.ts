// Text-to-Speech Service
// Web Speech API implementation for audio narration

export interface VoiceOptions {
  lang: string;
  rate: number; // 0.1 to 10, default 1
  pitch: number; // 0 to 2, default 1
  volume: number; // 0 to 1, default 1
}

class TextToSpeechService {
  private synthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.synthesis = window.speechSynthesis;
    
    // Load voices
    this.loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  private loadVoices() {
    this.voices = this.synthesis.getVoices();
  }

  getAvailableVoices(lang?: string): SpeechSynthesisVoice[] {
    if (!lang) return this.voices;
    return this.voices.filter(voice => voice.lang.startsWith(lang));
  }

  speak(
    text: string,
    options: Partial<VoiceOptions> = {},
    onEnd?: () => void,
    onError?: (error: Error) => void
  ) {
    // Stop any current speech
    this.stop();

    const {
      lang = 'en-US',
      rate = 0.9,
      pitch = 1,
      volume = 1,
    } = options;

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find best voice for language
    const preferredVoice = this.voices.find(
      voice => voice.lang === lang
    ) || this.voices.find(
      voice => voice.lang.startsWith(lang.split('-')[0])
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      this.currentUtterance = null;
      if (onError) {
        onError(new Error(`Speech synthesis error: ${event.error}`));
      }
    };

    this.currentUtterance = utterance;
    this.synthesis.speak(utterance);
  }

  pause() {
    if (this.synthesis.speaking && !this.synthesis.paused) {
      this.synthesis.pause();
    }
  }

  resume() {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  stop() {
    this.synthesis.cancel();
    this.currentUtterance = null;
  }

  isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  isPaused(): boolean {
    return this.synthesis.paused;
  }
}

// Export singleton instance
export const textToSpeech = new TextToSpeechService();

// React Hook
export function useTextToSpeech() {
  const [speaking, setSpeaking] = React.useState(false);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSpeaking(textToSpeech.isSpeaking());
      setPaused(textToSpeech.isPaused());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const speak = (text: string, options?: Partial<VoiceOptions>) => {
    textToSpeech.speak(text, options);
  };

  const pause = () => textToSpeech.pause();
  const resume = () => textToSpeech.resume();
  const stop = () => textToSpeech.stop();

  return { speak, pause, resume, stop, speaking, paused };
}

// Add React import at top
import React from 'react';

