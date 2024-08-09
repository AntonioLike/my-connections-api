import mongoose, { Schema, Document } from 'mongoose';

export interface IExample extends Document {
  name: string;
  value: string;
}

const ExampleSchema: Schema = new Schema({
  name: { type: String, required: true },
  value: { type: String, required: true }
});

export default mongoose.model<IExample>('Example', ExampleSchema);
