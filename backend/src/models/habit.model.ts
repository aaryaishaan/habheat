import mongoose from 'mongoose';


interface IHabit {
  userId: mongoose.Types.ObjectId;
  name: string;
  color?: string;
  startDate: string;
  completedDates: string[];
}

const habitSchema = new mongoose.Schema<IHabit>(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      color: {
        type: String,
      },
      startDate: {
        type: String,
        required: true,
      },
      completedDates: {
        type: [String],
        default: [],
      },
    },
    {
      timestamps: true,
    });

export const Habit = mongoose.model<IHabit>('Habit', habitSchema);