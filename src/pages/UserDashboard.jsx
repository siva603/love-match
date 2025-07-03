import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCard } from '@/components/UserCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/userService';
import { Heart, Users, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    dailyMatches: 5,
    likesGiven: 0
  });

  useEffect(() => {
    if (user) {
      loadMatches();
      loadStats();
    }
  }, [user]);

  const loadMatches = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const bestMatches = await userService.getBestMatches(user.id, 10);
      setMatches(bestMatches);
    } catch (error) {
      toast({
        title: "Error loading matches",
        description: "Unable to load your matches. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const allUsers = await userService.getAllUsers();
      setStats(prev => ({ ...prev, totalUsers: allUsers.length }));
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLike = (number) => {
    setStats(prev => ({ ...prev, likesGiven: prev.likesGiven + 1 }));
    toast({
      title: "It's a match! 💕",
      description: "You liked this profile. They'll be notified!",
    });
    nextMatch();
  };

  const handlePass = (number) => {
    toast({
      title: "Passed",
      description: "No worries, there are plenty of other matches!",
    });
    nextMatch();
  };

  const nextMatch = () => {
    if (currentMatchIndex < matches.length - 1) {
      setCurrentMatchIndex(prev => prev + 1);
    } else {
      loadMatches(); // Load more matches
      setCurrentMatchIndex(0);
    }
  };

  const currentMatch = matches[currentMatchIndex];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Welcome back, {user?.name}! 💖
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Ready to find your perfect match today?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white/90 backdrop-blur-sm border-primary/20 hover:shadow-card transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stats.totalUsers}</p>
                <p className="text-gray-600 dark:text-gray-400">Total Users</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/90 backdrop-blur-sm border-primary/20 hover:shadow-card transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-romantic rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stats.likesGiven}</p>
                <p className="text-gray-600 dark:text-gray-400">Likes Given</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/90 backdrop-blur-sm border-primary/20 hover:shadow-card transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
                <Search className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stats.dailyMatches}</p>
                <p className="text-gray-600 dark:text-gray-400">Daily Matches</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Match */}
          <div className="lg:col-span-2">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                Your Perfect Match Awaits
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Swipe right to like, left to pass
              </p>
            </div>

            {currentMatch ? (
              <div className="max-w-md mx-auto">
                <UserCard
                  user={currentMatch}
                  onLike={handleLike}
                  onPass={handlePass}
                  className="animate-slide-up"
                />
              </div>
            ) : (
              <Card className="p-12 text-center bg-white/90 backdrop-blur-sm border-primary/20">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-600 mb-2">
                  No more matches for now
                </h3>
                <p className="text-gray-500 mb-6">
                  Check back later or broaden your search preferences!
                </p>
                <Button variant="romantic" onClick={loadMatches}>
                  Refresh Matches
                </Button>
              </Card>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6 bg-white/90 backdrop-blur-sm border-primary/20">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/matches" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Heart className="w-4 h-4 mr-2" />
                    View All Matches
                  </Button>
                </Link>
                <Link to="/profile/edit" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start" onClick={loadMatches}>
                  <Search className="w-4 h-4 mr-2" />
                  Find New Matches
                </Button>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6 bg-gradient-secondary border-primary/20">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">💡 Dating Tips</h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <p>• Be authentic in your profile</p>
                <p>• Upload clear, recent photos</p>
                <p>• Show your personality in your bio</p>
                <p>• Be respectful in conversations</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};