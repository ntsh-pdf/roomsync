
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure axios is imported for local fetch events
import BookingForm from '../components/BookingForm';
import LiveManifest from '../components/LiveManifest';
import ReservationsList from '../components/ReservationsList';

export default function BookingPage() {
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedResourceId, setSelectedResourceId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Navigation active tab layout state ('form' or 'ledger')
  const [activeTab, setActiveTab] = useState('form');

  const [currentUserId, setCurrentUserId] = useState(1);
  const API_URL = 'http://localhost:5000/api';

  // Fetch rooms and existing bookings from backend on mount
  const fetchInitialData = async () => {
    try {
      const resRooms = await axios.get(`${API_URL}/resources`);
      setResources(resRooms.data);

      const resBookings = await axios.get(`${API_URL}/bookings`);
      setBookings(resBookings.data);
    } catch (err) {
      console.error("Could not fetch network data structures:", err);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const selectedResource = resources.find(r => r.id === parseInt(selectedResourceId));

  // Create new booking handler
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);

    if (new Date(startTime) >= new Date(endTime)) {
      setError('Invalid Schedule: The end time must occur after the start time.');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        user_id: currentUserId,
        resource_id: parseInt(selectedResourceId),
        start_time: startTime,
        end_time: endTime
      };

      await axios.post(`${API_URL}/bookings`, payload);
      setMessage('Reservation securely confirmed and committed!');
      
      // Clear fields
      setSelectedResourceId('');
      setStartTime('');
      setEndTime('');
      
      setCurrentUserId((prevId) => {
        if (prevId === 1) return 2;
        if (prevId === 2) return 3;
        if (prevId === 3) return 4;
        return 1; // Resets back to 1 creating a simple round-robin user simulation
      });

      // Refresh list from database immediately so new booking shows up
      fetchInitialData();
    } catch (err) {
      setError(err.response?.data?.error || 'A scheduling conflict occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Terminate/Delete booking handler
  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.delete(`${API_URL}/bookings/${bookingId}`);
      setMessage('Reservation successfully terminated.');
      // Refresh local array state automatically
      fetchInitialData();
    } catch (err) {
      setError('Failed to safely remove booking transaction block.');
    }
  };

  return (
    <div className="w-full space-y-8">
      
      {/* Visual Navigation Subheader Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-px">
        <button 
          onClick={() => { setActiveTab('form'); setMessage(''); setError(''); }}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeTab === 'form' ? 'border-indigo-500 text-white bg-indigo-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          📝 Book a Space
        </button>
        <button 
          onClick={() => { setActiveTab('ledger'); setMessage(''); setError(''); }}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all cursor-pointer relative ${activeTab === 'ledger' ? 'border-indigo-500 text-white bg-indigo-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          📊 Reservations Ledger
          {bookings.length > 0 && (
            <span className="ml-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] px-1.5 py-0.5 rounded-full font-mono">
              {bookings.length}
            </span>
          )}
        </button>
      </div>

      {/* Global Status Messaging */}
      {(message || error) && (
        <div className="animation-fade-in">
          {message && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-sm font-medium rounded-xl flex items-center space-x-3">
              <span>✨</span><span>{message}</span>
            </div>
          )}
          {error && (
            <div className="p-4 bg-rose-950/40 border border-rose-500/30 text-rose-300 text-sm font-medium rounded-xl flex items-center space-x-3">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}
        </div>
      )}

      {/* Dynamic Render Switch Condition */}
      {activeTab === 'form' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          <div className="lg:col-span-7 w-full">
            <BookingForm 
              resources={resources}
              selectedResourceId={selectedResourceId}
              setSelectedResourceId={setSelectedResourceId}
              startTime={startTime}
              setStartTime={setStartTime}
              endTime={endTime}
              setEndTime={setEndTime}
              handleBookingSubmit={handleBookingSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
          <div className="lg:col-span-5 space-y-6 w-full">
            <LiveManifest 
              selectedResource={selectedResource}
              startTime={startTime}
              endTime={endTime}
            />
          </div>
        </div>
      ) : (
        <div className="w-full">
          <ReservationsList bookings={bookings} onCancelBooking={handleCancelBooking} />
        </div>
      )}

    </div>
  );
}