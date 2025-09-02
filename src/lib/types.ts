export interface TweetInput {
    tid: string;
    tusername: string;
    tlocation: string;
    tretweets: string;
    tlikes: string;
    tcomments: string;
    tdescription: string;
}

export interface AnalyzeResult {
    campaign: {
        global: string;
        label: 'anti-india' | 'not-anti';
        local: string;
    };
    flaggedtype: {
        'Engage score': string;
        'Hated score': string;
        'Negative score': string;
        category: string;
        keywordsDiscovered: string[];
    };
    impact: {
        description: string;
    };
    location: string;
    tid: string;
    tusername: string;
}

export interface Campaigns {
    [globalCampaign: string]: {
        [localCampaign: string]: {
            label: 'anti-india' | 'not-anti';
            tdescription: string[];
        }
    }
}

export type TrendingKeywords = Record<string, number>;

export type LocationData = Record<string, number>;

export type Leaderboard = Record<string, number>;

export type MostViral = Record<string, number>;

export type MostHated = {
    hate_score: number;
    tweet: string;
}[];

export interface NetworkGraphData {
    campaign: {
        [campaignName: string]: {
            [userName: string]: {
                hatekeywords: string[];
            };
        };
    };
    hatewords: {
        [keyword: string]: {
            [userName: string]: {
                campaigns: string[];
            };
        };
    };
}
