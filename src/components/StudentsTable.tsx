"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStudents } from "@/hooks/useStudents";
import { Loader2, RefreshCw } from "lucide-react";
import Pagination from "./Pagination";

interface TableStudent {
  name: string;
  company: string;
  course: string;
  progress: number;
  lastActivity: string;
  progressColor: string;
}

interface StudentsTableProps {
  searchTerm?: string;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export default function StudentsTable({ 
  searchTerm, 
  page = 1, 
  limit = 10,
  onPageChange 
}: StudentsTableProps) {
  const { data, isLoading, error, refetch, isFetching } = useStudents({
    searchTerm,
    page,
    limit
  });

  const getProgressColor = (progress: number): string => {
    if (progress >= 70) return "#10b981";
    if (progress >= 30) return "#f59e0b"; 
    if (progress < 30 && progress > 0) return "#f9663a";
    return "#E4E4E4";
  };

  const formatLastActivity = (lastActivityAt?: string): string => {
    if (!lastActivityAt) return "No activity";

    const now = new Date();
    const activity = new Date(lastActivityAt);
    const diffMs = now.getTime() - activity.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60)
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const transformedStudents: TableStudent[] = data?.data.map((student) => {
    const primaryEnrollment = student.enrollments[0];
    const progress = primaryEnrollment?.progressPercent;
    const courseName = primaryEnrollment?.course?.title || "-";
    
    return {
      name: student.fullName,
      company: student.company?.name || "No Company",
      course: courseName,
      progress: progress,
      lastActivity: formatLastActivity(student.lastActivityAt),
      progressColor: getProgressColor(progress),
    };
  }) || [];

  const pagination = data?.pagination;

  return (
    <div className="w-full bg-[#f2f5fa]">
      <div className="bg-white rounded-none overflow-hidden shadow-sm">
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400">
            <div className="flex items-center justify-between">
              <p className="text-red-700">Error: {error.message}</p>
              <Button
                onClick={() => refetch()}
                className="bg-red-600 hover:bg-red-700 text-white"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        )}

        {searchTerm && data && (
          <div className="p-4 bg-blue-50 border-b flex items-center justify-between">
            <p className="text-blue-700">
              {pagination?.totalItems === 0 
                ? `No students found matching "${searchTerm}"`
                : `Found ${pagination?.totalItems} student${pagination?.totalItems !== 1 ? 's' : ''} matching "${searchTerm}"`
              }
            </p>
            {isFetching && (
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            )}
          </div>
        )}

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-[#f9663a]" />
              <p className="text-gray-600">Loading students...</p>
            </div>
          </div>
        ) : (
          <div>
            <Table>
              <TableHeader>
                <TableRow className="bg-background-white-2">
                  <TableHead className="py-4 px-6 font-bold text-[#1a1a1a] h-auto">
                    Student Name
                  </TableHead>
                  <TableHead className="text-center py-4 px-6 font-bold text-[#1a1a1a] h-auto">
                    Company
                  </TableHead>
                  <TableHead className="text-center py-4 px-6 font-bold text-[#1a1a1a] h-auto">
                    Course
                  </TableHead>
                  <TableHead className="text-center py-4 px-6 font-bold text-[#1a1a1a] h-auto">
                    Progress
                  </TableHead>
                  <TableHead className="text-center py-4 px-6 font-bold text-[#1a1a1a] h-auto">
                    Last Activity
                  </TableHead>
                  <TableHead className="text-center py-4 px-6 font-bold text-[#1a1a1a] h-auto">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transformedStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-gray-500">
                      {searchTerm ? `No students found matching "${searchTerm}"` : "No students found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  transformedStudents.map((student, index) => (
                    <TableRow
                      key={index}
                      className={`border-b border-[#e4e4e4] hover:bg-gray-50 ${
                        index % 2 === 1 ? 'bg-background-white-2' : ''
                      }`}
                    >
                      <TableCell className="py-4 px-6 text-[#1a1a1a]">
                        {student.name}
                      </TableCell>
                      <TableCell className="text-center py-4 px-6 text-[#1a1a1a]">
                        {student.company}
                      </TableCell>
                      <TableCell className="text-center py-4 px-6 text-[#1a1a1a]">
                        {student.course}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center justify-center gap-3">
                          <div className="relative w-20 h-2 bg-[#e4e4e4] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${student.progress}%`,
                                backgroundColor: student.progressColor,
                              }}
                            />
                          </div>
                          <span className="text-[#1a1a1a] font-medium text-sm w-7">
                            {student.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4 px-6 text-[#1a1a1a]">
                        {student.lastActivity}
                      </TableCell>
                      <TableCell className="py-4 px-6 flex justify-center">
                        <Button
                          className="bg-[#264ac4] hover:bg-[#1e3a9a] text-white rounded-3xl"
                          size="sm"
                          onClick={() => console.log(student.name)}
                        >
                          Mark Reviewed
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <Pagination
              currentPage={pagination?.page || 1}
              totalPages={pagination?.totalPages || 1}
              totalItems={pagination?.totalItems || 0}
              itemsPerPage={pagination?.limit || limit}
              onPageChange={onPageChange || (() => {})}
              isLoading={isFetching}
            />
          </div>
        )}
      </div>
    </div>
  );
}