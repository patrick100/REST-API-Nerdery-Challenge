import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { ReportsService } from '../services/reports.service';
import { CreateReportDto } from '../dtos/reports/request/create-report.dto';
import { ReportDto } from '../dtos/reports/response/report.dto';
import RequestWithUserId from '../interfaces/request-with-user-id.interface';
import { convertToJson, responseApi } from '../utils/serializer';

export async function reportPost(expressRequest: Request, res: Response): Promise<void> {
  const req = expressRequest as RequestWithUserId;
  const dto = plainToClass(CreateReportDto, {
    title: req.body.title,
    description: req.body.description,
    resourceId: +req.params.postId,
    userId: +req.userId,
    type: 'POST',
  });
  await dto.isValid();
  const report = await ReportsService.reportPost(dto);

  const reportJson = convertToJson(plainToClass(ReportDto, report));

  res.status(201).json(responseApi(reportJson));
}

export async function reportComment(expressRequest: Request, res: Response): Promise<void> {
  const req = expressRequest as RequestWithUserId;
  const dto = plainToClass(CreateReportDto, {
    title: req.body.title,
    description: req.body.description,
    resourceId: +req.params.commentId,
    userId: +req.userId,
    type: 'COMMENT',
  });
  await dto.isValid();
  const report = await ReportsService.reportComment(dto);

  const reportJson = convertToJson(plainToClass(ReportDto, report));

  res.status(201).json(responseApi(reportJson));
}
