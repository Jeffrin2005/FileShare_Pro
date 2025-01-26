import express, { Request, Response } from "express";
import File from "../models/file";
import path from "path";
import fs from 'fs';

const router = express.Router();

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  try {
    const file = await File.findById(id);
    if (!file) {
      res.status(404).json({ message: "Download link is expired" });
      return;
    }

    // Construct the absolute file path
    const filePath = path.join(__dirname, "..", "uploads", path.basename(file.path));

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('File not found on disk:', filePath);
      res.status(404).json({ message: "File not found on server" });
      return;
    }

    // Set Content-Disposition header to suggest filename
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Handle errors during streaming
    fileStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Error downloading file" });
      }
    });

  } catch (err) {
    console.error('Download error:', err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Server error during download" });
    }
  }
});

export default router;
