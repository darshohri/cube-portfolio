import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Send, Terminal, Cpu, Check, RefreshCw } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, hasFirebaseKeys } from '../firebase';
import { playSound } from '../utils/audio';

export default function CommandContactForm() {
  const [formData, setFormData] = useState({
    inquirerName: '',
    inquirerEmail: '',
    messageSubject: '',
    messagePayload: ''
  });

  const [isCompiling, setIsCompiling] = useState(false);
  const [transmissionCompleted, setTransmissionCompleted] = useState(false);
  const [deviceSession, setDeviceSession] = useState('');

  // Auto generate a simulated secure UUID packet session hash for data science theme
  useEffect(() => {
    const randomHash = Math.random().toString(36).substring(2, 10).toUpperCase();
    setDeviceSession(`DS-PORTAL-SESS-${randomHash}`);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Tactile electronic tick feedback on typing to reinforce technical CLI terminal look
    if (value.length % 2 === 0) {
      playSound.playHover();
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.inquirerName.trim() || !formData.inquirerEmail.trim() || !formData.messagePayload.trim()) {
      return;
    }

    setIsCompiling(true);
    playSound.playClick();

    // Safeguard and sanitize inputs to prevent injection or corruption
    const cleanName = formData.inquirerName.trim().substring(0, 256);
    const cleanEmail = formData.inquirerEmail.trim().toLowerCase().substring(0, 256);
    const cleanSubject = (formData.messageSubject || "System Ping").trim().substring(0, 500);
    const cleanPayload = formData.messagePayload.trim().substring(0, 10000);

    try {
      if (hasFirebaseKeys && db) {
        // Save message to Cloud Firestore using standard addDoc() and collection()
        const messagesCollection = collection(db, 'messages');
        await addDoc(messagesCollection, {
          inquirerName: cleanName,
          inquirerEmail: cleanEmail,
          messageSubject: cleanSubject,
          messagePayload: cleanPayload,
          deviceSession: deviceSession,
          createdAt: serverTimestamp()
        });
      } else {
        // Safe offline fallback for Vercel drops and ZIP downloads
        const offlineKey = 'portfolio_contact_messages';
        const currentStored = JSON.parse(localStorage.getItem(offlineKey) || '[]');
        currentStored.push({
          inquirerName: cleanName,
          inquirerEmail: cleanEmail,
          messageSubject: cleanSubject,
          messagePayload: cleanPayload,
          deviceSession: deviceSession,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem(offlineKey, JSON.stringify(currentStored));
        
        // Emulate some network latency for the UI feel
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      setIsCompiling(false);
      setTransmissionCompleted(true);
      playSound.playSuccess();
    } catch (error) {
      setIsCompiling(false);
      handleFirestoreError(error, OperationType.CREATE, `messages/*`);
    }
  };

  const resetForm = () => {
    playSound.playClose();
    setTransmissionCompleted(false);
    setFormData({
      inquirerName: '',
      inquirerEmail: '',
      messageSubject: '',
      messagePayload: ''
    });
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Interactive CLI Terminal Inputs Container */}
      <div className="rounded-xl bg-black border border-neutral-900 p-6 md:p-8 hover:border-white/20 transition-all shadow-xl shadow-black/60 contact-form-card">
        
        <div className="flex items-center gap-2 mb-6">
          <Terminal className="h-5 w-5 text-amber-500 animate-pulse" />
          <h3 className="text-lg font-display text-white font-extrabold tracking-tight uppercase">Transmission Portal</h3>
          <span className="text-[10px] font-mono bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2 py-0.5 rounded ml-auto font-bold uppercase">
            SECURE PORTAL
          </span>
        </div>

        {transmissionCompleted ? (
          <div className="py-8 text-center flex flex-col items-center justify-center animate-fade-in">
            <div className="h-12 w-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-amber-500 animate-bounce" />
            </div>
            <h4 className="text-lg font-display text-white font-medium uppercase tracking-wider">Transmission Logged!</h4>
            <p className="text-sm text-slate-300 mt-2 max-w-sm font-sans mx-auto leading-relaxed">
              Your inquiry payload has been saved directly to the database. I will review it and coordinate back with you at <b className="text-amber-500">{formData.inquirerEmail}</b>.
            </p>

            <button
              onClick={resetForm}
              className="mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white hover:bg-neutral-200 text-black font-mono text-xs font-black tracking-wider transition-all shadow-lg hover:shadow-white/10 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4 text-black text-xs" />
              <span>TRANSMIT ANOTHER MESSAGE</span>
            </button>

            <div className="mt-8 p-4 w-full bg-neutral-950 border border-neutral-900 rounded-xl max-w-md text-left font-mono text-[10px] text-zinc-500 leading-relaxed">
              <span className="text-amber-500 font-bold">
                [STREAM_STATUS]: {hasFirebaseKeys && db ? 'DATABASE_SYNCHRONIZED' : 'OFFLINE_VAULT_SAVED'}
              </span>
              <br />
              <span className="text-zinc-400">SESSION: {deviceSession}</span>
              <br />
              TIMESTAMP: {new Date().toISOString()}
            </div>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name Input */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider">
                  Sender Alias
                </label>
                <input
                  type="text"
                  name="inquirerName"
                  value={formData.inquirerName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Nicola Tesla"
                  disabled={isCompiling}
                  className="px-4 py-2.5 rounded-lg bg-black/80 border border-neutral-900 text-zinc-200 text-sm font-sans placeholder-zinc-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors disabled:opacity-50"
                />
              </div>

              {/* Email Input */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider">
                  Sender Email (Return Mailbox)
                </label>
                <input
                  type="email"
                  name="inquirerEmail"
                  value={formData.inquirerEmail}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. tesla@gmail.com"
                  disabled={isCompiling}
                  className="px-4 py-2.5 rounded-lg bg-black/80 border border-neutral-900 text-zinc-200 text-sm font-sans placeholder-zinc-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Target Endpoint Email Input */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider">
                  Target Endpoint Email
                </label>
                <input
                  type="email"
                  value="darshohri@gmail.com"
                  readOnly
                  disabled
                  title="Target is statically configured to darshohri@gmail.com"
                  className="px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-900 text-zinc-500 text-sm font-mono cursor-not-allowed select-all"
                />
              </div>

              {/* Subject Input */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider">
                  Transmission Subject
                </label>
                <input
                  type="text"
                  name="messageSubject"
                  value={formData.messageSubject}
                  onChange={handleInputChange}
                  placeholder="e.g. Software Dev Internship"
                  disabled={isCompiling}
                  className="px-4 py-2.5 rounded-lg bg-black/80 border border-neutral-900 text-zinc-200 text-sm font-sans placeholder-zinc-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            {/* Message Body Input */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider">
                Injected Telemetry (Message Payload)
              </label>
              <textarea
                name="messagePayload"
                value={formData.messagePayload}
                onChange={handleInputChange}
                required
                rows={5}
                placeholder="Write your note, proposal, or inquiry details here. ATS, recruiters, and colleagues always welcome."
                disabled={isCompiling}
                className="px-4 py-3 rounded-lg bg-black/80 border border-neutral-900 text-zinc-200 text-sm font-sans placeholder-zinc-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors disabled:opacity-50 resize-y"
              />
            </div>

            {/* Send Packet Button */}
            <button
              type="submit"
              disabled={isCompiling}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-mono text-xs font-black tracking-wider active:scale-95 disabled:opacity-60 transition-all shadow-lg hover:shadow-amber-500/15 cursor-pointer mt-4"
            >
              {isCompiling ? (
                <>
                  <Cpu className="h-4 w-4 animate-spin text-black" />
                  <span>TRANSMITTING STRUCTURED BYTES...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 text-black" />
                  <span>BROADCAST DATAFRAME MESSAGE</span>
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
