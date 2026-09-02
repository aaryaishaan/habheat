import {NextFunction, Request, Response} from 'express';

import {Habit} from '../models/habit.model.js';


export const createHabit =
    async(req: Request, res: Response, next: NextFunction):
        Promise<void> => {
          try {
            const {name, color, startDate} = req.body;
            if (!name || !startDate) {
              res.status(400).json({message: 'Fill in the required values.'})
              return;
            }
            const habit = await Habit.create({
              userId: req.userId,
              name,
              color,
              startDate,
              completedDates: [],
            });

            res.status(201).json({message: 'Habit created successfully', habit})


          } catch (error) {
            next(error)
          }
        }


export const getHabits =
    async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const habits = await Habit
                       .find({
                         userId: req.userId,
                       })
                       .sort({createdAt: -1});

    res.status(200).json({
      habits,
    });
  } catch (error) {
    next(error)
  }
};


export const getHabitById =
    async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {id} = req.params;

    const habit = await Habit.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!habit) {
      res.status(404).json({
        message: 'Habit not found',
      });
      return;
    }

    res.status(200).json({
      habit,
    });
  } catch (error) {
    next(error)
  }
};

export const updateHabit =
    async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {id} = req.params;
    const {name, color} = req.body;

    if (!name && !color) {
      res.status(400).json({
        message: 'Nothing to update',
      });
      return;
    }

    const habit = await Habit.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!habit) {
      res.status(404).json({
        message: 'Habit not found',
      });
      return;
    }

    if (name) habit.name = name;
    if (color) habit.color = color;

    await habit.save();

    res.status(200).json({
      message: 'Habit updated successfully',
      habit,
    });
  } catch (error) {
    next(error)
  }
};


export const deleteHabit =
    async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {id} = req.params;

    const habit = await Habit.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!habit) {
      res.status(404).json({
        message: 'Habit not found',
      });
      return;
    }

    res.status(200).json({
      message: 'Habit deleted successfully',
    });
  } catch (error) {
    next(error)
  }
};


export const toggleHabit =
    async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {id} = req.params;
    const {date} = req.body;

    if (!date || typeof date !== 'string') {
      res.status(400).json({
        message: 'Valid date is required',
      });
      return;
    }

    const habit = await Habit.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!habit) {
      res.status(404).json({
        message: 'Habit not found',
      });
      return;
    }

    const dateIndex = habit.completedDates.indexOf(date);

    if (dateIndex === -1) {
      habit.completedDates.push(date);
    } else {
      habit.completedDates.splice(dateIndex, 1);
    }

    await habit.save();

    res.status(200).json({
      message: 'Habit status updated',
      habit,
    });
  } catch (error) {
    next(error)
  }
};
