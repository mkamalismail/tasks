import React from 'react';
import { ArrowRight, CheckCircle2, Clock, ListTodo, Target, Zap, Calendar, BrainCircuit, TrendingUp } from 'lucide-react';
import Button from '../ui/Button';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">EMatrix</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onGetStarted}
            >
              Log in
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 opacity-50" />
        <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
                Master Your Time with
                <span className="block text-primary-600 mt-2">Eisenhower Matrix</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
                Transform your productivity by focusing on what truly matters. Our intuitive task management system helps you prioritize effectively and achieve more.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onGetStarted}
                  icon={<ArrowRight size={20} />}
                  iconPosition="right"
                >
                  Get started for free
                </Button>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-16 relative max-w-5xl mx-auto px-4">
            <img
              src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
              alt="Task Management"
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-8 transform hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-primary-500 bg-opacity-20 rounded-full flex items-center justify-center mb-6">
                <BrainCircuit className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Smart Prioritization
              </h3>
              <p className="text-gray-600">
                Leverage the power of the Eisenhower Matrix to make better decisions about task importance and urgency.
              </p>
            </div>

            <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-8 transform hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-secondary-500 bg-opacity-20 rounded-full flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Visual Task Management
              </h3>
              <p className="text-gray-600">
                Organize tasks with an intuitive drag-and-drop interface and multiple view options for better clarity.
              </p>
            </div>

            <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-xl p-8 transform hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-success-500 bg-opacity-20 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Progress Analytics
              </h3>
              <p className="text-gray-600">
                Track your productivity trends and celebrate achievements with detailed progress insights.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              How EMatrix Works
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Simple steps to transform your task management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <ListTodo className="w-6 h-6 text-primary-600" />,
                title: "Add Tasks",
                description: "Quickly input your tasks with titles, descriptions, and due dates."
              },
              {
                icon: <Target className="w-6 h-6 text-primary-600" />,
                title: "Categorize",
                description: "Sort tasks into quadrants based on urgency and importance."
              },
              {
                icon: <Clock className="w-6 h-6 text-primary-600" />,
                title: "Prioritize",
                description: "Focus on what matters most with clear visual organization."
              },
              {
                icon: <CheckCircle2 className="w-6 h-6 text-primary-600" />,
                title: "Complete",
                description: "Track progress and celebrate your accomplishments."
              }
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm relative">
                <div className="absolute -top-4 left-6 w-8 h-8 bg-primary-600 rounded-full text-white flex items-center justify-center font-bold">
                  {i + 1}
                </div>
                <div className="mt-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-primary-600 py-16">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg')] opacity-10 bg-cover bg-center" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to boost your productivity?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who use EMatrix to achieve more by doing less. Start organizing your tasks effectively today.
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={onGetStarted}
            icon={<ArrowRight size={20} />}
            iconPosition="right"
          >
            Start organizing today
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <Target className="h-8 w-8 text-primary-500" />
            <span className="text-xl font-bold text-white ml-2">EMatrix</span>
          </div>
          <p className="text-center mt-4">
            © {new Date().getFullYear()} EMatrix. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;