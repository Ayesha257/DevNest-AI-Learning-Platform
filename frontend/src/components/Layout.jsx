// src/components/Layout.jsx
import React from "react";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Optional: Add navbar here if you want */}
      {/* <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">DevNest</h1>
        </div>
      </nav> */}
      
      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
}