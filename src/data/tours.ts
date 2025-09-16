// Import local images for consistent display
import angkorWatImage from '@/assets/tour-angkor-wat.jpg';
import tokyoImage from '@/assets/tour-tokyo.jpg';
import swissAlpsImage from '@/assets/tour-swiss-alps.jpg';

export interface Tour {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  price: number;
  rating: number;
  category: string;
  region: string;
  highlights: string[];
  hotspots: Hotspot[];
  featured: boolean;
}

export interface Hotspot {
  id: string;
  title: string;
  description: string;
  position: [number, number, number];
  type: 'info' | 'audio' | 'video';
  content?: string;
  audioUrl?: string;
  videoUrl?: string;
}

export const tours: Tour[] = [
  {
    id: '1',
    title: 'Ancient Wonders of Angkor Wat',
    description: 'Explore the magnificent temple complex of Angkor Wat in Cambodia, where ancient Khmer architecture meets spiritual tranquility in stunning sunrise views.',
    image: angkorWatImage,
    duration: '45 mins',
    price: 29.99,
    rating: 4.9,
    category: 'Cultural',
    region: 'Asia',
    highlights: [
      'Sunrise over the main temple',
      'Intricate stone carvings exploration',
      'Hidden chambers and passages',
      'Buddhist monk morning rituals'
    ],
    hotspots: [
      {
        id: 'h1',
        title: 'Main Temple Entrance',
        description: 'The iconic entrance to Angkor Wat, featuring the famous causeway and reflection pools.',
        position: [0, 2, -5],
        type: 'info',
        content: 'Built in the early 12th century, this is the largest religious monument in the world.'
      },
      {
        id: 'h2',
        title: 'Central Tower',
        description: 'The highest point of the temple complex with panoramic views.',
        position: [0, 8, 0],
        type: 'audio',
        audioUrl: '/audio/temple-chants.mp3'
      },
      {
        id: 'h3',
        title: 'Bas-Relief Gallery',
        description: 'Intricate stone carvings depicting Hindu epics and Khmer history.',
        position: [-3, 1, 2],
        type: 'video',
        videoUrl: '/video/carving-details.mp4'
      }
    ],
    featured: true
  },
  {
    id: '2',
    title: 'Neon Dreams: Tokyo After Dark',
    description: 'Immerse yourself in the electric energy of Tokyo\'s nightlife, from bustling Shibuya crossing to intimate izakayas in hidden alleyways.',
    image: tokyoImage,
    duration: '60 mins',
    price: 34.99,
    rating: 4.8,
    category: 'Urban',
    region: 'Asia',
    highlights: [
      'Shibuya crossing at rush hour',
      'Traditional izakaya experience',
      'Neon-lit gaming arcades',
      'Rooftop city views'
    ],
    hotspots: [
      {
        id: 'h4',
        title: 'Shibuya Crossing',
        description: 'The world\'s busiest pedestrian crossing in the heart of Tokyo.',
        position: [0, 1, -3],
        type: 'info',
        content: 'Over 2.4 million people cross this intersection daily during peak times.'
      },
      {
        id: 'h5',
        title: 'Izakaya Alley',
        description: 'Experience authentic Japanese nightlife in a traditional drinking alley.',
        position: [2, 0, 1],
        type: 'audio',
        audioUrl: '/audio/izakaya-ambience.mp3'
      },
      {
        id: 'h6',
        title: 'Gaming Arcade',
        description: 'Multi-story arcade with classic and modern Japanese games.',
        position: [-2, 2, 0],
        type: 'video',
        videoUrl: '/video/arcade-lights.mp4'
      }
    ],
    featured: true
  },
  {
    id: '3',
    title: 'Swiss Alps: Winter Wonderland',
    description: 'Journey through snow-capped peaks and pristine alpine villages in the Swiss Alps, where every view is a postcard-perfect mountain panorama.',
    image: swissAlpsImage,
    duration: '50 mins',
    price: 32.99,
    rating: 4.9,
    category: 'Nature',
    region: 'Europe',
    highlights: [
      'Matterhorn peak views',
      'Alpine village exploration',
      'Traditional chalet interiors',
      'Mountain railway journey'
    ],
    hotspots: [
      {
        id: 'h7',
        title: 'Matterhorn Viewpoint',
        description: 'Iconic pyramid-shaped peak of the Matterhorn mountain.',
        position: [0, 5, -8],
        type: 'info',
        content: 'At 4,478 meters, the Matterhorn is one of the highest peaks in the Alps.'
      },
      {
        id: 'h8',
        title: 'Alpine Village',
        description: 'Traditional Swiss village nestled in the mountains.',
        position: [3, 1, -2],
        type: 'audio',
        audioUrl: '/audio/alpine-winds.mp3'
      },
      {
        id: 'h9',
        title: 'Mountain Railway',
        description: 'Historic cogwheel railway climbing through the mountains.',
        position: [-4, 2, 1],
        type: 'video',
        videoUrl: '/video/train-journey.mp4'
      }
    ],
    featured: false
  }
];

export const categories = [
  'All',
  'Cultural',
  'Urban', 
  'Nature',
  'Adventure',
  'Historical'
];

export const regions = [
  'All',
  'Asia',
  'Europe',
  'Americas',
  'Africa',
  'Oceania'
];