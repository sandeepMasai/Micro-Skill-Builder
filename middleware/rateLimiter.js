const rateLimit = require('express-rate-limit');

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

// Auth rate limiter (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: {
    error: 'Too many authentication attempts, please try again later.'
  }
});

module.exports = {
  generalLimiter,
  authLimiter
};