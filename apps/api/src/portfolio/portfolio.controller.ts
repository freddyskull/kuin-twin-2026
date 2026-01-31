import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioItemDto } from './dto';

@Controller('api/portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  /**
   * GET /api/portfolio/user/:userId
   * Obtener el portafolio de un usuario
   */
  @Get('user/:userId')
  async getByUser(@Param('userId') userId: string) {
    return this.portfolioService.getByUserId(userId);
  }

  /**
   * POST /api/portfolio/:userId
   * Agregar un item al portafolio
   */
  @Post(':userId')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('userId') userId: string,
    @Body() createDto: CreatePortfolioItemDto,
  ) {
    return this.portfolioService.addPortfolioItem(userId, createDto);
  }

  /**
   * DELETE /api/portfolio/:itemId
   * Eliminar un item del portafolio
   */
  @Delete(':itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('itemId') itemId: string) {
    return this.portfolioService.removePortfolioItem(itemId);
  }
}
