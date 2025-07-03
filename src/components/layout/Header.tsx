import React from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/context/AuthContext';
import { Heart, User, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-card/80 backdrop-blur-md border-b border-primary/20 shadow-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
          <div className="w-10 h-10 bg-gradient-romantic rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-romantic bg-clip-text text-transparent">
            LoveMatch
          </span>
        </Link>

        {/* Navigation */}
        {user && (
          <nav className="hidden md:flex items-center gap-6">
            {user.role === 'USER' ? (
              <>
                <Link to="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link to="/matches" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Matches
                </Link>
                <Link to="/profile/edit" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/admin" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link to="/admin/users" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Users
                </Link>
                <Link to="/admin/reports" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Reports
                </Link>
              </>
            )}
          </nav>
        )}

        {/* User Menu */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-2 text-sm">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">{user.name}</span>
              </div>
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-gradient-romantic hover:opacity-90">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};