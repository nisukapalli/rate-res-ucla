'use client';

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import StarRating from "@/components/reviews/StarRating";
import ReviewsSection from "@/components/reviews/ReviewsSection";

type TooltipInfo = {
  category: string;
  low: string;
  high: string;
};

const InfoTooltip = ({ info }: { info: TooltipInfo }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <span 
        className="inline-flex items-center justify-center w-4 h-4 text-xs bg-gray-300 text-gray-600 rounded-full cursor-help hover:bg-gray-400 transition-colors"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        i
      </span>
      {showTooltip && (
        <div className="absolute left-6 top-0 z-50 w-56 bg-gray-800 text-white text-xs rounded-lg p-3 shadow-lg">
          <div className="mb-2">
            <strong>1:</strong> {info.low}
          </div>
          <div>
            <strong>5:</strong> {info.high}
          </div>
          <div className="absolute left-0 top-1 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-gray-800 -ml-1"></div>
        </div>
      )}
    </div>
  );
};

type Review = {
  id: number;
  building: string;
  overall: number;
  location: number;
  distance: number;
  social: number;
  noise: number;
  clean: number;
  text: string | null;
  upvotes: number;
  downvotes: number;
  userVote: 'upvote' | 'downvote' | null;
  createdAt: string;
  author: {
    username: string;
    class: number;
  };
};

type Building = {
  id: number;
  name: string;
  address: string;
  type: string;
};

export default function BuildingDetailPage() {
  const params = useParams();
  const nameParam = params.name as string;
  const name = nameParam.replace(/_/g, " ");

  const [building, setBuilding] = useState<Building | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [loading, setLoading] = useState(true);

  const handleVote = async (reviewId: number, voteType: 'upvote' | 'downvote') => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voteType }),
      });

      if (response.ok) {
        const { upvotes, downvotes, userVote } = await response.json();
        setReviews(prevReviews =>
          prevReviews.map(review =>
            review.id === reviewId
              ? { ...review, upvotes, downvotes, userVote }
              : review
          )
        );
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to vote');
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote. Please try again.');
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch building
        const buildingResponse = await fetch(`/api/buildings/${encodeURIComponent(name)}`);
        if (!buildingResponse.ok) {
          setBuilding(null);
          setLoading(false);
          return;
        }
        const buildingData = await buildingResponse.json();
        setBuilding(buildingData);

        // Fetch reviews
        const reviewsResponse = await fetch(`/api/buildings/${encodeURIComponent(name)}/reviews`);
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [name]);

  const sortedReviews = [...reviews].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // Calculate averages
  const calculateAverage = (field: keyof Pick<Review, 'overall' | 'location' | 'distance' | 'social' | 'noise' | 'clean'>) => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review[field], 0);
    return (sum / reviews.length).toFixed(1);
  };

  const averages = {
    overall: calculateAverage('overall'),
    location: calculateAverage('location'),
    distance: calculateAverage('distance'),
    social: calculateAverage('social'),
    noise: calculateAverage('noise'),
    clean: calculateAverage('clean'),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!building) {
    notFound();
  }

  // Get badge color based on building type
  const getBadgeColor = (type: string) => {
    const typeUpper = type.toUpperCase();
    switch (typeUpper) {
      case 'CLASSIC':
        return 'bg-indigo-600 text-white';
      case 'DELUXE':
        return 'bg-yellow-600 text-white';
      case 'PLAZA':
        return 'bg-emerald-500 text-white';
      case 'SUITE':
        return 'bg-fuchsia-500 text-white';
      case 'UNIV_APT':
        return 'bg-teal-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Get progress bar color based on rating value
  const getProgressBarColor = (rating: string | number) => {
    const value = typeof rating === 'string' ? parseFloat(rating) : rating;
    if (value < 1.5) return 'bg-red-600';
    if (value < 2.5) return 'bg-orange-500';
    if (value < 3.5) return 'bg-yellow-500';
    if (value < 4.5) return 'bg-lime-500';
    return 'bg-green-600';
  };

  // Get inverted progress bar color (for noise level where higher = worse)
  const getInvertedProgressBarColor = (rating: string | number) => {
    const value = typeof rating === 'string' ? parseFloat(rating) : rating;
    if (value < 1.5) return 'bg-green-600';
    if (value < 2.5) return 'bg-lime-500';
    if (value < 3.5) return 'bg-yellow-500';
    if (value < 4.5) return 'bg-orange-500';
    return 'bg-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {building.name}
        </h1>
          <p className="text-lg text-gray-600 mb-2">{building.address}</p>
          <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${getBadgeColor(building.type)}`}>
            {building.type}
          </span>
        </div>

        {/* Two Column Layout */}
        <div className="flex gap-8">
          {/* Left Column - Image & Reviews */}
          <div className="flex-1 min-w-0">
            {/* Image Placeholder */}
            <div className="w-full h-64 rounded-lg border-2 border-gray-300 bg-gray-100 flex items-center justify-center mb-8">
              <p className="text-gray-500">Image placeholder</p>
            </div>

        <ReviewsSection buildingName={building.name} reviewsCount={reviews.length}>
              {reviews.length > 0 && (
                <div className="mb-6 flex items-center gap-3">
                  <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              )}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-600">No reviews yet.</p>
            ) : (
                  sortedReviews.map((review: Review) => (
                <div
                  key={review.id}
                      className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <p className="font-semibold text-gray-900">
                      Class of {review.author.class}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-600 font-medium">Overall:</span>
                      <StarRating value={review.overall} readOnly />
                    </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-600 font-medium">Location:</span>
                      <StarRating value={review.location} readOnly />
                    </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-600 font-medium">Distance from Campus:</span>
                      <StarRating value={review.distance} readOnly />
                    </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-600 font-medium">Social Activity:</span>
                      <StarRating value={review.social} readOnly />
                    </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-600 font-medium">Noise Level:</span>
                      <StarRating value={review.noise} readOnly />
                    </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-600 font-medium">Cleanliness:</span>
                      <StarRating value={review.clean} readOnly />
                    </div>
                  </div>
                  {review.text && (
                        <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500 mb-3">
                      <p className="text-gray-800 text-base leading-relaxed italic">
                        "{review.text}"
                      </p>
                    </div>
                  )}
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200">
                        <button
                          className={`flex items-center gap-1.5 transition-colors ${
                            review.userVote === 'upvote' 
                              ? 'text-green-600' 
                              : 'text-green-500 hover:text-green-600'
                          }`}
                          onClick={() => handleVote(review.id, 'upvote')}
                        >
                          {review.userVote === 'upvote' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                          )}
                          <span className="text-sm font-medium">{review.upvotes}</span>
                        </button>
                        <button
                          className={`flex items-center gap-1.5 transition-colors ${
                            review.userVote === 'downvote' 
                              ? 'text-red-600' 
                              : 'text-red-500 hover:text-red-600'
                          }`}
                          onClick={() => handleVote(review.id, 'downvote')}
                        >
                          {review.userVote === 'downvote' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                            </svg>
                          )}
                          <span className="text-sm font-medium">{review.downvotes}</span>
                        </button>
                      </div>
                </div>
              ))
            )}
          </div>
        </ReviewsSection>
          </div>

          {/* Right Column - Sticky Ratings Summary */}
          <div className="w-80 shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <div className="mb-6">
                  <div className={`${getProgressBarColor(averages.overall)} rounded-lg p-6 text-center`}>
                    <div className="text-5xl font-bold text-white mb-2">
                      {averages.overall}
                    </div>
                    <div className="text-sm text-white font-medium">
                      Overall Rating
                    </div>
                    <div className="text-xs text-white opacity-90 mt-1">
                      Based on {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-gray-700">Location</span>
                        <InfoTooltip info={{
                          category: "Location",
                          low: "Far from essential Hill facilities (e.g. dining halls, gym, etc.)",
                          high: "Very close to many Hill facilities"
                        }} />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{averages.location} / 5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${getProgressBarColor(averages.location)} h-2 rounded-full transition-all`}
                        style={{ width: `${(Number(averages.location) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-gray-700">Distance</span>
                        <InfoTooltip info={{
                          category: "Distance",
                          low: "Far from campus (long walk or need transportation)",
                          high: "Very close to campus (short walk)"
                        }} />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{averages.distance} / 5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${getProgressBarColor(averages.distance)} h-2 rounded-full transition-all`}
                        style={{ width: `${(Number(averages.distance) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-gray-700">Social Activity</span>
                        <InfoTooltip info={{
                          category: "Social Activity",
                          low: "Quiet, limited social interaction",
                          high: "Lively, very frequent social interactions"
                        }} />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{averages.social} / 5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${getProgressBarColor(averages.social)} h-2 rounded-full transition-all`}
                        style={{ width: `${(Number(averages.social) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-gray-700">Noise Level</span>
                        <InfoTooltip info={{
                          category: "Noise Level",
                          low: "Very quiet, peaceful environment",
                          high: "Very noisy, frequent disturbances"
                        }} />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{averages.noise} / 5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${getInvertedProgressBarColor(averages.noise)} h-2 rounded-full transition-all`}
                        style={{ width: `${(Number(averages.noise) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-gray-700">Cleanliness</span>
                        <InfoTooltip info={{
                          category: "Cleanliness",
                          low: "Poor cleanliness, often messy or dirty",
                          high: "Very clean, well-maintained facilities"
                        }} />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{averages.clean} / 5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${getProgressBarColor(averages.clean)} h-2 rounded-full transition-all`}
                        style={{ width: `${(Number(averages.clean) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

