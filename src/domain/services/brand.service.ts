import { type NextFunction, type Request, type Response } from "express";
import { brandOdm } from "../odm/brand.odm";
import fs from "fs";

const getAllBrands = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Asi leemos query params
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const brands = await brandOdm.getAllBrands(page, limit);

    // Num total de elementos
    const totalElements = await brandOdm.getBrandCount();

    const response = {
      pagination: {
        totalItems: totalElements,
        totalPages: Math.ceil(totalElements / limit),
        currentPage: page,
      },
      data: brands,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getBrandById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    const brand = await brandOdm.getBrandById(id);
    if (brand) {
      res.json(brand);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

const getBrandByName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const brandName = req.params.name;

  try {
    const brand = await brandOdm.getBrandByName(brandName);
    if (brand?.length) {
      res.json(brand);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    next(error);
  }
};

const createBrand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const createdBrand = await brandOdm.createBrand(req.body);
    res.status(201).json(createdBrand);
  } catch (error) {
    next(error);
  }
};

const deleteBrand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    const brandDeleted = await brandOdm.deleteBrand(id);
    if (brandDeleted) {
      res.json(brandDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

const updateBrand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    const brandUpdated = await brandOdm.updateBrand(id, req.body);
    if (brandUpdated) {
      res.json(brandUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

const updateBrandLogo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Renombrado de la imagen
    const originalname = req.file?.originalname as string;
    const path = req.file?.path as string;
    const newPath = `${path}_${originalname}`;
    fs.renameSync(path, newPath);

    // Busqueda de la marca
    const brandId = req.body.brandId;
    const brand = brandOdm.getBrandById(brandId) as any;

    if (brand) {
      brand.logoImage = newPath;
      const brandUpdated = await brandOdm.updateBrand(brandId, brand);
      res.json(brandUpdated);

      console.log("Marca modificada correctamente!");
    } else {
      fs.unlinkSync(newPath);
      res.status(404).send("Marca no encontrada");
    }
  } catch (error) {
    next(error);
  }
};

export const brandService = {
  getAllBrands,
  getBrandById,
  getBrandByName,
  createBrand,
  deleteBrand,
  updateBrand,
  updateBrandLogo,
};
