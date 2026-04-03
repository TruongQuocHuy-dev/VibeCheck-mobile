export const VIBE_HISTORY_MOCK = [
  {
    id: 'h1',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
    caption: 'Kỷ niệm Đà Lạt năm ngoái 🌸',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 1 month ago
    views: 120,
    reactions: 45,
  },
  {
    id: 'h2',
    imageUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
    caption: 'Hoàng hôn rực rỡ tại Vũng Tàu 🌅',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    views: 89,
    reactions: 20,
  },
  {
    id: 'h3',
    imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
    caption: 'Góc làm việc cực chill 💻',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    views: 56,
    reactions: 12,
  },
];
