export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  html_url: string;
}

export interface GitHubRepo {
  name: string;
  full_name: string;
  html_url: string;
  commits?: CommitInfo[];
}

export interface CommitInfo {
  sha: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  committer: {
    name: string;
    email: string;
    date: string;
  };
  message: string;
}

export interface GitHubApiRepo {
  name: string;
  full_name: string;
  html_url: string;
  fork: boolean;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
}

export interface Proxy {
  url: string;
  isWorking: boolean;
  rateLimitRemaining: number | null;
}

export interface RateLimitInfo {
  remaining: number;
  reset: number;
  proxy?: string;
}