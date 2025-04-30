"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { codeforcesApi } from "@/lib/api-client";
import { formatTimeAgo } from "@/lib/utils";
import { AnimatedTitle, AnimatedCard, FadeIn } from "@/components/ui/animated-card";
import { motion } from "framer-motion";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function SubmissionsPage() {
  const [handle, setHandle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Function to handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(handle);
  };

  // Query submissions when search query changes
  const { data, isLoading, error } = useQuery({
    queryKey: ["userSubmissions", searchQuery],
    queryFn: () => codeforcesApi.getUserSubmissions(searchQuery),
    enabled: !!searchQuery,
    staleTime: 60 * 1000, // 1 minute
  });

  // Format the verdict with appropriate styling
  const formatVerdict = (verdict: string) => {
    const verdictMap: Record<string, string> = {
      "OK": "Accepted",
      "WRONG_ANSWER": "Wrong Answer",
      "TIME_LIMIT_EXCEEDED": "Time Limit Exceeded",
      "MEMORY_LIMIT_EXCEEDED": "Memory Limit Exceeded",
      "RUNTIME_ERROR": "Runtime Error",
      "COMPILATION_ERROR": "Compilation Error",
      "SKIPPED": "Skipped",
      "REJECTED": "Rejected",
    };
    
    return verdictMap[verdict] || verdict;
  };

  // Get the appropriate CSS class for the verdict
  const getVerdictClass = (verdict: string) => {
    if (verdict === "OK") return "text-green-600";
    if (verdict === "WRONG_ANSWER") return "text-red-600";
    if (verdict === "TIME_LIMIT_EXCEEDED") return "text-orange-600";
    if (verdict === "MEMORY_LIMIT_EXCEEDED") return "text-purple-600";
    if (verdict === "RUNTIME_ERROR") return "text-yellow-600";
    if (verdict === "COMPILATION_ERROR") return "text-gray-600";
    return "text-gray-800";
  };

  // Animation variants for staggered list
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <div className="mx-auto px-4">
      <div className="mb-8">
        <AnimatedTitle className="mb-6">Submissions</AnimatedTitle>
        
        <FadeIn delay={0.5}>
          <div className="flex gap-4 mb-6">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/problemset"
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80 transition-colors"
              >
                Problem Set
              </Link>
            </motion.div>
          </div>
        </FadeIn>

        <FadeIn delay={1}>
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="Enter Codeforces handle"
              className="border px-4 py-2 rounded flex-grow bg-background"
              required
            />
            <motion.button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Search
            </motion.button>
          </form>
        </FadeIn>
      </div>

      {isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </motion.div>
      )}
      
      {error && (
        <FadeIn>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error loading submissions. Please make sure the handle is correct.
          </div>
        </FadeIn>
      )}

      {data?.result && data.result.length > 0 ? (
        <motion.div 
          className="overflow-x-auto glass-effect rounded-lg border"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <table className="min-w-full">
            <thead>
              <tr className="bg-secondary/50">
                <th className="py-2 px-4 border-b text-left">#</th>
                <th className="py-2 px-4 border-b text-left">Problem</th>
                <th className="py-2 px-4 border-b text-left">Verdict</th>
                <th className="py-2 px-4 border-b text-left">Time</th>
                <th className="py-2 px-4 border-b text-left">Memory</th>
                <th className="py-2 px-4 border-b text-left">Submitted</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.result.map((submission, index) => (
                <motion.tr 
                  key={submission.id} 
                  className="hover:bg-secondary/20"
                  variants={itemVariants}
                >
                  <td className="py-2 px-4 border-b">{submission.id}</td>
                  <td className="py-2 px-4 border-b">
                    <Link
                      href={`/problems/${submission.contestId}/${submission.problem.index}`}
                      className="text-primary hover:underline"
                    >
                      {submission.problem.index}. {submission.problem.name}
                    </Link>
                  </td>
                  <td className={`py-2 px-4 border-b ${getVerdictClass(submission.verdict)}`}>
                    {formatVerdict(submission.verdict)}
                  </td>
                  <td className="py-2 px-4 border-b">{submission.timeConsumedMillis} ms</td>
                  <td className="py-2 px-4 border-b">{Math.round(submission.memoryConsumedBytes / 1024)} KB</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(submission.creationTimeSeconds * 1000).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex gap-2">
                      <Link
                        href={`/submissions/${searchQuery}/${submission.id}`}
                        className="text-primary hover:underline text-sm"
                      >
                        Details
                      </Link>
                      <a
                        href={`https://codeforces.com/contest/${submission.contestId}/submission/${submission.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm"
                      >
                        Codeforces
                      </a>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      ) : searchQuery ? (
        <FadeIn>
          <AnimatedCard className="text-center py-12">
            No submissions found for handle: {searchQuery}
          </AnimatedCard>
        </FadeIn>
      ) : null}
    </div>
  );
} 