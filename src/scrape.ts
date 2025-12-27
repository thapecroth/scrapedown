import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";
import TurndownService from "./turndown";
import { fetchUrl, HEURISTIC_ORDER, AGENT_PROFILES, looksLikeBotDetection, looksLikeErrorPage } from "./agents";
import type { AgentName } from "./agents";

export interface ScrapeResult {
  title: string | null;
  byline: string | null;
  dir: string | null;
  lang: string | null;
  content: string;
  textContent: string;
  length: number;
  excerpt: string | null;
  siteName: string | null;
  _meta: {
    agent: string;
    attempts: number;
  };
}

export const scrape = async ({
  url,
  markdown,
  agent = "heuristic",
}: {
  url: string;
  markdown: boolean;
  agent?: AgentName;
}): Promise<ScrapeResult | null> => {
  if (agent === "heuristic") {
    return scrapeWithHeuristic(url, markdown);
  }

  // Single agent mode
  const result = await fetchUrl(url, agent);
  console.log("html", result.html);

  const article = extract(result.html);
  if (article == null) {
    return null;
  }

  return formatArticle(article, markdown, result.agentUsed, result.attempts);
};

// Heuristic mode: try agents until we get a valid article
async function scrapeWithHeuristic(
  url: string,
  markdown: boolean
): Promise<ScrapeResult | null> {
  let attempts = 0;

  for (const agentName of HEURISTIC_ORDER) {
    attempts++;
    const profile = AGENT_PROFILES[agentName];
    if (!profile) continue;
    console.log(`[heuristic] Trying agent: ${agentName}`);

    try {
      const response = await fetch(url, { headers: profile.headers });
      const html = await response.text();

      // Check HTTP status
      if (!response.ok) {
        console.log(`[heuristic] Agent ${agentName} got status ${response.status}`);
        continue;
      }

      // Check for bot detection or error pages
      if (looksLikeBotDetection(html)) {
        console.log(`[heuristic] Agent ${agentName} hit bot detection`);
        continue;
      }

      if (looksLikeErrorPage(html, response.status)) {
        console.log(`[heuristic] Agent ${agentName} got error page`);
        continue;
      }

      // Try to extract article
      const article = extract(html);
      if (article == null || !article.content || article.content.length < 100) {
        console.log(
          `[heuristic] Agent ${agentName} got no/small article: ${article?.content?.length ?? 0} chars`
        );
        continue;
      }

      // Success!
      console.log(`[heuristic] Success with agent: ${agentName}`);
      return formatArticle(article, markdown, agentName, attempts);
    } catch (error) {
      console.log(`[heuristic] Agent ${agentName} threw error:`, error);
    }
  }

  console.log(`[heuristic] All agents failed after ${attempts} attempts`);
  return null;
}

function formatArticle(
  article: ReturnType<Readability<string>["parse"]>,
  markdown: boolean,
  agentUsed: string,
  attempts: number
): ScrapeResult | null {
  if (!article) return null;

  const meta = { agent: agentUsed, attempts };

  if (markdown) {
    const textContent = convertToMarkdown(article.content);
    return { ...article, textContent, _meta: meta };
  } else {
    const content = cleanString(article.content);
    const textContent = cleanString(article.textContent);
    return { ...article, content, textContent, _meta: meta };
  }
}

const extract = (html: string) => {
  var doc = parseHTML(html);
  let reader = new Readability(doc.window.document);
  return reader.parse();
};

const convertToMarkdown = (html: string) => {
  const turndown = new TurndownService();
  const doc = parseHTML(html);
  return turndown.turndown(doc.window.document);
};

const cleanString = (str: string) =>
  str
    .replace(/[\s\t\u200B-\u200D\uFEFF]+/g, " ")
    .replace(/^\s+/gm, "")
    .replace(/\n+/g, "\n");
