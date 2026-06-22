import express from 'express';
import Book from '../models/Book.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all books (with optional search and geolocation filtering)
router.get('/', async (req, res) => {
  try {
    const { search, lat, lng, radius, status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = 'Available'; // default to available books
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Geolocation search
    if (lat && lng && radius) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius) * 1000 // Convert km to meters
        }
      };
    }

    const books = await Book.find(query).populate('owner', 'username email');
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('owner', 'username email location');
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a book
router.post('/', protect, async (req, res) => {
  try {
    const { title, author, description } = req.body;
    
    // Get user's location to assign to the book
    const user = await User.findById(req.user.id);
    
    const book = await Book.create({
      title,
      author,
      description,
      owner: req.user.id,
      location: user.location
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get books owned by current user
router.get('/my/books', protect, async (req, res) => {
  try {
    const books = await Book.find({ owner: req.user.id });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
