const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get all flashcard sets
 */
exports.getAllFlashcardSets = async () => {
  try {
    const flashcardSets = await prisma.flashcardSet.findMany({
      include: {
        flashcards: true,
        category: true,
        user: {
          select: {
            id: true,
            username: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return flashcardSets.map(formatFlashcardSet);
  } catch (error) {
    console.error('Error in getAllFlashcardSets:', error);
    throw error;
  }
};

/**
 * Get a single flashcard set by ID
 */
exports.getFlashcardSetById = async (id) => {
  try {
    const flashcardSet = await prisma.flashcardSet.findUnique({
      where: { id },
      include: {
        flashcards: true,
        category: true,
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    if (!flashcardSet) {
      return null;
    }

    return formatFlashcardSet(flashcardSet);
  } catch (error) {
    console.error('Error in getFlashcardSetById:', error);
    throw error;
  }
};

/**
 * Get flashcard sets by category
 */
exports.getFlashcardSetsByCategory = async (categoryId) => {
  try {
    const flashcardSets = await prisma.flashcardSet.findMany({
      where: { categoryId },
      include: {
        flashcards: true,
        category: true,
        user: {
          select: {
            id: true,
            username: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return flashcardSets.map(formatFlashcardSet);
  } catch (error) {
    console.error('Error in getFlashcardSetsByCategory:', error);
    throw error;
  }
};

/**
 * Get all categories
 */
exports.getAllCategories = async () => {
  try {
    return await prisma.category.findMany({
      orderBy: {
        description: 'asc'
      }
    });
  } catch (error) {
    console.error('Error in getAllCategories:', error);
    throw error;
  }
};

/**
 * Helper function to format flashcard set data
 */
function formatFlashcardSet(set) {
  return {
    id: set.id,
    userId: set.userId,
    title: set.title,
    description: set.description,
    categoryId: set.categoryId,
    createdAt: set.createdAt.toISOString(),
    updatedAt: set.updatedAt.toISOString(),
    flashcards: set.flashcards.map(card => ({
      id: card.id,
      setId: card.setId,
      frontText: card.frontText,
      backText: card.backText,
      difficulty: card.difficulty
    }))
  };
}
