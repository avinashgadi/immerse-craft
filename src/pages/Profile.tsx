import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Camera, 
  Edit3, 
  Save, 
  X, 
  Globe,
  Heart,
  Star,
  Clock,
  Trophy,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    display_name: '',
    avatar_url: '',
    bio: '',
    location: '',
    website: '',
    member_since: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Set initial profile data
    setProfileData(prev => ({
      ...prev,
      display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
      avatar_url: user.user_metadata?.avatar_url || '',
      bio: user.user_metadata?.bio || '',
      location: user.user_metadata?.location || '',
      website: user.user_metadata?.website || '',
      member_since: new Date(user.created_at).toLocaleDateString()
    }));
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: profileData.display_name,
          bio: profileData.bio,
          location: profileData.location,
          website: profileData.website
        }
      });

      if (error) throw error;

      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated."
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 pt-20 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Profile Header */}
          <Card className="glass border-primary/20 overflow-hidden">
            <div className="relative h-48 bg-gradient-to-r from-primary/30 to-accent/30">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                  >
                    <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                      <AvatarImage src={profileData.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-white text-2xl">
                        {profileData.display_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="icon"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                        onClick={() => {/* Handle avatar upload */}}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </motion.div>
                  
                  <div className="flex-1 text-white">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <div>
                        <h1 className="text-3xl font-bold gradient-text">
                          {isEditing ? (
                            <Input
                              name="display_name"
                              value={profileData.display_name}
                              onChange={handleInputChange}
                              className="text-3xl font-bold bg-transparent border-none p-0 h-auto text-white placeholder:text-white/70"
                              placeholder="Your name"
                            />
                          ) : (
                            profileData.display_name
                          )}
                        </h1>
                        <p className="text-white/80 flex items-center space-x-2 mt-1">
                          <Mail className="h-4 w-4" />
                          <span>{user.email}</span>
                        </p>
                        <p className="text-white/70 flex items-center space-x-2 mt-1">
                          <Calendar className="h-4 w-4" />
                          <span>Member since {profileData.member_since}</span>
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        {isEditing ? (
                          <>
                            <Button
                              onClick={handleSaveProfile}
                              disabled={loading}
                              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              {loading ? 'Saving...' : 'Save'}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setIsEditing(false)}
                              className="border-white/30 text-white hover:bg-white/10"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              onClick={() => setIsEditing(true)}
                              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit Profile
                            </Button>
                            <Button
                              variant="outline"
                              onClick={handleSignOut}
                              className="border-white/30 text-white hover:bg-white/10"
                            >
                              Sign Out
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Profile Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <Card className="glass border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-primary" />
                    <span>About</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Bio</label>
                        <textarea
                          name="bio"
                          value={profileData.bio}
                          onChange={handleInputChange}
                          placeholder="Tell us about yourself..."
                          className="w-full mt-1 p-3 border rounded-lg bg-background/50 border-border focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          rows={4}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Location</label>
                          <Input
                            name="location"
                            value={profileData.location}
                            onChange={handleInputChange}
                            placeholder="Your location"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Website</label>
                          <Input
                            name="website"
                            value={profileData.website}
                            onChange={handleInputChange}
                            placeholder="https://yourwebsite.com"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        {profileData.bio || "No bio available. Click 'Edit Profile' to add one."}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        {profileData.location && (
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{profileData.location}</span>
                          </div>
                        )}
                        {profileData.website && (
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <Globe className="h-4 w-4" />
                            <a 
                              href={profileData.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {profileData.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* VR Tour History */}
              <Card className="glass border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <span>VR Tour History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No VR tours completed yet</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => navigate('/destinations')}
                    >
                      Explore Destinations
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <Card className="glass border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span>Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Tours Completed</span>
                    </div>
                    <Badge variant="secondary">0</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Total Time</span>
                    </div>
                    <Badge variant="secondary">0h 0m</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Average Rating</span>
                    </div>
                    <Badge variant="secondary">-</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="glass border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-primary" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/destinations')}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Browse Destinations
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/demo')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Try Demo
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/')}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Go Home
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
