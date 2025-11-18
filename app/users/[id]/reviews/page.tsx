'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StarRating from '@/components/reviews/StarRating';

interface Review {
  id: number;
  building: string;
  overall: number;
  location: number;
  distance: number;
  social: number;
  noise: number;
  clean: number;
  text: string | null;
  createdAt: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  class: number;
}

export default function MyReviewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [userId, setUserId] = useState<string>('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Review>>({});

  useEffect(() => {
    params.then((p) => {
      setUserId(p.id);
      loadUserAndReviews(p.id);
    });
  }, []);

  const loadUserAndReviews = async (id: string) => {
    try {
      // Check authentication
      const authResponse = await fetch('/api/auth/me');
      if (!authResponse.ok) {
        router.push('/login');
        return;
      }

      const { user: currentUser } = await authResponse.json();
      
      // Verify user is viewing their own reviews
      if (currentUser.id !== parseInt(id)) {
        setError('You can only view your own reviews');
        setLoading(false);
        return;
      }

      setUser(currentUser);

      // Fetch user's reviews
      const reviewsResponse = await fetch(`/api/users/${id}/reviews`);
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
      } else {
        setError('Failed to load reviews');
      }
    } catch (err) {
      setError('An error occurred while loading your reviews');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId: number) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the review from state
        setReviews(reviews.filter((r) => r.id !== reviewId));
        setDeleteConfirm(null);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete review');
      }
    } catch (err) {
      setError('An error occurred while deleting the review');
      console.error('Delete error:', err);
    }
  };

  const startEdit = (review: Review) => {
    setEditingReviewId(review.id);
    setEditForm({
      overall: review.overall,
      location: review.location,
      distance: review.distance,
      social: review.social,
      noise: review.noise,
      clean: review.clean,
      text: review.text || '',
    });
  };

  const handleUpdate = async (reviewId: number) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const updatedReview = await response.json();
        // Update the review in state
        setReviews(reviews.map((r) => (r.id === reviewId ? updatedReview : r)));
        setEditingReviewId(null);
        setEditForm({});
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update review');
      }
    } catch (err) {
      setError('An error occurred while updating the review');
      console.error('Update error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
        <p className="text-gray-600">Loading your reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Reviews</h1>
          {user && (
            <p className="text-gray-600">
              {user.username} • Class of {user.class} • {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600 mb-4">You haven't written any reviews yet</p>
            <Link
              href="/review"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Write Your First Review
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Link
                      href={`/housing/${review.building.replace(/ /g, '_')}`}
                      className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition"
                    >
                      {review.building}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      Reviewed on {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  {editingReviewId !== review.id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(review)}
                        className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
                        title="Edit review"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit
                      </button>
                      {deleteConfirm === review.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-2 text-sm bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(review.id)}
                          className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete review"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {editingReviewId === review.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      {['overall', 'location', 'distance', 'social', 'noise', 'clean'].map((field) => (
                        <div key={field}>
                          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                            {field === 'distance' ? 'Distance' : field}:
                          </label>
                          <StarRating
                            value={editForm[field as keyof typeof editForm] as number || 0}
                            onChange={(value) => setEditForm({ ...editForm, [field]: value })}
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Comment (optional):
                      </label>
                      <textarea
                        value={editForm.text || ''}
                        onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        rows={3}
                        placeholder="Add your comments here..."
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setEditingReviewId(null);
                          setEditForm({});
                        }}
                        className="px-4 py-2 text-sm bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdate(review.id)}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 w-20 font-medium">Overall:</span>
                        <StarRating value={review.overall} readOnly />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 w-20 font-medium">Location:</span>
                        <StarRating value={review.location} readOnly />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 w-20 font-medium">Distance:</span>
                        <StarRating value={review.distance} readOnly />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 w-20 font-medium">Social:</span>
                        <StarRating value={review.social} readOnly />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 w-20 font-medium">Noise:</span>
                        <StarRating value={review.noise} readOnly />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 w-20 font-medium">Clean:</span>
                        <StarRating value={review.clean} readOnly />
                      </div>
                    </div>

                    {review.text && (
                      <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                        <p className="text-gray-800 text-base leading-relaxed italic">
                          "{review.text}"
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/review"
            className="inline-block text-blue-600 hover:underline font-medium"
          >
            ← Write another review
          </Link>
        </div>
      </div>
    </div>
  );
}

