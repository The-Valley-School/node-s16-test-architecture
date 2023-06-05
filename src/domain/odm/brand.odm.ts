import { Brand, IBrand } from "../entities/brand-entity";
import { Document } from "mongoose";

const getAllBrands = async (page: number, limit: number): Promise<any> => {
  return await Brand.find()
    .limit(limit)
    .skip((page - 1) * limit);
};

const getBrandCount = async (): Promise<number> => {
  return await Brand.countDocuments();
};

const getBrandById = async (id: string): Promise<Document<IBrand> | null> => {
  return await Brand.findById(id);
};

const getBrandByName = async (name: string): Promise<Document<IBrand>[]> => {
  return await Brand.find({ name: new RegExp("^" + name.toLowerCase(), "i") });
};

const createBrand = async (brandData: any): Promise<Document<IBrand>> => {
  const brand = new Brand(brandData);
  const document: Document<IBrand> = (await brand.save()) as any;

  return document;
};

const deleteBrand = async (id: string): Promise<Document<IBrand> | null> => {
  return await Brand.findByIdAndDelete(id);
};

const updateBrand = async (id: string, brandData: any): Promise<Document<IBrand> | null> => {
  return await Brand.findByIdAndUpdate(id, brandData, { new: true, runValidators: true });
};

export const brandOdm = {
  getAllBrands,
  getBrandCount,
  getBrandById,
  getBrandByName,
  createBrand,
  deleteBrand,
  updateBrand,
};
