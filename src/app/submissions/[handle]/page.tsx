"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { codeforcesApi } from "@/lib/api-client";
import { formatDate, getRatingColor } from "@/lib/utils";

export default function SubmissionsPage({ params }: { params: { handle: string } }) {
  const [page, setPage] = useState(1);
  const pageSize = 20;
  
  const handle = decodeURIComponent(params.handle);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["submissions", handle, page],
    queryFn: async () => {
      const from = (page - 1) * pageSize + 1;
      return await codeforcesApi.getUserStatus(handle, from, pageSize);
    },
    enabled: !!handle,
  });

  const formatVerdict = (verdict: string | undefined) => {
    if (!verdict) return "In queue";
    if (verdict === "OK") return "Accepted";
    
    // Map Codeforces verdicts to more readable forms
    const verdictMap: Record<string, string> = {
      "WRONG_ANSWER": "Wrong Answer",
      "TIME_LIMIT_EXCEEDED": "Time Limit Exceeded",
      "MEMORY_LIMIT_EXCEEDED": "Memory Limit Exceeded",
      "RUNTIME_ERROR": "Runtime Error",
      "COMPILATION_ERROR": "Compilation Error",
      "SKIPPED": "Skipped",
      "CHALLENGED": "Challenged",
      "IDLENESS_LIMIT_EXCEEDED": "Idleness Limit Exceeded",
      "SECURITY_VIOLATED": "Security Violated",
      "CRASHED": "Crashed",
      "INPUT_PREPARATION_CRASHED": "Input Preparation Crashed",
      "REJECTED": "Rejected"
    };
    
    return verdictMap[verdict] || verdict;
  };
  
  const getVerdictClass = (verdict: string | undefined) => {
    if (!verdict) return "bg-gray-500/20 text-gray-500";
    if (verdict === "OK") return "bg-green-500/20 text-green-500";
    return "bg-red-500/20 text-red-500";
  };

  const goToPrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToNextPage = () => {
    if (data && data.length === pageSize) {
      setPage(page + 1);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-2xl bg-gradient-to-r from-cf-blue to-cf-purple bg-clip-text text-transparent">
              CodeForge
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link 
              href="/dashboard" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/problems" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Problems
            </Link>
            <Link 
              href="/contests" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Contests
            </Link>
            <Link 
              href="/compare" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Compare
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link href="/dashboard" className="text-sm text-primary hover:underline mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Submissions for {handle}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevPage}
              disabled={page === 1}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                page === 1 
                  ? "bg-secondary/30 text-muted-foreground cursor-not-allowed" 
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              Previous
            </button>
            <span className="text-sm">Page {page}</span>
            <button
              onClick={goToNextPage}
              disabled={!data || data.length < pageSize}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                !data || data.length < pageSize
                  ? "bg-secondary/30 text-muted-foreground cursor-not-allowed" 
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              Next
            </button>
          </div>
        </div>
        
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-pulse-slow">Loading submissions...</div>
          </div>
        )}
        
        {error && (
          <div className="flex justify-center py-12">
            <div className="text-destructive">
              Error loading submissions. User may not exist or API error occurred.
            </div>
          </div>
        )}
        
        {data && data.length === 0 && (
          <div className="flex justify-center py-12">
            <div className="text-muted-foreground">No submissions found for this user.</div>
          </div>
        )}
        
        {data && data.length > 0 && (
          <div className="space-y-4">
            {data.map((submission) => (
              <div key={submission.id} className="border rounded-lg p-4 glass-effect">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <Link
                      href={`/problems/${submission.problem.contestId}/${submission.problem.index}`}
                      className="font-medium text-lg hover:text-primary hover:underline transition-colors"
                    >
                      {submission.problem.contestId && submission.problem.index ? `${submission.problem.contestId}${submission.problem.index}. ` : ''}{submission.problem.name}
                    </Link>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {submission.problem.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-secondary/50 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(new Date(submission.creationTimeSeconds * 1000))}
                    </div>
                    <div className="text-sm">
                      Language: {submission.programmingLanguage}
                    </div>
                    <div className="text-sm">
                      Time: {submission.timeConsumedMillis} ms
                    </div>
                    <div className="text-sm">
                      Memory: {Math.round(submission.memoryConsumedBytes / 1024)} KB
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-center">
                    <div className={`px-3 py-1.5 rounded-md text-sm font-medium ${getVerdictClass(submission.verdict)}`}>
                      {formatVerdict(submission.verdict)}
                    </div>
                    {submission.verdict && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {submission.passedTestCount} test{submission.passedTestCount !== 1 ? 's' : ''} passed
                      </div>
                    )}
                    <div className="flex flex-col gap-1 mt-2">
                      <Link 
                        href={`/submissions/${handle}/${submission.id}`}
                        className="text-xs text-primary hover:underline"
                      >
                        View Details
                      </Link>
                      <a 
                        href={`https://codeforces.com/contest/${submission.contestId}/submission/${submission.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        View on Codeforces
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 