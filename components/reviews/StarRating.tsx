"use client";

import { useState } from "react";

type StarRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
};

export default function StarRating({
  value,
  onChange,
  readOnly = false,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = (rating: number) => {
    if (!readOnly && onChange) {
      // If clicking the same star that's already selected, reset to 0
      if (value === rating) {
        onChange(0);
      } else {
        onChange(rating);
      }
    }
  };

  // Use hover value for preview, or actual value if not hovering
  const displayValue = hoverValue > 0 ? hoverValue : value;

  return (
    <div
      className="flex gap-1"
      onMouseLeave={() => !readOnly && setHoverValue(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isSelected = star <= displayValue;
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            disabled={readOnly}
            className={`text-2xl transition-colors ${
              isSelected
                ? "text-yellow-400"
                : "text-gray-300"
            } ${!readOnly ? "cursor-pointer" : "cursor-default"}`}
          >
            {isSelected ? "★" : "☆"}
          </button>
        );
      })}
    </div>
  );
}

