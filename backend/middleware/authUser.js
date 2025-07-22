import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not Authorized. Login again.' });
    }

    const token = authHeader.split(' ')[1];
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = token_decode;

    next();
  } catch (error) {
    console.error('Auth Error:', error.message);
    res.status(401).json({ success: false, message: 'Unauthorized', error: error.message });
  }
};

export default authUser;
