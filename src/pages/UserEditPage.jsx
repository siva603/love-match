import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { userService } from '@/services/userService';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Save, User as UserIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const UserEditPage = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { id: paramId } = useParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [interestsInput, setInterestsInput] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const id = paramId ?? currentUser?.id?.toString();
  const isAdmin = currentUser?.role === 'ADMIN';
  const isOwnProfile = currentUser?.id?.toString() === id;

  const loadUser = async () => {
    if (!id) {
      console.error("ID is missing or invalid:", id);
      return;
    }
  
    try {
      setIsLoading(true);
      const parsedId = parseInt(id);
      console.log("Loading user by ID:", parsedId);
  
      const userData = await userService.getUserById(parsedId);
      console.log("User fetched:", userData);
  
      setUser(userData);
  
      const safeInterests = Array.isArray(userData.interests) ? userData.interests : [];
      setValue('name', userData.name);
      setValue('email', userData.email);
      setValue('phone', userData.phone);
      setValue('age', userData.age);
      setValue('gender', userData.gender);
      setValue('interests', safeInterests);
      setValue('pic', userData.pic || '');
      setInterestsInput(safeInterests.join(', '));
    } catch (error) {
      console.error("Error loading user:", error);
      toast({
        title: "Error loading user",
        description: error.message || "Unable to load user data.",
        variant: "destructive",
      });
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    if (currentUser && id) {
      loadUser();
    }
  }, [id, currentUser]);

  const onSubmit = async (data) => {
    try {
      setIsSaving(true);

      const interests = interestsInput
        .split(',')
        .map((interest) => interest.trim())
        .filter((interest) => interest.length > 0);

      const updateData = {
        ...data,
        interests,
        id: parseInt(id),
      };

      // TODO: You can add updateUser API here

      toast({
        title: "User updated successfully",
        description: "The user information has been saved.",
      });

      if (isAdmin) {
        navigate('/admin/users');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: "Error updating user",
        description: error.message || "Unable to save user information.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-2">User not found</h2>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </Card>
      </div>
    );
  }

  if (!isAdmin && !isOwnProfile) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to edit this user.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate(-1)} className="border-primary/20 hover:bg-primary/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
              {isOwnProfile ? 'Edit Profile' : `Edit User: ${user.name}`}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Update user information and preferences</p>
          </div>
        </div>

        {/* Avatar Card */}
<Card className="p-6 mb-8 bg-white/90 backdrop-blur-sm border-primary/20 shadow-card">
  <div className="flex items-center gap-6">
    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20">
      <img
        src={
          user.pic && user.pic.trim() !== ''
            ? user.pic
            : userService.getProfilePicture(user.gender, user.id)
        }
        alt={user.name}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ff69b4&color=fff&size=400`;
        }}
      />
    </div>
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{user.name}</h2>
      <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
      <div className="flex gap-2 mt-2">
        <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
          {user.role}
        </span>
        <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
          {user.gender}
        </span>
      </div>
    </div>
  </div>
</Card>


        {/* Form Card */}
        <Card className="p-8 bg-white/90 backdrop-blur-sm border-primary/20 shadow-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register('name', { required: 'Name is required' })} className="border-primary/20 focus:border-primary" />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email', { required: 'Email is required' })} className="border-primary/20 focus:border-primary" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" {...register('phone', { required: 'Phone is required', valueAsNumber: true })} className="border-primary/20 focus:border-primary" />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" {...register('age', { required: 'Age is required', valueAsNumber: true, min: { value: 18, message: 'Must be at least 18' } })} className="border-primary/20 focus:border-primary" />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => setValue('gender', value)} defaultValue={user.gender}>
                  <SelectTrigger className="border-primary/20 focus:border-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

  {/* Profile Picture URL */}
  <div>
    <Label htmlFor="pic">Profile Picture URL</Label>
    <Input
      id="pic"
      type="url"
      {...register('pic')}
      placeholder="https://example.com/your-photo.jpg"
      className="border-primary/20 focus:border-primary"
    />
  </div>
              {isAdmin && (
                <div>
                  <Label htmlFor="password">New Password (Optional)</Label>
                  <Input id="password" type="password" {...register('password')} className="border-primary/20 focus:border-primary" placeholder="Leave blank to keep current password" />
                </div>
              )}
            </div>

            

            <div>
              <Label htmlFor="interests">Interests (comma-separated)</Label>
              <Input id="interests" value={interestsInput} onChange={(e) => setInterestsInput(e.target.value)} className="border-primary/20 focus:border-primary" placeholder="e.g., hiking, photography, coding" />
              <p className="text-sm text-gray-500 mt-1">Separate interests with commas</p>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} className="border-primary/20 hover:bg-primary/10">Cancel</Button>
              <Button type="submit" disabled={isSaving} className="bg-gradient-primary hover:opacity-90">
                {isSaving ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
