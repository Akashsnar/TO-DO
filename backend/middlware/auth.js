import jwt from 'jsonwebtoken';
import {User} from '../model/user_model.js'; 

export const authenticate = async (req, res, next) => {
    try {
        console.log("check auth");
        
        const token = req.headers.authorization?.split(' ')[1]; 
        if (!token) return res.status(401).json({ message: 'Authentication token missing' });

        const decoded = jwt.verify(token, 'your_jwt_secret'); 
        const user = await User.findById(decoded.id);
        if (!user) {
            console.log("user not found");
            return res.status(401).json({ message: 'User not found' });
        }
        console.log("user found");
        req.user = { id: user._id }; 
        next()
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
