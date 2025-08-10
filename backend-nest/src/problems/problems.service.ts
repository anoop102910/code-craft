import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { S3Service } from '../s3.service';

@Injectable()
export class ProblemsService {
  constructor(private prisma: PrismaService, private s3: S3Service) {}

  // Problems
  async getProblems() {
    return this.prisma.problem.findMany();
  }

  async getProblem(slug: string) {
    return this.prisma.problem.findUnique({ where: { slug } });
  }

  async createProblem(createProblemDto: CreateProblemDto) {
    const { all_test_cases, ...rest } = createProblemDto;
    const s3Key = `test-cases/${Date.now()}-${createProblemDto.slug}`;
    await this.s3.uploadFile(s3Key, Buffer.from(all_test_cases));
    const problem = await this.prisma.problem.create({
      data: { ...rest, all_test_cases: s3Key },
    });
    return problem;
  }

  async updateProblem(id: number, updateProblemDto: UpdateProblemDto) {
    const { all_test_cases, ...rest } = updateProblemDto;
    if (all_test_cases) {
      const s3Key = `test-cases/${Date.now()}-${updateProblemDto.slug}`;
      await this.s3.uploadFile(s3Key, Buffer.from(all_test_cases));
      return this.prisma.problem.update({
        where: { id },
        data: { ...rest, all_test_cases: s3Key },
      });
    }
    return this.prisma.problem.update({ where: { id }, data: rest });
  }

  async deleteProblem(id: number) {
    return this.prisma.problem.delete({ where: { id } });
  }

  // Categories
  async getCategories() {
    return this.prisma.category.findMany();
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({ data: createCategoryDto });
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({ where: { id }, data: updateCategoryDto });
  }

  async deleteCategory(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}
