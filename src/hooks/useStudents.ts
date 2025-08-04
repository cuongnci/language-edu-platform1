import { useQuery } from '@tanstack/react-query'

interface Student {
  id: string;
  fullName: string;
  company: {
    name: string;
  };
  currentCourse?: {
    title: string;
  };
  enrollments: {
    progressPercent: number;
    course: {
      title: string;
    };
  }[];
  lastActivityAt?: string;
}

interface ApiResponse {
  data: Student[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

interface UseStudentsParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
}

const fetchStudents = async ({ 
  searchTerm, 
  page = 1, 
  limit = 10 
}: UseStudentsParams): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  
  if (searchTerm) params.append('search', searchTerm);
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  const response = await fetch(`/api/students?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch students');
  }
  
  return response.json();
};

export const useStudents = (params: UseStudentsParams = {}) => {
  return useQuery({
    queryKey: ['students', params.searchTerm, params.page, params.limit],
    queryFn: () => fetchStudents(params),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};