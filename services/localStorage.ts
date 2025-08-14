
 import AsyncStorage from '@react-native-async-storage/async-storage';
 import { Agent, Tool } from '../types/agents';

 const AGENTS_KEY = 'installed_agents';
 const TOOLS_KEY = 'installed_tools';
 const SELECTED_AGENT_KEY = 'selected_agent';

 export class LocalStorageService {
   // Agents
   // Helper method to get user-specific key
  private static getUserKey(baseKey: string, userEmail: string): string {
    return `${baseKey}_${userEmail}`;
  }

  // Agents
  static async getInstalledAgents(userEmail?: string): Promise<Agent[]> {
    try {
      if (!userEmail) {
        // Fallback to old behavior for backward compatibility
        const data = await AsyncStorage.getItem(AGENTS_KEY);
        return data ? JSON.parse(data).map((agent: any) => ({
          ...agent,
          createdAt: new Date(agent.createdAt),
          updatedAt: new Date(agent.updatedAt)
        })) : [];
      }

      const userKey = this.getUserKey(AGENTS_KEY, userEmail);
      const data = await AsyncStorage.getItem(userKey);
      return data ? JSON.parse(data).map((agent: any) => ({
        ...agent,
        createdAt: new Date(agent.createdAt),
        updatedAt: new Date(agent.updatedAt)
      })) : [];
    } catch (error) {
      console.error('Error getting installed agents:', error);
      return [];
    }
  }

  static async saveAgent(agent: Agent, userEmail?: string): Promise<void> {
    try {
      if (!userEmail) {
        // Fallback to old behavior for backward compatibility
        const agents = await this.getInstalledAgents();
        const existingIndex = agents.findIndex(a => a.id === agent.id);
        
        if (existingIndex >= 0) {
          agents[existingIndex] = agent;
        } else {
          agents.push(agent);
        }
        
        await AsyncStorage.setItem(AGENTS_KEY, JSON.stringify(agents));
        return;
      }

      const userKey = this.getUserKey(AGENTS_KEY, userEmail);
      const agents = await this.getInstalledAgents(userEmail);
      const existingIndex = agents.findIndex(a => a.id === agent.id);
      
      if (existingIndex >= 0) {
        agents[existingIndex] = agent;
      } else {
        agents.push(agent);
      }
      
      await AsyncStorage.setItem(userKey, JSON.stringify(agents));
    } catch (error) {
      console.error('Error saving agent:', error);
      throw error;
    }
  }

  static async deleteAgent(agentId: string, userEmail?: string): Promise<void> {
    try {
      if (!userEmail) {
        // Fallback to old behavior for backward compatibility
        const agents = await this.getInstalledAgents();
        const filteredAgents = agents.filter(a => a.id !== agentId);
        await AsyncStorage.setItem(AGENTS_KEY, JSON.stringify(filteredAgents));
        return;
      }

      const userKey = this.getUserKey(AGENTS_KEY, userEmail);
      const agents = await this.getInstalledAgents(userEmail);
      const filteredAgents = agents.filter(a => a.id !== agentId);
      await AsyncStorage.setItem(userKey, JSON.stringify(filteredAgents));
    } catch (error) {
      console.error('Error deleting agent:', error);
      throw error;
    }
  }

  static async deleteMultipleAgents(agentIds: string[], userEmail?: string): Promise<void> {
    try {
      if (!userEmail) {
        // Fallback to old behavior for backward compatibility
        const agents = await this.getInstalledAgents();
        const filteredAgents = agents.filter(a => !agentIds.includes(a.id));
        await AsyncStorage.setItem(AGENTS_KEY, JSON.stringify(filteredAgents));
        return;
      }

      const userKey = this.getUserKey(AGENTS_KEY, userEmail);
      const agents = await this.getInstalledAgents(userEmail);
      const filteredAgents = agents.filter(a => !agentIds.includes(a.id));
      await AsyncStorage.setItem(userKey, JSON.stringify(filteredAgents));
    } catch (error) {
      console.error('Error deleting multiple agents:', error);
      throw error;
    }
  }

  // Tools
  static async getInstalledTools(userEmail?: string): Promise<Tool[]> {
    try {
      if (!userEmail) {
        // Fallback to old behavior for backward compatibility
        const data = await AsyncStorage.getItem(TOOLS_KEY);
        return data ? JSON.parse(data).map((tool: any) => ({
          ...tool,
          createdAt: new Date(tool.createdAt),
          updatedAt: new Date(tool.updatedAt)
        })) : [];
      }

      const userKey = this.getUserKey(TOOLS_KEY, userEmail);
      const data = await AsyncStorage.getItem(userKey);
      return data ? JSON.parse(data).map((tool: any) => ({
        ...tool,
        createdAt: new Date(tool.createdAt),
        updatedAt: new Date(tool.updatedAt)
      })) : [];
    } catch (error) {
      console.error('Error getting installed tools:', error);
      return [];
    }
  }

  static async saveTool(tool: Tool, userEmail?: string): Promise<void> {
    try {
      if (!userEmail) {
        // Fallback to old behavior for backward compatibility
        const tools = await this.getInstalledTools();
        const existingIndex = tools.findIndex(t => t.id === tool.id);
        
        if (existingIndex >= 0) {
          tools[existingIndex] = tool;
        } else {
          tools.push(tool);
        }
        
        await AsyncStorage.setItem(TOOLS_KEY, JSON.stringify(tools));
        return;
      }

      const userKey = this.getUserKey(TOOLS_KEY, userEmail);
      const tools = await this.getInstalledTools(userEmail);
      const existingIndex = tools.findIndex(t => t.id === tool.id);
      
      if (existingIndex >= 0) {
        tools[existingIndex] = tool;
      } else {
        tools.push(tool);
      }
      
      await AsyncStorage.setItem(userKey, JSON.stringify(tools));
    } catch (error) {
      console.error('Error saving tool:', error);
      throw error;
    }
  }

  static async deleteTool(toolId: string, userEmail?: string): Promise<void> {
    try {
      if (!userEmail) {
        // Fallback to old behavior for backward compatibility
        const tools = await this.getInstalledTools();
        const filteredTools = tools.filter(t => t.id !== toolId);
        await AsyncStorage.setItem(TOOLS_KEY, JSON.stringify(filteredTools));
        return;
      }

      const userKey = this.getUserKey(TOOLS_KEY, userEmail);
      const tools = await this.getInstalledTools(userEmail);
      const filteredTools = tools.filter(t => t.id !== toolId);
      await AsyncStorage.setItem(userKey, JSON.stringify(filteredTools));
    } catch (error) {
      console.error('Error deleting tool:', error);
      throw error;
    }
  }

  // Selected Agent
  static async getSelectedAgent(userEmail?: string): Promise<Agent | null> {
    try {
      if (!userEmail) {
        // Fallback to old behavior for backward compatibility
        const data = await AsyncStorage.getItem(SELECTED_AGENT_KEY);
        return data ? {
          ...JSON.parse(data),
          createdAt: new Date(JSON.parse(data).createdAt),
          updatedAt: new Date(JSON.parse(data).updatedAt)
        } : null;
      }

      const userKey = this.getUserKey(SELECTED_AGENT_KEY, userEmail);
      const data = await AsyncStorage.getItem(userKey);
      return data ? {
        ...JSON.parse(data),
        createdAt: new Date(JSON.parse(data).createdAt),
        updatedAt: new Date(JSON.parse(data).updatedAt)
      } : null;
    } catch (error) {
      console.error('Error getting selected agent:', error);
      return null;
    }
  }

  static async setSelectedAgent(agent: Agent, userEmail?: string): Promise<void> {
    try {
      if (!userEmail) {
        // Fallback to old behavior for backward compatibility
        await AsyncStorage.setItem(SELECTED_AGENT_KEY, JSON.stringify(agent));
        return;
      }

      const userKey = this.getUserKey(SELECTED_AGENT_KEY, userEmail);
      await AsyncStorage.setItem(userKey, JSON.stringify(agent));
    } catch (error) {
      console.error('Error setting selected agent:', error);
      throw error;
    }
  }
 }