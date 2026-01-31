import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';

@Controller('api/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /**
   * POST /api/media/:userId
   * Agregar un nuevo medio a la galería
   */
  @Post(':userId')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('userId') userId: string,
    @Body() createMediaDto: CreateMediaDto,
  ) {
    return this.mediaService.addMedia(userId, createMediaDto);
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
