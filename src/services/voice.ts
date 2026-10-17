export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
  confidence: number;
}

export type SupportedVoiceLanguage = 'en-IN' | 'hi-IN' | 'mr-IN';

export class VoiceService {
  private recognition: any = null;
  public isSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.isSupported = true;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
      }
    }
  }

  startListening(
    lang: SupportedVoiceLanguage = 'en-IN',
    onResult: (result: SpeechRecognitionResult) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): boolean {
    if (!this.isSupported || !this.recognition) {
      onError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or enter text manually.');
      return false;
    }

    try {
      this.recognition.lang = lang;

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        const confidence = event.results[0]?.[0]?.confidence || 0.9;

        onResult({
          transcript: text,
          isFinal: !!finalTranscript,
          confidence: Math.round(confidence * 100)
        });
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        onError(event.error === 'not-allowed' ? 'Microphone permission denied.' : `Speech recognition notice: ${event.error}`);
      };

      this.recognition.onend = () => {
        onEnd();
      };

      this.recognition.start();
      return true;
    } catch (e: any) {
      onError(e.message || 'Could not start speech recognition');
      return false;
    }
  }

  stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Already stopped
      }
    }
  }
}

export const voiceService = new VoiceService();
