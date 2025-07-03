import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { UserCard } from '@/components/UserCard';
import { userService } from '@/services/userService';
import { Search, Users, X, Grid, List, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Swal from 'sweetalert2';

export const AdminUserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [viewMode, setViewMode] = useState('table');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedRole]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const allUsers = await userService.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      toast({
        title: "Error loading users",
        description: "Unable to load user data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toString().includes(searchTerm)
      );
    }

    // Role filter
    if (selectedRole !== 'ALL') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action will permanently delete the user.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });
  
    if (result.isConfirmed) {
      try {
        console.log("delete is start")
        const res = await userService.deleteUser(userId);
       console.log("res "+res);
        // Show success message
        await Swal.fire({
          title: 'Deleted!',
          text: 'The user has been successfully removed.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
  
        // Remove from local state
        setUsers(prev =>
          Array.isArray(prev) ? prev.filter(user => user?.id !== userId) : []
        );
  
      } catch (error) {
        // Show error message
        Swal.fire({
          title: 'Error',
          text: 'Unable to delete the user. Please try again.',
          icon: 'error',
        });
      }
    }
  };
  

  const handleEditUser = (userId) => {
    navigate(`/admin/users/${userId}/edit`);
  };

  const handleViewUser = (userId) => {
    navigate(`/admin/users/${userId}/edit`);
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
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Manage all users on the platform ({filteredUsers.length} users)
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8 bg-white/90 backdrop-blur-sm border-primary/20 shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-primary/20 focus:border-primary"
              />
            </div>

            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-primary/20 rounded-lg focus:border-primary focus:outline-none bg-white dark:bg-card dark:text-foreground"
            >
              <option value="ALL">All Roles</option>
              <option value="USER">Users</option>
              <option value="ADMIN">Admins</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                onClick={() => setViewMode('table')}
                size="sm"
                className="border-primary/20 hover:bg-primary/10"
              >
                <List className="w-4 h-4 mr-2" />
                Table
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
                size="sm"
                className="border-primary/20 hover:bg-primary/10"
              >
                <Grid className="w-4 h-4 mr-2" />
                Grid
              </Button>
            </div>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedRole('ALL');
              }}
              className="border-primary/20 hover:bg-primary/10"
            >
              Clear Filters
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-white/90 dark:bg-card/90 backdrop-blur-sm border-primary/20 text-center">
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{users.length}</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">Total Users</div>
          </Card>
          <Card className="p-4 bg-white/90 dark:bg-card/90 backdrop-blur-sm border-primary/20 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.role === 'USER').length}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">Regular Users</div>
          </Card>
          <Card className="p-4 bg-white/90 dark:bg-card/90 backdrop-blur-sm border-primary/20 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.role === 'ADMIN').length}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">Admins</div>
          </Card>
          <Card className="p-4 bg-white/90 dark:bg-card/90 backdrop-blur-sm border-primary/20 text-center">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.gender === 'MALE').length}/{users.filter(u => u.gender === 'FEMALE').length}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">Male/Female</div>
          </Card>
        </div>

        {/* Users Display */}
        {filteredUsers.length > 0 ? (
          <div className="space-y-6">
            {viewMode === 'table' ? (
              <Card className="p-6 bg-white/90 dark:bg-card/90 backdrop-blur-sm border-primary/20 shadow-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Profile</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Interests</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user,index) => (
                      <TableRow 
                        key={user.id} 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleViewUser(user.id)}
                      >
                        <TableCell>
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                            <img
                              src={user.pic}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>{user.age}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.gender === 'MALE' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-pink-100 text-pink-800'
                          }`}>
                            {user.gender}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'ADMIN' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>
                        <div className="flex flex-wrap gap-1">
  {(user.interests || []).slice(0, 2).map((interest, index) => (
    <span 
      key={index}
      className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
    >
      {interest}
    </span>
  ))}
  {user.interests && user.interests.length > 2 && (
    <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
      +{user.interests.length - 2}
    </span>
  )}
</div>

                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditUser(user.id)}
                              className="border-primary/20 hover:bg-primary/10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredUsers.map((user, index) => (
                  <div key={user.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                    <UserCard
                      user={user}
                      onDelete={handleDeleteUser}
                      onEdit={handleEditUser}
                      showActions={true}
                      isAdmin={true}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
              No users found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Try adjusting your search filters or check if users exist in the database.
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedRole('ALL');
              }}
              className="bg-gradient-primary hover:opacity-90"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};