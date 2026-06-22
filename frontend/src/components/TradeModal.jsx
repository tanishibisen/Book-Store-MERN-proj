import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestTrade } from '../redux/tradeSlice';
import { X } from 'lucide-react';

const TradeModal = ({ requestedBook, onClose }) => {
  const dispatch = useDispatch();
  const { myBooks } = useSelector((state) => state.books);
  const [selectedOfferedBook, setSelectedOfferedBook] = useState('');

  const availableBooks = myBooks.filter(b => b.status === 'Available');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedOfferedBook) return;
    
    dispatch(requestTrade({
      requestedBookId: requestedBook._id,
      offeredBookId: selectedOfferedBook
    })).then(() => {
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Trade</h2>
          <p className="text-gray-600 mb-6 text-sm">
            You are requesting <span className="font-semibold text-indigo-600">{requestedBook.title}</span>. 
            Choose one of your available books to offer in exchange.
          </p>

          {availableBooks.length === 0 ? (
            <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg text-sm">
              You don't have any available books to offer. Go to your dashboard to list a book first.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Book to Offer</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={selectedOfferedBook}
                  onChange={(e) => setSelectedOfferedBook(e.target.value)}
                  required
                >
                  <option value="" disabled>Select a book...</option>
                  {availableBooks.map(book => (
                    <option key={book._id} value={book._id}>{book.title}</option>
                  ))}
                </select>
              </div>
              <button 
                type="submit" 
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Send Request
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradeModal;
