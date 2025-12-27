// Agent profiles with their HTTP headers
// Based on 2025 browser fingerprinting research
export interface AgentProfile {
  name: string;
  headers: Record<string, string>;
}

// Chrome 120+ on Windows - full realistic header set
// Headers must be coherent and match what real Chrome sends
export const AGENT_PROFILES: Record<string, AgentProfile> = {
  chrome: {
    name: "chrome",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Cache-Control": "max-age=0",
      "Sec-CH-UA": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      "Sec-CH-UA-Mobile": "?0",
      "Sec-CH-UA-Platform": '"Windows"',
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
      Priority: "u=0, i",
    },
  },
  // Chrome on macOS
  chrome_mac: {
    name: "chrome_mac",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Cache-Control": "max-age=0",
      "Sec-CH-UA": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      "Sec-CH-UA-Mobile": "?0",
      "Sec-CH-UA-Platform": '"macOS"',
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
      Priority: "u=0, i",
    },
  },
  // Googlebot - often whitelisted for SEO
  googlebot: {
    name: "googlebot",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate",
    },
  },
  // Googlebot rendering engine (Chrome-based)
  googlebot_chrome: {
    name: "googlebot_chrome",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
    },
  },
  // Claude Code's axios signature
  axios: {
    name: "axios",
    headers: {
      "User-Agent": "axios/1.8.4",
      Accept: "text/markdown, text/html, */*",
      "Accept-Encoding": "gzip, compress, deflate, br",
    },
  },
  // Firefox on Windows - coherent header set
  firefox: {
    name: "firefox",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      Priority: "u=0, i",
      // Note: Firefox does NOT send Sec-CH-UA headers
    },
  },
  // Safari on macOS
  safari: {
    name: "safari",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      // Note: Safari does NOT send Sec-CH-UA or Sec-Fetch headers
    },
  },
  // Edge on Windows
  edge: {
    name: "edge",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Sec-CH-UA": '"Microsoft Edge";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      "Sec-CH-UA-Mobile": "?0",
      "Sec-CH-UA-Platform": '"Windows"',
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
    },
  },
  // Mobile Chrome on Android
  chrome_mobile: {
    name: "chrome_mobile",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Sec-CH-UA": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      "Sec-CH-UA-Mobile": "?1",
      "Sec-CH-UA-Platform": '"Android"',
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
    },
  },
  // Minimal curl - last resort
  curl: {
    name: "curl",
    headers: {
      "User-Agent": "curl/8.4.0",
      Accept: "*/*",
    },
  },
};

// Order for heuristic mode - most likely to succeed first
// Chrome is most common, then try bots (often whitelisted), then alternatives
export const HEURISTIC_ORDER: string[] = [
  "chrome",
  "googlebot",
  "firefox",
  "safari",
  "chrome_mobile",
  "axios",
];

// All valid agent names
export const VALID_AGENTS = [...Object.keys(AGENT_PROFILES), "heuristic"] as const;
export type AgentName = (typeof VALID_AGENTS)[number];

// Bot detection patterns - if response contains these, try next agent
const BOT_DETECTION_PATTERNS = [
  /access denied/i,
  /blocked/i,
  /captcha/i,
  /cloudflare/i,
  /please verify you are human/i,
  /enable javascript/i,
  /browser check/i,
  /security check/i,
  /unusual traffic/i,
  /automated access/i,
  /rate limit/i,
  /too many requests/i,
  /forbidden/i,
  /not allowed/i,
  /robot or human/i,
  /are you a robot/i,
  /verify you are human/i,
  /challenge-platform/i,
  /just a moment/i,
  /checking your browser/i,
  /ddos protection/i,
  /attention required/i,
  /cf-browser-verification/i,
  /hcaptcha/i,
  /recaptcha/i,
  /grecaptcha/i,
  /turnstile/i,
];

// Patterns indicating Cloudflare specifically
const CLOUDFLARE_PATTERNS = [
  /ray id/i,
  /cloudflare/i,
  /cf-ray/i,
  /__cf_bm/i,
  /challenge-platform/i,
  /cdn-cgi/i,
];

export interface FetchResult {
  ok: boolean;
  status: number;
  html: string;
  agentUsed: string;
  attempts: number;
}

// Check if response looks like a bot detection page
export function looksLikeBotDetection(html: string): boolean {
  const lower = html.toLowerCase();

  // Very short responses with detection keywords are suspicious
  if (html.length < 1000) {
    for (const pattern of BOT_DETECTION_PATTERNS) {
      if (pattern.test(lower)) {
        return true;
      }
    }
  }

  // Check for Cloudflare challenge page (any length)
  if (html.length < 10000) {
    for (const pattern of CLOUDFLARE_PATTERNS) {
      if (pattern.test(lower)) {
        // Verify it's actually a challenge page, not just a page mentioning Cloudflare
        if (
          lower.includes("checking your browser") ||
          lower.includes("just a moment") ||
          lower.includes("challenge-platform") ||
          lower.includes("enable javascript and cookies")
        ) {
          return true;
        }
      }
    }
  }

  // Check for challenge pages with minimal content
  if (html.length < 5000) {
    // Page with almost no real content but has JS challenge
    const hasMinimalBody =
      html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "")
        .length < 500;
    if (hasMinimalBody && (lower.includes("challenge") || lower.includes("verify"))) {
      return true;
    }
  }

  return false;
}

// Check if response looks like an error page
export function looksLikeErrorPage(html: string, status: number): boolean {
  if (status >= 400) return true;

  const lower = html.toLowerCase();

  // Common error page patterns
  if (html.length < 2000) {
    if (
      lower.includes("404 not found") ||
      lower.includes("page not found") ||
      lower.includes("500 internal server error") ||
      lower.includes("503 service unavailable") ||
      lower.includes("502 bad gateway")
    ) {
      return true;
    }
  }

  return false;
}

// Fetch with a specific agent
async function fetchWithAgent(
  url: string,
  agent: AgentProfile
): Promise<{ ok: boolean; status: number; html: string }> {
  const response = await fetch(url, { headers: agent.headers });
  const html = await response.text();
  return { ok: response.ok, status: response.status, html };
}

// Fetch with heuristic - try agents in order until one succeeds
export async function fetchWithHeuristic(url: string): Promise<FetchResult> {
  let lastResult: { ok: boolean; status: number; html: string } | null = null;
  let attempts = 0;

  for (const agentName of HEURISTIC_ORDER) {
    attempts++;
    const agent = AGENT_PROFILES[agentName];
    if (!agent) continue;
    console.log(`[heuristic] Trying agent: ${agentName}`);

    try {
      const result = await fetchWithAgent(url, agent);
      lastResult = result;

      // Check if this looks like a successful response
      if (
        result.ok &&
        result.html.length > 0 &&
        !looksLikeBotDetection(result.html) &&
        !looksLikeErrorPage(result.html, result.status)
      ) {
        console.log(`[heuristic] Success with agent: ${agentName}`);
        return {
          ok: true,
          status: result.status,
          html: result.html,
          agentUsed: agentName,
          attempts,
        };
      }

      console.log(
        `[heuristic] Agent ${agentName} failed: status=${result.status}, len=${result.html.length}, botDetected=${looksLikeBotDetection(result.html)}`
      );
    } catch (error) {
      console.log(`[heuristic] Agent ${agentName} threw error:`, error);
    }
  }

  // All agents failed, return the last result
  return {
    ok: lastResult?.ok ?? false,
    status: lastResult?.status ?? 0,
    html: lastResult?.html ?? "",
    agentUsed: HEURISTIC_ORDER[HEURISTIC_ORDER.length - 1] ?? "unknown",
    attempts,
  };
}

// Main fetch function - handles both specific agent and heuristic mode
export async function fetchUrl(
  url: string,
  agent: AgentName = "heuristic"
): Promise<FetchResult> {
  if (agent === "heuristic") {
    return fetchWithHeuristic(url);
  }

  const profile = AGENT_PROFILES[agent];
  if (!profile) {
    throw new Error(`Unknown agent: ${agent}`);
  }

  console.log(`[fetch] Using agent: ${agent}`);
  const result = await fetchWithAgent(url, profile);
  return {
    ok: result.ok,
    status: result.status,
    html: result.html,
    agentUsed: agent,
    attempts: 1,
  };
}
