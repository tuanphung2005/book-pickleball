import { useState } from 'react'
import { playgrounds } from './data/playgrounds'
import { PlaygroundFilter } from './components/PlaygroundFilter'
import { PlaygroundList } from './components/PlaygroundList'
import { PlaygroundDetail } from './components/PlaygroundDetail'

import { Playground } from './types/playground'

function App() {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [rating, setRating] = useState<number | null>(null)
  const [activeFilter, setActiveFilter] = useState<'rating' | null>(null)
  const [selectedPlayground, setSelectedPlayground] = useState<Playground | null>(null)

  const handleRatingChange = (newRating: number | null) => {
    setRating(newRating);
    setActiveFilter(newRating ? 'rating' : null);
  };

  const filteredPlaygrounds = playgrounds
    .filter((playground) =>
      playground.name.toLowerCase().includes(search.toLowerCase()) ||
      playground.address.toLowerCase().includes(search.toLowerCase())
    )
    .filter((playground) =>
      filterType ? playground.type === filterType : true
    );

  const sortedPlaygrounds = [...filteredPlaygrounds].sort((a, b) => {
    if (activeFilter === 'rating') {
      return b.rating - a.rating;
    }
    return 0;
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tìm sân hoặc quận</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm sân"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 w-full rounded-lg"
        />
      </div>
      <PlaygroundFilter 
        filterType={filterType} 
        setFilterType={setFilterType}
        rating={rating}
        onRatingChange={handleRatingChange}
        activeFilter={activeFilter}
      />
      <PlaygroundList 
        playgrounds={sortedPlaygrounds} 
        onPlaygroundClick={setSelectedPlayground}
      />
      {selectedPlayground && (
        <PlaygroundDetail 
          playground={selectedPlayground} 
          onClose={() => setSelectedPlayground(null)}
        />
      )}
    </div>
  )
}

export default App