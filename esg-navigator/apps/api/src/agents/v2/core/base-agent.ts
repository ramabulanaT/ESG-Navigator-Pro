/**
 * Enhanced Base Agent Class
 * Provides comprehensive agent capabilities with monitoring, caching, and error handling
 */

import Anthropic from '@anthropic-ai/sdk';
import { ENV } from '../../../config/env';
import type {
  AgentContext,
  AgentInput,
  AgentOptions,
  AgentOutput,
  AgentMetadata,
} from './types';

export abstract class EnhancedBaseAgent<TInput = any, TOutput = any> {
  protected anthropic: Anthropic;
  protected readonly metadata: AgentMetadata;

  constructor(metadata: AgentMetadata) {
    this.metadata = metadata;
    this.anthropic = new Anthropic({
      apiKey: ENV.ANTHROPIC_API_KEY,
    });
  }

  /**
   * Main execution method - must be implemented by each agent
   */
  async execute(input: AgentInput<TInput>): Promise<AgentOutput<TOutput>> {
    const startTime = Date.now();
    const requestId = input.context.requestId;

    try {
      // Validate input
      if (!this.validateInput(input.data)) {
        throw new Error(`Invalid input data for agent ${this.metadata.name}`);
      }

      // Check cache (if enabled)
      const cacheKey = this.generateCacheKey(input);
      if (input.options?.streaming !== true) {
        const cached = await this.checkCache(cacheKey);
        if (cached) {
          console.log(`[${this.metadata.name}] Cache hit for request ${requestId}`);
          return {
            ...cached,
            metadata: {
              ...cached.metadata,
              cached: true,
            },
          };
        }
      }

      // Build prompts
      const systemPrompt = this.buildSystemPrompt();
      const userPrompt = this.buildUserPrompt(input.data);

      // Call Claude with retry logic
      const response = await this.callClaudeWithRetry(
        systemPrompt,
        userPrompt,
        input.options,
        3 // max retries
      );

      // Parse response
      const result = this.parseResponse(response.content);

      // Calculate confidence
      const confidence = this.calculateConfidence(input.data, result);

      // Build output
      const output: AgentOutput<TOutput> = {
        result,
        confidence,
        reasoning: this.extractReasoning(response.content),
        metadata: {
          executionTime: Date.now() - startTime,
          tokensUsed: {
            input: response.usage.input_tokens,
            output: response.usage.output_tokens,
            total: response.usage.input_tokens + response.usage.output_tokens,
          },
          model: input.options?.model || ENV.ANTHROPIC_MODEL,
        },
        suggestions: this.generateSuggestions(result),
        warnings: this.generateWarnings(result),
      };

      // Cache result
      await this.cacheResult(cacheKey, output);

      // Log execution
      await this.logExecution(input.context, input.data, output);

      return output;
    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      console.error(`[${this.metadata.name}] Execution error:`, error);

      // Log error
      await this.logExecution(
        input.context,
        input.data,
        {
          result: {} as TOutput,
          confidence: 0,
          metadata: {
            executionTime,
            tokensUsed: { input: 0, output: 0, total: 0 },
            model: ENV.ANTHROPIC_MODEL,
          },
        },
        error
      );

      throw error;
    }
  }

  /**
   * Validate input data - must be implemented by each agent
   */
  protected abstract validateInput(data: TInput): boolean;

  /**
   * Build the system prompt for Claude
   */
  protected abstract buildSystemPrompt(): string;

  /**
   * Build the user prompt from input data
   */
  protected abstract buildUserPrompt(data: TInput): string;

  /**
   * Parse Claude's response into structured output
   */
  protected abstract parseResponse(response: string): TOutput;

  /**
   * Calculate confidence score based on input and output
   */
  protected calculateConfidence(input: TInput, output: TOutput): number {
    // Default implementation - override in subclasses for custom logic
    return 75;
  }

  /**
   * Extract reasoning from Claude's response
   */
  protected extractReasoning(response: string): string | undefined {
    // Default implementation - can be overridden
    return undefined;
  }

  /**
   * Generate suggestions based on output
   */
  protected generateSuggestions(output: TOutput): string[] | undefined {
    // Default implementation - override in subclasses
    return undefined;
  }

  /**
   * Generate warnings based on output
   */
  protected generateWarnings(output: TOutput): string[] | undefined {
    // Default implementation - override in subclasses
    return undefined;
  }

  /**
   * Call Claude API with retry logic
   */
  protected async callClaudeWithRetry(
    systemPrompt: string,
    userPrompt: string,
    options?: AgentOptions,
    maxRetries = 3
  ): Promise<{
    content: string;
    usage: { input_tokens: number; output_tokens: number };
  }> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await this.callClaude(systemPrompt, userPrompt, options);
      } catch (error: any) {
        lastError = error;
        console.warn(
          `[${this.metadata.name}] Claude API attempt ${attempt + 1}/${maxRetries} failed:`,
          error.message
        );

        // Don't retry on validation errors
        if (error.status === 400) {
          throw error;
        }

        // Exponential backoff
        if (attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Claude API call failed after retries');
  }

  /**
   * Call Claude API
   */
  protected async callClaude(
    systemPrompt: string,
    userPrompt: string,
    options?: AgentOptions
  ): Promise<{
    content: string;
    usage: { input_tokens: number; output_tokens: number };
  }> {
    const response = await this.anthropic.messages.create({
      model: options?.model || ENV.ANTHROPIC_MODEL,
      max_tokens: options?.maxTokens || 4096,
      temperature: options?.temperature !== undefined ? options.temperature : 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    return {
      content: content.text,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    };
  }

  /**
   * Generate cache key for result caching
   */
  protected generateCacheKey(input: AgentInput<TInput>): string {
    // Simple implementation - override for custom caching logic
    const dataHash = JSON.stringify(input.data);
    return `agent:${this.metadata.name}:${this.metadata.version}:${dataHash.substring(0, 50)}`;
  }

  /**
   * Check cache for existing result
   */
  protected async checkCache(
    key: string
  ): Promise<AgentOutput<TOutput> | null> {
    // TODO: Implement Redis caching
    // For now, return null (no cache)
    return null;
  }

  /**
   * Cache result
   */
  protected async cacheResult(
    key: string,
    output: AgentOutput<TOutput>
  ): Promise<void> {
    // TODO: Implement Redis caching
    // For now, do nothing
  }

  /**
   * Log agent execution for monitoring
   */
  protected async logExecution(
    context: AgentContext,
    input: TInput,
    output: AgentOutput<TOutput>,
    error?: Error
  ): Promise<void> {
    const log = {
      agentName: this.metadata.name,
      agentVersion: this.metadata.version,
      tenantId: context.tenantId,
      userId: context.userId,
      requestId: context.requestId,
      executionTime: output.metadata.executionTime,
      tokensUsed: output.metadata.tokensUsed.total,
      success: !error,
      error: error?.message,
      timestamp: new Date().toISOString(),
    };

    // TODO: Store in database for analytics
    console.log('[AgentExecution]', log);
  }

  /**
   * Get agent metadata
   */
  getMetadata(): AgentMetadata {
    return this.metadata;
  }

  /**
   * Get agent info for registry
   */
  getInfo() {
    return {
      name: this.metadata.name,
      version: this.metadata.version,
      description: this.metadata.description,
      category: this.metadata.category,
      capabilities: this.metadata.capabilities,
    };
  }
}
