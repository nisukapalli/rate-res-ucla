"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReviewForm from "./ReviewForm";

type ReviewsSectionProps = {
  buildingName: string;
  reviewsCount: number;
  children: React.ReactNode;
};

export default function ReviewsSection({
  buildingName,
  reviewsCount,
  children,
}: ReviewsSectionProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  useEffect(() => {
    checkAuthAndReview();
  }, []);

  const checkAuthAndReview = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const { user } = await response.json();
        setIsAuthenticated(true);

        // Check if user has already reviewed this building
        const reviewsResponse = await fetch(`/api/users/${user.id}/reviews`);
        if (reviewsResponse.ok) {
          const reviews = await reviewsResponse.json();
          const hasReviewed = reviews.some((review: any) => review.building === buildingName);
          setUserHasReviewed(hasReviewed);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    }
  };

  const handleAddReviewClick = () => {
    if (isAuthenticated === false) {
      router.push('/login');
    } else {
      setShowForm(true);
    }
  };

  const handleReviewSubmit = () => {
    setShowForm(false);
    setUserHasReviewed(true);
    // Reload the page to show the new review
    router.refresh();
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Reviews ({reviewsCount})
        </h2>
        {!showForm && !userHasReviewed && (
          <button
            onClick={handleAddReviewClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
          >
            Add a Review
          </button>
        )}
        {userHasReviewed && (
          <span className="text-sm text-green-600 font-medium">
            ✓ You've reviewed this building
          </span>
        )}
      </div>
      {showForm && (
        <ReviewForm
          key={buildingName}
          buildingName={buildingName}
          onCancel={() => setShowForm(false)}
          onSubmit={handleReviewSubmit}
        />
      )}
      {children}
    </div>
  );
}

