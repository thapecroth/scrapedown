import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { scrape } from "./scrape";
import { VALID_AGENTS } from "./agents";
import type { AgentName } from "./agents";

const app = new Hono();

const querySchema = z.object({
  url: z.string().url(),
  markdown: z.union([z.literal("true"), z.literal("false")]).optional(),
  agent: z.enum(VALID_AGENTS as unknown as [string, ...string[]]).optional(),
});

app.get(
  "/",
  zValidator("query", querySchema),
  async (c) => {
    const url = c.req.query("url")!;
    const markdownParam = c.req.query("markdown") || "true";
    const markdown = markdownParam === "true" || markdownParam === "1";
    const agent = (c.req.query("agent") || "heuristic") as AgentName;

    try {
      console.log("scraping", url, "markdown:", markdown, "agent:", agent);
      const page = await scrape({ url, markdown, agent });
      return c.json({ page });
    } catch (e) {
      if (e instanceof Error) {
        return c.json({ page: null, error: e.message });
      } else {
        return c.json({ page: null, error: "An unknown error occurred" });
      }
    }
  }
);

export default app;
