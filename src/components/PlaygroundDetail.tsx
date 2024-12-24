import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFutbol, faMapMarkerAlt, faStar, faTableTennis, faTimes, faBasketball, faCalendarPlus, faLocationArrow, faFlag, faPhone } from '@fortawesome/free-solid-svg-icons';
import { Playground } from '../types/playground';
import { useState } from 'react';
import BookingForm from './BookingForm';

import { API_BASE_URL } from '../config';

interface PlaygroundDetailProps {
  playground: Playground;
  onClose: () => void;
  isLoggedIn?: boolean;
}

export const PlaygroundDetail = ({ playground, onClose, isLoggedIn }: PlaygroundDetailProps) => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const getTypeIcon = (type: 'football' | 'pickleball' | 'badminton' | 'basketball') => {
    switch(type) {
      case 'football':
        return faFutbol;
      case 'pickleball':
        return faTableTennis;
      case 'badminton':
        return faTableTennis;
      case 'basketball':
        return faBasketball;
    }
  };

  const handleBooking = () => {
    if (!isLoggedIn) {
      alert('Vui lòng đăng nhập để đặt sân');
      return;
    }
    setShowBookingForm(true);
  };

  const handleReport = async () => {
    if (!isLoggedIn) {
      alert('Vui lòng đăng nhập để báo cáo sân');
      return;
    }
    setShowReportForm(true);
  };

  const submitReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/playgrounds/${playground.id}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: reportReason })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      alert('Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét vấn đề này.');
      setShowReportForm(false);
      setReportReason('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    }
  };

  const openInGoogleMaps = () => {
    const encodedAddress = encodeURIComponent(playground.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  return (
    <>
  
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full relative">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 z-10 bg-red-400 px-1.5 py-1 rounded-full shadow-md"
            aria-label="Close"
          >
            <FontAwesomeIcon 
              icon={faTimes} 
              className="text-white text-xl"
            />
          </button>
          
          <div className="p-6">
            <img 
              src={playground.imageUrl} 
              alt={playground.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            
            <h2 className="text-2xl font-bold mb-4">{playground.name}</h2>
            
            <div className="space-y-2">
              <p className="flex items-center text-gray-700">
                <FontAwesomeIcon icon={getTypeIcon(playground.type)} className="mr-2" />
                {playground.type}
              </p>
              
              <div className="flex items-center justify-between">
                <p className="flex items-center text-gray-700">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                  {playground.address}
                </p>
                <button 
                  onClick={openInGoogleMaps}
                  className="ml-2 px-3 py-1 text-blue-500 hover:text-blue-600 bg-blue-50 rounded-lg flex items-center"
                  title="Mở trong Google Maps"
                >
                  <FontAwesomeIcon icon={faLocationArrow} className="mr-1" />
                  Chỉ đường
                </button>
              </div>

              {/* Add phone number display */}
              <p className="flex items-center text-gray-700">
                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                {playground.ownerPhone}
              </p>
              
              <p className="flex items-center text-amber-500">
                <FontAwesomeIcon icon={faStar} className="mr-2" />
                {playground.rating}
              </p>

              {playground.description && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {playground.description}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={handleBooking}
                  className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors mr-2"
                >
                  <FontAwesomeIcon icon={faCalendarPlus} className="mr-2" />
                  Đặt sân
                </button>
                <button
                  onClick={handleReport}
                  className="px-4 py-3 text-red-500 hover:text-red-600 rounded-lg border border-red-500 hover:border-red-600"
                  title="Báo cáo sân này"
                >
                  <FontAwesomeIcon icon={faFlag} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBookingForm && (
        <BookingForm 
          playground={playground} 
          onClose={() => setShowBookingForm(false)} 
        />
      )}

      {showReportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Báo cáo sân</h3>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Lý do báo cáo..."
              className="w-full h-32 border rounded-lg p-2 mb-4"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowReportForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                Hủy
              </button>
              <button
                onClick={submitReport}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Gửi báo cáo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};