"use client"
import React, { useState } from 'react';
import { FileUp, Loader2, Activity, FlaskRound as Flask, Heart, AlertCircle, Shield, Pill, LucideKey as Kidney, Scan, FlaskRound } from 'lucide-react';
import { ReportType, AnalysisResult, StoredAnalysis } from '@/components/types';
import { getSeverityColor, getSeverityIcon } from '@/components/utils';
import axios from 'axios';
import Link from 'next/link';

function App() {
  const [selectedType, setSelectedType] = useState<ReportType>('CBC');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult>({
    data: null,
    loading: false,
    error: null,
  });

  const endpoints = {
    CBC: 'https://med-nexus-models.onrender.com/CBC_report',
    Thyroid: 'https://med-nexus-models.onrender.com/Thyroid_report',
    Lipid: 'https://med-nexus-models.onrender.com/report',
    Kidney: 'https://med-nexus-models.onrender.com/KFT_report',
    PET: 'https://med-nexus-models.onrender.com/pet_scan_report',
    Urine: 'https://med-nexus-models.onrender.com/urine_report'
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setResult({ data: null, loading: false, error: null });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setResult({ data: null, loading: true, error: null });

    const formData = new FormData();
    formData.append('report', file);

    try {
      // Simulated API response for testing
      const response = await axios.post(endpoints[selectedType], formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult({ data: response.data, loading: false, error: null });

      const fileBlob = new Blob([file], { type: file.type });
      const fileUrl = URL.createObjectURL(fileBlob);

      // Store analysis in local storage
      if (response.data) {

        const storedAnalysis: StoredAnalysis = {
          ...response.data,
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          reportType: selectedType,
          fileName: file.name,
          fileUrl: URL.createObjectURL(file),
          fileType: file.type,
          fileData: await file.arrayBuffer()
        };
        
        const existingAnalyses = JSON.parse(localStorage.getItem('analyses') || '[]');
        localStorage.setItem('analyses', JSON.stringify([storedAnalysis, ...existingAnalyses]));
      }
    } catch (error: any) {
      console.error('API Error:', error);
      setResult({
        data: null,
        loading: false,
        error: error.message || 'Error analyzing report. Please try again.',
      });
    }
  };

  const getIcon = (type: ReportType) => {
    switch (type) {
      case 'CBC':
        return <Activity className="w-5 h-5" />;
      case 'Thyroid':
        return <Flask className="w-5 h-5" />;
      case 'Lipid':
        return <Heart className="w-5 h-5" />;
      case 'Kidney':
        return <Kidney className="w-5 h-5" />;
      case 'PET':
        return <Scan className="w-5 h-5" />;
      case 'Urine':
        return <FlaskRound className="w-5 h-5" />;
    }
  };

  const renderResults = () => {
    if (!result.data) return null;

    const { output_format } = result.data;
    const severityColor = getSeverityColor(output_format.severity_assessment.category);
    const SeverityIcon = getSeverityIcon(output_format.severity_assessment.category);

    return (
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Severity Status Card */}
        <div className={`col-span-2 p-6 rounded-lg border-2 ${severityColor} transition-colors duration-300`}>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SeverityIcon />
              <div>
                <h3 className="text-lg font-semibold">Severity Level</h3>
                <p className="text-sm opacity-90">Patient Condition Assessment</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${severityColor} shadow-sm`}>
                {output_format.severity_assessment.category}
              </span>
              <span className="text-sm mt-2 opacity-75">{output_format.urgency}</span>
            </div>
          </div>
          <p className="mt-4 text-sm opacity-90">{output_format.severity_assessment.explanation}</p>
        </div>

        {/* Disease Detection Card */}
        <div className="bg-black rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Activity className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-white">Analysis</h3>
            </div>
            <p className="text-white mb-4">{output_format.disease_detection.analysis}</p>
            <div className="space-y-3">
              <h4 className="font-medium text-white">Detected Conditions:</h4>
              <ul className="space-y-2">
                {output_format.disease_detection.possible_conditions.map((condition, index) => (
                  <li key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-black">
                    <AlertCircle className="w-5 h-5 text-blue-500" />
                    <span className="text-white">{condition}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recommendations Card */}
        <div className="bg-black rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Pill className="w-6 h-6 text-purple-500" />
              <h3 className="text-lg font-semibold text-white">Recommendations</h3>
            </div>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-black">
                <h4 className="font-medium text-white mb-2 flex items-center">
                  <Heart className="w-4 h-4 text-red-500 mr-2" />
                  Dietary Changes
                </h4>
                <p className="text-white">{output_format.recommendations.dietary_changes}</p>
              </div>
              <div className="p-3 rounded-lg bg-black">
                <h4 className="font-medium text-white mb-2 flex items-center">
                  <Activity className="w-4 h-4 text-green-500 mr-2" />
                  Lifestyle Changes
                </h4>
                <p className="text-white">{output_format.recommendations.lifestyle_changes}</p>
              </div>
              <div className="p-3 rounded-lg bg-black">
                <h4 className="font-medium text-white mb-2 flex items-center">
                  <Shield className="w-4 h-4 text-blue-500 mr-2" />
                  Medical Attention
                </h4>
                <p className="text-white">{output_format.recommendations.medical_attention}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="bg-black rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">
              EHR Report Analysis
            </h1>
            <button
              // onClick={() => window.location.href = '/profile'}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <Link href="/profile">View History</Link>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-white">
                Report Type
              </label>
              <div className="grid grid-cols-3 gap-4">
                {(['CBC', 'Thyroid', 'Lipid'] as ReportType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`flex items-center justify-center space-x-2 p-4 rounded-lg border-2 ${selectedType === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-white'
                      }`}
                  >
                    {getIcon(type)}
                    <span>{type}</span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {(['Kidney', 'PET', 'Urine'] as ReportType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`flex items-center justify-center space-x-2 p-4 rounded-lg border-2 ${selectedType === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-white'
                      }`}
                  >
                    {getIcon(type)}
                    <span>{type}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-white">
                Upload Report
              </label>
              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <FileUp className="mx-auto h-12 w-12 text-white" />
                  <div className="flex text-sm text-white">
                    <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-white">
                    PDF, PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
              {file && (
                <p className="text-sm text-white">
                  Selected file: {file.name}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!file || result.loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
              {result.loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Analyzing...
                </>
              ) : (
                'Analyze Report'
              )}
            </button>
          </form>

          {result.error && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <p className="text-red-700">{result.error}</p>
              </div>
            </div>
          )}

          {renderResults()}
        </div>
      </div>
    </div>
  );
}

export default App;