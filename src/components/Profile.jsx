import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, Mic, Settings, LogOut, Bell, Shield, Check } from 'lucide-react';

const MOCK_MICS = [
  'Default System Microphone',
  'External USB Condenser Mic',
  'MacBook Pro Built-in Mic'
];

const Profile = () => {
  const { user, logout, updateUserDetails } = useApp();
  
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(user?.email || 'user@example.com');
  const [micIndex, setMicIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSaveEmail = () => {
    updateUserDetails({ email: emailInput });
    setIsEditingEmail(false);
    showToast('Email address updated successfully');
  };

  const handleChangeMic = () => {
    const nextIdx = (micIndex + 1) % MOCK_MICS.length;
    setMicIndex(nextIdx);
    showToast(`Microphone changed to ${MOCK_MICS[nextIdx]}`);
  };

  const handlePrivacyManage = () => {
    showToast('Privacy settings data downloaded (Mocked action)');
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    showToast(`Practice reminders ${!notificationsEnabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-emerald-500/90 text-white px-6 py-3 rounded-xl shadow-lg font-medium flex items-center gap-3 animate-in slide-in-from-top-5 z-50">
          <Check size={20} />
          {toastMessage}
        </div>
      )}

      <h2 className="text-3xl font-black text-white mb-8">Account Profile</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column - User Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 text-center">
            <div className="w-24 h-24 mx-auto bg-indigo-500/20 border border-indigo-500/50 rounded-full flex items-center justify-center mb-4">
              <User size={40} className="text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white">{user?.username || 'Guest Singer'}</h3>
            <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full mt-2 uppercase tracking-wider">
              {user?.vocalProfile?.voiceType || 'Uncalibrated Voice'}
            </span>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-4">
            <button 
              onClick={logout}
              className="w-full flex items-center justify-between p-3 hover:bg-slate-800/50 rounded-xl transition-colors text-slate-300 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <LogOut size={18} className="text-rose-400" />
                <span className="font-semibold text-sm">Sign Out</span>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column - Settings */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-8">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Settings size={20} className="text-indigo-400" /> System Preferences
            </h3>
            
            <div className="space-y-6">
              
              {/* Email */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">Email Address</h4>
                    {isEditingEmail ? (
                      <input 
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="bg-slate-950 border border-slate-700 text-white text-sm rounded-lg block w-full p-2 mt-1 focus:outline-none focus:border-indigo-500"
                        autoFocus
                      />
                    ) : (
                      <p className="text-slate-400 text-sm">{user?.email || 'user@example.com'}</p>
                    )}
                  </div>
                </div>
                {isEditingEmail ? (
                  <div className="flex items-center gap-2 ml-4">
                    <button onClick={handleSaveEmail} className="text-sm font-bold text-emerald-400 hover:text-emerald-300">Save</button>
                    <button onClick={() => setIsEditingEmail(false)} className="text-sm font-bold text-slate-400 hover:text-slate-300">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setIsEditingEmail(true)} className="text-sm font-bold text-indigo-400 hover:text-indigo-300 ml-4">Edit</button>
                )}
              </div>

              {/* Mic Settings */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                    <Mic size={18} className="text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Microphone Input</h4>
                    <p className="text-slate-400 text-sm">{MOCK_MICS[micIndex]}</p>
                  </div>
                </div>
                <button onClick={handleChangeMic} className="text-sm font-bold text-indigo-400 hover:text-indigo-300">Change</button>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                    <Bell size={18} className="text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Practice Reminders</h4>
                    <p className="text-slate-400 text-sm">Daily notifications {notificationsEnabled ? 'enabled' : 'disabled'}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={notificationsEnabled} onChange={toggleNotifications} />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                </label>
              </div>
              
              {/* Privacy */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                    <Shield size={18} className="text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Privacy Data</h4>
                    <p className="text-slate-400 text-sm">Manage stored vocal recordings</p>
                  </div>
                </div>
                <button onClick={handlePrivacyManage} className="text-sm font-bold text-indigo-400 hover:text-indigo-300">Manage</button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
