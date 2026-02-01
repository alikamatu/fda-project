import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    createProduct(req: any, createProductDto: CreateProductDto): unknown;
    getAllProducts(req: any): unknown;
    getProduct(req: any, productId: string): unknown;
    updateProduct(req: any, productId: string, updateProductDto: UpdateProductDto): unknown;
}
