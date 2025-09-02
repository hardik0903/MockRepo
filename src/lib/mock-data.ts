export const campaignPerformanceData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
  { month: "Jul", desktop: 250, mobile: 180 },
  { month: "Aug", desktop: 180, mobile: 120 },
  { month: "Sep", desktop: 280, mobile: 200 },
  { month: "Oct", desktop: 320, mobile: 240 },
  { month: "Nov", desktop: 290, mobile: 210 },
  { month: "Dec", desktop: 350, mobile: 280 },
];

export const userEngagementData = [
  { name: 'Campaign A', likes: 4000, retweets: 2400, replies: 1200 },
  { name: 'Campaign B', likes: 3000, retweets: 1398, replies: 980 },
  { name: 'Campaign C', likes: 2000, retweets: 9800, replies: 400 },
  { name: 'Campaign D', likes: 2780, retweets: 3908, replies: 1500 },
  { name: 'Campaign E', likes: 1890, retweets: 4800, replies: 1800 },
  { name: 'Campaign F', likes: 2390, retweets: 3800, replies: 700 },
];

export const networkGraphData = {
  nodes: [
    { id: 0, type: 'campaign' }, { id: 1, type: 'campaign' },
    { id: 2, type: 'user' }, { id: 3, type: 'user' }, { id: 4, type: 'user' }, { id: 5, type: 'user' },
    { id: 6, type: 'keyword' }, { id: 7, type: 'keyword' }, { id: 8, type: 'keyword' }
  ],
  links: [
    { source: 0, target: 2 }, { source: 0, target: 3 },
    { source: 1, target: 4 }, { source: 1, target: 5 },
    { source: 2, target: 6 }, { source: 3, target: 6 },
    { source: 4, target: 7 }, { source: 5, target: 8 },
    { source: 0, target: 6 }, { source: 1, target: 8 }
  ]
};

export const tweetHeatmapData = [
  { lat: 34.0522, lng: -118.2437, weight: 0.5 },
  { lat: 40.7128, lng: -74.0060, weight: 0.8 },
  { lat: 41.8781, lng: -87.6298, weight: 0.6 },
  { lat: 29.7604, lng: -95.3698, weight: 0.4 },
  { lat: 39.9526, lng: -75.1652, weight: 0.7 },
  { lat: 33.4484, lng: -112.0740, weight: 0.3 },
  { lat: 25.7617, lng: -80.1918, weight: 0.9 },
  { lat: 51.5074, lng: -0.1278, weight: 1.0 },
  { lat: 48.8566, lng: 2.3522, weight: 0.8 },
  { lat: 35.6895, lng: 139.6917, weight: 0.9 },
  { lat: -33.8688, lng: 151.2093, weight: 0.7 },
];

export const tweetStream = [
    { id: 't1', author: 'AI Enthusiast', text: 'The new generative models are mind-blowing! #AI #DeepLearning', avatar: 'https://picsum.photos/40/40?random=1', dataAiHint: "person" },
    { id: 't2', author: 'Marketing Pro', text: 'Just launched a new campaign targeting Gen Z. Let\'s see how it performs! #Marketing #Digital', avatar: 'https://picsum.photos/40/40?random=2', dataAiHint: "person" },
    { id: 't3', author: 'Tech Reporter', text: 'Breaking: Major tech merger announced. This will reshape the industry. #TechNews #Business', avatar: 'https://picsum.photos/40/40?random=3', dataAiHint: "person" },
    { id: 't4', author: 'Crypto Fan', text: 'Bitcoin is on the move again! To the moon! #Crypto #BTC', avatar: 'https://picsum.photos/40/40?random=4', dataAiHint: "person" },
  ];
