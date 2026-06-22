import { MapPin, Book } from 'lucide-react';

const BookCard = ({ book, onRequestTrade }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4 transform transition hover:-translate-y-1 hover:shadow-xl border border-gray-100">
      <div>
        <h3 className="text-xl font-bold text-gray-800">{book.title}</h3>
        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
          <Book size={16} /> {book.author}
        </p>
      </div>
      <p className="text-gray-600 line-clamp-3 flex-grow">{book.description}</p>
      
      <div className="flex justify-between items-center mt-2 pt-4 border-t border-gray-100">
        <span className="text-xs text-indigo-500 bg-indigo-50 px-2 py-1 rounded-full flex items-center gap-1">
          <MapPin size={12} /> {book.distance ? `${(book.distance / 1000).toFixed(1)} km away` : 'Location available'}
        </span>
        <button 
          onClick={() => onRequestTrade(book)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
        >
          Request Trade
        </button>
      </div>
    </div>
  );
};

export default BookCard;
