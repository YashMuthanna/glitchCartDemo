import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-24 text-center">
      <h1 className="text-6xl font-bold text-neutral-900 mb-4">404</h1>
      <h2 className="text-2xl font-medium text-neutral-700 mb-6">Page Not Found</h2>
      <p className="text-neutral-500 max-w-md mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}
