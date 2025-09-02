import type {
  AnalyzeResult,
  Campaigns,
  Leaderboard,
  MostHated,
  MostViral,
  NetworkGraphData,
  TrendingKeywords,
  TweetInput,
  LocationData
} from './types';

const BASE_URL = '/api';

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
      throw new Error(`API call failed with status ${response.status}`);
    }
    
    // Handle cases with no content
    if (response.status === 204) {
        return null as T;
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    throw error;
  }
}

export const analyzeTweet = (tweet: TweetInput): Promise<AnalyzeResult> => {
  return fetcher<AnalyzeResult>('/analyze', {
    method: 'POST',
    body: JSON.stringify(tweet),
  });
};

export const fetchCampaigns = (): Promise<Campaigns> => fetcher<Campaigns>('/campaigns');
export const fetchTrendingKeywords = (): Promise<TrendingKeywords> => fetcher<TrendingKeywords>('/metrics/trending');
export const fetchLocationData = (): Promise<LocationData> => fetcher<LocationData>('/metrics/location');
export const fetchLeaderboard = (): Promise<Leaderboard> => fetcher<Leaderboard>('/metrics/leaderboard');
export const fetchMostViral = (): Promise<MostViral> => fetcher<MostViral>('/metrics/most_viral');
export const fetchMostHated = (): Promise<MostHated> => fetcher<MostHated>('/metrics/most_hated');
export const fetchNetworkGraph = (): Promise<NetworkGraphData> => fetcher<NetworkGraphData>('/metrics/network_graph');
export const fetchNewKeywords = (): Promise<string[]> => fetcher<string[]>('/metrics/new_keywords');