import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    createProduct(manufacturerId: string, dto: CreateProductDto): unknown;
    findAllProducts(manufacturerId: string): unknown;
    findOneProduct(manufacturerId: string, productId: string): unknown;
    updateProduct(manufacturerId: string, productId: string, dto: UpdateProductDto): unknown;
    private generateUniqueProductCode;
    private isProductCodeExists;
}
