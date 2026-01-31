'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function GeneratePage() {
  const [series, setSeries] = useState('POV');
  const [contentType, setContentType] = useState('reel');
  const [count, setCount] = useState(5);
  const [theme, setTheme] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setResult(null);

    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seriesName: series,
          contentType,
          theme: theme || undefined,
          count,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error generating content:', error);
      setResult({ error: 'Failed to generate content' });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-calm-50 to-sage-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="text-calm-600 hover:text-calm-800 mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-light text-calm-800 mb-2">
            Generate Content
          </h1>
          <p className="text-calm-600">Create AI-powered Instagram content</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-sage-100">
          <div className="space-y-6">
            <div>
              <label className="block text-calm-700 mb-2">Content Series</label>
              <select
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-calm-200 focus:border-sage-400 focus:outline-none"
              >
                <option value="POV">POV</option>
                <option value="soft_life">Soft Life</option>
                <option value="truth_bombs">Truth Bombs</option>
              </select>
            </div>

            <div>
              <label className="block text-calm-700 mb-2">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-calm-200 focus:border-sage-400 focus:outline-none"
              >
                <option value="reel">Reel</option>
                <option value="carousel">Carousel</option>
              </select>
            </div>

            <div>
              <label className="block text-calm-700 mb-2">Number of Posts</label>
              <input
                type="number"
                min="1"
                max="20"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-lg border border-calm-200 focus:border-sage-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-calm-700 mb-2">
                Theme (Optional)
              </label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g., morning routine, mindfulness"
                className="w-full px-4 py-3 rounded-lg border border-calm-200 focus:border-sage-400 focus:outline-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full px-6 py-4 bg-sage-500 hover:bg-sage-600 text-white rounded-xl transition-colors disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate Content'}
            </button>
          </div>

          {result && (
            <div className="mt-8 pt-8 border-t border-calm-200">
              {result.error ? (
                <div className="text-red-600">{result.error}</div>
              ) : (
                <div>
                  <h3 className="text-xl font-light text-calm-800 mb-4">
                    Generated {result.posts.length} posts
                  </h3>
                  <div className="space-y-4">
                    {result.posts.map((post: any, index: number) => (
                      <div
                        key={post.id}
                        className="p-4 bg-sage-50 rounded-lg"
                      >
                        <div className="text-sm text-calm-500 mb-2">
                          Post #{index + 1}
                        </div>
                        <p className="text-calm-700">{post.caption}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
