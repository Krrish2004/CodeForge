import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  // Get contestId and submissionId from query parameters
  const searchParams = request.nextUrl.searchParams;
  const contestId = searchParams.get('contestId');
  const submissionId = searchParams.get('submissionId');

  if (!contestId || !submissionId) {
    return NextResponse.json(
      { error: 'Missing contestId or submissionId parameters' },
      { status: 400 }
    );
  }

  try {
    // Instead of trying to fetch directly, return a message about Cloudflare protection
    return NextResponse.json({
      cloudflareProtected: true,
      message: "Codeforces uses Cloudflare protection that prevents server-side scraping.",
      sourceCode: `// This is a placeholder for the actual source code
// Codeforces uses Cloudflare protection that prevents server-side scraping
// In a production environment, you would need:
//   - A specialized service capable of bypassing Cloudflare protection
//   - A headless browser implementation (Puppeteer/Playwright)
//   - Or an official API from Codeforces

// Please use the "View on Codeforces" button to see the actual submission
function viewOnCodeforces() {
  // This would open the Codeforces submission page
  const url = \`https://codeforces.com/contest/${contestId}/submission/${submissionId}\`;
  window.open(url, "_blank");
}

// Example solution structure
function solve() {
  // Your solution would be here
  console.log("Solution placeholder");
}

solve();`,
      testResults: [
        {
          testNumber: "1",
          verdict: "Example Only",
          input: "This is an example test case.\nActual test cases are available on Codeforces.",
          output: "Example output",
          expected: "Example expected output"
        }
      ]
    });

    /* 
    // This code would work if Codeforces didn't use Cloudflare protection:
    // Fetch submission content from Codeforces
    const response = await axios.get(
      `https://codeforces.com/contest/${contestId}/submission/${submissionId}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://codeforces.com/',
          'sec-ch-ua': '"Google Chrome";v="123"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'DNT': '1',
          'Upgrade-Insecure-Requests': '1',
          'Connection': 'keep-alive'
        }
      }
    );

    // Extract submission source code and test details
    const html = response.data;
    const extractedData = extractSubmissionData(html);

    if (extractedData) {
      return NextResponse.json(extractedData);
    } else {
      return NextResponse.json(
        { error: 'Failed to extract submission content' },
        { status: 500 }
      );
    }
    */
  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submission from Codeforces' },
      { status: 500 }
    );
  }
}

// Helper function to extract submission data from HTML
function extractSubmissionData(html: string) {
  try {
    // Extract source code
    const sourceCodeMatch = html.match(/<pre id="program-source-text"[^>]*>([\s\S]*?)<\/pre>/);
    const sourceCode = sourceCodeMatch ? decodeHTML(sourceCodeMatch[1]) : null;

    // Extract test results table
    const testResultsMatch = html.match(/<div class="verdict-test-details">([\s\S]*?)<\/div>\s*<script>/);
    let testResults = null;
    
    if (testResultsMatch) {
      // Process the test results to make it usable
      const testTable = testResultsMatch[1];
      testResults = parseTestResults(testTable);
    }

    return {
      sourceCode,
      testResults,
    };
  } catch (error) {
    console.error('Error parsing submission HTML:', error);
    return null;
  }
}

// Helper function to decode HTML entities
function decodeHTML(html: string) {
  return html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<br\s*\/?>/g, '\n');
}

// Helper function to parse test results
function parseTestResults(html: string) {
  // Simple parsing for test case details
  const testCases: any[] = [];
  
  // Look for test case rows
  const testRowRegex = /<tr[^>]*>\s*<td[^>]*>(\d+)<\/td>[\s\S]*?<span[^>]*>([^<]*)<\/span>[\s\S]*?(?:<pre[^>]*>([\s\S]*?)<\/pre>[\s\S]*?)?(?:<pre[^>]*>([\s\S]*?)<\/pre>[\s\S]*?)?(?:<pre[^>]*>([\s\S]*?)<\/pre>[\s\S]*?)?/g;
  
  let match;
  while ((match = testRowRegex.exec(html)) !== null) {
    const testNumber = match[1];
    const verdict = match[2];
    const input = match[3] ? decodeHTML(match[3]) : null;
    const output = match[4] ? decodeHTML(match[4]) : null;
    const expected = match[5] ? decodeHTML(match[5]) : null;
    
    testCases.push({
      testNumber,
      verdict,
      input,
      output,
      expected,
    });
  }
  
  return testCases;
} 