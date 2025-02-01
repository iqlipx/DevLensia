import type { GitHubRepo, GitHubApiRepo, GitHubCommit, GitHubUser } from './types';
import { fetchWithProxy } from './proxy';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const GITHUB_API_BASE = 'https://api.github.com';
const REQUEST_DELAY = 500; // 500ms delay between requests

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

function getCachedData<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp }: CacheEntry<T> = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCachedData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (error) {
    console.error('Error caching data:', error);
  }
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchCommits(username: string, repo: string, perPage = 10): Promise<GitHubCommit[]> {
  const cacheKey = `commits_${username}_${repo}`;
  const cachedCommits = getCachedData<GitHubCommit[]>(cacheKey);
  if (cachedCommits) return cachedCommits;

  try {
    const response = await fetchWithProxy(`${GITHUB_API_BASE}/repos/${username}/${repo}/commits?per_page=${perPage}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch commits: ${response.status}`);
    }
    const commits = await response.json();
    if (!Array.isArray(commits)) {
      throw new Error('Invalid commits response format');
    }
    setCachedData(cacheKey, commits);
    return commits;
  } catch (error) {
    console.error('Error fetching commits:', error);
    return [];
  }
}

export async function fetchUserData(username: string): Promise<GitHubUser | null> {
  const cacheKey = `user_${username}`;
  const cachedUser = getCachedData<GitHubUser>(cacheKey);
  if (cachedUser) return cachedUser;

  try {
    const response = await fetchWithProxy(`${GITHUB_API_BASE}/users/${username}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found');
      }
      throw new Error(`Failed to fetch user data: ${response.status}`);
    }
    const userData = await response.json();
    setCachedData(cacheKey, userData);
    return userData;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch user data');
  }
}

export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  const cacheKey = `repos_${username}`;
  const cachedRepos = getCachedData<GitHubRepo[]>(cacheKey);
  if (cachedRepos) return cachedRepos;

  try {
    const response = await fetchWithProxy(`${GITHUB_API_BASE}/users/${username}/repos`);
    if (!response.ok) {
      throw new Error(`Failed to fetch repositories: ${response.status}`);
    }
    
    const repos = await response.json();
    if (!Array.isArray(repos)) {
      throw new Error('Invalid repositories response format');
    }

    const originalRepos = repos.filter(repo => !repo.fork);
    const reposWithCommits = [];

    for (const repo of originalRepos) {
      try {
        await delay(REQUEST_DELAY); // Add delay between requests
        const commits = await fetchCommits(username, repo.name, 10);
        reposWithCommits.push({
          name: repo.name,
          full_name: repo.full_name,
          html_url: repo.html_url,
          commits: commits.map(commit => ({
            sha: commit.sha,
            author: commit.commit.author,
            committer: commit.commit.committer,
            message: commit.commit.message
          }))
        });
      } catch (error) {
        console.error(`Error fetching commits for ${repo.name}:`, error);
        // Continue with next repo even if this one fails
        reposWithCommits.push({
          name: repo.name,
          full_name: repo.full_name,
          html_url: repo.html_url,
          commits: []
        });
      }
    }

    setCachedData(cacheKey, reposWithCommits);
    return reposWithCommits;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch repositories';
    throw new Error(message);
  }
}