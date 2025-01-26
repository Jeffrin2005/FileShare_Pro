import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import File from "../models/file";

const router = express.Router();

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1000
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

let upload = multer({
  storage,
});

//? @handles file upload
router.post("/upload", upload.single("myFile"), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.json({ error: "Bro!!! file is required" });
      return;
    }
    const { filename, path, size } = req.file;
    const file = await File.create({
      filename,
      path,
      size,
    });
    res.status(200).json({
      id: file._id,
      downloadPageLink: `${process.env.BASE_ENDPOINT_CLIENT}/download/${file._id}`,
    });
  } catch (err) {
    console.log(err instanceof Error ? err.message : 'Unknown error occurred');
    res.status(500).json({ messages: "Server Error :(" });
  }
});

//? @ returns the download link
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const file = await File.findById(id);
    if (!file) {
      res.status(404).json({ message: "File does not exist" });
      return;
    }
    res.status(200).json({
      filename: file.filename,
      size: file.size,
      id: file._id,
    });
  } catch (err) {
    console.log(err instanceof Error ? err.message : 'Unknown error occurred');
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
