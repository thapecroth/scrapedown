// Agent profiles with their HTTP headers
export interface AgentProfile {
  name: string;
  headers: Record<string, string>;
}

export const AGENT_PROFILES: Record<string, AgentProfile> = {
  chrome: {
    name: "chrome",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  },
  googlebot: {
    name: "googlebot",
    headers: {
      "User-Agent": "Googlebot/2.1 (+http://www.google.com/bot.html)",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Encoding": "gzip, deflate",
    },
  },
  axios: {
    name: "axios",
    headers: {
      "User-Agent": "axios/1.8.4",
      Accept: "text/markdown, text/html, */*",
      "Accept-Encoding": "gzip, compress, deflate, br",
    },
  },
  firefox: {
    name: "firefox",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
    },
  },
  curl: {
    name: "curl",
    headers: {
      "User-Agent": "curl/8.4.0",
      Accept: "*/*",
    },
  },
};

// Order for heuristic mode - most likely to succeed first
export const HEURISTIC_ORDER: string[] = ["chrome", "googlebot", "axios"];

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
  // Very short responses are suspicious
  if (html.length < 500) {
    const lower = html.toLowerCase();
    for (const pattern of BOT_DETECTION_PATTERNS) {
      if (pattern.test(lower)) {
        return true;
      }
    }
  }
  // Check for common bot detection in any length
  if (html.length < 5000) {
    const lower = html.toLowerCase();
    // Check for Cloudflare challenge page
    if (lower.includes("checking your browser") || lower.includes("ray id")) {
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
      if (result.ok && result.html.length > 0 && !looksLikeBotDetection(result.html)) {
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
