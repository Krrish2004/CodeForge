"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { codeforcesApi } from "@/lib/api-client";
import { getRatingColor } from "@/lib/utils";

interface ProblemDetailProps {
  params: {
    contestId: string;
    index: string;
  };
}

export default function ProblemDetailPage({ params }: ProblemDetailProps) {
  const { contestId, index } = params;
  const [problemHtml, setProblemHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch problem data to get name and tags
  const { data: problemsData } = useQuery({
    queryKey: ["problemset"],
    queryFn: async () => {
      return await codeforcesApi.getProblemset();
    },
  });

  // Find the specific problem in the problem set
  const problem = problemsData?.problems.find(
    (p) => p.contestId === Number(contestId) && p.index === index
  );

  // Fetch the problem HTML content from our API proxy
  useEffect(() => {
    const fetchProblemHtml = async () => {
      setLoading(true);
      try {
        // Use the server-side proxy instead of directly calling Codeforces
        const response = await axios.get(
          `/api/codeforces/problem?contestId=${contestId}&problemId=${index}`
        );
        
        if (response.data.html) {
          setProblemHtml(response.data.html);
          setError(null);
          
          // If it's a message about Cloudflare protection
          if (response.data.cloudflareProtected) {
            setError("Codeforces content is protected by Cloudflare. Please use the 'View on Codeforces' button.");
          }
        } else {
          setError("Couldn't parse problem content");
        }
      } catch (error) {
        console.error("Error fetching problem:", error);
        setError("Failed to load problem");
      } finally {
        setLoading(false);
      }
    };

    if (contestId && index) {
      fetchProblemHtml();
    }
  }, [contestId, index]);

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
              className="text-sm font-medium text-primary transition-colors"
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
        <Link href="/problems" className="text-sm text-primary hover:underline mb-4 inline-block">
          ← Back to Problems
        </Link>
        
        <div className="border rounded-lg p-6 bg-background">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse-slow">Loading problem...</div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-12">
              <div className="text-destructive mb-4">{error}</div>
              <p className="text-muted-foreground mb-4">There was an error loading the problem. Please try again or view it on Codeforces.</p>
              <a 
                href={`https://codeforces.com/contest/${contestId}/problem/${index}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                View on Codeforces
              </a>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold">
                  {problem ? (
                    <>
                      {`${contestId}${index}. ${problem.name}`}
                      {problem.rating && (
                        <span className={`ml-2 text-base font-normal ${getRatingColor(problem.rating)}`}>
                          ({problem.rating})
                        </span>
                      )}
                    </>
                  ) : (
                    `Problem ${contestId}${index}`
                  )}
                </h1>
                
                {problem && problem.tags && problem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {problem.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-secondary/50 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-3 mt-4">
                  <a 
                    href={`https://codeforces.com/contest/${contestId}/problem/${index}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    View on Codeforces
                  </a>
                  <a 
                    href={`https://codeforces.com/contest/${contestId}/submit/${index}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Submit solution
                  </a>
                </div>
              </div>
              
              <div 
                className="cf-problem-content prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: problemHtml }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 