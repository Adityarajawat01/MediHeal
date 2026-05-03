import jwt from 'jsonwebtoken';
import Doctor from '../models/Doctor.js';

const JWT_SECRET = process.env.JWT_SECRET 

export default async function doctorAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    //check token 
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: No token provided'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        

        if(payload.role !== 'doctor') {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Access denied'
            });
        }
        
        //fetch doctor
        const doctor = await Doctor.findById(payload.id).select('-password');

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        req.doctor = doctor;
        next();
    } catch (error) {
        console.error('Doctor auth error:', error);
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid token'
        });
    }
}