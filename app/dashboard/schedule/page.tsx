'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SchedulePage() {
  const [series, setSeries] = useState('POV');
  const [frequency, setFrequency] = useState('daily');
  const [timeOfDay, setTimeOfDay] = useState('10:00');
  const [scheduling, setScheduling] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSchedule = async () => {
    setScheduling(true);
    setResult(null);

    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seriesName: series,
          frequency,
          timeOfDay,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error scheduling posts:', error);
      setResult({ error: 'Failed to schedule posts' });
    } finally {
      setScheduling(false);
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
            Schedule Posts
          </h1>
          <p className="text-calm-600">Set up automatic posting schedule</p>
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
              <label className="block text-calm-700 mb-2">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-calm-200 focus:border-sage-400 focus:outline-none"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
              </select>
            </div>

            <div>
              <label className="block text-calm-700 mb-2">Time of Day</label>
              <input
                type="time"
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-calm-200 focus:border-sage-400 focus:outline-none"
              />
            </div>

            <button
              onClick={handleSchedule}
              disabled={scheduling}
              className="w-full px-6 py-4 bg-sage-500 hover:bg-sage-600 text-white rounded-xl transition-colors disabled:opacity-50"
            >
              {scheduling ? 'Scheduling...' : 'Schedule Posts'}
            </button>
          </div>

          {result && (
            <div className="mt-8 pt-8 border-t border-calm-200">
              {result.error ? (
                <div className="text-red-600">{result.error}</div>
              ) : (
                <div>
                  <h3 className="text-xl font-light text-calm-800 mb-4">
                    {result.message}
                  </h3>
                  <p className="text-calm-600">
                    Posts have been scheduled and will be published automatically
                    at the specified times.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
