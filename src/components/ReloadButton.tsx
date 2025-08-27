'use client';

import React from 'react';

interface ReloadButtonProps {
  errorMessage: string;
}

const ReloadButton: React.FC<ReloadButtonProps> = ({ errorMessage }) => {
  return (
    <div className="text-red-600 text-center">
      <p>{errorMessage}</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => window.location.reload()}
      >
        Tentar Novamente
      </button>
    </div>
  );
};

export default ReloadButton;
