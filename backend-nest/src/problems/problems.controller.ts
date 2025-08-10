import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  // Problems
  @Get()
  getProblems() {
    return this.problemsService.getProblems();
  }

  @Get(':slug')
  getProblem(@Param('slug') slug: string) {
    return this.problemsService.getProblem(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createProblem(@Body() createProblemDto: CreateProblemDto) {
    return this.problemsService.createProblem(createProblemDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateProblem(@Param('id') id: string, @Body() updateProblemDto: UpdateProblemDto) {
    return this.problemsService.updateProblem(+id, updateProblemDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteProblem(@Param('id') id: string) {
    return this.problemsService.deleteProblem(+id);
  }

  // Categories
  @Get('categories')
  getCategories() {
    return this.problemsService.getCategories();
  }

  @UseGuards(JwtAuthGuard)
  @Post('categories')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.problemsService.createCategory(createCategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.problemsService.updateCategory(+id, updateCategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.problemsService.deleteCategory(+id);
  }
}
