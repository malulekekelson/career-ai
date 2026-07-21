import { useState, useCallback } from "react"
import { projects } from '@/lib/api'
import { useNavigate } from "react-router-dom"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { 
  Upload, 
  File, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from "lucide-react"

interface UploadedFile {
  file: File
  name: string
  size: number
  type: string
  progress: number
  status: "idle" | "uploading" | "success" | "error"
}

const UploadPage = () => {
  const navigate = useNavigate()
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF or DOCX file")
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB")
      return
    }

    setError(null)
    setUploadedFile({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: "idle"
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"]
    },
    maxFiles: 1,
    multiple: false
  })

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }


// Inside handleUpload
const handleUpload = async () => {
  if (!uploadedFile) return

  setIsUploading(true)
  setUploadedFile({ ...uploadedFile, status: 'uploading', progress: 0 })

  try {
    const response = await projects.upload(uploadedFile.file)
    const { projectId } = response.data

    setUploadedFile((prev) => {
      if (!prev) return null
      return { ...prev, progress: 100, status: 'success' }
    })

    // Redirect to project detail
    setTimeout(() => {
      navigate(`/project/${projectId}`)
    }, 1500)
  } catch (err: any) {
    console.error(err)
    setUploadedFile((prev) => {
      if (!prev) return null
      return { ...prev, status: 'error' }
    })
    setError(err.response?.data?.error || 'Upload failed. Please try again.')
  } finally {
    setIsUploading(false)
  }
}

  // Remove file
  const removeFile = () => {
    setUploadedFile(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Your CV</h1>
          <p className="mt-2 text-gray-500">
            Upload your CV and let AI analyze, optimize, and boost your career.
          </p>
        </div>

        {/* Drop zone */}
        {!uploadedFile && (
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-lg font-medium text-gray-700">
              {isDragActive
                ? "Drop your CV here"
                : "Drag & drop your CV here"}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              or click to browse files
            </p>
            <p className="mt-4 text-xs text-gray-400">
              Supports PDF, DOCX (Max 10MB)
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            <div className="flex items-center">
              <AlertCircle className="mr-2 h-4 w-4" />
              {error}
            </div>
          </div>
        )}

        {/* Uploaded file preview */}
        {uploadedFile && (
          <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  {uploadedFile.status === "success" ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : uploadedFile.status === "error" ? (
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  ) : uploadedFile.type.includes("pdf") ? (
                    <FileText className="h-6 w-6" />
                  ) : (
                    <File className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(uploadedFile.size)} • {uploadedFile.type.includes("pdf") ? "PDF" : "DOCX"}
                  </p>
                  {uploadedFile.status === "uploading" && (
                    <div className="mt-2 w-64">
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                          style={{ width: `${uploadedFile.progress}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Uploading... {uploadedFile.progress}%
                      </p>
                    </div>
                  )}
                  {uploadedFile.status === "success" && (
                    <p className="mt-2 text-sm text-green-600">
                      ✅ Upload successful! Redirecting...
                    </p>
                  )}
                  {uploadedFile.status === "error" && (
                    <p className="mt-2 text-sm text-red-600">
                      ❌ Upload failed. Please try again.
                    </p>
                  )}
                </div>
              </div>

              {uploadedFile.status === "idle" && (
                <button
                  onClick={removeFile}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Upload button */}
            {uploadedFile.status === "idle" && (
              <div className="mt-6">
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload CV
                    </>
                  )}
                </Button>
                <button
                  onClick={removeFile}
                  className="ml-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Retry button for errors */}
            {uploadedFile.status === "error" && (
              <div className="mt-6">
                <Button
                  onClick={() => {
                    setUploadedFile({ ...uploadedFile, status: "idle", progress: 0 })
                    setError(null)
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Retry Upload
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Tips section */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
          <h3 className="font-medium text-gray-900">💡 Tips for best results</h3>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            <li>• Use a PDF format for best compatibility</li>
            <li>• Keep your CV to 2-3 pages</li>
            <li>• Include clear job titles and dates</li>
            <li>• Highlight measurable achievements</li>
            <li>• Use standard section headings (Experience, Education, Skills)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default UploadPage