import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { SubmitCodeService } from './submit-code.service';
import { SubmitCodeDto } from './dto/submit-code.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('submit-code')
export class SubmitCodeController {
  constructor(private readonly submitCodeService: SubmitCodeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  submitCode(@Body() submitCodeDto: SubmitCodeDto, @Request() req) {
    return this.submitCodeService.submitCode(submitCodeDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  getUserSubmissions(@Request() req) {
    return this.submitCodeService.getUserSubmissions(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAllSubmissions() {
    return this.submitCodeService.getAllSubmissions();
  }
}
