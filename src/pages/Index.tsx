import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Users, Search, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import heroImage from '@/assets/hero-dating.jpg';

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-romantic opacity-20" />
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-8 animate-float">
            <div className="w-24 h-24 bg-gradient-romantic rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
              <Heart className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="bg-gradient-romantic bg-clip-text text-transparent">
              LoveMatch
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-700 mb-8 font-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Where Hearts Connect & Love Begins
          </p>
          
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Join thousands of singles finding their perfect match. Experience modern dating with intelligent matching, 
            beautiful profiles, and meaningful connections.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
            {isAuthenticated ? (
              <Link to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'}>
                <Button variant="romantic" size="lg" className="text-lg px-8 py-4 shadow-romantic">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="romantic" size="lg" className="text-lg px-8 py-4 shadow-romantic">
                    Start Your Journey
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="floating" size="lg" className="text-lg px-8 py-4">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose LoveMatch?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our advanced matching system and beautiful interface make finding love effortless and enjoyable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="p-8 text-center bg-white/90 backdrop-blur-sm border-primary/20 hover:shadow-romantic transition-all duration-500 hover:scale-105 animate-fade-in">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Smart Matching</h3>
              <p className="text-gray-600">
                Our intelligent algorithm analyzes interests, preferences, and compatibility to find your perfect match.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-8 text-center bg-white/90 backdrop-blur-sm border-primary/20 hover:shadow-romantic transition-all duration-500 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-gradient-romantic rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Verified Profiles</h3>
              <p className="text-gray-600">
                Connect with real people through our verification system ensuring authentic and meaningful connections.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-8 text-center bg-white/90 backdrop-blur-sm border-primary/20 hover:shadow-romantic transition-all duration-500 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Premium Experience</h3>
              <p className="text-gray-600">
                Enjoy a beautiful, intuitive interface designed for modern daters who value quality and aesthetics.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-secondary">
        <div className="container mx-auto px-4 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="animate-fade-in">
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <p className="text-gray-700">Happy Couples</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <p className="text-gray-700">Active Users</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <p className="text-gray-700">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Ready to Find Your Perfect Match?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of singles who have already found love on LoveMatch.
            </p>
            <Link to="/register">
              <Button variant="romantic" size="lg" className="text-lg px-12 py-4 shadow-romantic animate-glow">
                Get Started Today
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
