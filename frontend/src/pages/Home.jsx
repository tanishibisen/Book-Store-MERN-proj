import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, fetchMyBooks } from '../redux/bookSlice';
import BookCard from '../components/BookCard';
import TradeModal from '../components/TradeModal';
import { Search, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { books, isLoading } = useSelector((state) => state.books);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState(10); // 10km default
  const [selectedTradeBook, setSelectedTradeBook] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchMyBooks());
    }
  }, [user, dispatch]);

  useEffect(() => {
    // Basic debounce for search
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchBooks({ 
        search: searchTerm, 
        lat: location?.lat, 
        lng: location?.lng, 
        radius 
      }));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, location, radius, dispatch]);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-10 text-center text-white shadow-xl">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Discover & Trade Books Locally</h1>
        <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-8">Join the community, find your next favorite read, and swap books with people nearby.</p>
        
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4 bg-white/10 p-2 rounded-2xl backdrop-blur-sm">
          <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-3 shadow-inner">
            <Search className="text-gray-400 mr-2" size={20} />
            <input 
              type="text" 
              placeholder="Search books by title or author..." 
              className="w-full outline-none text-gray-700 bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={handleGetLocation}
            className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-indigo-50 transition"
          >
            <MapPin size={20} /> 
            {location ? "Location Set" : "Find Near Me"}
          </button>
        </div>
      </section>

      {/* Book Catalog */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Available Books</h2>
          {location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <label>Radius (km):</label>
              <input 
                type="number" 
                className="border rounded p-1 w-16" 
                value={radius} 
                onChange={(e) => setRadius(e.target.value)}
                min="1"
              />
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-10">Loading books...</div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard 
                key={book._id} 
                book={book} 
                onRequestTrade={() => {
                  if (!user) {
                    navigate('/login');
                  } else if (book.owner._id === user._id || book.owner === user._id) {
                    alert("You cannot trade with yourself!");
                  } else {
                    setSelectedTradeBook(book);
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <h3 className="text-xl text-gray-500 font-medium">No books found.</h3>
            <p className="text-gray-400 mt-2">Try adjusting your search or location.</p>
          </div>
        )}
      </section>

      {selectedTradeBook && (
        <TradeModal 
          requestedBook={selectedTradeBook} 
          onClose={() => setSelectedTradeBook(null)} 
        />
      )}
    </div>
  );
};

export default Home;
