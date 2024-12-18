import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface PlaygroundFormProps {
  onClose: () => void;
  editPlayground?: {
    id: number;
    name: string;
    type: 'football' | 'pickleball' | 'badminton' | 'basketball';
    address: string;
    imageUrl: string;
  };
}

export const PlaygroundForm = ({ onClose, editPlayground }: PlaygroundFormProps) => {
  const [name, setName] = useState(editPlayground?.name || '');
  const [type, setType] = useState(editPlayground?.type || 'football');
  const [address, setAddress] = useState(editPlayground?.address || '');
  const [imageUrl, setImageUrl] = useState(editPlayground?.imageUrl || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const url = editPlayground 
        ? `http://localhost:5000/api/playgrounds/${editPlayground.id}`
        : 'http://localhost:5000/api/playgrounds';

      const response = await fetch(url, {
        method: editPlayground ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          type,
          address,
          imageUrl
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      onClose();
      window.location.reload(); // Refresh to show changes
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2 className="text-xl font-bold mb-4">
          {editPlayground ? 'Chỉnh sửa sân' : 'Thêm sân mới'}
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Tên sân</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Loại sân</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="border p-2 w-full rounded-lg"
              required
            >
              <option value="football">Bóng đá</option>
              <option value="pickleball">Pickleball</option>
              <option value="badminton">Cầu lông</option>
              <option value="basketball">Bóng rổ</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Địa chỉ</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border p-2 w-full rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">URL hình ảnh</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="border p-2 w-full rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          >
            {editPlayground ? 'Cập nhật' : 'Thêm sân'}
          </button>
        </form>
      </div>
    </div>
  );
};