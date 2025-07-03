import React, { useState, useEffect } from 'react';
import { UserCard } from '@/components/UserCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { userService, User } from '@/services/userService';
import { Search, Filter, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const MatchesPage: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<User[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'MALE' | 'FEMALE'>('ALL');
  const [ageFilter, setAgeFilter] = useState<'ALL' | '18-25' | '26-35' | '36+'>('ALL');

  useEffect(() => {
    loadMatches();
  }, [user]);

  useEffect(() => {
    filterMatches();
  }, [matches, searchTerm, genderFilter, ageFilter]);

  const loadMatches = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      // Load matches based on user's preference (opposite gender by default)
      let allMatches: User[] = [];
      
      if (user.gender === 'MALE') {
        allMatches = await userService.getFemaleUsers();
      } else {
        allMatches = await userService.getMaleUsers();
      }

      // Filter out the current user
      const filteredUsers = allMatches.filter(match => match.id !== user.id);
      setMatches(filteredUsers);
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

  const filterMatches = () => {
    let filtered = [...matches];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(match =>
        match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.interests.some(interest => 
          interest.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Gender filter
    if (genderFilter !== 'ALL') {
      filtered = filtered.filter(match => match.gender === genderFilter);
    }

    // Age filter
    if (ageFilter !== 'ALL') {
      filtered = filtered.filter(match => {
        switch (ageFilter) {
          case '18-25':
            return match.age >= 18 && match.age <= 25;
          case '26-35':
            return match.age >= 26 && match.age <= 35;
          case '36+':
            return match.age >= 36;
          default:
            return true;
        }
      });
    }

    setFilteredMatches(filtered);
  };

  const handleLike = (userId: number) => {
    toast({
      title: "Liked! 💕",
      description: "Your interest has been sent!",
    });
  };

  const handlePass = (userId: number) => {
    // Remove from current view
    setFilteredMatches(prev => prev.filter(match => match.id !== userId));
    toast({
      title: "Passed",
      description: "User removed from your matches.",
    });
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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Discover Your Matches
          </h1>
          <p className="text-gray-600 text-lg">
            {filteredMatches.length} potential matches found
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 mb-8 border border-primary/20 shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or interests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-primary/20 focus:border-primary"
              />
            </div>

            {/* Gender Filter */}
            <Select value={genderFilter} onValueChange={(value: any) => setGenderFilter(value)}>
              <SelectTrigger className="border-primary/20 focus:border-primary">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Genders</SelectItem>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
              </SelectContent>
            </Select>

            {/* Age Filter */}
            <Select value={ageFilter} onValueChange={(value: any) => setAgeFilter(value)}>
              <SelectTrigger className="border-primary/20 focus:border-primary">
                <SelectValue placeholder="Age Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Ages</SelectItem>
                <SelectItem value="18-25">18-25</SelectItem>
                <SelectItem value="26-35">26-35</SelectItem>
                <SelectItem value="36+">36+</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setGenderFilter('ALL');
                setAgeFilter('ALL');
              }}
              className="border-primary/20 hover:bg-primary/10"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Matches Grid */}
        {filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMatches.map((match, index) => (
              <div key={match.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <UserCard
                  user={match}
                  onLike={handleLike}
                  onPass={handlePass}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              No matches found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search filters or check back later for new profiles!
            </p>
            <Button
              variant="romantic"
              onClick={() => {
                setSearchTerm('');
                setGenderFilter('ALL');
                setAgeFilter('ALL');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};