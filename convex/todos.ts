import { Id } from "./_generated/dataModel";
import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { handleUserId } from "./auth";
import moment from "moment";
import { getEmbeddingsWithAI } from "./openai";
import { api } from "./_generated/api";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);
    if (userId) {
      return await ctx.db
        .query("todos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .collect();
    }
    return [];
  },
});

export const getCompletedTodosByProjectId = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const userId = await handleUserId(ctx);
    if (userId) {
      return await ctx.db
        .query("todos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("projectId"), projectId))
        .filter((q) => q.eq(q.field("isCompleted"), true))
        .collect();
    }
    return [];
  },
});

export const getTodosByProjectId = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const userId = await handleUserId(ctx);
    if (userId) {
      return await ctx.db
        .query("todos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("projectId"), projectId))
        .collect();
    }
    return [];
  },
});

export const getInCompleteTodosByProjectId = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const userId = await handleUserId(ctx);
    if (userId) {
      return await ctx.db
        .query("todos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("projectId"), projectId))
        .filter((q) => q.eq(q.field("isCompleted"), false))
        .collect();
    }
    return [];
  },
});

export const getTodosTotalByProjectId = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const userId = await handleUserId(ctx);
    if (userId) {
      const todos = await ctx.db
        .query("todos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("projectId"), projectId))
        .filter((q) => q.eq(q.field("isCompleted"), true))
        .collect();

      return todos?.length || 0;
    }
    return 0;
  },
});

export const todayTodos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      const SHIFT = 12 * 60 * 60 * 1000;
      const todayStart = moment().startOf("day").valueOf() - SHIFT;
      const todayEnd = moment().endOf("day").valueOf() - SHIFT;

      return await ctx.db
        .query("todos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("isCompleted"), false))
        .filter((q) => q.gte(q.field("dueDate"), todayStart))
        .filter((q) => q.lte(q.field("dueDate"), todayEnd))
        .collect();
    }
    return [];
  },
});

export const completedTodayTodos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      const SHIFT = 12 * 60 * 60 * 1000;
      const todayStart = moment().startOf("day").valueOf() - SHIFT;
      const todayEnd = moment().endOf("day").valueOf() - SHIFT;

      return await ctx.db
        .query("todos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("isCompleted"), true))
        .filter((q) => q.gte(q.field("dueDate"), todayStart))
        .filter((q) => q.lte(q.field("dueDate"), todayEnd))
        .collect();
    }
    return [];
  },
});

export const overdueTodos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      const SHIFT = 12 * 60 * 60 * 1000;
      const todayStart = moment().startOf("day").valueOf() - SHIFT;

      return await ctx.db
        .query("todos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("isCompleted"), false))
        .filter((q) => q.lt(q.field("dueDate"), todayStart))
        .collect();
    }
    return [];
  },
});

export const completedTodos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);
    if (userId) {
      return await ctx.db
        .query("todos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("isCompleted"), true))
        .collect();
    }
    return [];
  },
});

export const inCompleteTodos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);
    if (userId) {
      return await ctx.db
        .query("todos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("isCompleted"), false))
        .collect();
    }
    return [];
  },
});

export const totalTodos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);
    if (userId) {
      const todos = await ctx.db
        .query("todos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("isCompleted"), true))
        .collect();
      return todos.length || 0;
    }
    return 0;
  },
});

export const checkATodo = mutation({
  args: { taskId: v.id("todos") },
  handler: async (ctx, { taskId }) => {
    const newTaskId = await ctx.db.patch(taskId, { isCompleted: true });
    return newTaskId;
  },
});

export const unCheckATodo = mutation({
  args: { taskId: v.id("todos") },
  handler: async (ctx, { taskId }) => {
    const newTaskId = await ctx.db.patch(taskId, { isCompleted: false });
    return newTaskId;
  },
});

export const createATodo = mutation({
  args: {
    taskName: v.string(),
    description: v.optional(v.string()),
    priority: v.number(),
    dueDate: v.number(),
    projectId: v.id("projects"),
    labelId: v.id("labels"),
    embedding: v.optional(v.array(v.float64())),
  },
  handler: async (
    ctx,
    { taskName, description, priority, dueDate, projectId, labelId, embedding }
  ) => {
    try {
      const userId = await handleUserId(ctx);
      if (userId) {
        const newTaskId = await ctx.db.insert("todos", {
          userId,
          taskName,
          description,
          priority,
          dueDate,
          projectId,
          labelId,
          isCompleted: false,
          embedding,
        });
        return newTaskId;
      }

      return null;
    } catch (err) {
      console.log("Error occurred during createATodo mutation", err);

      return null;
    }
  },
});

export const createTodoAndEmbeddings = action({
  args: {
    taskName: v.string(),
    description: v.optional(v.string()),
    priority: v.number(),
    dueDate: v.number(),
    projectId: v.id("projects"),
    labelId: v.id("labels"),
  },
  handler: async (
    ctx,
    { taskName, description, priority, dueDate, projectId, labelId }
  ) => {
    const embedding = await getEmbeddingsWithAI(taskName);
    await ctx.runMutation(api.todos.createATodo, {
      taskName,
      description,
      priority,
      dueDate,
      projectId,
      labelId,
      embedding,
    });
  },
});

export const groupTodosByDate = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      const SHIFT = 12 * 60 * 60 * 1000;
      const tomorrowStart = moment().add(1, "day").startOf("day").valueOf() - SHIFT;

      const todos = await ctx.db
        .query("todos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("isCompleted"), false))
        .filter((q) => q.gte(q.field("dueDate"), tomorrowStart))
        .collect();

      const groupedTodos = todos.reduce<any>((acc, todo) => {
        const dueDate = new Date(todo.dueDate + SHIFT).toDateString();
        acc[dueDate] = (acc[dueDate] || []).concat(todo);
        return acc;
      }, {});

      return groupedTodos;
    }
    return [];
  },
});

export const groupCompletedTodosByDate = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);

    if (userId) {
      const SHIFT = 12 * 60 * 60 * 1000;
      const tomorrowStart = moment().add(1, "day").startOf("day").valueOf() - SHIFT;

      const todos = await ctx.db
        .query("todos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("isCompleted"), true))
        .filter((q) => q.gte(q.field("dueDate"), tomorrowStart))
        .collect();

      const groupedTodos = todos.reduce<any>((acc, todo) => {
        const dueDate = new Date(todo.dueDate + SHIFT).toDateString();
        acc[dueDate] = (acc[dueDate] || []).concat(todo);
        return acc;
      }, {});

      return groupedTodos;
    }
    return [];
  },
});

export const deleteATodo = mutation({
  args: {
    taskId: v.id("todos"),
  },
  handler: async (ctx, { taskId }) => {
    try {
      const userId = await handleUserId(ctx);
      if (userId) {
        const deletedTaskId = await ctx.db.delete(taskId);

        return deletedTaskId;
      }

      return null;
    } catch (err) {
      console.log("Error occurred during deleteATodo mutation", err);

      return null;
    }
  },
});