import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { userService } from '@/services/userService';
import { Users, Heart, Settings, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    maleUsers: 0,
    femaleUsers: 0,
    activeUsers: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [allUsers, maleUsers, femaleUsers] = await Promise.all([
        userService.getAllUsers(),
        userService.getMaleUsers(),
        userService.getFemaleUsers()
      ]);

      setStats({
        totalUsers: allUsers.length,
        maleUsers: maleUsers.length,
        femaleUsers: femaleUsers.length,
        activeUsers: allUsers.filter(user => user.role === 'USER').length
      });

      // Get 5 most recent users
      setRecentUsers(allUsers.slice(0, 5));
    } catch (error) {
      toast({
        title: "Error loading dashboard",
        description: "Unable to load dashboard data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Manage your dating platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white/90 backdrop-blur-sm border-primary/20 hover:shadow-card transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
                <p className="text-gray-600">Total Users</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/90 backdrop-blur-sm border-primary/20 hover:shadow-card transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-romantic rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{stats.activeUsers}</p>
                <p className="text-gray-600">Active Users</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/90 backdrop-blur-sm border-primary/20 hover:shadow-card transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{stats.maleUsers}</p>
                <p className="text-gray-600">Male Users</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/90 backdrop-blur-sm border-primary/20 hover:shadow-card transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{stats.femaleUsers}</p>
                <p className="text-gray-600">Female Users</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white/90 dark:bg-card/90 backdrop-blur-sm border-primary/20">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <Link to="/admin/users" className="block">
                  <Button variant="outline" className="w-full justify-start text-left">
                    <Users className="w-5 h-5 mr-3" />
                    Manage Users
                  </Button>
                </Link>
                <Link to="/admin/reports" className="block">
                  <Button variant="outline" className="w-full justify-start text-left">
                    <Settings className="w-5 h-5 mr-3" />
                    View Reports
                  </Button>
                </Link>
                <Button 
                  variant="romantic" 
                  className="w-full justify-start text-left"
                  onClick={loadDashboardData}
                >
                  <Heart className="w-5 h-5 mr-3" />
                  Refresh Data
                </Button>
              </div>
            </Card>
          </div>

          {/* Recent Users */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white/90 dark:bg-card/90 backdrop-blur-sm border-primary/20">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">Recent Users</h3>
              {recentUsers.length > 0 ? (
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div 
                      key={user.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200">{user.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {user.age} years old • {user.gender} • {user.role}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">ID: {user.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No users found</p>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Platform Health */}
        <div className="mt-8">
          <Card className="p-6 bg-gradient-secondary border-primary/20">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Platform Health</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">98.5%</div>
                <p className="text-gray-600 dark:text-gray-400">System Uptime</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">24ms</div>
                <p className="text-gray-600 dark:text-gray-400">Avg Response Time</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">99.2%</div>
                <p className="text-gray-600 dark:text-gray-400">User Satisfaction</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};