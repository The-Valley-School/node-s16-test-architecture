import { type NextFunction, type Request, type Response } from "express";
import { carOdm } from "../odm/car.odm";

const getAllCars = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = req.query.page as any;
    const limit = req.query.limit as any;

    const cars = await carOdm.getAllCars(page, limit);

    const totalElements = await carOdm.getCarCount();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: cars,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getCarById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    const car = await carOdm.getCarById(id);
    if (car) {
      res.json(car);
    } else {
      res.status(404).json({ error: "Car not found" });
    }
  } catch (error) {
    next(error);
  }
};

const createCar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const createdCar = await carOdm.createCar(req.body);
    res.status(201).json(createdCar);
  } catch (error) {
    next(error);
  }
};

const deleteCar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    const carDeleted = await carOdm.deleteCar(id);
    if (carDeleted) {
      res.json(carDeleted);
    } else {
      res.status(404).json({ error: "Car was not found" });
    }
  } catch (error) {
    next(error);
  }
};

const updateCar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    const carUpdated = await carOdm.updateCar(id, req.body);
    if (carUpdated) {
      res.json(carUpdated);
    } else {
      res.status(404).json({ error: "Car was not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const carService = {
  getAllCars,
  getCarById,
  createCar,
  deleteCar,
  updateCar,
};
