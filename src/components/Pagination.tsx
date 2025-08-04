"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function PaginationComponent({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  isLoading = false
}: PaginationProps) {
  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 4; 
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (totalPages > 1) {
        pages.push(2);
      }
      if (totalPages > 2) {
        pages.push(3);
      }
      
      if (currentPage > 4) {
        pages.push('...');
      }
      
      const start = Math.max(4, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
          
      if (!pages.includes(totalPages) && totalPages > 3) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePageClick = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    if (!isLoading && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePrevClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoading && currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoading && currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
      <div className="text-sm text-gray-600">
        Showing {startItem} to {endItem} of {totalItems} students
      </div>
      
      <Pagination className="justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={handlePrevClick}
              className={
                currentPage <= 1 || isLoading 
                  ? "pointer-events-none opacity-50" 
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
          
          {pageNumbers.map((page, index) => (
            <PaginationItem key={index}>
              {page === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => handlePageClick(e, page as number)}
                  isActive={currentPage === page}
                  className={
                    isLoading 
                      ? "pointer-events-none opacity-50" 
                      : "cursor-pointer"
                  }
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={handleNextClick}
              className={
                currentPage >= totalPages || isLoading 
                  ? "pointer-events-none opacity-50" 
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}