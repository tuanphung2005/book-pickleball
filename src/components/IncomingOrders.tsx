import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendar, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

import { API_BASE_URL } from '../config';

interface IncomingBooking {
  id: number;
  playgroundId: number;
  playgroundName: string;
  userName: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export const IncomingOrders = ({ onClose }: { onClose: () => void }) => {
  const [bookings, setBookings] = useState<IncomingBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIncomingBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/bookings/incoming`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching incoming bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (bookingId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        return;
      }
  
      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/confirm`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Không thể xác nhận đơn đặt sân');
      }
  
      alert('Đã xác nhận đơn đặt sân thành công');
      fetchIncomingBookings();
    } catch (err) {
      console.error('Error confirming booking:', err);
      alert('Không thể xác nhận đơn đặt sân. Vui lòng thử lại sau.');
    }
  };

  const handleReject = async (bookingId: number) => {
    if (!window.confirm('Bạn có chắc muốn từ chối đơn đặt sân này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/reject`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reject booking');
      }

      fetchIncomingBookings();
    } catch (err) {
      console.error('Error rejecting booking:', err);
    }
  };

  useEffect(() => {
    fetchIncomingBookings();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2 className="text-xl font-bold mb-4">Đơn đặt sân đang chờ</h2>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{booking.playgroundName}</h3>
                    <p className="text-gray-600">Người đặt: {booking.userName}</p>
                    <p className="text-gray-600">
                      <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                      {new Date(booking.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      <FontAwesomeIcon icon={faClock} className="mr-2" />
                      {booking.timeStart} - {booking.timeEnd}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleConfirm(booking.id)}
                      className="text-green-600 hover:text-green-700 p-2"
                      title="Xác nhận"
                    >
                      <FontAwesomeIcon icon={faCheck} className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleReject(booking.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                      title="Từ chối"
                    >
                      <FontAwesomeIcon icon={faTimes} className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {bookings.length === 0 && (
              <p className="text-gray-500 text-center">Không có đơn đặt sân nào</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};