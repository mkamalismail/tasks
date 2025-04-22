import React, { useState } from 'react';
import Header from './components/layout/Header';
import QuadrantGrid from './components/layout/QuadrantGrid';
import Footer from './components/layout/Footer';
import AuthForm from './components/auth/AuthForm';
import ProfilePage from './components/profile/ProfilePage';
import LandingPage from './components/landing/LandingPage';
import useAuthStore from './store/authStore';

const App: React.FC = () => {
  const { user, loading } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user && !showAuth) {
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  if (!user) {
    return (
      <div className="h-full">
        <AuthForm 
          onSuccess={() => setShowAuth(false)} 
          onBack={() => setShowAuth(false)}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <Header onProfileClick={() => setShowProfile(true)} />
      <main className="flex-1 flex flex-col">
        {showProfile ? (
          <ProfilePage onBack={() => setShowProfile(false)} />
        ) : (
          <QuadrantGrid />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;