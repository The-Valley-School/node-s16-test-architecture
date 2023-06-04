# VIDEO 03 - Rellenando swagger de CAR con una IA

Teniendo en cuenta que documentar nuestro API requiere mucho tiempo y es una tarea bastante mecánica, vamos a hacer uso de Chat GPT para generar el resto de la documentación de nuestra API de brand:

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

/**
 * @swagger
 * /brand/name/{name}:
 *   get:
 *     summary: Get a brand by name
 *     tags: [Brand]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The brand name
 *     responses:
 *       200:
 *         description: The brand info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       404:
 *         description: The brand was not found
 */
brandRouter.get("/name/:name", async (req: Request, res: Response, next: NextFunction) => {
  const brandName = req.params.name;

  try {
    const brand = await Brand.find({ name: new RegExp("^" + brandName.toLowerCase(), "i") });
    if (brand?.length) {
      res.json(brand);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /brand:
 *   post:
 *     summary: Create a new brand
 *     tags: [Brand]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *     responses:
 *       201:
 *         description: The brand was created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       400:
 *         description: The request body is incorrect or missing
 */
brandRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const brand = new Brand(req.body);
    const createdBrand = await brand.save();
    return res.status(201).json(createdBrand);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /brand/{id}:
 *   delete:
 *     summary: Deletes a brand
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
 *         description: The brand was deleted successfully
 *       404:
 *         description: The brand was not found
 */
brandRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const brandDeleted = await Brand.findByIdAndDelete(id);
    if (brandDeleted) {
      res.json(brandDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /brand/{id}:
 *   put:
 *     summary: Update a brand
 *     tags: [Brand]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The brand ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *     responses:
 *       200:
 *         description: The brand was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       400:
 *         description: The request body is incorrect or missing
 *       404:
 *         description: The brand was not found
 */
brandRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const brandUpdated = await Brand.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (brandUpdated) {
      res.json(brandUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /brand/logo-upload:
 *   post:
 *     summary: Upload a logo for a brand
 *     tags: [Brand]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: logo
 *         type: file
 *         description: The file to upload.
 *       - in: formData
 *         name: brandId
 *         type: string
 *         description: The id of the brand
 *     responses:
 *       200:
 *         description: The logo was uploaded successfully
 *       404:
 *         description: The brand was not found
 */
brandRouter.post("/logo-upload", upload.single("logo"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Renombrado de la imagen
    const originalname = req.file?.originalname as string;
    const path = req.file?.path as string;
    const newPath = `${path}_${originalname}`;
    fs.renameSync(path, newPath);

    // Busqueda de la marca
    const brandId = req.body.brandId;
    const brand = await Brand.findById(brandId);

    if (brand) {
      brand.logoImage = newPath;
      await brand.save();
      res.json(brand);

      console.log("Marca modificada correctamente!");
    } else {
      fs.unlinkSync(newPath);
      res.status(404).send("Marca no encontrada");
    }
  } catch (error) {
    next(error);
  }
});
```

Y también para CAR:

```tsx
/**
 * @swagger
 * tags:
 *   name: Car
 *   description: The cars managing API
 */

import express, { type NextFunction, type Response, type Request } from "express";

// Modelos
import { Car } from "../models/mongo/Car";

// Router propio de usuarios
export const carRouter = express.Router();

/**
 * @swagger
 * /car:
 *   get:
 *     summary: Lists all the cars
 *     tags: [Car]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of items to return
 *     responses:
 *       200:
 *         description: The list of the cars
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Car'
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       400:
 *         description: Invalid page or limit parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
carRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Estamos en el middleware /car que comprueba parámetros");

    const page: number = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit: number = req.query.limit ? parseInt(req.query.limit as string) : 10;

    if (!isNaN(page) && !isNaN(limit) && page > 0 && limit > 0) {
      req.query.page = page as any;
      req.query.limit = limit as any;
      next();
    } else {
      console.log("Parámetros no válidos:");
      console.log(JSON.stringify(req.query));
      res.status(400).json({ error: "Params page or limit are not valid" });
    }
  } catch (error) {
    next(error);
  }
});

carRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Asi leemos query params
    const page: number = req.query.page as any;
    const limit: number = req.query.limit as any;

    const cars = await Car.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .populate(["owner", "brand"]);

    // Num total de elementos
    const totalElements = await Car.countDocuments();

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
});

/**
 * @swagger
 * /car/{id}:
 *   get:
 *     summary: Get a car by ID
 *     tags: [Car]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The car ID
 *     responses:
 *       200:
 *         description: The car info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       404:
 *         description: Car not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
carRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const car = await Car.findById(id).populate(["owner", "brand"]);
    if (car) {
      res.json(car);
    } else {
      res.status(404).json({ error: "Car not found" });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /car/brand/{brand}:
 *   get:
 *     summary: Get cars by brand
 *     tags: [Car]
 *     parameters:
 *       - in: path
 *         name: brand
 *         schema:
 *           type: string
 *         required: true
 *         description: The car brand
 *     responses:
 *       200:
 *         description: List of cars of the specified brand
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 *       404:
 *         description: Cars not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
carRouter.get("/brand/:brand", async (req: Request, res: Response, next: NextFunction) => {
  const brand = req.params.brand;

  try {
    const car = await Car.find({ brand: new RegExp("^" + brand.toLowerCase(), "i") }).populate(["owner", "brand"]);
    if (car?.length) {
      res.json(car);
    } else {
      res.status(404).json({ error: "There are no cars for this brand" });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /car:
 *   post:
 *     summary: Create a new car
 *     tags: [Car]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       201:
 *         description: The car was created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       400:
 *         description: Missing parameters or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
carRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const car = new Car(req.body);
    const createdCar = await car.save();
    return res.status(201).json(createdCar);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /car/{id}:
 *   delete:
 *     summary: Delete a car by ID
 *     tags: [Car]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The car ID
 *     responses:
 *       200:
 *         description: The car was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       404:
 *         description: The car was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
carRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const carDeleted = await Car.findByIdAndDelete(id);
    if (carDeleted) {
      res.json(carDeleted);
    } else {
      res.status(404).json({ error: "Car was not found" });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /car/{id}:
 *   put:
 *     summary: Update a car by ID
 *     tags: [Car]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The car ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       200:
 *         description: The car was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       400:
 *         description: Some parameters are missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: The car was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
carRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const carUpdated = await Car.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (carUpdated) {
      res.json(carUpdated);
    } else {
      res.status(404).json({ error: "Car was not found" });
    }
  } catch (error) {
    next(error);
  }
});
```

Además hemos generado un pequeño script que nos permite exportar a json nuestra configuración de Swagger:

```tsx
import swaggerJSDoc from "swagger-jsdoc";
import { swaggerOptions } from "../swagger-options";
import fs from "fs";

const specs = swaggerJSDoc(swaggerOptions);
const data = JSON.stringify(specs);
fs.writeFileSync("./swagger.json", data);

console.log("Swagger json generado correctamente");
```

