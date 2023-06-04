# VIDEO 02 - Primeras peticiones documentadas

En este vídeo hemos documentado nuestras primeras peticiones.

Para ello hemos creado esta anotación dentro de Brand.ts que nos sirve para definir una Brand:

```tsx
/**
 * @swagger
 * components:
 *  schemas:
 *    Brand:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 *          description: Name of the brand (sample Ford)
 *        creationYear:
 *          type: number
 *          description: Year when brand was created (sample 1990)
 *        country:
 *          type: string
 *          description: Country of this Brand (sample SPAIN)
 *        logoImage:
 *          type: string
 *          description: Logo of this brand (sample http://balbblabla.com/image.jpg)
 */
```

Después hemos creado también el modelo Pagination:

```tsx
/**
 * @swagger
 * components:
 *  schemas:
 *    Pagination:
 *      type: object
 *      properties:
 *        totalItems:
 *          type: number
 *          description: Total items on this endpoint
 *        totalPages:
 *          type: number
 *          description: Number of pages for this pagination
 *        currentPage:
 *          type: number
 *          description: Current page showed
 */
```

Y por último hemos añadido las anotaciones a nuestro brand.routes.ts:

```tsx
/**
 * @swagger
 * tags:
 *   name: Brand
 *   description: The brands managing API
 */

import express, { type NextFunction, type Response, type Request } from "express";
import fs from "fs";
import multer from "multer";

// Modelos
import { Brand } from "../models/mongo/Brand";
const upload = multer({ dest: "public" });

export const brandRouter = express.Router();

/**
 * @swagger
 * /brand:
 *   get:
 *     summary: Lists all the brands
 *     tags: [Brand]
 *     responses:
 *       200:
 *         description: The list of the brands
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Brand'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
brandRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Asi leemos query params
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const brands = await Brand.find()
      .limit(limit)
      .skip((page - 1) * limit);

    // Num total de elementos
    const totalElements = await Brand.countDocuments();

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
});

/**
 * @swagger
 * /brand/{id}:
 *   get:
 *     summary: Get a brand by ID
 *     tags: [Brand]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The brand ID
 *     responses:
 *       200:
 *         description: The brand info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 */
brandRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const brand = await Brand.findById(id);
    if (brand) {
      res.json(brand);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});
```

