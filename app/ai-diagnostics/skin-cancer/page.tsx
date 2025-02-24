import React from 'react'
import { SkinCancerDetectionForm } from '@/components/SkinCancerDetectionForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, ChevronRight } from 'lucide-react';


export default function SkinCancer() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4 space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Skin Cancer Detection</h1>
          <p className="text-xl text-muted-foreground">Advanced AI-powered analysis for Skin Cancer Detection</p>
        </header>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            This tool is for informational purposes only and should not replace professional medical advice.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Image Analysis</CardTitle>
              <CardDescription>Upload and analyze MRI scans for potential abnormalities</CardDescription>
            </CardHeader>
            <CardContent>
              <SkinCancerDetectionForm />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Skin Cancer</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <p className="text-sm text-muted-foreground">
                    Skin cancer is one of the most common types of cancer, often caused by prolonged exposure to ultraviolet (UV)
                    radiation. Early detection is crucial for effective treatment and improved outcomes. This AI tool assists in
                    analyzing skin lesions from imaging scans, helping healthcare professionals identify potential malignancies
                    and make accurate diagnoses.
                  </p>
                  <Separator className="my-4" />
                  <h4 className="font-semibold mb-2">Common Symptoms</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>New or changing moles</li>
                    <li>Unusual skin growths or sores that don’t heal</li>
                    <li>Itchy or bleeding spots</li>
                    <li>Irregular borders or uneven color in moles</li>
                    <li>Changes in skin texture or appearance</li>
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detection Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Accuracy</span>
                    <Badge variant="secondary">93%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Sensitivity</span>
                    <Badge variant="secondary">90%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Specificity</span>
                    <Badge variant="secondary">94%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="help">Help</TabsTrigger>
              </TabsList>
              <TabsContent value="info">
                <Card>
                  <CardHeader>
                    <CardTitle>How It Works</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Our AI model analyzes skin images using advanced deep learning techniques to detect potential
                      abnormalities, such as malignant lesions, atypical moles, or early signs of skin cancer.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="resources">
                <Card>
                  <CardHeader>
                    <CardTitle>Helpful Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>
                        <a href="#" className="text-sm text-blue-500 hover:underline">
                          Understanding Gynecological Conditions
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-sm text-blue-500 hover:underline">
                          Prevention Tips
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-sm text-blue-500 hover:underline">
                          Treatment Options
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="help">
                <Card>
                  <CardHeader>
                    <CardTitle>Need Assistance?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      If you need help using this tool or have questions about your results, please don`&apos;`t hesitate to
                      reach out.
                    </p>
                    <Button variant="outline">
                      Contact Support
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>


      </div>
    </div>
  )
}
