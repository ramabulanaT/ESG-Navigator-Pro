/**
 * Enhanced Agent Manager v2
 * Manages agent lifecycle, versioning, and execution
 */

import type { EnhancedBaseAgent } from './base-agent';
import type { AgentInput, AgentOutput } from './types';

export class AgentManagerV2 {
  private agents: Map<string, EnhancedBaseAgent> = new Map();

  /**
   * Register an agent
   */
  register(agent: EnhancedBaseAgent): void {
    const metadata = agent.getMetadata();
    const key = `${metadata.name}:${metadata.version}`;
    this.agents.set(key, agent);
    console.log(`[AgentManagerV2] Registered agent: ${key}`);
  }

  /**
   * Register multiple agents at once
   */
  registerMultiple(agents: EnhancedBaseAgent[]): void {
    agents.forEach((agent) => this.register(agent));
  }

  /**
   * Get an agent by name and version
   */
  get(name: string, version: string = 'latest'): EnhancedBaseAgent {
    const key =
      version === 'latest' ? this.getLatestVersion(name) : `${name}:${version}`;

    const agent = this.agents.get(key);
    if (!agent) {
      throw new Error(`Agent not found: ${key}`);
    }
    return agent;
  }

  /**
   * Check if an agent exists
   */
  has(name: string, version?: string): boolean {
    if (version) {
      return this.agents.has(`${name}:${version}`);
    }
    // Check if any version exists
    return Array.from(this.agents.keys()).some((key) =>
      key.startsWith(`${name}:`)
    );
  }

  /**
   * Execute an agent by name
   */
  async execute<TInput, TOutput>(
    name: string,
    input: AgentInput<TInput>,
    options?: { version?: string }
  ): Promise<AgentOutput<TOutput>> {
    const agent = this.get(name, options?.version);
    return await agent.execute(input);
  }

  /**
   * List all registered agents
   */
  list(): Array<{
    name: string;
    version: string;
    description: string;
    category: string;
    capabilities: string[];
  }> {
    return Array.from(this.agents.values()).map((agent) => agent.getInfo());
  }

  /**
   * List agents by category
   */
  listByCategory(
    category: 'assessment' | 'advisory' | 'operational' | 'intelligence'
  ) {
    return this.list().filter((agent) => agent.category === category);
  }

  /**
   * Get all versions of a specific agent
   */
  getVersions(name: string): string[] {
    const versions = Array.from(this.agents.keys())
      .filter((key) => key.startsWith(`${name}:`))
      .map((key) => key.split(':')[1])
      .sort();

    return versions;
  }

  /**
   * Get the latest version of an agent
   */
  private getLatestVersion(name: string): string {
    const versions = Array.from(this.agents.keys())
      .filter((key) => key.startsWith(`${name}:`))
      .sort()
      .reverse();

    if (versions.length === 0) {
      throw new Error(`No versions found for agent: ${name}`);
    }

    return versions[0];
  }

  /**
   * Remove an agent
   */
  unregister(name: string, version: string): boolean {
    const key = `${name}:${version}`;
    const deleted = this.agents.delete(key);
    if (deleted) {
      console.log(`[AgentManagerV2] Unregistered agent: ${key}`);
    }
    return deleted;
  }

  /**
   * Get agent statistics
   */
  getStats() {
    const categories = {
      assessment: 0,
      advisory: 0,
      operational: 0,
      intelligence: 0,
    };

    this.list().forEach((agent) => {
      categories[agent.category]++;
    });

    return {
      total: this.agents.size,
      categories,
      agents: this.list().map((a) => ({ name: a.name, version: a.version })),
    };
  }
}

// Singleton instance
export const agentManagerV2 = new AgentManagerV2();
