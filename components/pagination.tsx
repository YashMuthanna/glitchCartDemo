"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always include first page
      pages.push(1)

      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if at the beginning
      if (currentPage <= 3) {
        end = 4
      }

      // Adjust if at the end
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push("ellipsis-start")
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push("ellipsis-end")
      }

      // Always include last page
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav className="flex justify-center mt-8">
      <ul className="flex items-center gap-1">
        <li>
          <Button variant="outline" size="icon" asChild disabled={currentPage === 1}>
            <Link href={`/products?page=${currentPage - 1}`} aria-label="Previous page">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
        </li>

        {pageNumbers.map((page, index) => {
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <li key={`ellipsis-${index}`} className="px-2">
                <span className="text-neutral-500">...</span>
              </li>
            )
          }

          return (
            <li key={index}>
              <Button variant={currentPage === page ? "default" : "outline"} size="icon" asChild>
                <Link href={`/products?page=${page}`}>{page}</Link>
              </Button>
            </li>
          )
        })}

        <li>
          <Button variant="outline" size="icon" asChild disabled={currentPage === totalPages}>
            <Link href={`/products?page=${currentPage + 1}`} aria-label="Next page">
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </li>
      </ul>
    </nav>
  )
}
