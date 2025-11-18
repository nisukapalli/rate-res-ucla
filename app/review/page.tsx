'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReviewForm from '@/components/reviews/ReviewForm';

interface Building {
  id: number;
  name: string;
  address: string;
  type: string;
}

export default function ReviewPage() {
  const router = useRouter();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [reviewedBuildings, setReviewedBuildings] = useState<Set<string>>(new Set());

  useEffect(() => {
    checkAuthAndLoadBuildings();
  }, []);

  const checkAuthAndLoadBuildings = async () => {
    try {
      // Check if user is logged in
      const authResponse = await fetch('/api/auth/me');
      if (!authResponse.ok) {
        router.push('/login');
        return;
      }
      const { user } = await authResponse.json();
      setUser(user);

      // Load buildings
      const buildingsResponse = await fetch('/api/buildings');
      if (buildingsResponse.ok) {
        const data = await buildingsResponse.json();
        setBuildings(data);
      }

      // Load user's existing reviews to see which buildings they've already reviewed
      const reviewsResponse = await fetch(`/api/users/${user.id}/reviews`);
      if (reviewsResponse.ok) {
        const reviews = await reviewsResponse.json();
        const buildingNames = new Set<string>(reviews.map((review: any) => review.building as string));
        setReviewedBuildings(buildingNames);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = () => {
    setShowSuccess(true);
    // Add the building to the reviewed set
    setReviewedBuildings(new Set([...reviewedBuildings, selectedBuilding]));
    setSelectedBuilding('');
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Write a Review</h1>
          <p className="text-gray-600">Share your housing experience with the UCLA community</p>
        </div>

        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium">
              ✓ Review submitted successfully! Thank you for your feedback.
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <label htmlFor="building" className="block text-lg font-semibold text-gray-900 mb-3">
            Select a Building
          </label>
          <select
            id="building"
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base text-gray-900"
          >
            <option value="">-- Choose a building --</option>
            {buildings.map((building) => {
              const alreadyReviewed = reviewedBuildings.has(building.name);
              return (
                <option 
                  key={building.id} 
                  value={building.name}
                  disabled={alreadyReviewed}
                >
                  {building.name}
                  {alreadyReviewed ? ' - Already Reviewed ✓' : ''}
                </option>
              );
            })}
          </select>
          {reviewedBuildings.size > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              You've reviewed {reviewedBuildings.size} building{reviewedBuildings.size !== 1 ? 's' : ''} so far
            </p>
          )}
        </div>

        {selectedBuilding && (
          <ReviewForm
            key={selectedBuilding}
            buildingName={selectedBuilding}
            onSubmit={handleReviewSubmit}
            onCancel={() => setSelectedBuilding('')}
          />
        )}

        {!selectedBuilding && (
          <div className="text-center py-12">
            <p className="text-gray-500">Select a building above to start your review</p>
          </div>
        )}
      </div>
    </div>
  );
}
