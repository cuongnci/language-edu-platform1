"use client";
import StudentsSearch from "@/components/StudentsSearch";
import StudentsTable from "@/components/StudentsTable";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function MainTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams?.get("search") || ""
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams?.get("page") || "1")
  );
  const [limit] = useState(parseInt(searchParams?.get("limit") || "10"));

  const updateURL = (
    search: string,
    page: number,
    limitParam: number = limit
  ) => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (page > 1) params.set("page", page.toString());
    if (limitParam !== 10) params.set("limit", limitParam.toString());

    const queryString = params.toString();
    const newURL = queryString ? `?${queryString}` : "/";

    router.push(newURL, { scroll: false });
  };

  useEffect(() => {
    const urlSearch = searchParams?.get("search") || "";
    const urlPage = parseInt(searchParams?.get("page") || "1");

    setSearchTerm(urlSearch);
    setCurrentPage(urlPage);
  }, [searchParams]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    updateURL(term, 1, limit);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(searchTerm, page, limit);
  };

  return (
    <>
      <StudentsSearch onSearch={handleSearch} currentSearch={searchTerm} />
      <StudentsTable
        searchTerm={searchTerm}
        page={currentPage}
        limit={limit}
        onPageChange={handlePageChange}
      />
    </>
  );
}
