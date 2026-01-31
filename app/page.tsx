'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface AnalyticsSummary {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalViews: number;
  avgEngagement: string;
}

interface PostingLog {
  id: string;
  status: string;
  message: string;
  timestamp: string;
  post: {
    series: {
      name: string;
    };
    caption: string;
  };
}

interface ScheduledPost {
  id: string;
  caption: string;
  scheduledFor: string;
  series: {
    name: string;
  };
}

export default function Home() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [recentLogs, setRecentLogs] = useState<PostingLog[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch analytics
        const analyticsRes = await fetch('/api/analytics');
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData.summary);

        // Fetch recent logs
        const logsRes = await fetch('/api/posts/logs');
        const logsData = await logsRes.json();
        setRecentLogs(logsData.logs.slice(0, 5));

        // Fetch scheduled posts
        const scheduleRes = await fetch('/api/schedule');
        const scheduleData = await scheduleRes.json();
        setScheduledPosts(scheduleData.posts.slice(0, 5));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-calm-50 flex items-center justify-center">
        <div className="text-calm-600 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-calm-50 to-sage-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light text-calm-800 mb-2">Quiet Hours</h1>
          <p className="text-calm-600 text-lg">Your content, on autopilot</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-sage-100">
            <div className="text-calm-500 text-sm mb-1">Total Posts</div>
            <div className="text-3xl font-light text-calm-800">{analytics?.totalPosts || 0}</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-sage-100">
            <div className="text-calm-500 text-sm mb-1">Total Likes</div>
            <div className="text-3xl font-light text-calm-800">{analytics?.totalLikes || 0}</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-sage-100">
            <div className="text-calm-500 text-sm mb-1">Comments</div>
            <div className="text-3xl font-light text-calm-800">{analytics?.totalComments || 0}</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-sage-100">
            <div className="text-calm-500 text-sm mb-1">Total Views</div>
            <div className="text-3xl font-light text-calm-800">{analytics?.totalViews || 0}</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-sage-100">
            <div className="text-calm-500 text-sm mb-1">Engagement</div>
            <div className="text-3xl font-light text-calm-800">{analytics?.avgEngagement || '0'}%</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Recent Activity */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-sage-100">
            <h2 className="text-2xl font-light text-calm-800 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentLogs.length > 0 ? (
                recentLogs.map((log) => (
                  <div key={log.id} className="border-l-2 border-sage-300 pl-4 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          log.status === 'success'
                            ? 'bg-sage-100 text-sage-700'
                            : log.status === 'failed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-calm-100 text-calm-700'
                        }`}
                      >
                        {log.status}
                      </span>
                      <span className="text-calm-500 text-sm">
                        {log.post.series.name}
                      </span>
                    </div>
                    <p className="text-calm-600 text-sm mb-1">{log.message}</p>
                    <p className="text-calm-400 text-xs">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-calm-500 text-center py-8">No activity yet</p>
              )}
            </div>
          </div>

          {/* Upcoming Posts */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-sage-100">
            <h2 className="text-2xl font-light text-calm-800 mb-6">Upcoming Posts</h2>
            <div className="space-y-4">
              {scheduledPosts.length > 0 ? (
                scheduledPosts.map((post) => (
                  <div key={post.id} className="border-l-2 border-sage-300 pl-4 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-1 rounded-full text-xs bg-sage-100 text-sage-700">
                        {post.series.name}
                      </span>
                    </div>
                    <p className="text-calm-600 text-sm mb-1 line-clamp-2">
                      {post.caption}
                    </p>
                    <p className="text-calm-400 text-xs">
                      Scheduled for {new Date(post.scheduledFor).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-calm-500 text-center py-8">No scheduled posts</p>
              )}
            </div>
          </div>
        </div>

        {/* Series Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-light text-calm-800 mb-6">Content Series</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SeriesCard
              name="POV"
              description="Point of view content"
              href="/series/POV"
              color="sage"
            />
            <SeriesCard
              name="Soft Life"
              description="Wellness and calm living"
              href="/series/soft_life"
              color="calm"
            />
            <SeriesCard
              name="Truth Bombs"
              description="Impactful insights"
              href="/series/truth_bombs"
              color="sage"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-sage-100">
          <h2 className="text-2xl font-light text-calm-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/generate"
              className="px-6 py-4 bg-sage-500 hover:bg-sage-600 text-white rounded-xl transition-colors text-center"
            >
              Generate Content
            </Link>
            <Link
              href="/dashboard/schedule"
              className="px-6 py-4 bg-calm-500 hover:bg-calm-600 text-white rounded-xl transition-colors text-center"
            >
              Schedule Posts
            </Link>
            <Link
              href="/dashboard/analytics"
              className="px-6 py-4 bg-sage-500 hover:bg-sage-600 text-white rounded-xl transition-colors text-center"
            >
              View Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SeriesCard({
  name,
  description,
  href,
  color,
}: {
  name: string;
  description: string;
  href: string;
  color: string;
}) {
  return (
    <Link href={href}>
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-sage-100 hover:border-sage-300 transition-all cursor-pointer">
        <h3 className="text-xl font-light text-calm-800 mb-2">{name}</h3>
        <p className="text-calm-600 text-sm">{description}</p>
      </div>
    </Link>
  );
}
