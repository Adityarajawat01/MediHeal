import express from 'express';
import multer from 'multer';
import { createService, getServices, getServiceById, updateService, deleteService } from '../controllers/serviceController.js';

const serviceRouter = express.Router();
const upload = multer({ dest: '/tmp' });

serviceRouter.get('/', getServices);
serviceRouter.get('/:id', getServiceById);

serviceRouter.post('/', upload.single('image'), createService);
serviceRouter.put('/:id', upload.single('image'), updateService);
serviceRouter.delete('/:id', deleteService);

export default serviceRouter;