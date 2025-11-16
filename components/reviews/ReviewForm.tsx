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
  const [formData, setFormData] = useState({
    overall: 0,
    location: 0,
    distance: 0,
    social: 0,
    noise: 0,
    clean: 0,
    text: "",
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [formData.text]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.overall === 0 ||
      formData.location === 0 ||
      formData.distance === 0 ||
      formData.social === 0 ||
      formData.noise === 0 ||
      formData.clean === 0
    ) {
      alert("Please rate all categories");
      return;
    }
    // TODO: Implement form submission
    console.log("Submit review:", { buildingName, ...formData });
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="border-2 border-gray-300 rounded-lg p-4 mb-8 bg-white max-w-4xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Write a Review
      </h3>
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Leave a comment (optional)
          </label>
          <textarea
            ref={textareaRef}
            value={formData.text}
            onChange={(e) =>
              setFormData({ ...formData, text: e.target.value })
            }
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none overflow-hidden"
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
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

