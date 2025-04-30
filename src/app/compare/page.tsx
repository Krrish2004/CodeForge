"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { codeforcesApi, User } from "@/lib/api-client";
import { getRatingColor, formatDate } from "@/lib/utils";
import { FadeIn, AnimatedTitle, SlideIn } from "@/components/ui/animated-card";

export default function ComparePage() {
  const [handles, setHandles] = useState<string[]>(["", ""]);
  const [searchedHandles, setSearchedHandles] = useState<string[]>([]);

  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ["users", ...searchedHandles],
    queryFn: async () => {
      if (!searchedHandles.length || searchedHandles.some(h => !h)) return null;
      const users = await codeforcesApi.getUserInfo(searchedHandles);
      return users;
    },
    enabled: searchedHandles.length > 0 && searchedHandles.every(h => !!h),
  });

  const handleInputChange = (index: number, value: string) => {
    const newHandles = [...handles];
    newHandles[index] = value;
    setHandles(newHandles);
  };

  const handleCompare = () => {
    const validHandles = handles.filter(h => h.trim());
    if (validHandles.length > 0) {
      setSearchedHandles(validHandles);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCompare();
    }
  };

  const addAnotherUser = () => {
    setHandles([...handles, ""]);
  };

  const removeUser = (index: number) => {
    const newHandles = [...handles];
    newHandles.splice(index, 1);
    setHandles(newHandles);
  };

  return (
    <div className="w-full space-y-6">
      <AnimatedTitle>Compare Users</AnimatedTitle>
      <SlideIn>
        <div className="border rounded-lg p-6 glass-effect">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Enter Codeforces Handles</h2>
            {handles.map((handle, index) => (
              <div className="flex gap-2 items-center" key={index}>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`User ${index + 1}`}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                {handles.length > 2 && (
                  <button
                    onClick={() => removeUser(index)}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <div className="flex gap-3">
              <button
                onClick={handleCompare}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
              >
                Compare
              </button>
              {handles.length < 5 && (
                <button
                  onClick={addAnotherUser}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
                >
                  Add Another User
                </button>
              )}
            </div>
          </div>
        </div>
      </SlideIn>

      {isLoading && (
        <FadeIn>
          <div className="w-full flex justify-center py-12">
            <div className="animate-pulse-slow">Loading users data...</div>
          </div>
        </FadeIn>
      )}

      {error && (
        <FadeIn>
          <div className="w-full flex justify-center py-12">
            <div className="text-destructive">
              Error loading users: One or more users not found or API error
            </div>
          </div>
        </FadeIn>
      )}

      {usersData && usersData.length > 0 && (
        <FadeIn>
          <div className="space-y-6">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Rating</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Max Rating</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Rank</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Registered</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Contribution</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {usersData.map((user: User) => (
                    <tr key={user.handle} className="hover:bg-secondary/20">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={user.avatar} 
                            alt={user.handle} 
                            className="w-8 h-8 rounded-full object-cover border"
                          />
                          <Link 
                            href={`/dashboard?handle=${user.handle}`}
                            className="font-medium hover:underline"
                          >
                            {user.handle}
                          </Link>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${getRatingColor(user.rating || 0)}`}>
                          {user.rating || 'Unrated'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${getRatingColor(user.maxRating || 0)}`}>
                          {user.maxRating || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`${getRatingColor(user.rating || 0)}`}>
                          {user.rank ? user.rank.charAt(0).toUpperCase() + user.rank.slice(1) : 'Unrated'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {formatDate(new Date(user.registrationTimeSeconds * 1000))}
                      </td>
                      <td className="px-4 py-3">
                        <span className={user.contribution > 0 ? 'text-green-500' : user.contribution < 0 ? 'text-red-500' : ''}>
                          {user.contribution > 0 ? `+${user.contribution}` : user.contribution}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Rating Comparison Visualization */}
            <SlideIn direction="up" delay={0.1}>
              <div className="border rounded-lg p-6 glass-effect">
                <h2 className="text-xl font-medium mb-4">Rating Comparison</h2>
                <div className="w-full h-20 relative mt-8">
                  {/* Rating Scale */}
                  <div className="absolute top-8 left-0 w-full h-1 bg-gray-700"></div>
                  
                  {/* Rating Marks */}
                  {[800, 1200, 1400, 1600, 1900, 2100, 2400, 2600, 3000].map((rating) => (
                    <div key={rating} className="absolute top-7 h-3 border-l border-gray-700" style={{ left: `${(rating - 800) / 22}%` }}>
                      <div className="absolute -left-4 -top-6 text-xs text-muted-foreground">
                        {rating}
                      </div>
                    </div>
                  ))}
                  
                  {/* User Markers */}
                  {usersData.map((user: User, index: number) => {
                    const rating = user.rating || 0;
                    const position = Math.max(0, Math.min(100, (rating - 800) / 22));
                    return (
                      <div 
                        key={user.handle} 
                        className={`absolute top-0 -ml-3 -mt-3 h-6 w-6 rounded-full border-2 border-background flex items-center justify-center ${getRatingColor(rating)}`} 
                        style={{ left: `${position}%` }}
                        title={`${user.handle}: ${rating}`}
                      >
                        <span className="text-xs font-bold text-white">{index + 1}</span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {usersData.map((user: User, index: number) => (
                    <div key={user.handle} className="flex items-center gap-2">
                      <div className={`h-4 w-4 rounded-full ${getRatingColor(user.rating || 0)}`}></div>
                      <div className="text-sm">
                        {index + 1}. {user.handle}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SlideIn>
          </div>
        </FadeIn>
      )}
    </div>
  );
} 