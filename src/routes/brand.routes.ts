/**
 * @swagger
 * tags:
 *   name: Brand
 *   description: The brands managing API
 */

import express from "express";
import multer from "multer";
import { brandService } from "../domain/services/brand.service";
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
brandRouter.get("/", brandService.getAllBrands);

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
brandRouter.get("/:id", brandService.getBrandById);

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
brandRouter.get("/name/:name", brandService.getBrandByName);

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
brandRouter.post("/", brandService.createBrand);

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
brandRouter.delete("/:id", brandService.deleteBrand);

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
brandRouter.put("/:id", brandService.updateBrand);

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
brandRouter.post("/logo-upload", upload.single("logo"), brandService.updateBrandLogo);
