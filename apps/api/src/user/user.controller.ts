import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto, RegisterUserNestedDto, CreateProfileDto } from './dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto) as any;
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerNested(@Body() registerDto: RegisterUserNestedDto): Promise<UserResponseDto> {
    return this.userService.registerNested(registerDto) as any;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('me/profile')
  async createMyProfile(
    @Request() req: any,
    @Body() profileDto: CreateProfileDto,
  ) {
    return this.userService.createProfile(req.user.userId, profileDto);
  }

  @Post(':id/profile')
  async createProfile(
    @Param('id') id: string,
    @Body() profileDto: CreateProfileDto,
  ) {
    return this.userService.createProfile(id, profileDto);
  }

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll() as any;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findOne(id) as any;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(id, updateUserDto) as any;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
