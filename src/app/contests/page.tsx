"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { codeforcesApi, Contest } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import { FadeIn, AnimatedTitle, SlideIn } from "@/components/ui/animated-card";

export default function ContestsPage() {
  const [contestType, setContestType] = useState<string>("all");
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["contests"],
    queryFn: async () => {
      const contestList = await codeforcesApi.getContestList();
      return contestList;
    },
  });

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours === 0) {
      return `${minutes} min`;
    }
    
    return `${hours}h ${minutes}m`;
  };

  const getContestStatus = (contest: Contest): { status: string; statusClass: string } => {
    if (contest.phase === "BEFORE") {
      return { 
        status: "Upcoming", 
        statusClass: "bg-blue-500/20 text-blue-500" 
      };
    } else if (contest.phase === "CODING") {
      return { 
        status: "Ongoing", 
        statusClass: "bg-green-500/20 text-green-500" 
      };
    } else if (contest.phase === "PENDING_SYSTEM_TEST" || contest.phase === "SYSTEM_TEST") {
      return { 
        status: "System Testing", 
        statusClass: "bg-orange-500/20 text-orange-500" 
      };
    } else {
      return { 
        status: "Finished", 
        statusClass: "bg-gray-500/20 text-gray-500" 
      };
    }
  };

  const filteredContests = data ? data.filter((contest) => {
    if (contestType === "all") return true;
    if (contestType === "upcoming") return contest.phase === "BEFORE";
    if (contestType === "ongoing") return contest.phase === "CODING";
    if (contestType === "finished") return contest.phase === "FINISHED";
    return true;
  }) : [];

  return (
    <>
      <AnimatedTitle className="mb-6">Contests</AnimatedTitle>
      
      <SlideIn>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setContestType("all")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              contestType === "all" 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary/50 hover:bg-secondary"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setContestType("upcoming")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              contestType === "upcoming" 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary/50 hover:bg-secondary"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setContestType("ongoing")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              contestType === "ongoing" 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary/50 hover:bg-secondary"
            }`}
          >
            Ongoing
          </button>
          <button
            onClick={() => setContestType("finished")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              contestType === "finished" 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary/50 hover:bg-secondary"
            }`}
          >
            Finished
          </button>
        </div>
      </SlideIn>
      
      {isLoading && (
        <FadeIn>
          <div className="flex justify-center py-12">
            <div className="animate-pulse-slow">Loading contests...</div>
          </div>
        </FadeIn>
      )}
      
      {error && (
        <FadeIn>
          <div className="flex justify-center py-12">
            <div className="text-destructive">
              Error loading contests. Please try again later.
            </div>
          </div>
        </FadeIn>
      )}
      
      {!isLoading && filteredContests.length === 0 && (
        <FadeIn>
          <div className="flex justify-center py-12">
            <div className="text-muted-foreground">
              No contests found matching your filters.
            </div>
          </div>
        </FadeIn>
      )}
      
      {!isLoading && filteredContests.length > 0 && (
        <SlideIn direction="up" delay={0.2}>
          <div className="space-y-4">
            {filteredContests.map((contest, index) => {
              const { status, statusClass } = getContestStatus(contest);
              return (
                <div 
                  key={contest.id} 
                  className="border rounded-lg p-4 glass-effect hover:border-primary transition-colors"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex gap-2 items-center">
                        <h2 className="font-medium text-lg">{contest.name}</h2>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusClass}`}>
                          {status}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="inline-block mr-3">
                          <span className="font-medium">Type:</span> {contest.type}
                        </span>
                        <span className="inline-block mr-3">
                          <span className="font-medium">Duration:</span> {formatDuration(contest.durationSeconds)}
                        </span>
                        {contest.startTimeSeconds && (
                          <span className="inline-block">
                            <span className="font-medium">Start:</span> {formatDate(new Date(contest.startTimeSeconds * 1000))}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <a 
                        href={`https://codeforces.com/contests/${contest.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        View on Codeforces
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SlideIn>
      )}
    </>
  );
} 