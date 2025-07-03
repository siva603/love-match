// UserCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X, Edit, Trash2 } from 'lucide-react';
import { userService } from '@/services/userService';

export const UserCard = ({
  user,
  onLike,
  onPass,
  onDelete,
  onEdit,
  showActions = true,
  isAdmin = false,
  className = ''
}) => {
  const navigate = useNavigate();
  const profileImage = user.pic || "";
  
  return (
    <Card className={`w-full max-w-xs rounded-2xl overflow-hidden shadow-lg border border-primary/20 bg-gradient-to-br from-white/90 to-white/70 dark:from-card/90 dark:to-card/70 backdrop-blur-md hover:shadow-xl transition-transform duration-500 hover:scale-105 ${className}`}>
  <div className="relative">
    {/* Profile Image */}
    <div className="aspect-[3/4] overflow-hidden">
  <img
    src={profileImage}
    alt={user.name}
    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
    onError={(e) => {
      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ff69b4&color=fff&size=400`;
    }}
  />
</div>


    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

    {/* User Info Overlay */}
    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-xl font-semibold">{user.name}</h3>
        <span className="text-lg">{user.age}</span>
      </div>

      {/* Interests */}
      <div className="flex flex-wrap gap-1 mb-2">
        {(user.interests || []).slice(0, 2).map((interest, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs"
          >
            {interest}
          </Badge>
        ))}
        {user.interests && user.interests.length > 2 && (
          <Badge
            variant="secondary"
            className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs"
          >
            +{user.interests.length - 2}
          </Badge>
        )}
      </div>

      {/* Role Badge */}
      <Badge
        variant={user.role === 'ADMIN' ? 'destructive' : 'default'}
        className="text-xs"
      >
        {user.role}
      </Badge>
    </div>
  </div>

  {/* Action Buttons (User) */}
  {showActions && !isAdmin && (
    <div className="p-3 bg-white/90 dark:bg-card/90 backdrop-blur-md">
      <div className="flex justify-center gap-6">
        {onPass && (
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-red-500 hover:bg-red-100 group"
            onClick={() => onPass(user.id)}
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
          </Button>
        )}
        {onLike && (
          <Button
            size="icon"
            className="w-10 h-10 rounded-full bg-gradient-romantic text-white hover:opacity-90"
            onClick={() => onLike(user.id)}
          >
            <Heart className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  )}

  {/* Admin Actions */}
  {isAdmin && showActions && (
    <div className="p-3 bg-white/90 dark:bg-card/90 backdrop-blur-md">
      <div className="flex gap-2">
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-primary/20 hover:bg-primary/10"
            onClick={() => onEdit(user.id)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={() => onDelete(user.id)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        )}
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 space-y-1">
        <p className="truncate"><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
      </div>
    </div>
  )}
</Card>

  );
};
