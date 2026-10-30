import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Phone,
  Mail,
  MapPin,
  FileText,
  BookmarkCheck,
  ShieldAlert,
  Compass,
  ArrowRight,
  Info,
} from 'lucide-react';

const SUGGESTED_QUERIES = [
  'What is Jamiatul Madina? / جامعۃ المدینہ کیا ہے؟',
  'When and where was the first Jamiatul Madina established?',
  'How many branches of Jamiatul Madina exist worldwide?',
  'How many total students are currently studying?',
  'What are the basic admission requirements?',
  'Is accommodation and food provided at Jamiatul Madina?',
  'Which educational board is Jamiatul Madina affiliated with?',
];

export default function UserSearch() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeResponseTab, setActiveResponseTab] = useState('detailed'); // 'detailed' | 'summary'
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const utteranceRef = useRef(null);
  const audioRef = useRef(null);

  // Voice Search states
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Load available Speech Synthesis voices (asynchronously populated by browser)
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available && available.length > 0) {
        setVoices(available);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'ur-PK'; // Urdu (Pakistan) detection

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        setQuery(spokenText);
        setIsListening(false);
        // Automatically execute search with captured voice
        executeSearch(spokenText);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert(
        'Voice Speech Recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.'
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start issue:', err);
      }
    }
  };

  // Perform AI Search via Backend
  const executeSearch = async (searchQuery) => {
    const q = searchQuery !== undefined ? searchQuery : query;
    if (!q || !q.trim()) return;

    setLoading(true);
    setResult(null);
    setCopied(false);
    stopTextToSpeech();

    try {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q.trim() }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Search error:', error);
      setResult({
        found: false,
        message:
          'معذرت، سرور سے رابطہ نہیں ہو سکا۔ براہ کرم انٹرنیٹ کنکشن چیک کر کے دوبارہ کوشش کریں۔',
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle search input changes: Auto-reset result if input becomes empty
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (!val || val.trim() === '') {
      setResult(null);
      stopTextToSpeech();
    }
  };

  const handleClear = () => {
    setQuery('');
    setResult(null);
    stopTextToSpeech();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  // Copy answer to clipboard (based on active tab)
  const copyAnswer = () => {
    const textToCopy =
      activeResponseTab === 'summary'
        ? result?.summary || result?.detailed || result?.answer
        : result?.detailed || result?.answer;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Helper to detect if text contains Urdu/Arabic characters or script
  const isUrduScript = (text) => {
    if (!text) return false;
    // Unicode ranges for Arabic, Urdu, Persian characters (e.g. حروفِ تہجی)
    const urduArabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return urduArabicRegex.test(text);
  };

  // Helper to pick matching voice from available system/browser voices
  const pickBestVoice = (allVoices, hasUrdu) => {
    if (!allVoices || allVoices.length === 0) return null;

    if (hasUrdu) {
      // Look exclusively for Urdu voices (e.g. ur-PK, ur-IN, ur, or name containing Urdu/Pakistan)
      const urduVoice = allVoices.find((v) => {
        const lang = (v.lang || '').toLowerCase();
        const name = (v.name || '').toLowerCase();
        return (
          lang.startsWith('ur') ||
          lang.includes('urdu') ||
          name.includes('urdu') ||
          name.includes('pakistan')
        );
      });
      // Do NOT fallback to Arabic (ar) or other languages.
      // If no explicit Urdu voice object exists, returning null allows
      // the browser's native OS speech engine to synthesize via utterance.lang = 'ur-PK' directly.
      return urduVoice || null;
    } else {
      // English Voice Selection
      const englishVoice =
        allVoices.find((v) => {
          const lang = (v.lang || '').toLowerCase();
          const name = (v.name || '').toLowerCase();
          return (
            lang === 'en-us' &&
            (name.includes('natural') || name.includes('google') || name.includes('online'))
          );
        }) ||
        allVoices.find((v) => (v.lang || '').toLowerCase() === 'en-us') ||
        allVoices.find((v) => (v.lang || '').toLowerCase().startsWith('en'));

      return englishVoice || null;
    }
  };

  // Helper to vocalize via Web Speech API
  const playViaSpeechSynthesis = (cleanText, hasUrdu, voiceObj) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance; // Prevent garbage collection in Chromium

    // 1. Always set utterance.lang = isUrdu ? 'ur-PK' : 'en-US' explicitly
    utterance.lang = hasUrdu ? 'ur-PK' : 'en-US';
    utterance.rate = hasUrdu ? 0.90 : 1.0;
    utterance.pitch = 1.0;

    if (voiceObj) {
      utterance.voice = voiceObj;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };
    utterance.onerror = (event) => {
      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        console.warn('Speech synthesis event:', event.error);
      }
      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    // 3. Call cancel() before speak(utterance)
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Upgraded Text to Speech with Dual-Engine (Browser Voice + Clear Online Fallback)
  const toggleTextToSpeech = () => {
    if (isSpeaking) {
      stopTextToSpeech();
      return;
    }

    // Determine content to speak based on current active tab
    const textToSpeak =
      activeResponseTab === 'summary'
        ? result?.summary || result?.detailed || result?.answer
        : result?.detailed || result?.answer;

    if (!textToSpeak || !textToSpeak.trim()) return;

    // 1. Auto-detect if text contains Urdu/Arabic characters or script
    const hasUrdu = isUrduScript(textToSpeak);

    // Clean text: strip markdown characters (*, #, _, `, >, ~) for smooth verbal reading
    const cleanSpeechText = textToSpeak
      .replace(/[*#_`>~]/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    const allVoices =
      voices.length > 0 ? voices : 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : [];
    const selectedVoice = pickBestVoice(allVoices, hasUrdu);

    // If Urdu is detected and the OS/browser lacks an installed Urdu voice (common on Windows):
    // Use HTML5 audio stream for crystal-clear, authentic native Urdu pronunciation without errors!
    if (hasUrdu && !selectedVoice) {
      stopTextToSpeech();
      try {
        const sentences = cleanSpeechText
          .split(/(?<=[۔!؟\n])/g)
          .map((s) => s.trim())
          .filter(Boolean);

        const chunks = sentences.length > 0 ? sentences : [cleanSpeechText.slice(0, 200)];
        let currentChunkIndex = 0;
        setIsSpeaking(true);

        const playNextChunk = () => {
          if (currentChunkIndex >= chunks.length) {
            setIsSpeaking(false);
            audioRef.current = null;
            return;
          }

          const chunk = chunks[currentChunkIndex];
          currentChunkIndex++;

          // Google TTS Urdu audio stream (plays natural native Pakistani Urdu)
          const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ur&client=tw-ob&q=${encodeURIComponent(
            chunk
          )}`;

          const audio = new Audio(ttsUrl);
          audioRef.current = audio;

          audio.onended = playNextChunk;
          audio.onerror = () => {
            // Fallback to Web Speech API if network audio fails
            playViaSpeechSynthesis(cleanSpeechText, hasUrdu, null);
          };

          audio.play().catch(() => {
            // Autoplay policy or error, fallback to Web Speech API
            playViaSpeechSynthesis(cleanSpeechText, hasUrdu, null);
          });
        };

        playNextChunk();
        return;
      } catch (err) {
        playViaSpeechSynthesis(cleanSpeechText, hasUrdu, null);
        return;
      }
    }

    // Default: Play via Web Speech API using matched voice
    playViaSpeechSynthesis(cleanSpeechText, hasUrdu, selectedVoice);
  };

  const stopTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsSpeaking(false);
    utteranceRef.current = null;
  };

  // Generate Khulasa (Executive summary)
  const getKhulasaSummary = (text) => {
    if (!text) return '';
    // Extract first 1 or 2 concise sentences
    const sentences = text.split(/(?<=[.?!۔])/);
    if (sentences.length > 0) {
      return sentences.slice(0, 2).join(' ').trim();
    }
    return text.slice(0, 200) + '...';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-8 animate-fade-in">
      
      {/* Sober Minimal Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2.5 font-arabic-heading leading-tight">
          جامعۃ المدینہ <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-200">اے آئی اسسٹنٹ</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-normal">
          Ask any question about admissions, courses, campuses, or facilities in Urdu, Roman Urdu, or English.
        </p>
      </div>

      {/* Main Search Bar Card */}
      <div className="relative mb-6 sm:mb-8">
        <div className="relative flex items-center bg-slate-900/90 border-2 border-emerald-800/80 hover:border-emerald-500/80 focus-within:border-emerald-400 rounded-3xl p-2 sm:p-2.5 shadow-2xl shadow-emerald-950/60 transition-all duration-300">
          
          {/* Search Icon */}
          <div className="pl-3.5 pr-2 text-emerald-400">
            <Search className="w-6 h-6" />
          </div>

          {/* Large Input Field */}
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="سوال پوچھیں... (e.g. How many branches worldwide? or داخلے کی کیا شرائط ہیں؟)"
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base px-2 py-2 focus:outline-none"
          />

          {/* Clear button if text exists */}
          {query && (
            <button
              onClick={handleClear}
              className="px-2 text-slate-400 hover:text-white text-xs transition"
              title="Clear search"
            >
              Clear
            </button>
          )}

          {/* Voice Search Button with Animated Pulsing Red Indicator */}
          <button
            onClick={toggleVoiceSearch}
            type="button"
            title={isListening ? 'Listening in Urdu... Click to stop' : 'Click to speak in Urdu / Voice Search'}
            className={`relative p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 mr-1.5 sm:mr-2 flex items-center justify-center shrink-0 ${
              isListening
                ? 'bg-red-500/20 text-red-400 ring-2 ring-red-500 animate-pulse-fast shadow-lg shadow-red-500/30'
                : 'bg-slate-800 text-slate-300 hover:text-emerald-300 hover:bg-slate-700/80'
            }`}
          >
            {isListening ? (
              <>
                <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 animate-bounce" />
                <span className="absolute -top-7 -right-2 text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap animate-pulse">
                  Listening (ur-PK)...
                </span>
              </>
            ) : (
              <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            )}
          </button>

          {/* Search Action Button */}
          <button
            onClick={() => executeSearch()}
            disabled={loading || !query.trim()}
            className="px-3.5 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-900/50 active:scale-[0.98] transition disabled:opacity-40 flex items-center gap-1.5 sm:gap-2 shrink-0"
          >
            {loading ? (
              <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <span>Ask AI</span>
            )}
          </button>

        </div>

        {/* Real-time Voice Listening Bar Indicator */}
        {isListening && (
          <div className="mt-2 text-center text-xs text-red-400 flex items-center justify-center gap-2 animate-fade-in font-medium">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span>بولیں، آپ کی آواز سنی جا رہی ہے (Speak in Urdu or English)...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Questions */}
      {!result && !loading && (
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-3">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Frequently Asked Questions / فوری منتخب سوالات:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUERIES.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(item);
                  executeSearch(item);
                }}
                className="text-xs bg-slate-900/80 hover:bg-emerald-950/70 border border-slate-800 hover:border-emerald-700/60 text-slate-300 hover:text-emerald-300 px-3.5 py-2 rounded-xl transition duration-150 text-left flex items-center gap-1.5 shadow-sm"
              >
                <span>{item}</span>
                <ArrowRight className="w-3 h-3 text-emerald-500 shrink-0 opacity-60" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SKELETON LOADING ANIMATION */}
      {loading && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-emerald-900/50 shadow-2xl animate-pulse space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="h-6 w-36 bg-slate-800 rounded-lg"></div>
            <div className="h-6 w-24 bg-emerald-950/80 rounded-full"></div>
          </div>
          <div className="space-y-3 pt-2">
            <div className="h-4 bg-slate-800 rounded w-5/6"></div>
            <div className="h-4 bg-slate-800 rounded w-full"></div>
            <div className="h-4 bg-slate-800 rounded w-4/6"></div>
            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
          </div>
          <div className="pt-4 flex items-center gap-2">
            <div className="h-7 w-28 bg-emerald-900/30 rounded-xl"></div>
            <div className="h-7 w-20 bg-slate-800 rounded-xl"></div>
          </div>
        </div>
      )}

      {/* RESULT DISPLAY CARD */}
      {result && !loading && (
        <div className="animate-slide-up">
          {result.found ? (
            <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-slate-900 border border-emerald-900/40 shadow-xl shadow-emerald-950/40">
              
              {/* Card Header: Multi-Tab Toggle on Left & Subtle Verified Record Badge + Actions on Right */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-5">
                
                {/* Multi-Tab Toggle */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                  <button
                    onClick={() => setActiveResponseTab('detailed')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      activeResponseTab === 'detailed'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Detailed</span>
                  </button>
                  <button
                    onClick={() => setActiveResponseTab('summary')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      activeResponseTab === 'summary'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                    <span>خلاصہ / Khulasa</span>
                  </button>
                </div>

                {/* Top-Right: Subtle Official Verified Record Badge & Audio/Copy Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Subtle Official Verified Record Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-xs font-medium">
                    <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Official Verified Record</span>
                  </div>

                  {/* Audio Speech Button */}
                  <button
                    onClick={toggleTextToSpeech}
                    title={isSpeaking ? 'Stop Audio' : 'Listen Answer'}
                    className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs border transition flex items-center gap-1.5 ${
                      isSpeaking
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                        : 'bg-slate-950 text-slate-300 hover:text-white border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-4 h-4 text-white" />
                        <span className="hidden sm:inline font-medium">Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-emerald-400" />
                        <span className="hidden sm:inline">Listen / سنیں</span>
                      </>
                    )}
                  </button>

                  {/* Copy Answer Button */}
                  <button
                    onClick={copyAnswer}
                    title="Copy Answer"
                    className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-800 transition flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

              </div>

              {/* Main Content Area */}
              <div className="mb-6">
                {activeResponseTab === 'detailed' ? (
                  <div className="text-sm sm:text-base text-slate-100 leading-relaxed whitespace-pre-line font-sans">
                    {result.detailed || result.answer}
                  </div>
                ) : (
                  <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-100 shadow-inner">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>خلاصہ کلام / Summary:</span>
                    </div>
                    <div className="text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans">
                      {result.summary || getKhulasaSummary(result.detailed || result.answer)}
                    </div>
                  </div>
                )}
              </div>

              {/* Sober Minimal Footer: Category Tag Only (Cleaned up technical badges) */}
              {result.matchedCategories && result.matchedCategories.length > 0 && (
                <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-500 text-[11px]">Category:</span>
                    {result.matchedCategories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-emerald-300/80 text-[11px]"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* FALLBACK VIEW (When found: false) */
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-amber-900/60 shadow-2xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-700/50 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-200">
                    معلومات دستیاب نہیں ہیں (Record Not Found in Official Registry)
                  </h3>
                  <p className="text-base text-amber-300/90 font-medium mt-1 urdu-text">
                    {result.message || 'یہ معلومات فی الحال جامعۃ المدینہ کے آفیشل ریکارڈ میں موجود نہیں ہیں۔'}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    To maintain 100% authenticity and prevent hallucinations, our AI assistant only answers verified data recorded by Jamiatul Madina / Kanz-ul-Madaris.
                  </p>
                </div>
              </div>

              {/* Contact Markaz Box */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-white mb-3">
                  <Info className="w-4 h-4 text-emerald-400" />
                  <span>Contact Markaz for Direct Inquiry / براہِ راست رابطہ برائے رہنمائی:</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-semibold text-slate-300">Central Markaz</span>
                    </div>
                    <p className="text-slate-300 font-medium">Faizan-e-Madina, Main University Road, Karachi</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-semibold text-slate-300">Official Helplines</span>
                    </div>
                    <p className="text-emerald-400 font-mono font-medium">+92 311 7864100</p>
                    <p className="text-emerald-400 font-mono font-medium">+92 300 0220115</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Mail className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-semibold text-slate-300">Email & Web</span>
                    </div>
                    <p className="text-slate-300 font-mono">info@jamiatulmadina.net</p>
                    <p className="text-slate-400">www.dawateislami.net</p>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
}
