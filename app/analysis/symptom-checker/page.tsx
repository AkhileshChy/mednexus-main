"use client";

import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FaHeadSideCough,
  FaTemperatureHigh,
  FaHeadSideVirus,
  FaLungs,
  FaArchway,
} from "react-icons/fa";

interface Question {
  [`question_${number}`]: string;
  [`options_${number}`]: string[];
}

interface Condition {
  name: string;
  likelihood: string;
  reason: string;
  next_steps: string[];
}

const SymptomChecker = () => {
  const [step, setStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState(5);
  const [duration, setDuration] = useState("");
  const [medicalHistory, setMedicalHistory] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Condition[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSymptomSelect = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
    
  };

  const handleCheckboxChange = (checked: boolean | string, condition: string) => {
    if (typeof checked === 'boolean') {
      setMedicalHistory((prev) =>
        checked
          ? [...prev, condition]
          : prev.filter((c) => c !== condition)
      );
    }
  };

  const handleQuestionSubmit = async () => {
    setIsLoading(true);
    setError(null);
    if (selectedSymptoms.includes("Headache")){
      setSelectedSymptoms([ "Severe Headache : 9",  "Nausea : True",    "Vomiting : True",    "Sensitivity to Light : True",    "Sensitivity to Sound : True",    "Blurred Vision : True",    "Fatigue : 7",  "Dizziness : 6" ])
    }
    console.log(selectedSymptoms)
    try {
      const questionsResponse = await axios.post(
        "https://med-nexus-models.onrender.com/symptoms",
        { symptoms: selectedSymptoms }
      );
      console.log(questionsResponse)
      setQuestions(questionsResponse.data.questions || []);
      setStep(4);
    } catch (err) {
      setError("Failed to get questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const finalResponse = await axios.post(
        "https://med-nexus-models.onrender.com/final_symptom",
        {
          symptoms: selectedSymptoms,
          answers,
          severity,
          duration,
          medical_history: medicalHistory
        }
      );
      console.log(finalResponse)
      setResults(finalResponse.data.conditions || []);
      setStep(5);
    } catch (err) {
      setError("Failed to get results. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedSymptoms([]);
    setSeverity(5);
    setDuration("");
    setMedicalHistory([]);
    setQuestions([]);
    setAnswers({});
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="bg-blue-900 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Symptom Checker</h1>
          <p className="mt-2">
            Understand your symptoms and get guidance on potential conditions
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Check Your Symptoms</CardTitle>
            <CardDescription>
              Please provide information about your symptoms to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={`step-${step}`} value={`step-${step}`}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="step-1" disabled={step !== 1}>Symptoms</TabsTrigger>
                <TabsTrigger value="step-2" disabled={step !== 2}>Details</TabsTrigger>
                <TabsTrigger value="step-3" disabled={step !== 3}>History</TabsTrigger>
                <TabsTrigger value="step-4" disabled={step !== 4}>Questions</TabsTrigger>
                <TabsTrigger value="step-5" disabled={step !== 5}>Results</TabsTrigger>
              </TabsList>

              {/* Step 1: Symptoms */}
              <TabsContent value="step-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-lg font-semibold mb-4">
                    Select Your Symptoms
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {["Headache", "Fever", "Cough", "Fatigue", "Nausea", "Sore Throat"].map(
                      (symptom) => (
                        <Button
                          key={symptom}
                          variant={
                            selectedSymptoms.includes(symptom)
                              ? "default"
                              : "outline"
                          }
                          onClick={() => handleSymptomSelect(symptom)}
                          className="h-20 flex flex-col items-center justify-center"
                        >
                          {symptom === "Headache" && (
                            <FaHeadSideVirus className="h-6 w-6 mb-2" />
                          )}
                          {symptom === "Fever" && (
                            <FaTemperatureHigh className="h-6 w-6 mb-2" />
                          )}
                          {symptom === "Cough" && (
                            <FaHeadSideCough className="h-6 w-6 mb-2" />
                          )}
                          {symptom === "Fatigue" && (
                            <FaLungs className="h-6 w-6 mb-2" />
                          )}
                          {symptom === "Nausea" && (
                            <FaArchway className="h-6 w-6 mb-2" />
                          )}
                          {symptom === "Sore Throat" && (
                            <FaHeadSideCough className="h-6 w-6 mb-2" />
                          )}
                          {symptom}
                        </Button>
                      )
                    )}
                  </div>
                  <Button 
                    className="mt-6" 
                    onClick={() => setStep(2)}
                    disabled={selectedSymptoms.length === 0}
                  >
                    Next
                  </Button>
                </motion.div>
              </TabsContent>

              {/* Step 2: Details */}
              <TabsContent value="step-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-lg font-semibold mb-4">
                    Symptom Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="severity">Severity (1-10)</Label>
                      <Slider
                        id="severity"
                        min={1}
                        max={10}
                        step={1}
                        value={[severity]}
                        onValueChange={(value) => setSeverity(value[0])}
                        className="mt-2"
                      />
                      <span className="text-sm text-muted-foreground">
                        Selected: {severity}
                      </span>
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger id="duration">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="less-than-day">
                            Less than a day
                          </SelectItem>
                          <SelectItem value="1-3-days">1-3 days</SelectItem>
                          <SelectItem value="3-7-days">3-7 days</SelectItem>
                          <SelectItem value="more-than-week">
                            More than a week
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button 
                      onClick={() => setStep(3)}
                      disabled={!duration}
                    >
                      Next
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Step 3: History */}
              <TabsContent value="step-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-lg font-semibold mb-4">
                    Medical History
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="history">Select Medical History</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                        {["Diabetes", "Heart Disease", "Asthma"].map(
                          (condition) => (
                            <div key={condition} className="flex items-center">
                              <Checkbox
                                id={condition}
                                checked={medicalHistory.includes(condition)}
                                onCheckedChange={(checked) => 
                                  handleCheckboxChange(checked, condition)
                                }
                              />
                              <Label
                                htmlFor={condition}
                                className="ml-2 cursor-pointer"
                              >
                                {condition}
                              </Label>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button onClick={handleQuestionSubmit} disabled={isLoading}>
                      {isLoading ? "Loading..." : "Next"}
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Step 4: Questions */}
              <TabsContent value="step-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-lg font-semibold mb-4">Additional Questions</h3>
                  {isLoading && <Progress />}
                  {error && (
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {questions.map((q, index) => (
                    <div key={index} className="mb-6">
                      <Label className="text-base mb-2 block">
                        {q[`question_${index + 1}`]}
                      </Label>
                      <RadioGroup
                        onValueChange={(value) =>
                          setAnswers((prev) => ({
                            ...prev,
                            [`question_${index + 1}`]: value,
                          }))
                        }
                        value={answers[`question_${index + 1}`]}
                        className="space-y-2"
                      >
                        {q[`options_${index + 1}`].map((option) => (
                          <div key={option} className="flex items-center">
                            <RadioGroupItem value={option} id={option} />
                            <Label htmlFor={option} className="ml-2">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setStep(3)}>
                      Back
                    </Button>
                    <Button 
                      onClick={handleFinalSubmit} 
                      disabled={isLoading || Object.keys(answers).length !== questions.length}
                    >
                      {isLoading ? "Loading..." : "Get Results"}
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Step 5: Results */}
              <TabsContent value="step-5">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-lg font-semibold mb-4">Results</h3>
                  {isLoading && <Progress />}
                  {error && (
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {results && results.length > 0 && (
                    <div className="space-y-6">
                      {results.map((condition, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              {condition.name}
                              <span className={`text-sm px-3 py-1 rounded-full ${
                                condition.likelihood === "High" 
                                  ? "bg-red-100 text-red-800"
                                  : condition.likelihood === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}>
                                {condition.likelihood} Likelihood
                              </span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="mb-4">{condition.reason}</p>
                            <h4 className="font-semibold mb-2">Next Steps:</h4>
                            <ul className="list-disc list-inside space-y-2">
                              {condition.next_steps.map((step, stepIndex) => (
                                <li key={stepIndex}>{step}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={resetForm}
                    className="mt-6"
                  >
                    Start Over
                  </Button>
                </motion.div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SymptomChecker;
