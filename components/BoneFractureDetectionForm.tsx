'use client'

import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Upload, Camera, Bone, RotateCcw, Save, Share2, Download, Maximize2, ChevronLeft, ChevronRight } from "lucide-react"

export function BoneFractureDetectionForm() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<number>(0)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [imageHistory, setImageHistory] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [annotations, setAnnotations] = useState<string>('')
  const fullscreenRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDarkMode(darkModePreference)
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const onDrop = (acceptedFiles: File[]) => {
    handleFileSelection(acceptedFiles[0])
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize: 5242880 // 5MB
  })

  const handleFileSelection = (selectedFile: File) => {
    setFile(selectedFile)
    const imageUrl = URL.createObjectURL(selectedFile)
    setPreviewUrl(imageUrl)
    setProcessedImageUrl(null)
    setError(null)
    setImageHistory(prev => [...prev, imageUrl])
    setCurrentImageIndex(prev => prev + 1)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    setIsLoading(true)
    setError(null)
    setProgress(0)

    const formData = new FormData()
    formData.append('img', file)

    try {
      const response = await axios.post('YOUR_API_ENDPOINT', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1))
          setProgress(percentCompleted)
        }
      })

      // Assuming the API returns the processed image URL
      setProcessedImageUrl(response.data.processedImage)
      setImageHistory(prev => [...prev, response.data.processedImage])
      setCurrentImageIndex(prev => prev + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing the image')
      setProcessedImageUrl(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreviewUrl(null)
    setProcessedImageUrl(null)
    setError(null)
    setProgress(0)
    setAnnotations('')
  }

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      const video = document.createElement('video')
      video.srcObject = stream
      await video.play()

      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      canvas.getContext('2d')?.drawImage(video, 0, 0)

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'camera_capture.jpg', { type: 'image/jpeg' })
          handleFileSelection(file)
        }
      }, 'image/jpeg')

      stream.getTracks().forEach(track => track.stop())
    } catch (err) {
      console.error(err)
      setError('Unable to access camera')
    }
  }

  const handleSaveImage = () => {
    if (processedImageUrl) {
      const link = document.createElement('a')
      link.href = processedImageUrl
      link.download = 'processed_bone_scan.png'
      link.click()
    }
  }

  const handleShareImage = () => {
    if (processedImageUrl && navigator.share) {
      navigator.share({
        title: 'Bone Fracture Analysis',
        text: 'Check out this bone fracture analysis result!',
        url: processedImageUrl
      }).catch((error) => console.log('Error sharing', error))
    } else {
      alert('Sharing is not supported on this device')
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      fullscreenRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1)
    }
  }

  const handleNextImage = () => {
    if (currentImageIndex < imageHistory.length - 1) {
      setCurrentImageIndex(prev => prev + 1)
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-5xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text">
                Bone Fracture Detection
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <Switch
                  id="dark-mode"
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="camera">Camera</TabsTrigger>
              </TabsList>
              <TabsContent value="upload">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive ? 'border-primary' : 'border-gray-300'
                    }`}
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p className="text-lg">Drop the X-ray image here ...</p>
                    ) : (
                      <div>
                        <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                        <p className="text-lg">Drag & drop an X-ray image here, or click to select one</p>
                        <p className="text-sm text-gray-500 mt-2">Supported formats: JPEG, PNG (Max 5MB)</p>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" disabled={!file || isLoading} className="flex-1">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                        </>
                      ) : (
                        <>
                          <Bone className="mr-2 h-4 w-4" /> Detect Fractures
                        </>
                      )}
                    </Button>
                    <Button type="button" onClick={handleReset} variant="outline" className="flex-1">
                      <RotateCcw className="mr-2 h-4 w-4" /> Reset
                    </Button>
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="camera">
                <div className="space-y-4">
                  <Button onClick={handleCameraCapture} className="w-full">
                    <Camera className="mr-2 h-4 w-4" /> Capture Image
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full"
                >
                  <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
            {isLoading && (
              <div className="w-full mb-4">
                <Progress value={progress} className="w-full" />
              </div>
            )}
            <AnimatePresence>
              {(previewUrl || processedImageUrl) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="w-full space-y-4"
                >
                  <div ref={fullscreenRef} className="relative">
                    <div className="grid grid-cols-2 gap-4">
                      {previewUrl && (
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Original X-ray:</h3>
                          <img src={previewUrl} alt="Original" className="w-full h-auto rounded-lg shadow-lg" />
                        </div>
                      )}
                      {processedImageUrl && (
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Analysis Result:</h3>
                          <img src={processedImageUrl} alt="Analyzed" className="w-full h-auto rounded-lg shadow-lg" />
                        </div>
                      )}
                    </div>
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={handlePreviousImage} disabled={currentImageIndex === 0}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleNextImage} disabled={currentImageIndex === imageHistory.length - 1}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleSaveImage} disabled={!processedImageUrl}>
                      <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                    <Button variant="outline" onClick={handleShareImage} disabled={!processedImageUrl}>
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Download className="mr-2 h-4 w-4" /> Export Report
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Export Analysis Report</DialogTitle>
                          <DialogDescription>
                            Choose the format to export your analysis report.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col space-y-2">
                          <Button onClick={() => alert('Exporting as PDF...')}>Export as PDF</Button>
                          <Button onClick={() => alert('Exporting as DICOM...')}>Export as DICOM</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="annotations">
                      <AccordionTrigger>Medical Notes</AccordionTrigger>
                      <AccordionContent>
                        <textarea
                          className="w-full h-32 p-2 border rounded-md"
                          value={annotations}
                          onChange={(e) => setAnnotations(e.target.value)}
                          placeholder="Add medical notes and observations here..."
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </motion.div>
              )}
            </AnimatePresence>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
