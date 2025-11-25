import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultCard } from './components/ResultCard';
import { generateCaptions } from './services/geminiService';
import { MediaFile, CaptionResponse, AppState } from './types';
import { Loader2, RefreshCw, Aperture, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [media, setMedia] = useState<MediaFile | null>(null);
  const [result, setResult] = useState<CaptionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedMedia: MediaFile) => {
    setMedia(selectedMedia);
    setResult(null);
    setError(null);
    setAppState(AppState.IDLE);
  };

  const handleGenerate = async () => {
    if (!media) return;

    setAppState(AppState.ANALYZING);
    setError(null);

    try {
      const data = await generateCaptions(media.base64, media.mimeType);
      setResult(data);
      setAppState(AppState.SUCCESS);
    } catch (err) {
      console.error(err);
      setError("Failed to generate captions. Please try again or check your file.");
      setAppState(AppState.ERROR);
    }
  };

  const reset = () => {
    setMedia(null);
    setResult(null);
    setAppState(AppState.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-lg">
              <Aperture className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-white">Lens & Lyric</h1>
              <p className="text-xs text-slate-400 hidden sm:block">AI Contextual Captioning</p>
            </div>
          </div>
          <div className="text-sm font-medium text-slate-400">
            Powered by Google Gemini
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          
          {/* Hero / Intro */}
          {!media && (
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-indigo-200 mb-6 font-serif">
                Give your moments a voice.
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed max-w-xl mx-auto">
                Upload an image or video. Our AI interprets the deeper meaning, mood, and context to craft the perfect bilingual captions.
              </p>
            </div>
          )}

          {/* Upload Section */}
          {!media && (
            <FileUpload onFileSelect={handleFileSelect} disabled={false} />
          )}

          {/* Preview & Analysis Section */}
          {media && (
            <div className="space-y-8 animate-in zoom-in-95 duration-500">
              
              {/* Media Preview */}
              <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800 group">
                {media.type === 'video' ? (
                  <video 
                    src={media.previewUrl} 
                    controls 
                    className="w-full max-h-[60vh] object-contain mx-auto" 
                  />
                ) : (
                  <img 
                    src={media.previewUrl} 
                    alt="Preview" 
                    className="w-full max-h-[60vh] object-contain mx-auto" 
                  />
                )}
                
                {appState === AppState.IDLE && (
                   <button 
                    onClick={reset}
                    className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                    title="Change file"
                   >
                     <RefreshCw className="w-5 h-5" />
                   </button>
                )}
              </div>

              {/* Action Area */}
              {appState === AppState.IDLE && (
                <div className="flex justify-center">
                  <button
                    onClick={handleGenerate}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 px-12 rounded-full shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-3 text-lg"
                  >
                    <Sparkles className="w-5 h-5" />
                    Interpret & Generate Captions
                  </button>
                </div>
              )}

              {/* Loading State */}
              {appState === AppState.ANALYZING && (
                <div className="text-center py-12">
                  <div className="inline-block relative">
                    <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse"></div>
                    <Loader2 className="w-12 h-12 text-indigo-400 animate-spin relative z-10" />
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-white">Analyzing Concepts...</h3>
                  <p className="text-slate-400 mt-2">Reading the visual language and mood</p>
                </div>
              )}

              {/* Error State */}
              {appState === AppState.ERROR && (
                <div className="bg-red-900/20 border border-red-900/50 rounded-xl p-6 text-center">
                  <p className="text-red-400 mb-4">{error}</p>
                  <button 
                    onClick={handleGenerate}
                    className="text-white bg-red-600/80 hover:bg-red-600 px-6 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    Try Again
                  </button>
                  <button 
                    onClick={reset}
                    className="ml-4 text-slate-400 hover:text-white text-sm font-medium transition-colors"
                  >
                    Upload New File
                  </button>
                </div>
              )}

              {/* Results */}
              {appState === AppState.SUCCESS && result && (
                <div className="space-y-8">
                  <ResultCard data={result} />
                  <div className="flex justify-center pt-8 border-t border-slate-800">
                     <button
                      onClick={reset}
                      className="text-slate-400 hover:text-white flex items-center gap-2 px-6 py-3 hover:bg-slate-800 rounded-full transition-all"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Analyze Another Media
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;