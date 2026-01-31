import sharp from 'sharp';
import { join } from 'path';
import { promises as fs } from 'fs';
import { BadRequestException } from '@nestjs/common';

export const optimizeImage = async (file: Express.Multer.File, userId: string) => {
  const uploadPath = join(process.cwd(), 'uploads/media');
  
  // Asegurarse de que el directorio existe
  try {
    await fs.mkdir(uploadPath, { recursive: true });
  } catch (err) {
    // Directorio ya existe
  }

  const timestamp = Date.now();
  const fileName = `${userId}-${timestamp}.webp`;
  const filePath = join(uploadPath, fileName);

  try {
    await sharp(file.buffer)
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(filePath);

    return {
      fileName,
      url: `/uploads/media/${fileName}`,
      path: filePath,
      mimeType: 'image/webp',
    };
  } catch (error) {
    throw new BadRequestException('Error al procesar la imagen');
  }
};
