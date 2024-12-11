import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faClock, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { Playground } from '../types/playground';

interface BookingFormProps {
  playground: Playground;
  onClose: () => void;
}

export const BookingForm = ({ playground, onClose }: BookingFormProps) => {
  const [date, setDate] = useState('');
  const [timeStart, setTimeStart] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkOwnership = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/playgrounds/${playground.id}/owner`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        if (data.isOwner) {
          setError('Không thể đặt sân của chính mình');
        }
      } catch (err) {
        console.error('Error checking ownership:', err);
      }
    };

    checkOwnership();
  }, [playground.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (error === 'Không thể đặt sân của chính mình') {
      return;
    }

    try {
      const timeEnd = `${Number(timeStart.split(':')[0]) + 1}:00`; // Calculate end time
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          playgroundId: playground.id,
          date,
          timeStart,
          timeEnd
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      alert('Đặt sân thành công!');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi đặt sân');
    }
  };

  const timeSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00",
    "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2 className="text-xl font-bold mb-4">Đặt sân: {playground.name}</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">
              <FontAwesomeIcon icon={faCalendar} className="mr-2" />
              Ngày
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="border p-2 w-full rounded-lg"
              required
              disabled={error === 'Không thể đặt sân của chính mình'}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              <FontAwesomeIcon icon={faClock} className="mr-2" />
              Thời gian
            </label>
            <select
              value={timeStart}
              onChange={(e) => setTimeStart(e.target.value)}
              className="border p-2 w-full rounded-lg"
              required
              disabled={error === 'Không thể đặt sân của chính mình'}
            >
              <option value="">Chọn giờ</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>
                  {slot} - {Number(slot.split(':')[0]) + 1}:00
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-500 text-white p-2 rounded-lg ${
              error === 'Không thể đặt sân của chính mình' 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-blue-600'
            }`}
            disabled={error === 'Không thể đặt sân của chính mình'}
          >
            Xác nhận đặt sân
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;