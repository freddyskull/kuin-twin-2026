import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { optimizeImage } from './media.utils';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /**
   * POST /api/media/:userId
   * Subir y optimizar una imagen a la galería local
   */
  @Post(':userId')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Param('userId') userId: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp|avif)$/,
        })
        .addMaxSizeValidator({
          maxSize: 2 * 1024 * 1024, // 2MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          exceptionFactory: (error) => {
            if (error.includes('file type')) {
              return new BadRequestException('El formato de imagen no es válido. Usa JPG, PNG, WEBP o AVIF.');
            }
            if (error.includes('max size')) {
              return new BadRequestException('La imagen es demasiado grande. El límite es de 2MB.');
            }
            return new BadRequestException('Error al validar el archivo: ' + error);
          },
        }),
    )
    file: Express.Multer.File,
  ) {
    // 1. Optimizar la imagen
    const processed = await optimizeImage(file, userId);

    // 2. Guardar en DB
    return this.mediaService.addMedia(userId, {
      url: processed.url,
      fileName: processed.fileName,
      mimeType: processed.mimeType,
      size: file.size,
      alt: file.originalname,
    });
  }

  /**
   * GET /api/media/user/:userId
   * Listar toda la galería de un usuario
   */
  @Get('user/:userId')
  async findAll(@Param('userId') userId: string) {
    return this.mediaService.findAllByUser(userId);
  }

  /**
   * DELETE /api/media/:mediaId
   * Eliminar un medio (WP style)
   */
  @Delete(':mediaId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('mediaId') mediaId: string) {
    return this.mediaService.remove(mediaId);
  }
}
