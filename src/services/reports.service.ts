import { prisma } from '../server';
import { CreateReportDto } from '../dtos/reports/request/create-report.dto';
import { Report } from '@prisma/client';
import createError from 'http-errors';

export class ReportsService {
  static async reportPost(input: CreateReportDto): Promise<Report> {
    const post = await prisma.post.findUnique({ where: { id: input.resourceId } });

    if (!post) throw createError(404, 'Not Found Post');

    return await prisma.report.create({ data: input });
  }

  static async reportComment(input: CreateReportDto): Promise<Report> {
    const comment = await prisma.comment.findUnique({ where: { id: input.resourceId } });

    if (!comment) throw createError(404, 'Not Found Comment');

    return await prisma.report.create({ data: input });
  }
}
