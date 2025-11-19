"use client";

import { useState, useRef, useEffect } from "react";
import StarRating from "./StarRating";

type ReviewFormProps = {
  buildingName: string;
  onCancel?: () => void;
  onSubmit?: () => void;
};

export default function ReviewForm({
  buildingName,
  onCancel,
  onSubmit,
}: ReviewFormProps) {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    overall: 0,
    location: 0,
    distance: 0,
    social: 0,
    noise: 0,
    clean: 0,
    text: "",
    yearStart: currentYear,
    yearEnd: currentYear,
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [formData.text]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      formData.overall === 0 ||
      formData.location === 0 ||
      formData.distance === 0 ||
      formData.social === 0 ||
      formData.noise === 0 ||
      formData.clean === 0
    ) {
      setError("Please rate all categories");
      return;
    }

    if (formData.yearStart < 1919 || formData.yearStart > currentYear) {
      setError(`Start year must be between 1919 and ${currentYear}`);
      return;
    }

    if (formData.yearEnd < 1919 || formData.yearEnd > currentYear + 1) {
      setError(`End year must be between 1919 and ${currentYear + 1}`);
      return;
    }

    if (formData.yearStart > formData.yearEnd) {
      setError("Start year cannot be after end year");
      return;
    }

    if (formData.yearEnd - formData.yearStart > 4) {
      setError("You cannot have lived in a building for more than 4 years");
      return;
    }

    setSubmitting(true);

    try {
      // First, get the current user
      const authResponse = await fetch('/api/auth/me');
      if (!authResponse.ok) {
        setError("You must be logged in to submit a review");
        setSubmitting(false);
        return;
      }
      
      const { user } = await authResponse.json();

      // Submit the review
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          building: buildingName,
          overall: formData.overall,
          location: formData.location,
          distance: formData.distance,
          social: formData.social,
          noise: formData.noise,
          clean: formData.clean,
          text: formData.text || null,
          yearStart: formData.yearStart,
          yearEnd: formData.yearEnd,
          authorId: user.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit review');
      }

      // Success - reset form
      setFormData({
        overall: 0,
        location: 0,
        distance: 0,
        social: 0,
        noise: 0,
        clean: 0,
        text: "",
        yearStart: currentYear,
        yearEnd: currentYear,
      });

      if (onSubmit) {
        onSubmit();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-2 border-gray-300 rounded-lg p-4 mb-8 bg-white max-w-4xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Write a Review
      </h3>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Overall
            </label>
            <StarRating
              value={formData.overall}
              onChange={(value) =>
                setFormData({ ...formData, overall: value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <StarRating
              value={formData.location}
              onChange={(value) =>
                setFormData({ ...formData, location: value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Distance from Campus
            </label>
            <StarRating
              value={formData.distance}
              onChange={(value) =>
                setFormData({ ...formData, distance: value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Social Activity
            </label>
            <StarRating
              value={formData.social}
              onChange={(value) =>
                setFormData({ ...formData, social: value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Noise Level
            </label>
            <StarRating
              value={formData.noise}
              onChange={(value) =>
                setFormData({ ...formData, noise: value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cleanliness
            </label>
            <StarRating
              value={formData.clean}
              onChange={(value) =>
                setFormData({ ...formData, clean: value })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year Started
            </label>
            <input
              type="number"
              value={formData.yearStart}
              onChange={(e) =>
                setFormData({ ...formData, yearStart: parseInt(e.target.value) || currentYear })
              }
              min="1919"
              max={currentYear}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year Ended
            </label>
            <input
              type="number"
              value={formData.yearEnd}
              onChange={(e) =>
                setFormData({ ...formData, yearEnd: parseInt(e.target.value) || currentYear })
              }
              min="1919"
              max={currentYear + 1}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Leave a comment (optional). Share more details about your experience.
          </label>
          <textarea
            ref={textareaRef}
            value={formData.text}
            onChange={(e) =>
              setFormData({ ...formData, text: e.target.value })
            }
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none overflow-hidden text-gray-900"
            rows={2}
            style={{ minHeight: "60px" }}
          />
        </div>
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => {
              setFormData({
                overall: 0,
                location: 0,
                distance: 0,
                social: 0,
                noise: 0,
                clean: 0,
                text: "",
                yearStart: currentYear,
                yearEnd: currentYear,
              });
              if (textareaRef.current) {
                textareaRef.current.style.height = "60px";
              }
              if (onCancel) {
                onCancel();
              }
            }}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}

