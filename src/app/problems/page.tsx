"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { codeforcesApi } from "@/lib/api-client";
import { getRatingColor } from "@/lib/utils";
import { 
  AnimatedCard, 
  AnimatedTitle, 
  FadeIn, 
  SlideIn,
  StaggeredList,
  StaggeredItem
} from "@/components/ui/animated-card";

export default function ProblemsPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [difficultyRange, setDifficultyRange] = useState<[number, number]>([800, 3500]);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["problems", selectedTags, difficultyRange],
    queryFn: async () => {
      const response = await codeforcesApi.getProblemsetProblems(
        selectedTags.length > 0 ? selectedTags : undefined
      );
      
      // Filter by difficulty if available
      let filteredProblems = response.problems;
      if (difficultyRange) {
        filteredProblems = filteredProblems.filter(
          (p) => p.rating && p.rating >= difficultyRange[0] && p.rating <= difficultyRange[1]
        );
      }
      
      return {
        problems: filteredProblems,
        problemStatistics: response.problemStatistics,
      };
    },
  });

  // Get all available tags
  const allTags = data?.problems.reduce((acc: Set<string>, problem) => {
    problem.tags.forEach((tag) => acc.add(tag));
    return acc;
  }, new Set<string>());

  const tagsList = allTags ? Array.from(allTags).sort() : [];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setDifficultyRange([800, 3500]);
  };

  return (
    <FadeIn>
      <div className="flex flex-col md:flex-row gap-6">
        <SlideIn direction="left" className="w-full md:w-64 space-y-6">
          <AnimatedCard>
            <h2 className="text-xl font-medium mb-4">Filters</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Difficulty Range</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="800"
                    max="3500"
                    step="100"
                    value={difficultyRange[0]}
                    onChange={(e) => setDifficultyRange([parseInt(e.target.value), difficultyRange[1]])}
                    className="w-24 rounded-md border border-input bg-background px-3 py-1 text-sm"
                  />
                  <span>—</span>
                  <input
                    type="number"
                    min="800"
                    max="3500"
                    step="100"
                    value={difficultyRange[1]}
                    onChange={(e) => setDifficultyRange([difficultyRange[0], parseInt(e.target.value)])}
                    className="w-24 rounded-md border border-input bg-background px-3 py-1 text-sm"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Tags</h3>
                <div className="space-y-1 max-h-96 overflow-y-auto pr-2">
                  {tagsList.map((tag) => (
                    <div key={tag} className="flex items-center">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag)}
                          onChange={() => toggleTag(tag)}
                          className="rounded border-gray-400"
                        />
                        {tag}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={clearFilters}
                className="w-full text-sm text-center underline text-muted-foreground hover:text-foreground"
              >
                Clear all filters
              </button>
            </div>
          </AnimatedCard>
        </SlideIn>
        
        <SlideIn direction="right" delay={0.2} className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <AnimatedTitle>Problems</AnimatedTitle>
            {data && (
              <FadeIn delay={0.4}>
                <div className="text-sm text-muted-foreground">
                  Showing {data.problems.length} problems
                </div>
              </FadeIn>
            )}
          </div>
          
          {isLoading && (
            <FadeIn className="flex justify-center py-12">
              <div className="animate-pulse-slow">Loading problems...</div>
            </FadeIn>
          )}
          
          {error && (
            <FadeIn className="flex justify-center py-12">
              <div className="text-destructive">
                Error loading problems. Please try again later.
              </div>
            </FadeIn>
          )}
          
          {data && (
            <AnimatedCard delay={0.3}>
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">#</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Tags</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Difficulty</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <StaggeredList delay={0.4} staggerDelay={0.03}>
                    {data.problems.slice(0, 50).map((problem) => (
                      <StaggeredItem key={`${problem.contestId}-${problem.index}`}>
                        <tr className="hover:bg-secondary/20">
                          <td className="px-4 py-3 text-sm">
                            {problem.contestId}-{problem.index}
                          </td>
                          <td className="px-4 py-3">
                            <Link 
                              href={`/problems/${problem.contestId}/${problem.index}`}
                              className="font-medium hover:underline text-primary"
                            >
                              {problem.name}
                            </Link>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {problem.tags.map((tag) => (
                                <span 
                                  key={tag} 
                                  className="text-xs bg-secondary/50 px-2 py-0.5 rounded cursor-pointer"
                                  onClick={() => toggleTag(tag)}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {problem.rating ? (
                              <span className={`text-sm font-medium ${getRatingColor(problem.rating)}`}>
                                {problem.rating}
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">N/A</span>
                            )}
                          </td>
                        </tr>
                      </StaggeredItem>
                    ))}
                  </StaggeredList>
                </tbody>
              </table>
              {data.problems.length > 50 && (
                <FadeIn delay={0.6} className="p-4 text-center text-sm text-muted-foreground">
                  Showing 50 of {data.problems.length} problems. Refine your filters to see more specific results.
                </FadeIn>
              )}
            </AnimatedCard>
          )}
        </SlideIn>
      </div>
    </FadeIn>
  );
} 