import { Router } from 'express';
import ExampleController from '../controllers/exampleController';

const router = Router();

router.get('/example', ExampleController.getExample);

export default router;
