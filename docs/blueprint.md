# **App Name**: SentinelX Dashboard

## Core Features:

- Data Fetching and Display: Fetch real-time data from backend APIs and display it in interactive charts and graphs. Components must refresh automatically upon receiving new data.
- Interactive 3D Network Graph: Render an interactive 3D force-directed graph to visualize relationships between campaigns, users, and keywords. It will automatically pull data from the `/metrics/network_graph` endpoint and map each relationship to the 3D space.
- Heatmap Display: Integrate with Google Maps API and plot user tweets on an interactive heatmap.
- Trending Keyword Tool: AI analyses tweets in the stream, using a LLM reasoning 'tool' to select keywords and adding them to the trending keyword list.
- Input Tweet Analyzer: Enable the user to input new tweet json data which will then be automatically analyzed by our backend.

## Style Guidelines:

- Background color: Dark gray (#111827) for a modern dark mode theme.
- Primary color: Vibrant orange (#F97316) for interactive elements, graphs, and highlights.
- Accent color: Pale orange (#FBC08A), for hovering / secondary elements. A lighter color is required here to establish hierarchy in the page's clickable elements.
- Font: 'Inter', a clean sans-serif font, for a modern look. Note: currently only Google Fonts are supported.
- Use minimalist icons to represent different data categories.
- Implement a grid-based layout for the dashboard, providing a clear structure.
- Incorporate subtle transitions and animations for a polished user experience.