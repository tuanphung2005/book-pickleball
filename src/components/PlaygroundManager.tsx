import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Playground } from '../types/playground';
import { PlaygroundForm } from './PlaygroundForm';


import { API_BASE_URL } from '../config';

interface PlaygroundManagerProps {
  onClose: () => void;
}

export const PlaygroundManager = ({ onClose }: PlaygroundManagerProps) => {
  const [userPlaygrounds, setUserPlaygrounds] = useState<Playground[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPlayground, setEditPlayground] = useState<Playground | null>(null);

  useEffect(() => {
    fetchPlaygrounds();
  }, []);

  const fetchPlaygrounds = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/playgrounds/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUserPlaygrounds(data);
    } catch (err) {
      console.error('Error fetching user playgrounds:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa sân này không?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/playgrounds/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete playground');
      }

      setUserPlaygrounds(playgrounds => 
        playgrounds.filter(p => p.id !== id)
      );
    } catch (err) {
      console.error('Error deleting playground:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2 className="text-xl font-bold mb-4">Quản lý sân</h2>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-4">
            {userPlaygrounds.map((playground) => (
              <div key={playground.id} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{playground.name}</h3>
                  <p className="text-gray-600">{playground.address}</p>
                  <p className="text-sm text-gray-500 capitalize">{playground.type}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg text-blue-600"
                    onClick={() => setEditPlayground(playground)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg text-red-600"
                    onClick={() => handleDelete(playground.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editPlayground && (
        <PlaygroundForm 
          onClose={() => setEditPlayground(null)}
          editPlayground={editPlayground}
        />
      )}
    </div>
  );
};