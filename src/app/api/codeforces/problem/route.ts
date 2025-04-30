import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  // Get contestId and problemId from query parameters
  const searchParams = request.nextUrl.searchParams;
  const contestId = searchParams.get('contestId');
  const problemId = searchParams.get('problemId');

  if (!contestId || !problemId) {
    return NextResponse.json(
      { error: 'Missing contestId or problemId parameters' },
      { status: 400 }
    );
  }

  try {
    // Instead of trying to fetch directly, return a message about Cloudflare protection
    return NextResponse.json({
      html: `
        <div class="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded mb-4">
          <h3 class="font-bold text-lg mb-2">Codeforces Content Not Available</h3>
          <p class="mb-2">
            Codeforces uses Cloudflare protection that prevents server-side scraping.
            To view the problem, please use the "View on Codeforces" button.
          </p>
          <p>
            In a production environment, this would require:
            <ul class="list-disc pl-5 mt-2">
              <li>A specialized service capable of bypassing Cloudflare protection</li>
              <li>A headless browser implementation (Puppeteer/Playwright)</li>
              <li>Or an official API from Codeforces (which doesn't currently provide problem content)</li>
            </ul>
          </p>
        </div>
      `,
      cloudflareProtected: true
    });

    /* 
    // This code would work if Codeforces didn't use Cloudflare protection:
    const response = await axios.get(
      `https://codeforces.com/contest/${contestId}/problem/${problemId}`,
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

    // Extract problem statement content
    const html = response.data;
    const problemStatement = extractProblemContent(html);

    if (problemStatement) {
      return NextResponse.json({ html: problemStatement });
    } else {
      return NextResponse.json(
        { error: 'Failed to extract problem content' },
        { status: 500 }
      );
    }
    */
  } catch (error) {
    console.error('Error fetching problem:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problem from Codeforces' },
      { status: 500 }
    );
  }
}

// Helper function to extract problem content
function extractProblemContent(html: string) {
  try {
    // The problem content is usually in a div with class "problem-statement"
    const problemStatementMatch = html.match(
      /<div class="problem-statement">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<div class="bottom-links"/
    );

    if (problemStatementMatch && problemStatementMatch[1]) {
      // Process the HTML to fix relative paths and styling
      let content = problemStatementMatch[1];

      // Fix image paths
      content = content.replace(/src="\//g, 'src="https://codeforces.com/');

      return content;
    }
    return null;
  } catch (error) {
    console.error('Error parsing HTML:', error);
    return null;
  }
} 