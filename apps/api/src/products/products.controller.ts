import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('manufacturer/products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MANUFACTURER)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async createProduct(@Request() req, @Body() createProductDto: CreateProductDto) {
    const manufacturerId = req.user.id;
    return this.productsService.createProduct(manufacturerId, createProductDto);
  }

  @Get()
  async getAllProducts(@Request() req) {
    const manufacturerId = req.user.id;
    return this.productsService.findAllProducts(manufacturerId);
  }

  @Get(':productId')
  async getProduct(@Request() req, @Param('productId') productId: string) {
    const manufacturerId = req.user.id;
    return this.productsService.findOneProduct(manufacturerId, productId);
  }

  @Put(':productId')
  async updateProduct(
    @Request() req,
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const manufacturerId = req.user.id;
    return this.productsService.updateProduct(manufacturerId, productId, updateProductDto);
  }
}