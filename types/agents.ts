export interface Tool {
  id: string;
  name: string;
  description: string;
  function: string; // JavaScript function as string
  parameters: ToolParameter[];
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  authorId?: string;
  authorName?: string;
  authorEmail?: string;
  downloads?: number; // Added for published tools
  rating?: number; // Added for published tools
  publishedAt?: Date; // Added for published tools
}

export interface ToolParameter {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required: boolean;
}

export interface Agent {
  id: string;
  name: string;
  description: string; // System prompt
  toolIds: string[]; // Maximum 5 tools
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  authorId?: string;
  authorName?: string;
  authorEmail?: string;
  downloads?: number; // Added for published agents
  rating?: number; // Added for published agents
  publishedAt?: Date; // Added for published agents
}

export interface PublishedItem {
  id: string;
  name?: string; // Optional
  description?: string; // Optional
  authorName?: string; // Optional
  authorEmail?: string; // Optional
  downloads?: number; // Optional
  rating?: number; // Optional
  createdAt: any;
  publishedAt: any;
  updatedAt: any;
  isPublished?: boolean;
}

// Union type for when we need to handle both
export type ToolOrPublished = Tool | PublishedItem;