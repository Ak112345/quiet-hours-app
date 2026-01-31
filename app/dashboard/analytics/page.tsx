'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Analytics {
  summary: {
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    totalViews: number;
    avgEngagement: string;
  };
  recentAnalytics: any[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch('/api/analytics');
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 via-calm-50 to-sage-100 flex items-center justify-center">
        <div className="text-calm-600 text-lg">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-calm-50 to-sage-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="text-calm-600 hover:text-calm-800 mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-light text-calm-800 mb-2">Analytics</h1>
          <p className="text-calm-600">Track your content performance</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-sage-100">
            <div className="text-calm-500 text-sm mb-1">Total Posts</div>
            <div className="text-3xl font-light text-calm-800">
              {analytics?.summary.totalPosts || 0}
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-sage-100">
            <div className="text-calm-500 text-sm mb-1">Total Likes</div>
            <div className="text-3xl font-light text-calm-800">
              {analytics?.summary.totalLikes || 0}
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-sage-100">
            <div className="text-calm-500 text-sm mb-1">Comments</div>
            <div className="text-3xl font-light text-calm-800">
              {analytics?.summary.totalComments || 0}
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-sage-100">
            <div className="text-calm-500 text-sm mb-1">Total Views</div>
            <div className="text-3xl font-light text-calm-800">
              {analytics?.summary.totalViews || 0}
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-sage-100">
            <div className="text-calm-500 text-sm mb-1">Avg Engagement</div>
            <div className="text-3xl font-light text-calm-800">
              {analytics?.summary.avgEngagement || '0'}%
            </div>
          </div>
        </div>

        {/* Recent Analytics Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-sage-100">
          <h2 className="text-2xl font-light text-calm-800 mb-6">
            Recent Posts Performance
          </h2>
          {analytics?.recentAnalytics && analytics.recentAnalytics.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-calm-200">
                    <th className="text-left py-3 px-4 text-calm-600 font-normal">
                      Series
                    </th>
                    <th className="text-left py-3 px-4 text-calm-600 font-normal">
                      Likes
                    </th>
                    <th className="text-left py-3 px-4 text-calm-600 font-normal">
                      Comments
                    </th>
                    <th className="text-left py-3 px-4 text-calm-600 font-normal">
                      Views
                    </th>
                    <th className="text-left py-3 px-4 text-calm-600 font-normal">
                      Engagement
                    </th>
                    <th className="text-left py-3 px-4 text-calm-600 font-normal">
                      Fetched
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentAnalytics.map((item: any) => (
                    <tr key={item.id} className="border-b border-calm-100">
                      <td className="py-3 px-4 text-calm-700">
                        {item.post.series.name}
                      </td>
                      <td className="py-3 px-4 text-calm-700">{item.likes}</td>
                      <td className="py-3 px-4 text-calm-700">
                        {item.comments}
                      </td>
                      <td className="py-3 px-4 text-calm-700">{item.views}</td>
                      <td className="py-3 px-4 text-calm-700">
                        {item.engagement.toFixed(2)}%
                      </td>
                      <td className="py-3 px-4 text-calm-700">
                        {new Date(item.fetchedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-calm-500 text-center py-8">
              No analytics data available yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
