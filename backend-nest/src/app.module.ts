import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProblemsModule } from './problems/problems.module';
import { SubmitCodeModule } from './submit-code/submit-code.module';

@Module({
  imports: [AuthModule, ProblemsModule, SubmitCodeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
