import express from 'express';
import upload from '../middlewares/multer.js';

import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  doctorLogin,
  toggleAvailability
} from '../controllers/doctorController.js';

import doctorAuth from '../middlewares/doctorAuth.js';

const doctorRouter = express.Router();

doctorRouter.get('/', getDoctors);
doctorRouter.post('/login', doctorLogin);

doctorRouter.get('/:id', getDoctorById);

// ✅ IMAGE UPLOAD FIXED
doctorRouter.post('/', upload.single('image'), createDoctor);

doctorRouter.put("/:id", doctorAuth, upload.single('image'), updateDoctor);

doctorRouter.post("/:id/toggle-availability", doctorAuth, toggleAvailability);
doctorRouter.delete("/:id", deleteDoctor);

export default doctorRouter;