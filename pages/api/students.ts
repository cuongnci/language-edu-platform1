import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

interface ApiResponse {
  data: unknown[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

interface QueryParams {
  search?: string;
  page?: string;
  limit?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { search = '', page = '1', limit = '10' } = req.query as QueryParams;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  if (isNaN(pageNum) || pageNum < 1) {
    return res.status(400).json({ error: 'Invalid page number' });
  }
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return res.status(400).json({ error: 'Invalid limit (must be 1-100)' });
  }

  const skip = (pageNum - 1) * limitNum;

  const where = search
    ? {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  try {
    const [data, totalItems] = await prisma.$transaction([
      prisma.student.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { id: 'asc' as const },
        select: {
          id: true,
          fullName: true,
          lastActivityAt: true,
          company: {
            select: {
              name: true,
            },
          },
          currentCourse: {
            select: {
              title: true,
            },
          },
          enrollments: {
            select: {
              progressPercent: true,
              course: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      }),
      prisma.student.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / limitNum);

    res.status(200).json({
      data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}