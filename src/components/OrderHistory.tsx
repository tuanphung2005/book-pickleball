import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendar, faBan, faStar, faHourglassHalf, faCheckCircle } from '@fortawesome/free-solid-svg-icons';


import { API_BASE_URL } from '../config';
interface Booking {
  id: number;
  playgroundId: number;
  playgroundName: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  rated: boolean;
}

export const OrderHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: number) => {
    if (!window.confirm('Bạn có chắc muốn hủy đặt sân này không?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }


      fetchBookings();
    } catch (err) {
      console.error('Error cancelling booking:', err);
    }
  };

  const handleRate = async (bookingId: number, playgroundId: number, rating: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/playgrounds/${playgroundId}/rating`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          rating,
          bookingId
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update rating');
      }

      // Refresh bookings to show updated rating status
      fetchBookings();

    } catch (err) {
      console.error('Error rating playground:', err);
      alert('Không thể đánh giá sân. Vui lòng thử lại sau.');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Lịch sử đặt sân</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{booking.playgroundName}</h3>
                <p className="text-gray-600">
                  <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                  {new Date(booking.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <FontAwesomeIcon icon={faClock} className="mr-2" />
                  {booking.timeStart} - {booking.timeEnd}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`
                    inline-flex items-center px-2 py-1 rounded text-sm mt-2
                    ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                    ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    <FontAwesomeIcon 
                      icon={
                        booking.status === 'confirmed' ? faCheckCircle :
                        booking.status === 'pending' ? faHourglassHalf :
                        faBan
                      } 
                      className="mr-2" 
                    />
                    {booking.status === 'confirmed' && 'Đã xác nhận'}
                    {booking.status === 'pending' && 'Đang chờ'}
                    {booking.status === 'cancelled' && 'Đã hủy'}
                  </span>
                  
                  {booking.status === 'confirmed' && (
                    <span className={`inline-flex items-center px-2 py-1 rounded text-sm mt-2 ${
                      booking.rated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      <FontAwesomeIcon icon={faStar} className="mr-1" />
                      {booking.rated ? 'Đã đánh giá' : 'Chưa đánh giá'}
                    </span>
                  )}
                </div>
                
                {booking.status === 'confirmed' && !booking.rated && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Đánh giá sân:</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRate(booking.id, booking.playgroundId, star)}
                          className="text-yellow-400 hover:text-yellow-500"
                        >
                          <FontAwesomeIcon icon={faStar} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {booking.status === 'pending' && (
                <button
                  onClick={() => handleCancel(booking.id)}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  title="Hủy đặt sân"
                >
                  Hủy đặt
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};