import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { BookOpen, LogOut, User, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          <BookOpen />
          BookSwap
        </Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link to="/add-book" className="text-gray-600 hover:text-indigo-600 flex items-center gap-1">
                <PlusCircle size={20} /> Add Book
              </Link>
              <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 flex items-center gap-1">
                <User size={20} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="text-red-500 hover:text-red-700 flex items-center gap-1">
                <LogOut size={20} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Login</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;