import React, { useState } from 'react';
import { AppUser } from '../types/index.ts';
import { 
  User, 
  Sparkles, 
  CreditCard, 
  Key, 
  Terminal, 
  Cpu, 
  Sliders, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Bell, 
  ShieldAlert, 
  Database,
  Globe,
  Settings,
  HelpCircle,
  Link,
  ChevronRight,
  Activity,
  Layers
} from 'lucide-react';

interface SettingsCenterProps {
  currentUser: AppUser;
  setCurrentUser: (user: any) => void;
  historyCount: number;
  onClearHistory: () => void;
}

export default function SettingsCenter({ 
  currentUser, 
  setCurrentUser, 
  historyCount,
  onClearHistory 
}: SettingsCenterProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'ai' | 'billing' | 'api' | 'integrations'>('profile');
  
  // Profile settings state
  const [displayName, setDisplayName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.email.split('@')[0] || 'creator');
  const [userBio, setUserBio] = useState('Passionate graphics designer leveraging neural models for next-gen segmentations.');
  const [compactMode, setCompactMode] = useState(false);
  const [accentColor, setAccentColor] = useState('#2563eb');

  // AI preferences state
  const [defaultModel, setDefaultModel] = useState('Gemini High-Fi Segmentation');
  const [defaultFormat, setDefaultFormat] = useState('png');
  const [autoDownload, setAutoDownload] = useState(false);
  const [featherSmooth, setFeatherSmooth] = useState(5);

  // API keys state
  const [apiKeys, setApiKeys] = useState<{ id: string; name: string; key: string; createdAt: string; calls: number }[]>([
    { id: 'key_1', name: 'Web Production Client', key: 'vsn_live_a8f89bc210ef4f86a98293c833aa', createdAt: '2026-07-01', calls: 324 },
  ]);
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Webhooks state
  const [webhookUrl, setWebhookUrl] = useState('https://mycompany.com/webhooks/vision');
  const [webhookEvents, setWebhookEvents] = useState({ jobFinished: true, fileDownloaded: false });
  const [webhookPayload, setWebhookPayload] = useState<string | null>(null);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  // Billing states
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [transactions, setTransactions] = useState([
    { id: 'TX-8921', date: '2026-07-01', amount: '$19.00', status: 'PAID', plan: 'Pro Monthly Plan' },
    { id: 'TX-8210', date: '2026-06-01', amount: '$19.00', status: 'PAID', plan: 'Pro Monthly Plan' },
  ]);

  // Admin dashboard states (Only simulated / fully functional for active Admin role)
  const [globalFeatureGating, setGlobalFeatureGating] = useState({
    disableGpuWorkloads: false,
    enforceHardBillingGates: true,
    experimentalBiRefNet: true,
  });
  const [adminUsers, setAdminUsers] = useState([
    { email: 'guest@vision.ai', role: 'GUEST', credits: 3 },
    { email: 'free@vision.ai', role: 'FREE_USER', credits: 15 },
    { email: 'pro@vision.ai', role: 'PREMIUM_USER', credits: 1000 },
    { email: 'admin@vision.ai', role: 'ADMIN', credits: 99999 },
  ]);
  const [adminLogs, setAdminLogs] = useState([
    { time: '23:35:10', type: 'API', text: 'Auth token verified successfully for session creator.' },
    { time: '23:35:22', type: 'GPU', text: 'Edge detection segmentation model weights loaded.' },
    { time: '23:35:48', type: 'BILLING', text: 'Billing verification: user verified under Premium quota.' },
    { time: '23:36:11', type: 'INFERENCE', text: 'Gemini-2.5-flash processing finished in 184ms.' },
  ]);

  // Save profile changes
  const handleSaveProfile = () => {
    setCurrentUser((prev: any) => ({
      ...prev,
      name: displayName
    }));
    alert('Profile preferences updated in secure local store.');
  };

  // Generate API key
  const handleGenerateKey = () => {
    if (!newKeyName.trim()) return;
    const keyString = 'vsn_live_' + Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16);
    const keyItem = {
      id: 'key_' + Math.random().toString(36).substring(2, 9),
      name: newKeyName,
      key: keyString,
      createdAt: new Date().toISOString().split('T')[0],
      calls: 0
    };
    setApiKeys([...apiKeys, keyItem]);
    setNewKeyName('');
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  // Trigger simulated Webhook delivery ping
  const handleTestWebhook = () => {
    setIsTestingWebhook(true);
    setWebhookPayload(null);
    setTimeout(() => {
      setIsTestingWebhook(false);
      setWebhookPayload(JSON.stringify({
        event: "webhook.test_ping",
        timestamp: new Date().toISOString(),
        webhookUrl: webhookUrl,
        payload: {
          status: "SUCCESS",
          deliveryId: "del_" + Math.random().toString(36).substring(2, 12),
          triggeredEvents: Object.keys(webhookEvents).filter(k => (webhookEvents as any)[k]),
          latencyMs: 142,
          serverEnvironment: "production-asia-southeast1"
        }
      }, null, 2));
    }, 1000);
  };

  // Handle plan checkout upgrade
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError('');
    if (!cardNumber || !cardName || !cardExpiry || !cardCvc) {
      setCheckoutError('Please populate all payment parameters.');
      return;
    }
    setCheckoutSuccess(true);
    setTimeout(() => {
      // Upgrade user role to Premium instantly
      setCurrentUser((prev: any) => ({
        ...prev,
        subscription: 'Pro',
        credits: 1000
      }));
      // Append new invoice transaction
      const newTx = {
        id: 'TX-' + Math.floor(Math.random() * 9000 + 1000),
        date: new Date().toISOString().split('T')[0],
        amount: '$19.00',
        status: 'PAID',
        plan: 'Pro Monthly Plan'
      };
      setTransactions([newTx, ...transactions]);
      setShowCheckoutModal(false);
      setCheckoutSuccess(false);
      setCardNumber('');
      setCardName('');
      setCardExpiry('');
      setCardCvc('');
    }, 1500);
  };

  const handleDowngrade = () => {
    setCurrentUser((prev: any) => ({
      ...prev,
      subscription: 'Free',
      credits: 50
    }));
    alert('Plan downgraded to Free tier. Quotas adjusted.');
  };

  // Adjust credentials from Admin Console
  const handleAdjustAdminCredits = (email: string, change: number) => {
    setAdminUsers(prev => prev.map(u => {
      if (u.email === email) {
        return { ...u, credits: Math.max(0, u.credits + change) };
      }
      return u;
    }));
    if (email === currentUser.email) {
      setCurrentUser((prev: any) => ({
        ...prev,
        credits: Math.max(0, prev.credits + change)
      }));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Settings Navigation Sidebar (Col 1-3) */}
      <div className="lg:col-span-3 space-y-2">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <img src={currentUser.avatar} alt="User Avatar" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" />
            <div className="space-y-0.5 overflow-hidden">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-50 truncate">{currentUser.name}</h4>
              <span className="inline-flex text-[9px] px-1.5 py-0.2 bg-brand-100 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400 font-mono font-bold uppercase rounded">
                {(currentUser.subscription || 'Free').toUpperCase()} PLAN
              </span>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3 flex justify-between text-xs font-mono">
            <span className="text-slate-500">Available Credits:</span>
            <span className="font-bold text-brand-600 dark:text-brand-400">{currentUser.credits} Token</span>
          </div>
        </div>

        <div className="p-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex flex-col gap-1">
          {[
            { id: 'profile', label: 'Display Profile', icon: User },
            { id: 'ai', label: 'AI Preferences', icon: Sliders },
            { id: 'billing', label: 'Billing & Quotas', icon: CreditCard },
            { id: 'api', label: 'Developer APIs', icon: Key },
            { id: 'integrations', label: 'Webhooks & Sync', icon: Globe },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubTab(item.id as any)}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all text-left ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings Center Contents (Col 4-12) */}
      <div className="lg:col-span-9">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-sm min-h-[480px]">
          
          {/* 1. PROFILE PREFERENCES */}
          {activeSubTab === 'profile' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Personal Account Preferences</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Configure display identity and application spacing density parameters.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-400">Display Identity</label>
                  <input 
                    type="text" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)} 
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 smooth-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-400">Username Slug</label>
                  <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 smooth-all"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-400">Creative Bio</label>
                  <textarea 
                    value={userBio} 
                    onChange={(e) => setUserBio(e.target.value)} 
                    rows={3}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 smooth-all"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/60 pt-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Accessibility & Styling Settings</h4>
                
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Compact Spacing Layout</span>
                    <span className="text-[10px] text-slate-500">Reduce padding density on bento blocks.</span>
                  </div>
                  <button 
                    onClick={() => setCompactMode(!compactMode)}
                    className={`w-10 h-6 rounded-full relative smooth-all ${compactMode ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-800'}`}
                  >
                    <div className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.75 transition-all ${compactMode ? 'right-0.75' : 'left-0.75'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">System Accent Theme</span>
                    <span className="text-[10px] text-slate-500">Customize main color accents inside the dashboard.</span>
                  </div>
                  <div className="flex gap-2">
                    {['#2563eb', '#8b5cf6', '#10b981', '#f59e0b'].map((col) => (
                      <button 
                        key={col} 
                        onClick={() => setAccentColor(col)} 
                        className={`w-6 h-6 rounded-full border border-white dark:border-slate-900 shadow-sm relative`}
                        style={{ backgroundColor: col }}
                      >
                        {accentColor === col && <Check className="w-3.5 h-3.5 text-white absolute inset-0.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800/60 pt-5">
                <button 
                  onClick={onClearHistory}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-800/50 text-rose-700 hover:bg-rose-100 smooth-all"
                >
                  Clear Sandbox History ({historyCount} items)
                </button>
                <button 
                  onClick={handleSaveProfile}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 smooth-all"
                >
                  Save Profile Settings
                </button>
              </div>
            </div>
          )}

          {/* 2. AI PREFERENCES */}
          {activeSubTab === 'ai' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">AI Preferences</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Configure default network processing algorithms and automatic tasks behavior.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-400 text-slate-800 dark:text-slate-300">Default Segmentor Model</label>
                  <select 
                    value={defaultModel} 
                    onChange={(e) => setDefaultModel(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <option value="Gemini High-Fi Segmentation">Gemini High-Fi Segmentation</option>
                    <option value="Edge Adaptive Net">Edge Adaptive Net (V2)</option>
                    <option value="BiRefNet Studio">BiRefNet Studio (Max Detail)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-400 text-slate-800 dark:text-slate-300">Default Download Encoding</label>
                  <select 
                    value={defaultFormat} 
                    onChange={(e) => setDefaultFormat(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <option value="png">PNG (Lossless Alpha Background)</option>
                    <option value="jpg">JPG (White Solid Fill)</option>
                    <option value="webp">WebP (Optimized Studio compression)</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-400 text-slate-800 dark:text-slate-300">
                    <span>Edge Alpha Feather Smoothing Radius</span>
                    <span className="font-mono text-[10px] text-brand-600 font-bold">{featherSmooth}px</span>
                  </div>
                  <input 
                    type="range" 
                    min={0} 
                    max={10} 
                    value={featherSmooth} 
                    onChange={(e) => setFeatherSmooth(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/60 pt-5">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Instant Auto Download</span>
                    <span className="text-[10px] text-slate-500">Automatically trigger browser downloads when background task is complete.</span>
                  </div>
                  <button 
                    onClick={() => setAutoDownload(!autoDownload)}
                    className={`w-10 h-6 rounded-full relative smooth-all ${autoDownload ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-800'}`}
                  >
                    <div className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.75 transition-all ${autoDownload ? 'right-0.75' : 'left-0.75'}`} />
                  </button>
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-100 dark:border-slate-800/60 pt-5">
                <button 
                  onClick={() => alert('AI Model preferences synchronized successfully.')}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 smooth-all"
                >
                  Synchronize AI Parameters
                </button>
              </div>
            </div>
          )}

          {/* 3. BILLING & SUBSCRIPTIONS */}
          {activeSubTab === 'billing' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800/60 pb-4 flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Billing, Quotas & Subscription Engine</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Scale credit limits, modify active subscriptions, and view past invoices.</p>
                </div>
                <span className="px-3 py-1 bg-brand-100 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400 rounded-xl text-xs font-bold font-mono uppercase">
                  ACTIVE: {currentUser.subscription || 'Free'}
                </span>
              </div>

              {/* Plans Comparison Deck */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Free Card */}
                <div className={`p-4 rounded-2xl border bg-slate-50 dark:bg-slate-950/40 relative flex flex-col justify-between ${(!currentUser.subscription || currentUser.subscription === 'Free') ? 'border-brand-500 ring-1 ring-brand-500/20' : 'border-slate-200 dark:border-slate-800'}`}>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide font-mono">Free Plan</h4>
                    <div className="text-xl font-bold font-sans text-slate-900 dark:text-white">$0 <span className="text-[10px] text-slate-500 font-normal">/ month</span></div>
                    <ul className="text-[10px] space-y-1.5 text-slate-600 dark:text-slate-400 font-mono">
                      <li>• 50 complimentary credits</li>
                      <li>• Max size: 5MB image limit</li>
                      <li>• Standard Gemini Model</li>
                      <li>• Standard GPU queues</li>
                    </ul>
                  </div>
                  {(!currentUser.subscription || currentUser.subscription === 'Free') ? (
                    <span className="w-full text-center mt-4 py-1.5 bg-brand-100 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400 rounded-xl text-[10px] font-bold uppercase tracking-wider">Current Active Plan</span>
                  ) : (
                    <button 
                      onClick={() => handleDowngrade()}
                      className="w-full text-center mt-4 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 rounded-xl text-[10px] font-bold uppercase tracking-wider"
                    >
                      Demote to Free
                    </button>
                  )}
                </div>

                {/* Premium Pro Card */}
                <div className={`p-4 rounded-2xl border bg-slate-50 dark:bg-slate-950/40 relative flex flex-col justify-between ${currentUser.subscription === 'Pro' ? 'border-brand-500 ring-1 ring-brand-500/20' : 'border-slate-200 dark:border-slate-800'}`}>
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-brand-600 text-white rounded text-[8px] font-bold uppercase tracking-wider">POPULAR</div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-brand-600 uppercase tracking-wide font-mono font-bold text-indigo-600">PRO STUDIO</h4>
                    <div className="text-xl font-bold font-sans text-slate-900 dark:text-white">$19.00 <span className="text-[10px] text-slate-500 font-normal">/ mo</span></div>
                    <ul className="text-[10px] space-y-1.5 text-slate-600 dark:text-slate-400 font-mono">
                      <li>• 1000 premium monthly credits</li>
                      <li>• Max size: 20MB files, any model</li>
                      <li>• Full parallel batch concurrency</li>
                      <li>• Dedicated Priority GPU queues</li>
                    </ul>
                  </div>
                  {currentUser.subscription === 'Pro' ? (
                    <span className="w-full text-center mt-4 py-1.5 bg-brand-100 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400 rounded-xl text-[10px] font-bold uppercase tracking-wider">Current Active Plan</span>
                  ) : (
                    <button 
                      onClick={() => setShowCheckoutModal(true)}
                      className="w-full text-center mt-4 py-1.5 bg-brand-600 text-white hover:bg-brand-700 rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-sm"
                    >
                      Upgrade To Pro
                    </button>
                  )}
                </div>

                {/* Business / Enterprise Card */}
                <div className={`p-4 rounded-2xl border bg-slate-50 dark:bg-slate-950/40 relative flex flex-col justify-between ${currentUser.subscription === 'Business' ? 'border-brand-500 ring-1 ring-brand-500/20' : 'border-slate-200 dark:border-slate-800'}`}>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide font-mono text-indigo-600">BUSINESS TIER</h4>
                    <div className="text-xl font-bold font-sans text-slate-900 dark:text-white">$49.00 <span className="text-[10px] text-slate-500 font-normal">/ mo</span></div>
                    <ul className="text-[10px] space-y-1.5 text-slate-600 dark:text-slate-400 font-mono">
                      <li>• 5000 high-speed credits</li>
                      <li>• Max size: 50MB files, dedicated</li>
                      <li>• High throughput segment queue</li>
                      <li>• Advanced sync options</li>
                    </ul>
                  </div>
                  {currentUser.subscription === 'Business' ? (
                    <span className="w-full text-center mt-4 py-1.5 bg-brand-100 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400 rounded-xl text-[10px] font-bold uppercase tracking-wider">Current Active Plan</span>
                  ) : (
                    <button 
                      onClick={() => {
                        setCurrentUser((prev: any) => ({ ...prev, subscription: 'Business', credits: 5000 }));
                        alert('Upgraded to Business Tier successfully.');
                      }}
                      className="w-full text-center mt-4 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 rounded-xl text-[10px] font-bold uppercase tracking-wider"
                    >
                      Upgrade Business
                    </button>
                  )}
                </div>

              </div>

              {/* Transaction / Invoices logs */}
              <div className="border-t border-slate-100 dark:border-slate-800/60 pt-5 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">SaaS Transaction History</h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] font-mono text-slate-600 dark:text-slate-400 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-slate-400">
                        <th className="pb-2">Invoice ID</th>
                        <th className="pb-2">Trigger Date</th>
                        <th className="pb-2">Plan Product</th>
                        <th className="pb-2">Charged Amount</th>
                        <th className="pb-2 text-right">Status Ledger</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-slate-100 dark:border-slate-800/60">
                          <td className="py-2.5 font-bold text-slate-900 dark:text-slate-100">{tx.id}</td>
                          <td className="py-2.5">{tx.date}</td>
                          <td className="py-2.5 font-semibold">{tx.plan}</td>
                          <td className="py-2.5 text-brand-600 font-bold">{tx.amount}</td>
                          <td className="py-2.5 text-right">
                            <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-md font-bold text-[9px]">
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* 4. DEVELOPER APIS & KEYS */}
          {activeSubTab === 'api' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Developer Portal & Security Keys</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Manage client secret keys to interface with our background segmentation gateway asynchronously.</p>
              </div>

              {false ? (
                <div className="p-6 text-center bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200/50 dark:border-amber-900/40 space-y-2">
                  <ShieldAlert className="w-8 h-8 text-amber-500 mx-auto" />
                  <h4 className="text-xs font-bold text-slate-950 dark:text-white uppercase">Privilege Level Insufficient</h4>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">Please upgrade to Pro to leverage key integration.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Create Key */}
                  <div className="flex gap-2 items-end">
                    <div className="space-y-1.5 w-full">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-400">Provision New Secret API Token</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Mobile App Release Client"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 smooth-all"
                      />
                    </div>
                    <button 
                      onClick={handleGenerateKey}
                      className="px-4 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Generate
                    </button>
                  </div>

                  {/* Active keys ledger */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Active Client Secret Keys</h4>
                    <div className="space-y-2">
                      {apiKeys.length === 0 ? (
                        <div className="p-3 text-center border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 rounded-xl">No active tokens provisioned.</div>
                      ) : (
                        apiKeys.map((k) => (
                          <div key={k.id} className="p-3.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-950 flex justify-between items-center text-xs">
                            <div className="space-y-1 overflow-hidden">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-slate-50">{k.name}</span>
                                <span className="text-[9px] font-mono font-bold text-brand-600 bg-brand-50 px-1 rounded">Rate Limit: {currentUser.subscription === 'Pro' ? '60 req/min' : '5 req/min'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                                <span className="truncate max-w-[200px] sm:max-w-xs">{k.key}</span>
                                <button 
                                  onClick={() => copyToClipboard(k.key, k.id)}
                                  className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                                >
                                  {copiedKeyId === k.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 shrink-0 font-mono text-[10px] text-slate-500">
                              <span className="hidden sm:inline">Calls: {k.calls}</span>
                              <button 
                                onClick={() => handleRevokeKey(k.id)}
                                className="text-rose-500 hover:text-rose-700 shrink-0 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* cURL instructions documentation */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">cURL API Gateway Endpoint Snippet</h4>
                    <pre className="p-4 rounded-xl bg-slate-950 text-slate-300 text-[10px] font-mono leading-relaxed overflow-x-auto border border-slate-800/50">
{`curl -X POST "https://vision.ai-studio/api/v1/jobs/create" \\
  -H "Authorization: Bearer ${apiKeys[0]?.key || 'YOUR_SECRET_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "toolType": "BG_REMOVER",
    "image": "data:image/png;base64,iVBORw0KGgoAAAANS..."
  }'`}
                    </pre>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* 5. INTEGRATIONS & WEBHOOKS */}
          {activeSubTab === 'integrations' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Webhooks & External Service Sync</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Trigger automatic external POST payloads to notify your enterprise web servers when AI segmentation jobs execute successfully.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-400 text-slate-800 dark:text-slate-300">Target HTTP Webhook Endpoint URL</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 smooth-all"
                    />
                    <button 
                      onClick={handleTestWebhook}
                      disabled={isTestingWebhook}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {isTestingWebhook ? 'Delivering...' : 'Test Delivery'}
                    </button>
                  </div>
                </div>

                {/* Event Selectors */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-400 text-slate-800 dark:text-slate-300">Trigger Event Webhook Scopes</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <label className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 rounded-xl flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">job.completed</span>
                        <p className="text-[10px] text-slate-500">Dispatched when background GPU segmentation compiles successfully.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={webhookEvents.jobFinished} 
                        onChange={(e) => setWebhookEvents({ ...webhookEvents, jobFinished: e.target.checked })}
                        className="w-4 h-4 text-brand-600 border-slate-300 rounded focus:ring-brand-500"
                      />
                    </label>

                    <label className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60 rounded-xl flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">download.logged</span>
                        <p className="text-[10px] text-slate-500">Dispatched when client pulls processed image format presets.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={webhookEvents.fileDownloaded} 
                        onChange={(e) => setWebhookEvents({ ...webhookEvents, fileDownloaded: e.target.checked })}
                        className="w-4 h-4 text-brand-600 border-slate-300 rounded focus:ring-brand-500"
                      />
                    </label>
                  </div>
                </div>

                {/* Simulated Delivery Console Payload output */}
                {webhookPayload && (
                  <div className="space-y-1.5 animate-fadeIn">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                      <span>HTTP RESPONSE: <span className="text-emerald-500 font-bold">200 OK</span></span>
                      <span>DELIVERY ID: VS_DEL_89201A</span>
                    </div>
                    <pre className="p-4 rounded-xl bg-slate-950 text-slate-300 text-[10px] font-mono leading-relaxed overflow-x-auto border border-slate-800/50 max-h-56">
                      {webhookPayload}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}



        </div>
      </div>

      {/* Sleek checkout Card upgrade modal popup */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 max-w-md w-full space-y-6 relative overflow-hidden">
            
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800/60 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Credit Card Authentication</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Upgrade session credentials to Pro Studio Plan instantly.</p>
              </div>
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 flex items-center justify-center font-bold text-slate-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {checkoutError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-800/50 text-[11px] text-rose-700 dark:text-rose-400 font-semibold">
                {checkoutError}
              </div>
            )}

            <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-400">
              
              <div className="space-y-1">
                <label>Cardholder Full Name</label>
                <input 
                  type="text" 
                  placeholder="Jane Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 smooth-all"
                />
              </div>

              <div className="space-y-1">
                <label>Debit/Credit Card Number</label>
                <input 
                  type="text" 
                  placeholder="4111 2222 3333 4444"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 smooth-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label>Expiry (MM/YY)</label>
                  <input 
                    type="text" 
                    placeholder="12/28"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 smooth-all"
                  />
                </div>
                <div className="space-y-1">
                  <label>Secure CVC Code</label>
                  <input 
                    type="password" 
                    placeholder="•••"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 smooth-all"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 flex justify-between items-center">
                <span className="text-[11px] text-slate-400 font-mono">Billed monthly: $19.00 USD</span>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Pay & Upgrade Account
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
