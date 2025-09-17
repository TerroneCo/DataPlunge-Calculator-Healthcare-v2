import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <img 
            src="/DataPlunge Logo.svg" 
            alt="DataPlunge Logo" 
            className="h-12 w-auto"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Welcome to Your App
        </h1>
        <p className="text-gray-600 text-center">
          Start prompting (or editing) to see magic happen :)
        </p>
      </div>
    </div>
  );
}

export default App;