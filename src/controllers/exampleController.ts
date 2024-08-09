import { Request, Response } from 'express';
import ExampleService from '../services/exampleService';

class ExampleController {
  async getExample(req: Request, res: Response) {
    try {
      const data = await ExampleService.getExampleData();
      res.json(data);
    } catch (error) {
      res.status(500).send('Server error');
    }
  }
}

export default new ExampleController();
