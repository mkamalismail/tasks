import React, { useState, useEffect } from 'react';
import { LogIn, UserPlus, ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';
import useAuthStore from '../../store/authStore';

interface AuthFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

const images = [
  {
    url: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
    title: "Organize your tasks effectively",
    description: "Use the Eisenhower Matrix to prioritize what matters most"
  },
  {
    url: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
    title: "Collaborate seamlessly",
    description: "Work together with your team to achieve more"
  },
  {
    url: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg",
    title: "Track your progress",
    description: "Monitor your productivity and celebrate achievements"
  }
];

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess, onBack }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { signIn, signUp } = useAuthStore();

  // Auto-rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignUp) {
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
      onSuccess();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="w-full min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-[45%] p-8 flex items-center justify-center bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600 mb-8">
            {isSignUp
              ? 'Start organizing your tasks effectively'
              : 'Sign in to continue with your productivity journey'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-error-50 text-error-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              icon={isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>

            <p className="text-center text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Right Panel - Image Carousel */}
      <div className="hidden lg:block lg:w-[55%] bg-gradient-to-br from-primary-500 to-secondary-500 p-8 relative overflow-hidden">
        <div className="h-full w-full rounded-3xl overflow-hidden relative">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h2 className="text-3xl font-bold mb-4">
                  {image.title}
                </h2>
                <p className="text-lg opacity-90">
                  {image.description}
                </p>
              </div>
            </div>
          ))}

          {/* Image Navigation Dots */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Show image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;