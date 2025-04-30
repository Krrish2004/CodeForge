"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, AnimatedTitle, AnimatedCard } from "@/components/ui/animated-card";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function SubmissionDetailPage({ params }: { params: { handle: string; id: string } }) {
  const { handle, id } = params;
  const [submissionData, setSubmissionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissionDetails = async () => {
      setLoading(true);
      try {
        // Find the associated contest ID for this submission by checking user's submissions
        const submissionsResponse = await axios.get(
          `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=100`
        );
        
        if (submissionsResponse.data.status !== "OK") {
          throw new Error(submissionsResponse.data.comment || "Failed to fetch user submissions");
        }
        
        const submission = submissionsResponse.data.result.find(
          (s: any) => s.id.toString() === id
        );
        
        if (!submission) {
          throw new Error("Submission not found");
        }
        
        setSubmissionData(submission);
        
        // Get the source code and test results using our server-side proxy
        try {
          const contestId = submission.contestId;
          
          // Use our server-side proxy to fetch the submission details
          const proxyResponse = await axios.get(
            `/api/codeforces/submission?contestId=${contestId}&submissionId=${id}`
          );
          
          if (proxyResponse.data) {
            setSubmissionData({
              ...submission,
              sourceCode: proxyResponse.data.sourceCode,
              testResults: proxyResponse.data.testResults,
              cloudflareProtected: proxyResponse.data.cloudflareProtected
            });
          }
        } catch (scrapingError) {
          console.error("Error fetching submission details:", scrapingError);
          // We still have basic submission data from the API
        }
      } catch (err: any) {
        console.error("Error fetching submission details:", err);
        setError(err.message || "Failed to load submission details");
      } finally {
        setLoading(false);
      }
    };

    if (handle && id) {
      fetchSubmissionDetails();
    }
  }, [handle, id]);

  // Map programming language to syntax highlighting language
  const mapLanguage = (cfLanguage: string) => {
    const langMap: Record<string, string> = {
      "GNU C++17": "cpp",
      "GNU C++14": "cpp",
      "GNU C++20": "cpp",
      "GNU C++11": "cpp",
      "GNU C": "c",
      "Java 8": "java",
      "Java 11": "java",
      "Python 2": "python",
      "Python 3": "python",
      "PyPy 2": "python",
      "PyPy 3": "python",
      "JavaScript": "javascript",
      "Kotlin": "kotlin",
      "Rust": "rust",
      "Go": "go",
    };
    
    // Default to the language name or text if not found
    return langMap[cfLanguage] || cfLanguage.toLowerCase() || "text";
  };

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
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <FadeIn delay={0}>
          <Link href={`/submissions/${handle}`} className="text-sm text-primary hover:underline mb-1 inline-block">
            ← Back to {handle}'s submissions
          </Link>
        </FadeIn>
        
        <FadeIn delay={0.2}>
          <AnimatedTitle>Submission #{id}</AnimatedTitle>
        </FadeIn>
        
        {loading ? (
          <div className="space-y-6">
            <SkeletonCard className="h-40" />
            <SkeletonCard className="h-80" />
          </div>
        ) : error ? (
          <FadeIn delay={0.5}>
            <div className="flex flex-col items-center py-12">
              <div className="text-destructive mb-4">{error}</div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <a 
                  href={submissionData?.contestId 
                    ? `https://codeforces.com/contest/${submissionData.contestId}/submission/${id}` 
                    : `https://codeforces.com/problemset/submission/${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                  View on Codeforces
                </a>
              </motion.div>
            </div>
          </FadeIn>
        ) : submissionData ? (
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Submission Info */}
            <motion.div variants={itemVariants}>
              <AnimatedCard className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <span className="text-muted-foreground text-sm">Problem:</span>
                    <Link
                      href={`/problems/${submissionData.contestId}/${submissionData.problem.index}`}
                      className="ml-2 font-medium hover:text-primary hover:underline transition-colors"
                    >
                      {submissionData.problem.name}
                    </Link>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Verdict:</span> 
                    <span className={`ml-2 px-2 py-0.5 rounded-md text-sm font-medium ${getVerdictClass(submissionData.verdict)}`}>
                      {formatVerdict(submissionData.verdict)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Language:</span> 
                    <span className="ml-2">{submissionData.programmingLanguage}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-muted-foreground text-sm">Submitted:</span>
                    <span className="ml-2">
                      {new Date(submissionData.creationTimeSeconds * 1000).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Time:</span>
                    <span className="ml-2">{submissionData.timeConsumedMillis} ms</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Memory:</span>
                    <span className="ml-2">{Math.round(submissionData.memoryConsumedBytes / 1024)} KB</span>
                  </div>
                </div>
              </AnimatedCard>
            </motion.div>
            
            {/* Source Code */}
            <motion.div variants={itemVariants}>
              <AnimatedCard>
                <h2 className="text-lg font-medium mb-3">Source Code</h2>
                
                {submissionData.sourceCode ? (
                  <div className="max-h-[500px] overflow-auto rounded-md">
                    <SyntaxHighlighter
                      language={mapLanguage(submissionData.programmingLanguage)}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        borderRadius: '0.375rem',
                        fontSize: '0.9rem',
                      }}
                    >
                      {submissionData.sourceCode}
                    </SyntaxHighlighter>
                    
                    {submissionData.cloudflareProtected && (
                      <div className="p-2 mt-2 text-sm bg-yellow-100 text-yellow-800 rounded-md">
                        <p>Note: This is a placeholder code. Codeforces uses Cloudflare protection that prevents server-side scraping.</p>
                        <p>Please use the "View on Codeforces" button below to see the actual submission.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-secondary/20 rounded-md">
                    <p className="text-muted-foreground text-center">
                      Source code not available. 
                      <a 
                        href={`https://codeforces.com/contest/${submissionData.contestId}/submission/${id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 text-primary hover:underline"
                      >
                        View on Codeforces
                      </a>
                    </p>
                  </div>
                )}
              </AnimatedCard>
            </motion.div>
            
            {/* Test Results */}
            {submissionData.testResults && submissionData.testResults.length > 0 && (
              <motion.div variants={itemVariants}>
                <AnimatedCard>
                  <h2 className="text-lg font-medium mb-3">Test Results</h2>
                  
                  {submissionData.cloudflareProtected && (
                    <div className="p-2 mb-4 text-sm bg-yellow-100 text-yellow-800 rounded-md">
                      <p>Note: These are example test results. Codeforces uses Cloudflare protection that prevents server-side scraping.</p>
                      <p>Please use the "View on Codeforces" button below to see the actual test results.</p>
                    </div>
                  )}
                  
                  <motion.div 
                    className="space-y-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                  >
                    {submissionData.testResults.map((test: any, index: number) => (
                      <motion.div 
                        key={index} 
                        className="border rounded-md overflow-hidden"
                        variants={itemVariants}
                      >
                        <div className={`p-2 ${
                          test.verdict === "OK" || test.verdict === "Accepted" 
                            ? "bg-green-500/10" 
                            : "bg-red-500/10"
                        }`}>
                          <h3 className="font-medium">
                            Test #{test.testNumber || index + 1}: 
                            <span className={`ml-2 ${
                              test.verdict === "OK" || test.verdict === "Accepted" 
                                ? "text-green-500" 
                                : "text-red-500"
                            }`}>
                              {test.verdict}
                            </span>
                          </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
                          {test.input && (
                            <div className="p-3">
                              <h4 className="text-xs font-medium text-muted-foreground mb-1">Input:</h4>
                              <pre className="text-xs whitespace-pre-wrap bg-secondary/20 p-2 rounded">{test.input}</pre>
                            </div>
                          )}
                          
                          {test.output && (
                            <div className="p-3">
                              <h4 className="text-xs font-medium text-muted-foreground mb-1">Your Output:</h4>
                              <pre className="text-xs whitespace-pre-wrap bg-secondary/20 p-2 rounded">{test.output}</pre>
                            </div>
                          )}
                          
                          {test.expected && (
                            <div className="p-3">
                              <h4 className="text-xs font-medium text-muted-foreground mb-1">Expected Output:</h4>
                              <pre className="text-xs whitespace-pre-wrap bg-secondary/20 p-2 rounded">{test.expected}</pre>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatedCard>
              </motion.div>
            )}
            
            {/* Links */}
            <motion.div 
              variants={itemVariants}
              className="flex justify-between items-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  href={`/submissions/${handle}`}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium shadow transition-colors hover:bg-secondary/80"
                >
                  Back to All Submissions
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <a 
                  href={`https://codeforces.com/contest/${submissionData.contestId}/submission/${id}`}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                  View on Codeforces
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}