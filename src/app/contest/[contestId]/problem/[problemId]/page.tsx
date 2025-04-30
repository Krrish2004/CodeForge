'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';

export default function ProblemPage() {
  const params = useParams();
  const contestId = params.contestId as string;
  const problemId = params.problemId as string;
  
  const [problemData, setProblemData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        // First try to get the problem from Codeforces API
        const response = await axios.get(`https://codeforces.com/api/contest.standings`, {
          params: {
            contestId,
            from: 1,
            count: 1,
            showUnofficial: true
          }
        });

        if (response.data.status === 'OK') {
          const problems = response.data.result.problems;
          const problem = problems.find((p: any) => p.index === problemId);
          
          if (problem) {
            // Now fetch the HTML content using our server-side proxy
            const htmlResponse = await axios.get(`/api/codeforces/problem?contestId=${contestId}&problemId=${problemId}`);
            
            if (htmlResponse.data.html) {
              setProblemData({
                ...problem,
                statement: htmlResponse.data.html
              });
            } else {
              setError('Could not parse problem statement');
            }
          } else {
            setError(`Problem ${problemId} not found in contest ${contestId}`);
          }
        } else {
          setError('Failed to fetch problem data');
        }
      } catch (err) {
        console.error('Error fetching problem:', err);
        setError('Failed to load problem. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [contestId, problemId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {loading ? 'Loading problem...' : problemData ? `Problem ${problemData.index}: ${problemData.name}` : 'Problem Not Found'}
          </h1>
          <div className="flex gap-2">
            <Link
              href="/problemset"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Problem Set
            </Link>
            <Link
              href={`https://codeforces.com/contest/${contestId}/problem/${problemId}`}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Codeforces
            </Link>
          </div>
        </div>
        
        {loading && (
          <div className="mt-8 text-center">
            <p>Loading problem data...</p>
          </div>
        )}
        
        {error && (
          <div className="mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
            <p className="mt-2">
              <Link 
                href={`https://codeforces.com/contest/${contestId}/problem/${problemId}`}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Click here to view the problem on Codeforces
              </Link>
            </p>
          </div>
        )}
        
        {problemData && (
          <div className="mt-8">
            <div className="mb-4 flex flex-wrap gap-2">
              {problemData.tags && problemData.tags.map((tag: string) => (
                <span 
                  key={tag} 
                  className="px-2 py-1 bg-gray-200 text-gray-800 text-sm rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div 
                className="problem-statement"
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(problemData.statement) 
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 