import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

interface PlaygroundFilterProps {
    filterType: string;
    setFilterType: (value: string) => void;
    rating: number | null;
    onRatingChange: (rating: number | null) => void;
    activeFilter: 'rating' | null;
}

export const PlaygroundFilter = ({
    filterType,
    setFilterType,
    rating,
    onRatingChange,
    activeFilter
}: PlaygroundFilterProps) => {
    return (
        <div className="mb-4">
            <div className="flex space-x-2">
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border p-2 flex-1 rounded-lg"
                >
                    <option value="">Loại sân: Tất cả</option>
                    <option value="football">Bóng đá</option>
                    <option value="pickleball">Pickleball</option>
                    <option value="badminton">Cầu lông</option>
                    <option value="basketball">Bóng rổ</option>
                </select>

                <button
                    onClick={() => onRatingChange(rating ? null : 4)}
                    className={`border p-2 flex-1 rounded-lg ${activeFilter === 'rating' ? 'bg-blue-100' : ''}`}
                >
                    <FontAwesomeIcon icon={faStar} className="mr-2" />
                    Đánh giá cao
                </button>
            </div>
        </div>
    );
};