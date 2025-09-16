import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  Clock, 
  Star, 
  MapPin, 
  Calendar,
  Trophy,
  Globe,
  Eye,
  Download,
  Share2,
  Filter,
  Search,
  Grid,
  List
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Tour {
  id: string;
  destination_id: string;
  destination_name: string;
  destination_description: string;
  destination_country: string;
  destination_image_url: string;
  destination_price: number;
  destination_duration_minutes: number;
  destination_rating: number;
  purchase_date: string;
  status: string;
  amount: number;
  currency: string;
}

const MyTours = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in-progress' | 'not-started'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchUserTours();
  }, [user, navigate]);

  const fetchUserTours = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch user's purchased tours
      const { data: purchases, error: purchasesError } = await supabase
        .from('purchases')
        .select(`
          id,
          destination_id,
          amount,
          currency,
          status,
          created_at,
          destinations (
            id,
            name,
            description,
            country,
            image_url,
            price,
            duration_minutes,
            rating
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (purchasesError) throw purchasesError;

      // Transform the data to match our Tour interface
      const transformedTours: Tour[] = purchases?.map(purchase => ({
        id: purchase.id,
        destination_id: purchase.destination_id,
        destination_name: purchase.destinations?.name || 'Unknown Destination',
        destination_description: purchase.destinations?.description || '',
        destination_country: purchase.destinations?.country || '',
        destination_image_url: purchase.destinations?.image_url || '',
        destination_price: purchase.destinations?.price || 0,
        destination_duration_minutes: purchase.destinations?.duration_minutes || 0,
        destination_rating: purchase.destinations?.rating || 0,
        purchase_date: purchase.created_at,
        status: 'completed', // Since we're only fetching completed purchases
        amount: purchase.amount,
        currency: purchase.currency
      })) || [];

      setTours(transformedTours);
    } catch (error: any) {
      console.error('Error fetching tours:', error);
      toast({
        title: "Error",
        description: "Failed to load your tours. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartTour = (tour: Tour) => {
    // Navigate to VR tour page with the specific destination data
    navigate('/vr-tour', {
      state: {
        destination: {
          id: tour.destination_id,
          name: tour.destination_name,
          description: tour.destination_description,
          image_url: tour.destination_image_url,
          duration_minutes: tour.destination_duration_minutes,
          price: tour.destination_price,
          rating: tour.destination_rating,
          category: 'VR Experience',
          region: tour.destination_country
        }
      }
    });
  };

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.destination_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tour.destination_country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || tour.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
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
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                My VR Tours
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Explore your purchased VR destinations and start immersive journeys around the world
              </p>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <Card className="glass border-primary/20">
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{tours.length}</div>
                <div className="text-sm text-muted-foreground">Total Tours</div>
              </CardContent>
            </Card>
            <Card className="glass border-primary/20">
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {tours.reduce((total, tour) => total + tour.destination_duration_minutes, 0) > 0 
                    ? formatDuration(tours.reduce((total, tour) => total + tour.destination_duration_minutes, 0))
                    : '0m'
                  }
                </div>
                <div className="text-sm text-muted-foreground">Total Duration</div>
              </CardContent>
            </Card>
            <Card className="glass border-primary/20">
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {tours.length > 0 
                    ? (tours.reduce((sum, tour) => sum + tour.destination_rating, 0) / tours.length).toFixed(1)
                    : '0.0'
                  }
                </div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </CardContent>
            </Card>
            <Card className="glass border-primary/20">
              <CardContent className="p-6 text-center">
                <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {new Set(tours.map(tour => tour.destination_country)).size}
                </div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 items-center justify-between"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search tours..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg bg-background/50 border-border focus:ring-2 focus:ring-primary/20 focus:border-primary w-64"
                />
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border rounded-lg bg-background/50 border-border focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="all">All Tours</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="not-started">Not Started</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Tours Grid/List */}
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center py-12"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your tours...</p>
            </motion.div>
          ) : filteredTours.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center py-12"
            >
              <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No tours found</h3>
              <p className="text-muted-foreground mb-6">
                {tours.length === 0 
                  ? "You haven't purchased any VR tours yet. Start exploring amazing destinations!"
                  : "No tours match your current filters. Try adjusting your search or filters."
                }
              </p>
              {tours.length === 0 && (
                <Button onClick={() => navigate('/destinations')}>
                  <Globe className="h-4 w-4 mr-2" />
                  Browse Destinations
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
              }
            >
              {filteredTours.map((tour, index) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="glass border-primary/20 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={tour.destination_image_url}
                        alt={tour.destination_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          {tour.destination_country}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          <Star className="h-3 w-3 mr-1" />
                          {tour.destination_rating}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{tour.destination_name}</h3>
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {tour.destination_description}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{formatDuration(tour.destination_duration_minutes)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(tour.purchase_date)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => handleStartTour(tour)}
                            className="flex-1"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Start VR Tour
                          </Button>
                          <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MyTours;
