"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { codeforcesApi } from "@/lib/api-client";
import { formatDate, getRatingColor, getTimeAgo } from "@/lib/utils";
import { FadeIn, AnimatedTitle, SlideIn } from "@/components/ui/animated-card";

export default function DashboardPage() {
  const [handle, setHandle] = useState<string>("");
  const [searchedHandle, setSearchedHandle] = useState<string>("");

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
    refetch: refetchUser
  } = useQuery({
    queryKey: ["user", searchedHandle],
    queryFn: async () => {
      if (!searchedHandle) return null;
      const users = await codeforcesApi.getUserInfo([searchedHandle]);
      return users[0];
    },
    enabled: !!searchedHandle,
  });

  const {
    data: submissionsData,
    isLoading: submissionsLoading,
  } = useQuery({
    queryKey: ["submissions", searchedHandle],
    queryFn: async () => {
      if (!searchedHandle) return null;
      return await codeforcesApi.getUserStatus(searchedHandle, 1, 20);
    },
    enabled: !!searchedHandle,
  });

  const {
    data: ratingHistory,
    isLoading: ratingLoading,
  } = useQuery({
    queryKey: ["rating", searchedHandle],
    queryFn: async () => {
      if (!searchedHandle) return null;
      return await codeforcesApi.getUserRatingHistory(searchedHandle);
    },
    enabled: !!searchedHandle,
  });

  const handleSearch = () => {
    if (handle.trim()) {
      setSearchedHandle(handle.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Calculate statistics if data is available
  const stats = {
    totalSubmissions: submissionsData?.length || 0,
    acceptedSubmissions: submissionsData?.filter(s => s.verdict === "OK").length || 0,
    rejectedSubmissions: submissionsData?.filter(s => s.verdict && s.verdict !== "OK").length || 0,
  };

  // Generate topic tags from submissions
  const tags = submissionsData?.reduce((acc: Record<string, number>, submission) => {
    submission.problem.tags.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  const topTags = tags ? Object.entries(tags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5) : [];

  return (
    <div className="w-full space-y-4">
      <AnimatedTitle>Dashboard</AnimatedTitle>
      <SlideIn direction="up">
        <div className="border rounded-lg p-4">
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Enter Codeforces Handle</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. tourist"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                onClick={handleSearch}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </SlideIn>

      {userLoading && (
        <FadeIn>
          <div className="w-full flex justify-center py-12">
            <div className="animate-pulse-slow">Loading user data...</div>
          </div>
        </FadeIn>
      )}

      {userError && (
        <FadeIn>
          <div className="w-full flex justify-center py-12">
            <div className="text-destructive">
              Error loading user: User not found or API error
            </div>
          </div>
        </FadeIn>
      )}

      {userData && (
        <div className="grid gap-6 md:grid-cols-3">
          <SlideIn direction="up" className="col-span-3 gradient-border">
            <div className="border rounded-lg p-6 bg-background space-y-4">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <img
                    src={userData.titlePhoto}
                    alt={userData.handle}
                    className="w-32 h-32 rounded-lg object-cover border"
                  />
                </div>
                <div className="space-y-3 flex-1">
                  <div className="flex flex-col gap-1">
                    <h2 className={`text-2xl font-bold ${getRatingColor(userData.rating || 0)}`}>
                      {userData.handle}
                    </h2>
                    <div className="text-sm text-muted-foreground">
                      {userData.rank && (
                        <span className={`${getRatingColor(userData.rating || 0)} font-medium`}>
                          {userData.rank.charAt(0).toUpperCase() + userData.rank.slice(1)}
                        </span>
                      )}
                      {userData.rating && (
                        <span className="ml-2">({userData.rating})</span>
                      )}
                    </div>
                    {userData.country && (
                      <div className="text-sm">
                        {userData.country}
                        {userData.city && `, ${userData.city}`}
                      </div>
                    )}
                    {userData.organization && (
                      <div className="text-sm">{userData.organization}</div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="rounded-md bg-secondary/50 px-3 py-2">
                      <div className="text-xs text-muted-foreground">Max Rating</div>
                      <div className={`text-lg font-medium ${getRatingColor(userData.maxRating || 0)}`}>
                        {userData.maxRating || 'N/A'}
                      </div>
                    </div>
                    <div className="rounded-md bg-secondary/50 px-3 py-2">
                      <div className="text-xs text-muted-foreground">Max Rank</div>
                      <div className={`text-lg font-medium ${getRatingColor(userData.maxRating || 0)}`}>
                        {userData.maxRank?.charAt(0).toUpperCase() + (userData.maxRank?.slice(1) || 'N/A')}
                      </div>
                    </div>
                    <div className="rounded-md bg-secondary/50 px-3 py-2">
                      <div className="text-xs text-muted-foreground">Contribution</div>
                      <div className="text-lg font-medium">
                        {userData.contribution > 0 ? `+${userData.contribution}` : userData.contribution}
                      </div>
                    </div>
                    <div className="rounded-md bg-secondary/50 px-3 py-2">
                      <div className="text-xs text-muted-foreground">Friend of</div>
                      <div className="text-lg font-medium">{userData.friendOfCount}</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span>Last online: {getTimeAgo(userData.lastOnlineTimeSeconds)}</span>
                    <span className="mx-2">•</span>
                    <span>Registered: {formatDate(new Date(userData.registrationTimeSeconds * 1000))}</span>
                  </div>
                </div>
              </div>
            </div>
          </SlideIn>

          {!submissionsLoading && submissionsData && (
            <>
              <SlideIn direction="up" delay={0.1} className="glass-effect border rounded-lg p-6 col-span-3 md:col-span-2">
                <h3 className="text-xl font-medium mb-4">Recent Submissions</h3>
                <div className="space-y-3">
                  {submissionsData.slice(0, 5).map((submission) => (
                    <div key={submission.id} className="border rounded-md p-3 bg-background/70">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">
                            {submission.problem.index}. {submission.problem.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(new Date(submission.creationTimeSeconds * 1000))}
                            <span className="ml-2">•</span>
                            <span className="ml-2">{submission.programmingLanguage}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {submission.problem.tags.map((tag) => (
                              <span key={tag} className="text-xs bg-secondary/50 px-2 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-md text-sm ${
                          submission.verdict === "OK" 
                            ? "bg-green-500/20 text-green-500" 
                            : "bg-red-500/20 text-red-500"
                        }`}>
                          {submission.verdict === "OK" ? "Accepted" : submission.verdict?.replace(/_/g, " ")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SlideIn>
              
              <SlideIn direction="up" delay={0.2} className="glass-effect border rounded-lg p-6 col-span-3 md:col-span-1">
                <h3 className="text-xl font-medium mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total Submissions</div>
                    <div className="text-2xl font-medium">{stats.totalSubmissions}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Accepted</div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-medium text-green-500">{stats.acceptedSubmissions}</div>
                      <div className="text-sm text-muted-foreground">
                        ({Math.round((stats.acceptedSubmissions / stats.totalSubmissions) * 100) || 0}%)
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Popular Topics</div>
                    <div className="space-y-1">
                      {topTags.map(([tag, count]) => (
                        <div key={tag} className="flex justify-between">
                          <span className="text-sm">{tag}</span>
                          <span className="text-sm text-muted-foreground">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SlideIn>
            </>
          )}
        </div>
      )}
    </div>
  );
} 