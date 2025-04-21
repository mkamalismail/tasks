import React, { useState } from 'react';
import { User, Save, LogOut, ArrowLeft, Mail, AlertTriangle, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import useAuthStore from '../../store/authStore';

interface ProfilePageProps {
  onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
  const { user, updateUserProfile, updateUserPassword, logout, sendVerificationEmail } = useAuthStore();
  const [name, setName] = useState(user?.displayName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      await updateUserProfile(name);
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      await updateUserPassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMessage('Password updated successfully!');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSendVerificationEmail = async () => {
    try {
      await sendVerificationEmail();
      setVerificationEmailSent(true);
      setSuccessMessage('Verification email sent! Please check your inbox.');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        icon={<ArrowLeft size={16} />}
        className="mb-4"
      >
        Back to Tasks
      </Button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <User size={24} className="text-primary-500" />
          Profile Settings
        </h1>

        {/* Email Verification Status */}
        {user && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            user.emailVerified 
              ? 'bg-success-50 text-success-700' 
              : 'bg-warning-50 text-warning-700'
          }`}>
            {user.emailVerified ? (
              <>
                <CheckCircle size={20} />
                <span>Your email is verified</span>
              </>
            ) : (
              <>
                <AlertTriangle size={20} />
                <div className="flex-1">
                  <p className="font-medium">Email not verified</p>
                  <p className="text-sm">Please verify your email to ensure account security</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSendVerificationEmail}
                  disabled={verificationEmailSent}
                  icon={<Mail size={16} />}
                >
                  {verificationEmailSent ? 'Email Sent' : 'Verify Email'}
                </Button>
              </>
            )}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-error-50 text-error-600 rounded-md">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-success-50 text-success-600 rounded-md">
            {successMessage}
          </div>
        )}

        <div className="space-y-6">
          {/* Update Profile Form */}
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <h2 className="text-lg font-semibold">Update Profile</h2>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
            <Button type="submit" variant="primary" icon={<Save size={16} />}>
              Update Profile
            </Button>
          </form>

          {/* Update Password Form */}
          <form onSubmit={handleUpdatePassword} className="space-y-4 pt-6 border-t">
            <h2 className="text-lg font-semibold">Change Password</h2>
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
            <Button type="submit" variant="primary" icon={<Save size={16} />}>
              Update Password
            </Button>
          </form>

          {/* Logout Button */}
          <div className="pt-6 border-t">
            <Button
              type="button"
              variant="danger"
              onClick={handleLogout}
              icon={<LogOut size={16} />}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;