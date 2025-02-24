'use client';

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, AlertCircle, CheckCircle2 } from "lucide-react";

interface PneumoniaAnalysis {
  pneumonia_analysis: {
    type: string;
    description: string;
    next_steps: string[];
  };
}

export default function PneumoniaDetection() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PneumoniaAnalysis | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    handleFileSelection(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  const handleFileSelection = (selectedFile: File) => {
    setFile(selectedFile);
    const imageUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(imageUrl);
    setError(null);
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('img', file);

      const response = await axios.post<PneumoniaAnalysis>(
        'http://127.0.0.1:5000/pneumonia',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setResult(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Pneumonia Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div>
                  {isDragActive ? (
                    <p className="text-lg">Drop the chest X-ray here ...</p>
                  ) : (
                    <>
                      <p className="text-lg">Drag & drop a chest X-ray here, or click to select</p>
                      <p className="text-sm text-gray-500 mt-2">Supported formats: JPEG, PNG</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {previewUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <Label className="text-lg font-medium">Preview:</Label>
                <div className="relative rounded-lg overflow-hidden">
                  <img 
                    src={previewUrl} 
                    alt="X-ray preview" 
                    className="w-full h-auto"
                  />
                </div>
              </motion.div>
            )}

            <Button 
              type="submit" 
              disabled={!file || isLoading} 
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze X-ray'
              )}
            </Button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4"
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-4"
            >
              <Alert className="bg-primary/5 border-primary/20">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertTitle className="text-lg font-semibold">
                  {result.pneumonia_analysis.type}
                </AlertTitle>
                <AlertDescription className="mt-2">
                  <p className="text-gray-700 dark:text-gray-300">
                    {result.pneumonia_analysis.description}
                  </p>
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Next Steps:</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      {result.pneumonia_analysis.next_steps.map((step, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300">
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
