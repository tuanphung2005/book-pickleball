import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendar } from '@fortawesome/free-solid-svg-icons';

interface Booking {
  id: number;
  playgroundId: number;
  playgroundName: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export const OrderHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/bookings', {
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
            <h3 className="font-bold">{booking.playgroundName}</h3>
            <p className="text-gray-600">
              <FontAwesomeIcon icon={faCalendar} className="mr-2" />
              {new Date(booking.date).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <FontAwesomeIcon icon={faClock} className="mr-2" />
              {booking.timeStart} - {booking.timeEnd}
            </p>
            <span className={`
              inline-block px-2 py-1 rounded text-sm mt-2
              ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
              ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
              ${booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
            `}>
              {booking.status === 'confirmed' && 'Đã xác nhận'}
              {booking.status === 'pending' && 'Đang chờ'}
              {booking.status === 'cancelled' && 'Đã hủy'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};