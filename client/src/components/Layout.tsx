import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50/70">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;