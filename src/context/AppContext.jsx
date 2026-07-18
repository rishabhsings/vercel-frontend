import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'dashboard', 'range-finder', 'lessons'
  const [error, setError] = useState(null);

  // Auto-load profile or create a default guest profile
  useEffect(() => {
    const loadProfile = () => {
      try {
        const storedUser = localStorage.getItem('swarsikh_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          const guestUser = {
            _id: 'guest_' + Math.random().toString(36).substr(2, 9),
            username: 'Guest Learner',
            isGuest: true,
            vocalProfile: { voiceType: 'Undetermined', minFrequency: 0, maxFrequency: 0, highestNote: '', lowestNote: '' },
            stats: { xp: 0, streakDays: 0, lastActive: new Date().toISOString() }
          };
          localStorage.setItem('swarsikh_user', JSON.stringify(guestUser));
          setUser(guestUser);
        }
        setCurrentView('landing');
      } catch (err) {
        console.error('Failed to load user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const updateVocalProfile = async (vocalData) => {
    if (!user) return false;
    try {
      const updatedUser = {
        ...user,
        vocalProfile: vocalData
      };
      setUser(updatedUser);
      localStorage.setItem('swarsikh_user', JSON.stringify(updatedUser));
      return true;
    } catch (err) {
      console.error('Failed to sync vocal profile locally:', err);
      return false;
    }
  };

  const completeLesson = async (lessonId) => {
    if (!user) return false;
    try {
      const currentXP = user.stats?.xp || 0;
      const updatedUser = {
        ...user,
        stats: {
          ...user.stats,
          xp: currentXP + 100, // standard reward
          streakDays: (user.stats?.streakDays || 0) + 1,
          lastActive: new Date().toISOString()
        }
      };
      setUser(updatedUser);
      localStorage.setItem('swarsikh_user', JSON.stringify(updatedUser));
      return { success: true, xpEarned: 100, user: updatedUser };
    } catch (err) {
      console.error('Failed to register lesson completion locally:', err);
      return null;
    }
  };

  const updateUserDetails = (details) => {
    if (!user) return;
    const updatedUser = { ...user, ...details };
    setUser(updatedUser);
    localStorage.setItem('swarsikh_user', JSON.stringify(updatedUser));
  };

  const login = (username, email) => {
    const registeredUser = {
      ...user,
      username: username || 'Real User',
      isGuest: false,
      email: email || 'user@example.com'
    };
    setUser(registeredUser);
    localStorage.setItem('swarsikh_user', JSON.stringify(registeredUser));
    setCurrentView('profile');
  };

  const logout = () => {
    localStorage.removeItem('swarsikh_user');
    // Generate a fresh guest session
    const guestUser = {
      _id: 'guest_' + Math.random().toString(36).substr(2, 9),
      username: 'Guest Learner',
      isGuest: true,
      email: '',
      vocalProfile: { voiceType: 'Undetermined', minFrequency: 0, maxFrequency: 0, highestNote: '', lowestNote: '' },
      stats: { xp: 0, streakDays: 0, lastActive: new Date().toISOString() }
    };
    localStorage.setItem('swarsikh_user', JSON.stringify(guestUser));
    setUser(guestUser);
    setCurrentView('landing');
  };

  return (
    <AppContext.Provider value={{
      user,
      loading,
      currentView,
      error,
      setCurrentView,
      updateVocalProfile,
      completeLesson,
      updateUserDetails,
      login,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};
export default AppContext;
