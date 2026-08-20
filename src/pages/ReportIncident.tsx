import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FilePlus2,
  Send,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Info,
  Mic,
  MicOff,
  ShieldCheck,
  ShieldAlert,
  Radio,
  Volume2,
  Crosshair,
  ChevronDown,
  ChevronUp,
  Languages
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DisasterType, Severity, Incident } from '../types';
import { AIVerificationDetector, VerificationResult } from '../components/common/AIVerificationDetector';

export const ReportIncident: React.FC = () => {
  const navigate = useNavigate();
  const { addIncident, affectedAreas, addNotification, runAITriage } = useApp();

  const [title, setTitle] = useState('');
  const [disasterType, setDisasterType] = useState<DisasterType>('flood');
  const [severity, setSeverity] = useState<Severity>('High');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState(affectedAreas[0]?.district || 'Chennai');
  const [lat, setLat] = useState('13.0827');
  const [lng, setLng] = useState('80.2707');
  const [description, setDescription] = useState('');
  const [affectedPeople, setAffectedPeople] = useState<number>(50);
  const [injuredCount, setInjuredCount] = useState<number>(0);
  const [missingCount, setMissingCount] = useState<number>(0);
  const [priority, setPriority] = useState<Incident['priority']>('P1 - Immediate');
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [source, setSource] = useState<Incident['source']>('Citizen');
  const [selectedResources, setSelectedResources] = useState<string[]>([
    'Inflatable Boats',
    'Food Rations'
  ]);
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTriageLoading, setIsTriageLoading] = useState(false);
  const [triageFeedback, setTriageFeedback] = useState<any>(null);

  // Speech-to-Text / Voice Recording State (Step 2 of Hackathon Workflow)
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [voiceLang, setVoiceLang] = useState<'en-IN' | 'ta-IN' | 'hi-IN'>('en-IN');
  const recognitionRef = useRef<any>(null);

  // Credibility and Fake Detection State (Step 5 of Hackathon Workflow)
  const [credibilityScore, setCredibilityScore] = useState<number>(90);
  const [isLikelyFake, setIsLikelyFake] = useState<boolean>(false);
  const [credibilityReasoning, setCredibilityReasoning] = useState<string>('');
  const [misinformationRisk, setMisinformationRisk] = useState<'Low' | 'Medium' | 'High' | 'Suspected Hoax'>('Low');
  const [showVerificationDetector, setShowVerificationDetector] = useState<boolean>(false);

  const handleDetectorResult = (result: VerificationResult, text: string) => {
    setDescription(text);
    if (!title && text) {
      setTitle(text.slice(0, 65));
    }
    setCredibilityScore(result.credibilityScore);
    setIsLikelyFake(result.isLikelyFake);
    setCredibilityReasoning(result.recommendedAction);
    setMisinformationRisk(result.misinformationRisk);
    addNotification(
      'Verification Applied to Form',
      `Auto-filled report details with Trust Score: ${result.credibilityScore}%.`,
      result.isLikelyFake ? 'warning' : 'success'
    );
  };

  const availableResourcesList = [
    'Inflatable Boats',
    'Medical Kits & ALS Ambulance',
    'Drinking Water Tankers',
    'Ready-to-Eat Food Rations',
    'Life Jackets & Buoys',
    'Heavy Excavators & Earthmovers',
    'Mobile Diesel Generator',
    'Air-drop Evacuation Team'
  ];

  const handleDistrictChange = (dist: string) => {
    setDistrict(dist);
    const area = affectedAreas.find(a => a.district === dist);
    if (area) {
      setLat(area.lat.toString());
      setLng(area.lng.toString());
    }
  };

  const toggleResource = (res: string) => {
    if (selectedResources.includes(res)) {
      setSelectedResources(selectedResources.filter(r => r !== res));
    } else {
      setSelectedResources([...selectedResources, res]);
    }
  };

  // Step 2: Speech-to-Text Integration with Multi-Language Support
  const handleToggleVoiceInput = () => {
    // If already recording, stop it
    if (isRecordingVoice && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      setIsRecordingVoice(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceSupported(false);
      triggerSimulatedVoice();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = voiceLang; // 'en-IN', 'ta-IN', or 'hi-IN'

      recognition.onstart = () => {
        setIsRecordingVoice(true);
        addNotification(
          'Microphone Active',
          `Listening in ${voiceLang === 'ta-IN' ? 'Tamil (தமிழ்)' : voiceLang === 'hi-IN' ? 'Hindi (हिन्दी)' : 'English'}... Speak now into your mic.`,
          'info'
        );
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const textToUse = finalTranscript || interimTranscript;
        if (textToUse) {
          setDescription(prev => {
            // If already contains text, append cleanly
            if (finalTranscript) {
              return prev ? `${prev} ${finalTranscript}` : finalTranscript;
            }
            return prev || interimTranscript;
          });

          if (!title && (finalTranscript || textToUse.length > 15)) {
            setTitle((finalTranscript || textToUse).slice(0, 70));
          }
        }

        if (finalTranscript) {
          setIsRecordingVoice(false);
          addNotification('Voice Transcribed', 'Speech successfully converted to distress report.', 'success');
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        setIsRecordingVoice(false);

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          addNotification(
            'Microphone Permission Needed',
            'Browser blocked mic access. Please click "Allow" in browser address bar or use Demo Voice.',
            'warning'
          );
          // Run simulation fallback so workflow is never broken
          triggerSimulatedVoice();
        } else if (event.error === 'no-speech') {
          addNotification('No Speech Detected', 'No voice was picked up. Please speak clearly into your mic.', 'info');
        } else {
          addNotification('Voice Error', `Speech engine: ${event.error}. Loading emergency voice sample.`, 'warning');
          triggerSimulatedVoice();
        }
      };

      recognition.onend = () => {
        setIsRecordingVoice(false);
      };

      recognition.start();
    } catch (e: any) {
      console.warn('Could not start recognition:', e);
      setIsRecordingVoice(false);
      triggerSimulatedVoice();
    }
  };

  const triggerSimulatedVoice = () => {
    setIsRecordingVoice(true);
    addNotification('Voice Simulation', 'Simulating voice input transcription for emergency intake...', 'info');
    setTimeout(() => {
      const sampleTamil = "அடையாறு ஆற்றில் வெள்ளப்பெருக்கு ஏற்பட்டுள்ளது. கோட்டூர்புரம் பாலம் அருகில் 40 குடும்பங்கள் முதல் தளத்தில் சிக்கியுள்ளனர். உடனடியாக மீட்பு படகுகள் மற்றும் குடிநீர் தேவை.";
      const sampleEnglish = "Adyar river overflow near Kotturpuram bridge. Water entered residential ground floors, 40 families trapped on first floor. Immediate inflatable rescue boats and drinking water packets needed.";
      
      const chosenText = voiceLang === 'ta-IN' ? sampleTamil : sampleEnglish;
      setDescription(prev => (prev ? `${prev} ${chosenText}` : chosenText));
      if (!title) {
        setTitle(voiceLang === 'ta-IN' ? "கோட்டூர்புரம் அடையாறு ஆற்று வெள்ளப்பெருக்கு மீட்பு" : "Adyar river flash flood trapping residents in Kotturpuram");
      }
      setIsRecordingVoice(false);
      addNotification('Voice Transcribed', 'Voice report successfully transcribed and populated.', 'success');
    }, 1800);
  };

  // Step 3, 4, 5, 7, 8: Run Full AI Decision Pipeline
  const handleAITriageAssist = async () => {
    if (!title && !description) {
      addNotification('Enter Details First', 'Please enter a title or description for AI analysis.', 'warning');
      return;
    }

    setIsTriageLoading(true);
    try {
      const res = await runAITriage({
        title,
        description,
        location,
        district,
        disasterType,
        source,
        reporterName
      });

      if (res && res.triage) {
        setTriageFeedback(res);
        if (res.triage.severity) {
          setSeverity(res.triage.severity as Severity);
        }
        if (res.triage.priority) {
          setPriority(res.triage.priority as Incident['priority']);
        }
        if (Array.isArray(res.triage.suggestedResources) && res.triage.suggestedResources.length > 0) {
          setSelectedResources(res.triage.suggestedResources);
        }
        if (res.triage.credibilityScore !== undefined) {
          setCredibilityScore(res.triage.credibilityScore);
          setIsLikelyFake(res.triage.isLikelyFake);
          setCredibilityReasoning(res.triage.credibilityReasoning);
          setMisinformationRisk(res.triage.misinformationRisk || 'Low');
        }

        const isFake = res.triage.isLikelyFake || res.triage.credibilityScore < 40;
        addNotification(
          isFake ? 'Potential Fake Report Flagged' : 'AI Verification Complete',
          isFake 
            ? `Warning: Report flagged with high misinformation risk (Trust: ${res.triage.credibilityScore}%).`
            : `Verified authentic: ${res.triage.severity} severity (${res.triage.credibilityScore}% Trust).`,
          isFake ? 'critical' : (res.triage.severity === 'Critical' ? 'critical' : 'success')
        );
      }
    } catch (err) {
      console.warn('AI Triage error:', err);
      // Fallback local heuristic
      if (affectedPeople > 200 || injuredCount > 0 || disasterType === 'building_collapse') {
        setSeverity('Critical');
        setPriority('P1 - Immediate');
      } else {
        setSeverity('High');
        setPriority('P2 - High');
      }
      setCredibilityScore(88);
      setMisinformationRisk('Low');
      addNotification('Heuristic Triage Applied', 'Calculated optimal severity and priority.', 'info');
    } finally {
      setIsTriageLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !reporterName) {
      alert('Please fill in all mandatory fields.');
      return;
    }

    setIsSubmitting(true);
    await addIncident({
      title,
      disasterType,
      severity,
      location,
      district,
      lat: parseFloat(lat) || 13.0827,
      lng: parseFloat(lng) || 80.2707,
      description,
      affectedPeople: Number(affectedPeople),
      injuredCount: Number(injuredCount),
      missingCount: Number(missingCount),
      priority,
      status: 'New',
      verificationStatus: isLikelyFake || credibilityScore < 40 
        ? 'Flagged' 
        : (source === 'Official' ? 'Verified' : 'Unverified'),
      source,
      reporterName,
      reporterContact: reporterContact || '+91 94440 00000',
      requiredResources: selectedResources,
      imageUrl: imageUrl || undefined,
      credibilityScore,
      isLikelyFake,
      credibilityReasoning,
      misinformationRisk
    });

    setIsSubmitting(false);
    navigate('/incidents');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FilePlus2 className="w-6 h-6 text-red-600" />
            Report Emergency Incident
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Submit critical real-time incident reports to the State Disaster Operations Command (SEOC)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Language Selector for Voice */}
          <div className="flex items-center bg-white border border-slate-200 rounded-md p-0.5 shadow-2xs">
            <span className="text-[10px] font-mono text-slate-500 px-1.5 flex items-center gap-1">
              <Languages className="w-3 h-3 text-slate-400" />
            </span>
            <button
              type="button"
              onClick={() => setVoiceLang('en-IN')}
              className={`px-2 py-1 rounded text-[11px] font-bold font-mono transition-colors ${
                voiceLang === 'en-IN' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setVoiceLang('ta-IN')}
              className={`px-2 py-1 rounded text-[11px] font-bold font-mono transition-colors ${
                voiceLang === 'ta-IN' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Tamil Voice Input (தமிழ்)"
            >
              தமிழ்
            </button>
            <button
              type="button"
              onClick={() => setVoiceLang('hi-IN')}
              className={`px-2 py-1 rounded text-[11px] font-bold font-mono transition-colors ${
                voiceLang === 'hi-IN' ? 'bg-orange-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Hindi Voice Input (हिन्दी)"
            >
              हिन्दी
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowVerificationDetector(!showVerificationDetector)}
            className={`px-3 py-2 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs border ${
              showVerificationDetector
                ? 'bg-neutral-900 text-orange-400 border-neutral-800'
                : 'bg-orange-50 hover:bg-orange-100 text-orange-800 border-orange-200'
            }`}
          >
            <Crosshair className="w-4 h-4 text-orange-500" />
            {showVerificationDetector ? 'Close Detector' : 'Verification Engine'}
          </button>

          <button
            type="button"
            onClick={handleToggleVoiceInput}
            className={`px-3 py-2 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs border ${
              isRecordingVoice
                ? 'bg-red-600 text-white border-red-700 animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
            }`}
          >
            {isRecordingVoice ? (
              <>
                <MicOff className="w-4 h-4 text-white" /> Listening ({voiceLang === 'ta-IN' ? 'தமிழ்' : voiceLang === 'hi-IN' ? 'हिन्दी' : 'EN'})...
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-red-400" /> Voice Input ({voiceLang === 'ta-IN' ? 'தமிழ்' : voiceLang === 'hi-IN' ? 'हिन्दी' : 'EN'})
              </>
            )}
          </button>

          <button
            type="button"
            onClick={triggerSimulatedVoice}
            className="px-2.5 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 shadow-2xs transition-colors flex items-center gap-1"
            title="Demo Voice Transcribe Sample without microphone"
          >
            <Volume2 className="w-3.5 h-3.5 text-slate-600" /> Demo Audio
          </button>

          <button
            type="button"
            disabled={isTriageLoading}
            onClick={handleAITriageAssist}
            className="px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors self-start shadow-2xs disabled:opacity-60"
          >
            {isTriageLoading ? (
              <>
                <Loader2 className="w-4 h-4 text-white animate-spin" /> Verifying...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-blue-200" /> AI Verify & Triage
              </>
            )}
          </button>
        </div>
      </div>

      {/* Embedded AI Verification Detector Panel */}
      {showVerificationDetector && (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <AIVerificationDetector
            initialText={description}
            onVerificationComplete={handleDetectorResult}
          />
        </div>
      )}

      {/* AI Triage & Fake Report Detector Feedback Banner */}
      {triageFeedback && (
        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start gap-4 shadow-xs ${
          triageFeedback.triage.isLikelyFake || triageFeedback.triage.credibilityScore < 40
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : triageFeedback.triage.severity === 'Critical'
            ? 'bg-red-50 border-red-200 text-red-900'
            : 'bg-blue-50 border-blue-200 text-blue-900'
        }`}>
          <div className="mt-0.5">
            {triageFeedback.triage.isLikelyFake || triageFeedback.triage.credibilityScore < 40 ? (
              <ShieldAlert className="w-6 h-6 text-amber-600" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            )}
          </div>
          
          <div className="flex-1 text-xs space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-bold flex items-center gap-2">
                <span>AI Verification & Credibility Assessment ({triageFeedback.source})</span>
                {triageFeedback.triage.isLikelyDuplicate && (
                  <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded font-bold">
                    Potential Duplicate Report
                  </span>
                )}
              </div>

              {/* Trust Score Badge */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-slate-600">Trust Score:</span>
                <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                  triageFeedback.triage.credibilityScore >= 80
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : triageFeedback.triage.credibilityScore >= 50
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-red-100 text-red-800 border border-red-300 animate-pulse'
                }`}>
                  {triageFeedback.triage.credibilityScore ?? 90}% 
                  {triageFeedback.triage.isLikelyFake ? ' (Suspected Fake)' : ' (Genuine)'}
                </span>
              </div>
            </div>

            <p className="leading-relaxed">{triageFeedback.triage.actionableGuidance}</p>
            
            {triageFeedback.triage.credibilityReasoning && (
              <div className="p-2 rounded bg-white/70 border border-slate-200 text-slate-700">
                <span className="font-bold text-slate-900">Credibility Analysis: </span>
                {triageFeedback.triage.credibilityReasoning}
              </div>
            )}

            <div className="font-mono text-[11px] text-slate-600 pt-0.5">
              Risk: {triageFeedback.triage.estimatedCasualtyRisk} • Evacuation Perimeter: {triageFeedback.triage.evacuationPerimeterMeters}m • Misinformation: {triageFeedback.triage.misinformationRisk || 'Low'}
            </div>
          </div>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Basic Classification */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold">1</span>
            Incident Classification & Title
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Incident Headline / Subject <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Flash flood inundation trapping 40 families on rooftop near Kotturpuram bridge"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-300"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Disaster Type
              </label>
              <select
                value={disasterType}
                onChange={(e) => setDisasterType(e.target.value as DisasterType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-800 font-medium"
              >
                <option value="flood">Flood / Inundation</option>
                <option value="cyclone">Cyclone / Gale Storm</option>
                <option value="earthquake">Earthquake / Tremor</option>
                <option value="landslide">Landslide / Mudslide</option>
                <option value="fire">Fire Hazard</option>
                <option value="building_collapse">Structural Collapse</option>
                <option value="other">Other Emergency</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Severity Level
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Severity)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs font-bold text-red-600"
              >
                <option value="Critical">Critical (Immediate Danger)</option>
                <option value="High">High (Urgent Attention)</option>
                <option value="Medium">Medium (Elevated)</option>
                <option value="Low">Low (Advisory)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Incident Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-800 font-medium"
              >
                <option value="Citizen">Citizen Crowdsourced</option>
                <option value="Official">First Responder / Police</option>
                <option value="Drone Recon">Drone Reconnaissance</option>
                <option value="Satellite Alert">Satellite / Sensor Feed</option>
                <option value="Live News / GDACS">Live News / GDACS</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 2: Location & Spatial Data */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold">2</span>
            Location & Spatial Coordinates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                District <span className="text-red-600">*</span>
              </label>
              <select
                value={district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-800 font-medium"
              >
                {affectedAreas.map((a) => (
                  <option key={a.id} value={a.district}>
                    {a.district} ({a.severity})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Specific Landmark / Street Address <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Near Bridge #4, Gandhi Nagar 2nd Main"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-300"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Latitude (Decimal Degrees)
              </label>
              <input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs font-mono text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Longitude (Decimal Degrees)
              </label>
              <input
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs font-mono text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Human Impact & Urgency */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold">3</span>
              Human Impact & On-Ground Description
            </h3>

            <button
              type="button"
              onClick={handleToggleVoiceInput}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              <Mic className="w-3.5 h-3.5" />
              {isRecordingVoice ? 'Recording...' : 'Dictate with Voice'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Estimated Affected People
              </label>
              <input
                type="number"
                min="1"
                value={affectedPeople}
                onChange={(e) => setAffectedPeople(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Injured Count
              </label>
              <input
                type="number"
                min="0"
                value={injuredCount}
                onChange={(e) => setInjuredCount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs font-mono text-red-600 font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Missing Persons
              </label>
              <input
                type="number"
                min="0"
                value={missingCount}
                onChange={(e) => setMissingCount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs font-mono text-amber-700 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Field Description & Distress Signal
            </label>
            <textarea
              rows={4}
              placeholder="Describe physical conditions, water depth, structure status, urgent medical needs..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-300"
            />
          </div>
        </div>

        {/* Step 4: Required Emergency Supplies */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold">4</span>
            Immediate Supplies & Rescue Assets Required
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {availableResourcesList.map((res) => {
              const selected = selectedResources.includes(res);
              return (
                <button
                  type="button"
                  key={res}
                  onClick={() => toggleResource(res)}
                  className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                    selected
                      ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="truncate">{res}</span>
                    {selected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 5: Informant / Reporter Verification */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold">5</span>
            Reporter Information & Source Credibility
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Reporter / Officer Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. S. Karthikeyan (Ward Councillor)"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-300"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Direct Contact Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 94440 12345"
                value={reporterContact}
                onChange={(e) => setReporterContact(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/incidents')}
            className="px-5 py-2.5 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Transmitting to EOC...' : 'Transmit Emergency Report'}
          </button>
        </div>
      </form>
    </div>
  );
};
