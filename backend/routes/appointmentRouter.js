import express from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import { createAppointment, confirmPayment,  getAppointments, getStats, updateAppointment, getAppointmentsByPatient, cancelAppointment, getAppointmentsByDoctor, getRegisteredUserCount } from "../controllers/appointmentController.js";

const appointmentRouter = express.Router();

appointmentRouter.get("/", getAppointments);
appointmentRouter.get("/confirm", confirmPayment);
appointmentRouter.get("/stats/summary",getStats);
appointmentRouter.get("/doctor/:doctorId", getAppointmentsByDoctor);

//authentic routes
appointmentRouter.post("/", clerkMiddleware(), requireAuth(), createAppointment);
appointmentRouter.get("/me", clerkMiddleware(), requireAuth(), getAppointmentsByPatient);

appointmentRouter.post("/:id/cancel", cancelAppointment);
appointmentRouter.get("/patient/count", getRegisteredUserCount);
appointmentRouter.put("/:id", updateAppointment);
appointmentRouter.put("/:id/update", updateAppointment);

export default appointmentRouter;
