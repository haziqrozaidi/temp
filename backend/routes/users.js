var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST sync user data from Clerk */
router.post('/sync', function(req, res, next) {
  try {
    // Extract user data from request body
    const { clerkUserId, username, email, role } = req.body;

    // Log received data (for development/debugging)
    console.log('User data received:', { clerkUserId, username, email, role });

    // Simple response for now - just acknowledge receipt
    res.status(200).json({
      success: true,
      message: 'User data received successfully',
      timestamp: '2025-06-14 10:10:56' // Current timestamp from your request
    });
    
  } catch (error) {
    console.error('Error processing user data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process user data'
    });
  }
});

module.exports = router;
