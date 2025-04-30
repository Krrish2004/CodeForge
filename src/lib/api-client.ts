import axios from 'axios';
import { generateCodeforcesApiSignature } from './utils';

// Get API key and secret from environment variables
const API_KEY = process.env.NEXT_PUBLIC_CODEFORCES_API_KEY || 'caad47ed4ba4fe9d2582efb504d58360dcc921f6';
const API_SECRET = process.env.CODEFORCES_API_SECRET || '809b8ec689c495a38fd946a809b26c1e25683dec';
const API_BASE_URL = 'https://codeforces.com/api';

// Define types for the API responses
export interface CodeforcesApiResponse<T> {
  status: 'OK' | 'FAILED';
  result: T;
  comment?: string;
}

export interface User {
  handle: string;
  email?: string;
  vkId?: string;
  openId?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  organization?: string;
  contribution: number;
  rank?: string;
  rating?: number;
  maxRank?: string;
  maxRating?: number;
  lastOnlineTimeSeconds: number;
  registrationTimeSeconds: number;
  friendOfCount: number;
  avatar: string;
  titlePhoto: string;
}

export interface Contest {
  id: number;
  name: string;
  type: string;
  phase: string;
  frozen: boolean;
  durationSeconds: number;
  startTimeSeconds?: number;
  relativeTimeSeconds?: number;
  preparedBy?: string;
  websiteUrl?: string;
  description?: string;
  difficulty?: number;
  kind?: string;
  icpcRegion?: string;
  country?: string;
  city?: string;
  season?: string;
}

export interface Problem {
  contestId?: number;
  problemsetName?: string;
  index: string;
  name: string;
  type: string;
  points?: number;
  rating?: number;
  tags: string[];
}

export interface Submission {
  id: number;
  contestId?: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  problem: Problem;
  author: {
    contestId?: number;
    members: {
      handle: string;
    }[];
    participantType: string;
    ghost: boolean;
    startTimeSeconds: number;
  };
  programmingLanguage: string;
  verdict?: string;
  testset: string;
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
}

class CodeforcesApiClient {
  // Simplified request function that doesn't use authentication for public methods
  private async makePublicRequest<T>(
    methodName: string,
    params: Record<string, string> = {}
  ): Promise<T> {
    try {
      // Build query params
      const queryParams = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
      
      const url = `${API_BASE_URL}/${methodName}${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await axios.get<CodeforcesApiResponse<T>>(url);
      
      if (response.data.status === 'OK') {
        return response.data.result;
      } else {
        throw new Error(response.data.comment || 'API request failed');
      }
    } catch (error) {
      console.error(`Error in ${methodName}:`, error);
      throw error;
    }
  }

  // Authenticated request for methods that require it
  private async makeAuthenticatedRequest<T>(
    methodName: string,
    params: Record<string, string> = {}
  ): Promise<T> {
    try {
      const { apiSig, queryParams } = generateCodeforcesApiSignature(
        methodName,
        params,
        API_KEY,
        API_SECRET
      );
      
      const url = `${API_BASE_URL}/${methodName}?${queryParams}&apiKey=${API_KEY}&apiSig=${apiSig}`;
      
      const response = await axios.get<CodeforcesApiResponse<T>>(url);
      
      if (response.data.status === 'OK') {
        return response.data.result;
      } else {
        throw new Error(response.data.comment || 'API request failed');
      }
    } catch (error) {
      console.error(`Error in ${methodName}:`, error);
      throw error;
    }
  }

  // User methods
  async getUserInfo(handles: string[]): Promise<User[]> {
    return this.makePublicRequest<User[]>('user.info', {
      handles: handles.join(';')
    });
  }

  async getUserStatus(handle: string, from = 1, count = 10): Promise<Submission[]> {
    return this.makePublicRequest<Submission[]>('user.status', {
      handle,
      from: from.toString(),
      count: count.toString()
    });
  }

  async getUserRatingHistory(handle: string): Promise<any[]> {
    return this.makePublicRequest<any[]>('user.rating', {
      handle
    });
  }

  // Contest methods
  async getContestList(gym = false): Promise<Contest[]> {
    return this.makePublicRequest<Contest[]>('contest.list', {
      gym: gym.toString()
    });
  }

  async getContestStandings(
    contestId: number,
    from = 1,
    count = 10,
    handles?: string[]
  ): Promise<any> {
    const params: Record<string, string> = {
      contestId: contestId.toString(),
      from: from.toString(),
      count: count.toString(),
    };

    if (handles && handles.length > 0) {
      params.handles = handles.join(';');
    }

    return this.makePublicRequest<any>('contest.standings', params);
  }

  // Problem methods
  async getProblemset(): Promise<{ problems: Problem[], problemStatistics: any[] }> {
    return this.makePublicRequest<{ problems: Problem[], problemStatistics: any[] }>('problemset.problems');
  }

  async getProblemsetProblems(tags?: string[], problemsetName?: string): Promise<{ problems: Problem[], problemStatistics: any[] }> {
    const params: Record<string, string> = {};
    
    if (tags && tags.length > 0) {
      params.tags = tags.join(';');
    }
    
    if (problemsetName) {
      params.problemsetName = problemsetName;
    }
    
    return this.makePublicRequest<{ problems: Problem[], problemStatistics: any[] }>('problemset.problems', params);
  }

  // Get all submissions for a user 
  async getUserSubmissions(handle: string, count = 50): Promise<CodeforcesApiResponse<Submission[]>> {
    try {
      const response = await axios.get<CodeforcesApiResponse<Submission[]>>(
        `${API_BASE_URL}/user.status?handle=${handle}&count=${count}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error in getUserSubmissions:`, error);
      throw error;
    }
  }
}

export const codeforcesApi = new CodeforcesApiClient(); 