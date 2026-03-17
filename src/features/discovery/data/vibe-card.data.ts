import { VibeCard } from '../domain/types/vibe-card.types';

export const mockVibeCards: VibeCard[] = [
  {
    id: '1',
    type: 'song',
    title: 'Đang nghe gì?',
    subtitle: 'Mơ hồ - Vũ Cát Tường ft. Hà Anh Tuấn',
    location: 'Khu B KTX',
    distance: 'Cách 800m',
    backgroundColor: '#3E2723', // Dark brown/orange gradient overlay feel
  },
  {
    id: '2',
    type: 'status',
    title: 'Cảm xúc hiện tại?',
    subtitle: 'CHILL & CODING ☕',
    location: 'The Coffee House',
    distance: 'Cách 1.2km',
    backgroundColor: '#1B263B', // Dark blue overlay feel
  },
  {
    id: '3',
    type: 'location',
    title: 'Muốn đi đâu nhất?',
    subtitle: 'Đà Lạt săn mây ngay lúc này ☁',
    location: 'Thư viện',
    distance: 'Cách 300m',
    backgroundColor: '#2D3748', // Dark gray overlay feel
  },
  {
    id: '4',
    type: 'song',
    title: 'Đang nghe gì?',
    subtitle: 'Left & Right - SEVENTEEN 🎶',
    location: 'Công viên 23/9',
    distance: 'Cách 1.5km',
    backgroundColor: '#1A535C', // Dark teal
  },
  {
    id: '5',
    type: 'status',
    title: 'Muốn nói gì?',
    subtitle: 'Deadline dí chạy k kịp 💀',
    location: 'Workspace',
    distance: 'Cách 500m',
    backgroundColor: '#4A4E69', // Dark slate/purple
  },
  {
    id: '6',
    type: 'location',
    title: 'Gặp ở đâu?',
    subtitle: 'Starbucks New World ☕',
    location: 'Quận 1',
    distance: 'Cách 2.4km',
    backgroundColor: '#1E6042', // Dark green
  },
  {
    id: '7',
    type: 'status',
    title: 'Mood',
    subtitle: 'Cần một người lắng nghe 🎧',
    location: 'Landmark 81',
    distance: 'Cách 4.1km',
    backgroundColor: '#9A031E', // Dark red
  },
];
