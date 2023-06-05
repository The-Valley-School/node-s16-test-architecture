import { Car, ICar } from "../entities/car-entity";
import { Document } from "mongoose";

const getAllCars = async (page: number, limit: number): Promise<Document<ICar>[]> => {
  return await Car.find()
    .limit(limit)
    .skip((page - 1) * limit)
    .populate(["owner", "brand"]);
};

const getCarCount = async (): Promise<number> => {
  return await Car.countDocuments();
};

const getCarById = async (id: string): Promise<Document<ICar> | null> => {
  return await Car.findById(id).populate(["owner", "brand"]);
};

const createCar = async (carData: any): Promise<Document<ICar>> => {
  const car = new Car(carData);
  const document: Document<ICar> = (await car.save()) as any;

  return document;
};

const deleteCar = async (id: string): Promise<Document<ICar> | null> => {
  return await Car.findByIdAndDelete(id);
};

const updateCar = async (id: string, carData: any): Promise<Document<ICar> | null> => {
  return await Car.findByIdAndUpdate(id, carData, { new: true, runValidators: true });
};

export const carOdm = {
  getAllCars,
  getCarCount,
  getCarById,
  createCar,
  deleteCar,
  updateCar
};
