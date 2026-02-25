import { Controller, Post, Get, Param, UseGuards, Req } from '@nestjs/common';
import { FavoriteService } from './favorite.service';

@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post(':serviceId')
  async toggle(@Param('serviceId') serviceId: string, @Req() req: any) {
    // TODO: Usar el userId del JWT cuando la auth esté lista. 
    // Por ahora, si no hay auth, podemos recibirlo de alguna forma o usar un ID hardcoded para demo
    const userId = req.user?.id || 'demo-user-id'; 
    return this.favoriteService.toggle(userId, serviceId);
  }

  @Get(':serviceId/check')
  async check(@Param('serviceId') serviceId: string, @Req() req: any) {
    const userId = req.user?.id || 'demo-user-id';
    return { isFavorite: await this.favoriteService.isFavorite(userId, serviceId) };
  }

  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user?.id || 'demo-user-id';
    return this.favoriteService.findAllByUser(userId);
  }
}
