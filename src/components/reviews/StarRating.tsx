import React from 'react';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: '1rem', md: '1.5rem', lg: '2rem' };

const StarRating: React.FC<StarRatingProps> = ({ value, onChange, readonly = false, size = 'md' }) => {
  return (
    <div style={{ display: 'inline-flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="material-symbols-outlined"
          style={{
            fontSize: sizes[size],
            color: star <= value ? '#f59e0b' : 'var(--on-surface-variant, #9ca3af)',
            cursor: readonly ? 'default' : 'pointer',
            fontVariationSettings: star <= value ? "'FILL' 1" : "'FILL' 0",
            transition: 'color 0.15s, font-variation-settings 0.15s',
          }}
          onClick={() => !readonly && onChange?.(star)}
        >
          star
        </span>
      ))}
    </div>
  );
};

export default StarRating;
