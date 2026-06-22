import express from 'express';
import Trade from '../models/Trade.js';
import Book from '../models/Book.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Create a trade request
router.post('/', protect, async (req, res) => {
  try {
    const { requestedBookId, offeredBookId } = req.body;
    
    const requestedBook = await Book.findById(requestedBookId);
    if (!requestedBook) return res.status(404).json({ message: 'Requested book not found' });
    if (requestedBook.status !== 'Available') return res.status(400).json({ message: 'Requested book is not available' });

    const offeredBook = await Book.findById(offeredBookId);
    if (!offeredBook) return res.status(404).json({ message: 'Offered book not found' });
    if (offeredBook.owner.toString() !== req.user.id) return res.status(403).json({ message: 'You do not own the offered book' });

    const trade = await Trade.create({
      requester: req.user.id,
      receiver: requestedBook.owner,
      requestedBook: requestedBookId,
      offeredBook: offeredBookId
    });

    res.status(201).json(trade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's trades (both requested and received)
router.get('/', protect, async (req, res) => {
  try {
    const trades = await Trade.find({
      $or: [{ requester: req.user.id }, { receiver: req.user.id }]
    })
    .populate('requester', 'username')
    .populate('receiver', 'username')
    .populate('requestedBook', 'title author')
    .populate('offeredBook', 'title author')
    .sort('-createdAt');

    res.json(trades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update trade status (Accept / Reject)
router.patch('/:id', protect, async (req, res) => {
  try {
    const { status } = req.body; // 'Accepted' or 'Rejected'
    const trade = await Trade.findById(req.params.id);

    if (!trade) return res.status(404).json({ message: 'Trade not found' });

    // Only receiver can accept/reject
    if (trade.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this trade' });
    }

    trade.status = status;
    await trade.save();

    if (status === 'Accepted') {
      // Mark books as Traded
      await Book.findByIdAndUpdate(trade.requestedBook, { status: 'Traded' });
      await Book.findByIdAndUpdate(trade.offeredBook, { status: 'Traded' });
      
      // Reject other pending trades for these books
      await Trade.updateMany({
        _id: { $ne: trade._id },
        status: 'Pending',
        $or: [
          { requestedBook: trade.requestedBook },
          { requestedBook: trade.offeredBook },
          { offeredBook: trade.requestedBook },
          { offeredBook: trade.offeredBook }
        ]
      }, { status: 'Rejected' });
    }

    res.json(trade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
