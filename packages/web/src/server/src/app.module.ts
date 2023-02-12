import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CommonModule } from './common/common.module';
import { ApiModule } from './api/api.module';
import { RouterModule, Routes } from '@nestjs/core';
import * as path from 'path';

const routes: Routes = [
  {
    path: 'api',
    module: ApiModule,
  },
];

const staticModules =
  process.env.NODE_ENV === 'production'
    ? [
        ServeStaticModule.forRoot({
          rootPath: path.join(process.cwd(), 'public'), // path to your static files - only in production
        }),
      ]
    : [];

@Module({
  imports: [
    CommonModule,
    ApiModule,
    RouterModule.register(routes),
    ...staticModules,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
