"use client";

import { useState } from "react";
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
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Reviews ({reviewsCount})
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Add a Review
          </button>
        )}
      </div>
      {showForm && (
        <ReviewForm
          buildingName={buildingName}
          onCancel={() => setShowForm(false)}
          onSubmit={() => setShowForm(false)}
        />
      )}
      {children}
    </div>
  );
}

