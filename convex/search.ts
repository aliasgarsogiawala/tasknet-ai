import { v } from "convex/values";
import { action, internalQuery } from "./_generated/server";
import { getEmbeddingsWithAI } from "./openai";
import { handleUserId } from "./auth";
import { internal } from "./_generated/api";

export const fetchSearchResults = internalQuery({
  args: {
    results: v.array(v.object({ _id: v.id("todos"), _score: v.float64() })),
  },
  handler: async (ctx, args) => {
    const results = [];
    for (const result of args.results) {
      const doc = await ctx.db.get(result._id);
      if (doc === null) {
        continue;
      }
      results.push({ ...doc });
    }
    return results;
  },
});

export const searchTasks = action({
  args: {
    query: v.string(),
  },
  handler: async (ctx, { query }) => {
    try {
      const userId = await handleUserId(ctx);
      if (!userId) {
        console.log("No userId found for search");
        return [];
      }

      if (!query || query.trim() === "") {
        console.log("Empty search query");
        return [];
      }

      const embedding = await getEmbeddingsWithAI(query);

      const results = await ctx.vectorSearch("todos", "by_embedding", {
        vector: embedding,
        limit: 16,
        filter: (q) => q.eq("userId", userId),
      });

      if (!results || results.length === 0) {
        console.log("No vector search results found");
        return [];
      }

      const rows: any = await ctx.runQuery(
        internal.search.fetchSearchResults,
        {
          results,
        }
      );
      
      console.log(`Search for "${query}" returned ${rows?.length || 0} results`);
      return rows || [];
    } catch (err) {
      console.error("Error searching", err);
      return [];
    }
  },
});