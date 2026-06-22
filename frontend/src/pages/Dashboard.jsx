import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBooks } from '../redux/bookSlice';
import { fetchMyTrades, updateTradeStatus } from '../redux/tradeSlice';
import { Book, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myBooks } = useSelector((state) => state.books);
  const { trades } = useSelector((state) => state.trades);

  useEffect(() => {
    if (user) {
      dispatch(fetchMyBooks());
      dispatch(fetchMyTrades());
    }
  }, [user, dispatch]);

  if (!user) {
    return <div className="text-center mt-20">Please log in to view your dashboard.</div>;
  }

  const handleTradeAction = (tradeId, status) => {
    dispatch(updateTradeStatus({ tradeId, status }));
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome, {user.username}!</h2>
          <p className="text-gray-500">Manage your books and trade requests.</p>
        </div>
        <Link to="/add-book" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          Add New Book
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Books Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
            <Book className="text-indigo-600" /> My Listed Books
          </h3>
          {myBooks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">You haven't listed any books yet.</p>
          ) : (
            <ul className="space-y-4">
              {myBooks.map((book) => (
                <li key={book._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-800">{book.title}</h4>
                    <p className="text-sm text-gray-500">{book.author}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${book.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                    {book.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Trade Requests Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
            <RefreshCw className="text-indigo-600" /> Trade Requests
          </h3>
          {trades.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No active trade requests.</p>
          ) : (
            <ul className="space-y-4">
              {trades.map((trade) => {
                const isReceiver = trade.receiver._id === user._id || trade.receiver === user._id;
                return (
                  <li key={trade._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-semibold uppercase text-indigo-500 tracking-wider">
                          {isReceiver ? 'Incoming Request' : 'Sent Request'}
                        </span>
                        <p className="text-gray-800 text-sm mt-1">
                          <span className="font-semibold">{isReceiver ? trade.requester.username : 'You'}</span> requested 
                          <span className="font-semibold"> {trade.requestedBook.title}</span> in exchange for 
                          <span className="font-semibold"> {trade.offeredBook.title}</span>.
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        trade.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        trade.status === 'Accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {trade.status}
                      </span>
                    </div>
                    
                    {isReceiver && trade.status === 'Pending' && (
                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                        <button 
                          onClick={() => handleTradeAction(trade._id, 'Accepted')}
                          className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition text-sm"
                        >
                          <CheckCircle size={16} /> Accept
                        </button>
                        <button 
                          onClick={() => handleTradeAction(trade._id, 'Rejected')}
                          className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 transition text-sm"
                        >
                          <XCircle size={16} /> Reject
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
