 import express from 'express';
 import { clerkMiddleware, requireAuth } from '@clerk/express';
 
 import { cancelServiceAppointment, confirmServicePayment, createServiceAppointment, getServiceAppointmentById, getServiceAppointments, getServicesAppointmentsByPatient, updateServiceAppointment } from '../controllers/serviceAppointmentController.js'

 const serviceAppointmentRouter = express.Router()

 serviceAppointmentRouter.get("/", getServiceAppointments);
 serviceAppointmentRouter.get("/confirm", confirmServicePayment);
 serviceAppointmentRouter.get('/stats/summary', getServiceAppointments);

 serviceAppointmentRouter.post("/",clerkMiddleware(), requireAuth(), createServiceAppointment)

 serviceAppointmentRouter.get('/me', clerkMiddleware(), requireAuth(), getServicesAppointmentsByPatient);

 serviceAppointmentRouter.get("/:id", getServiceAppointmentById);
serviceAppointmentRouter.put("/:id", updateServiceAppointment);
serviceAppointmentRouter.post("/:id/cancel", cancelServiceAppointment);

export default serviceAppointmentRouter;