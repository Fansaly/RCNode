export interface User {
  id?: string;
  loginname: string;
  avatar_url: string;
}

export interface UserInfo extends User {
  create_at: Date | string;
  githubUsername: string;
  recent_replies: Array<{
    author: User;
    id: string;
    title: string;
    last_reply_at: Date | string;
  }>;
  recent_topics: Array<{
    author: User;
    id: string;
    title: string;
    last_reply_at: Date | string;
  }>;
  score: number;
}

export interface Topic {
  author: User;
  author_id: string;
  content: string;
  create_at: Date | string;
  good: boolean;
  id: string;
  is_collect?: boolean; // topic details
  last_reply_at: Date | string;
  // topic details
  replies?: Array<{
    author: User;
    author_id: string;
    content: string;
    create_at: Date | string;
    id: string;
    is_uped: string;
    reply_id?: string;
    ups: string[];
  }>;
  reply_count: number;
  tab: string;
  title: string;
  top: boolean;
  visit_count: number;
}

export interface Message {
  id: string;
  type: string;
  has_read: boolean;
  author: User;
  topic: {
    id: string;
    title: string;
    last_reply_at: Date | string;
  };
  reply: {
    id: string;
    content: string;
    ups: string[];
    create_at: Date | string;
  };
}
