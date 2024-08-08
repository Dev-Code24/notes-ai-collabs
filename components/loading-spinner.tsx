import { LoaderCircle } from "lucide-react"

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center mt-10">
      <LoaderCircle className="h-16 w-16 animate-spin" />
    </div>
  )
}
export default LoadingSpinner