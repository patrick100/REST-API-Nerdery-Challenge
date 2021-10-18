import { Prisma } from '@prisma/client';
import { prisma } from '../seed';

const reports: Prisma.ReportCreateInput[] = [
  {
    title: 'It is a malicious post',
    description: "This post doesn't show any kind of evidence",
    user: { connect: { id: 1 } },
    resourceId: 4,
    type: 'POST',
  },
  {
    title: 'This comment instinct hate',
    description: 'This type of people need therapy',
    user: { connect: { id: 2 } },
    resourceId: 4,
    type: 'COMMENT',
  },
  {
    title: 'This comment instinct hate again',
    description: 'I insist this type of people need therapy',
    user: { connect: { id: 2 } },
    resourceId: 4,
    type: 'COMMENT',
  },
];

const reportsSeed = async () => {
  for (const report of reports) {
    await prisma.report.create({
      data: report,
    });
  }
};

export default reportsSeed;
