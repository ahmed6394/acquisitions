import aj from '../config/arcjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';

const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || 'guest';

    let limit;
    let message;

    switch (role) {
      case 'admin':
        limit = 20;
        message = 'Admin request limit exceeded (20 requests per 2 seconds). Slow down!';
        break;
      case 'user':
        limit = 10;
        message = 'User request limit exceeded (10 requests per 2 seconds). Slow down!';
        break;
      case 'guest':
        limit = 5;
        message = 'Guest request limit exceeded (5 requests per 2 seconds). Slow down!';
        break;
    }
    const client = aj.withRule(slidingWindow({
      mode: 'LIVE',
      interval: '1m',
      max: limit,
      name: `${role}-rate-limit`
    }));
    const decision = await client.protect(req);
    if (decision.isDenied() && decision.reason.isBot()){
      logger.warn('Bot request blocked', {IP: req.ip, userAgent: req.get('user-agent'), path: req.path});
      return res.status(429).json({ error: 'Too Many Requests', message: 'Bot activity detected. Access denied.' });
    }

    if (decision.isDenied() && decision.reason.isShield()){
      logger.warn('Shield request blocked', {IP: req.ip, userAgent: req.get('user-agent'), path: req.path, method: req.method});
      return res.status(429).json({ error: 'Too Many Requests', message: 'Shield activity detected. Access denied.' });
    }

    if (decision.isDenied() && decision.reason.isRateLimit()){
      logger.warn('Rate limit request blocked', {IP: req.ip, userAgent: req.get('user-agent'), path: req.path});
      return res.status(429).json({ error: 'Too Many Requests', message });
    }
    next();

  } catch (e) {
    console.error('Security middleware error:', e);
    res.status(500).json({ error: 'Internal Server Error!', message: 'Something went wrong with security middleware' });
  }
};

export default securityMiddleware;