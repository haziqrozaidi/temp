const express = require('express');
const router = express.Router();
const flashcardSetController = require('../controllers/flashcardSetController');

/**
 * GET /flashcard-sets
 * Retrieves all flashcard sets with their flashcards and categories
 */
router.get('/', async (req, res) => {
  try {
    const flashcardSets = await flashcardSetController.getAllFlashcardSets();
    res.json(flashcardSets);
  } catch (error) {
    console.error('Error fetching flashcard sets:', error);
    res.status(500).json({
      error: 'Failed to retrieve flashcard sets',
      details: error.message
    });
  }
});

/**
 * GET /flashcard-sets/:id
 * Retrieves a single flashcard set by ID
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const flashcardSet = await flashcardSetController.getFlashcardSetById(id);

    if (!flashcardSet) {
      return res.status(404).json({ error: 'Flashcard set not found' });
    }

    res.json(flashcardSet);
  } catch (error) {
    console.error('Error fetching flashcard set:', error);
    res.status(500).json({
      error: 'Failed to retrieve flashcard set',
      details: error.message
    });
  }
});

/**
 * GET /flashcard-sets/category/:categoryId
 * Retrieves all flashcard sets for a specific category
 */
router.get('/category/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  
  try {
    const flashcardSets = await flashcardSetController.getFlashcardSetsByCategory(categoryId);
    res.json(flashcardSets);
  } catch (error) {
    console.error('Error fetching flashcard sets by category:', error);
    res.status(500).json({
      error: 'Failed to retrieve flashcard sets for this category',
      details: error.message
    });
  }
});

/**
 * GET /flashcard-sets/categories/all
 * Retrieves all categories for flashcard sets
 */
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await flashcardSetController.getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      error: 'Failed to retrieve categories',
      details: error.message
    });
  }
});

module.exports = router;
