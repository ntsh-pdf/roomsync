// frontend/src/App.jsx
import React from 'react';
import MainLayout from './layouts/MainLayout';
import BookingPage from './pages/BookingPage';

function App() {
  return (
    <MainLayout>
      <BookingPage />
    </MainLayout>
  );
}

export default App;