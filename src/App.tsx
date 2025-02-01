import React, { useState, useEffect } from "react";
import {
  Search,
  Moon,
  Sun,
  Github,
  ExternalLink,
  Mail,
  MapPin,
  Building2,
  Twitter,
  Users,
  Book,
  FileCode2,
  Clock,
  GitCommit,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import type { GitHubUser, GitHubRepo } from "./types";
import { fetchUserData, fetchUserRepos } from "./github";

function LoadingSkeleton({ darkMode }: { darkMode: boolean }) {
  return (
    <div
      className={`rounded-xl shadow-lg overflow-hidden ${
        darkMode ? "bg-gray-800" : "bg-white"
      } animate-pulse`}
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-600" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/4" />
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-6 bg-gray-300 dark:bg-gray-600 rounded"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [rateLimitWarning, setRateLimitWarning] = useState<string | null>(null);

  useEffect(() => {
    // Check rate limit status on component mount
    const rateLimitInfo = localStorage.getItem("githubRateLimit");
    if (rateLimitInfo) {
      const { remaining, reset } = JSON.parse(rateLimitInfo);
      const now = Date.now();
      const resetTime = new Date(reset);

      if (remaining < 10 && reset > now) {
        setRateLimitWarning(
          `API rate limit running low (${remaining} calls remaining). Resets at ${resetTime.toLocaleString()}`
        );
      }
    }
  }, []);

  const fetchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoadingUser(true);
    setLoadingRepos(true);
    setError(null);
    setUser(null);
    setRepos([]);
    setRateLimitWarning(null);

    try {
      const userData = await fetchUserData(username);
      if (userData) {
        setUser(userData);
        setLoadingUser(false);

        const userRepos = await fetchUserRepos(username);
        setRepos(userRepos);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoadingUser(false);
      setLoadingRepos(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Github className="w-8 h-8" />
            Browse GitHub Profiles
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        {rateLimitWarning && (
          <div
            className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
              darkMode
                ? "bg-yellow-900/50 text-yellow-200"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            <AlertCircle className="w-5 h-5" />
            {rateLimitWarning}
          </div>
        )}

        {error && (
          <div
            className={`p-4 rounded-lg ${
              darkMode ? "bg-red-900/50" : "bg-red-100"
            } text-red-600 mb-8`}
          >
            {error}
          </div>
        )}
        <form onSubmit={fetchUser} className="mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter GitHub username"
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <button
              type="submit"
              disabled={loadingUser || loadingRepos}
              className={`px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                loadingUser || loadingRepos
                  ? "opacity-75 cursor-not-allowed"
                  : ""
              }`}
            >
              {loadingUser || loadingRepos ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Searching...
                </div>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </form>

        <div className="space-y-8">
          {/* User Profile Section */}
          {loadingUser ? (
            <LoadingSkeleton darkMode={darkMode} />
          ) : (
            user && (
              <div
                className={`rounded-xl shadow-lg overflow-hidden ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={user.avatar_url}
                        alt={user.login}
                        className="w-32 h-32 rounded-full ring-4 ring-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-2xl font-bold">
                          {user.name || user.login}
                        </h2>
                        <a
                          href={user.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>
                      {user.bio && (
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          {user.bio}
                        </p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.company && (
                          <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-gray-400" />
                            <span>{user.company}</span>
                          </div>
                        )}
                        {user.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <span>{user.location}</span>
                          </div>
                        )}
                        {user.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <a
                              href={`mailto:${user.email}`}
                              className="text-blue-500 hover:text-blue-600"
                            >
                              {user.email}
                            </a>
                          </div>
                        )}
                        {user.blog && (
                          <div className="flex items-center gap-2">
                            <ExternalLink className="w-5 h-5 text-gray-400" />
                            <a
                              href={
                                user.blog.startsWith("http")
                                  ? user.blog
                                  : `https://${user.blog}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600"
                            >
                              {user.blog}
                            </a>
                          </div>
                        )}
                        {user.twitter_username && (
                          <div className="flex items-center gap-2">
                            <Twitter className="w-5 h-5 text-gray-400" />
                            <a
                              href={`https://twitter.com/${user.twitter_username}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600"
                            >
                              @{user.twitter_username}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <div
                      className={`p-4 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Book className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">Repositories</span>
                      </div>
                      <span className="text-2xl font-bold">
                        {user.public_repos}
                      </span>
                    </div>
                    <div
                      className={`p-4 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <FileCode2 className="w-5 h-5 text-green-500" />
                        <span className="font-medium">Gists</span>
                      </div>
                      <span className="text-2xl font-bold">
                        {user.public_gists}
                      </span>
                    </div>
                    <div
                      className={`p-4 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-purple-500" />
                        <span className="font-medium">Followers</span>
                      </div>
                      <span className="text-2xl font-bold">
                        {user.followers}
                      </span>
                    </div>
                    <div
                      className={`p-4 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-orange-500" />
                        <span className="font-medium">Following</span>
                      </div>
                      <span className="text-2xl font-bold">
                        {user.following}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span>Joined: {formatDate(user.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span>Last updated: {formatDate(user.updated_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Repositories Section */}
          {user &&
            (loadingRepos ? (
              <div
                className={`rounded-xl shadow-lg overflow-hidden ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } p-6`}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Book className="w-6 h-6 text-blue-500" />
                  <h3 className="text-2xl font-bold">
                    Loading Repositories...
                  </h3>
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin ml-2" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-50"
                      } animate-pulse`}
                    >
                      <div className="h-6 bg-gray-600 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-600 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              repos.length > 0 && (
                <div
                  className={`rounded-xl shadow-lg overflow-hidden ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Book className="w-6 h-6 text-blue-500" />
                      <h3 className="text-2xl font-bold">
                        Original Repositories
                      </h3>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                        {repos.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {repos.map((repo) => (
                        <a
                          key={repo.name}
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-4 rounded-lg ${
                            darkMode
                              ? "bg-gray-700 hover:bg-gray-600"
                              : "bg-gray-50 hover:bg-gray-100"
                          } transition-colors duration-200 group`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Book className="w-5 h-5 text-blue-500" />
                            <span className="font-medium group-hover:text-blue-500 transition-colors duration-200">
                              {repo.name}
                            </span>
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {repo.full_name}
                          </p>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )
            ))}

          {/* Commit Information Section */}
          {user &&
            !loadingRepos &&
            repos.some((repo) => repo.commits?.length) && (
              <div
                className={`rounded-xl shadow-lg overflow-hidden ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <GitCommit className="w-6 h-6 text-purple-500" />
                    <h3 className="text-2xl font-bold">Recent Commits</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {repos.map(
                      (repo) =>
                        repo.commits?.length && (
                          <div
                            key={repo.name}
                            className={`p-4 rounded-lg ${
                              darkMode ? "bg-gray-700" : "bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-4">
                              <Book className="w-5 h-5 text-purple-500" />
                              <a
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-lg hover:text-purple-500 transition-colors duration-200 flex items-center gap-1"
                              >
                                {repo.name}
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>

                            <div className="space-y-4">
                              {repo.commits.map((commit, index) => (
                                <div
                                  key={commit.sha}
                                  className={`p-4 rounded-lg ${
                                    darkMode ? "bg-gray-800" : "bg-white"
                                  } border ${
                                    darkMode
                                      ? "border-gray-600"
                                      : "border-gray-200"
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <GitCommit className="w-5 h-5 text-purple-500 mt-1" />
                                    <div className="flex-1">
                                      <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-2">
                                            <MessageSquare className="w-4 h-4 text-gray-400" />
                                            <p className="font-medium text-gray-700 dark:text-gray-300">
                                              {commit.message}
                                            </p>
                                          </div>
                                          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                                            <div>
                                              <span className="font-medium">
                                                Author:
                                              </span>{" "}
                                              {commit.author.name}{" "}
                                              <a
                                                href={`mailto:${commit.author.email}`}
                                                className="text-purple-500 hover:text-purple-600"
                                              >
                                                ({commit.author.email})
                                              </a>
                                            </div>
                                            <div>
                                              <span className="font-medium">
                                                Date:
                                              </span>{" "}
                                              {formatDate(commit.author.date)}
                                            </div>
                                            {commit.author.email !==
                                              commit.committer.email && (
                                              <div>
                                                <span className="font-medium">
                                                  Committed by:
                                                </span>{" "}
                                                {commit.committer.name}{" "}
                                                <a
                                                  href={`mailto:${commit.committer.email}`}
                                                  className="text-purple-500 hover:text-purple-600"
                                                >
                                                  ({commit.committer.email})
                                                </a>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                          #{repo.commits.length - index}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default App;
