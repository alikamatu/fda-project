import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

const imageStorage = diskStorage({
  destination: './uploads/products',
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `product-${uniqueSuffix}${extname(file.originalname)}`);
  },
});

function imageFileFilter(_req, file, cb) {
  if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
    return cb(new BadRequestException('Only image files are allowed'), false);
  }
  cb(null, true);
}

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

  @Post(':productId/images')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: imageStorage,
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadProductImages(
    @Request() req,
    @Param('productId') productId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No images provided');
    }
    const manufacturerId = req.user.id;
    const imageUrls = files.map((f) => `/uploads/products/${f.filename}`);
    return this.productsService.addProductImages(manufacturerId, productId, imageUrls);
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