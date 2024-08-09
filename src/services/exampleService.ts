import ExampleModel, { IExample } from '../models/exampleModel';

class ExampleService {
  async getExampleData(): Promise<IExample[]> {
    return ExampleModel.find({});
  }
}

export default new ExampleService();
