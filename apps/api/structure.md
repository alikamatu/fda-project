apps/api/src/
│
├── app.module.ts
├── main.ts
│
├── config/
│   ├── config.module.ts
│   ├── jwt.config.ts
│   ├── database.config.ts
│
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
│
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── local.strategy.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   └── decorators/
│       └── roles.decorator.ts
│
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
│
├── manufacturers/
│   ├── manufacturers.module.ts
│   ├── manufacturers.controller.ts
│   ├── manufacturers.service.ts
│   └── dto/
│       └── create-manufacturer.dto.ts
│
├── products/
│   ├── products.module.ts
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── dto/
│       ├── create-product.dto.ts
│       └── approve-product.dto.ts
│
├── batches/
│   ├── batches.module.ts
│   ├── batches.controller.ts
│   ├── batches.service.ts
│   └── dto/
│       └── create-batch.dto.ts
│
├── verification/
│   ├── verification.module.ts
│   ├── verification.controller.ts
│   ├── verification.service.ts
│   └── dto/
│       └── verify-code.dto.ts
│
├── alerts/
│   ├── alerts.module.ts
│   ├── alerts.service.ts
│
├── notifications/
│   ├── notifications.module.ts
│   ├── notifications.service.ts
│
├── audit/
│   ├── audit.module.ts
│   └── audit.service.ts
│
└── common/
    ├── decorators/
    ├── filters/
    ├── interceptors/
    ├── pipes/
    └── constants/