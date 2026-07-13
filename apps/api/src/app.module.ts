import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StudySetsModule } from './modules/study-sets/study-sets.module';
import { CardsModule } from './modules/cards/cards.module';
import { TagsModule } from './modules/tags/tags.module';
import { SearchModule } from './modules/search/search.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ClassesModule } from './modules/classes/classes.module';
import { VersionsModule } from './modules/versions/versions.module';
import { DiagramsModule } from './modules/diagrams/diagrams.module';
import { AiModule } from './modules/ai/ai.module';
import { MediaModule } from './modules/media/media.module';
import { ProgressModule } from './modules/progress/progress.module';
import { FoldersModule } from './modules/folders/folders.module';
import { EmailModule } from './modules/email/email.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get('DB_PORT', 5432),
        username: config.get('DB_USERNAME', 'postgres'),
        password: config.get('DB_PASSWORD', 'postgres'),
        database: config.get('DB_DATABASE', 'quizlet'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        synchronize: true,
        logging: config.get('NODE_ENV') === 'development',
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      useFactory: (config: ConfigService) => ([{
        ttl: config.get<number>('THROTTLE_TTL', 60000),
        limit: config.get<number>('THROTTLE_LIMIT', 100),
      }]),
      inject: [ConfigService],
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    StudySetsModule,
    CardsModule,
    TagsModule,
    SearchModule,
    CommentsModule,
    ClassesModule,
    VersionsModule,
    DiagramsModule,
    AiModule,
    MediaModule,
    ProgressModule,
    FoldersModule,
    EmailModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
