'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, FlaskRound as Flask, Heart, Plus, Clock, User, LucideKey as Kidney, Scan } from 'lucide-react';
import type { StoredAnalysis, ReportType } from '@/components/types';
import { AnalysisDialog } from './AnalysisDialog';
import { getSeverityColor, getSeverityIcon } from '@/components/utils';

export default function Profile() {
  const router = useRouter();
  const [selectedAnalysis, setSelectedAnalysis] = useState<StoredAnalysis | null>(null);
  const [analyses, setAnalyses] = useState<StoredAnalysis[]>([]);

  useEffect(() => {
    try {
      const storedAnalyses = JSON.parse(localStorage.getItem('analyses') || '[]');
      setAnalyses(storedAnalyses);
    } catch (error) {
      console.error('Error loading analyses:', error);
      setAnalyses([]);
    }
  }, []);

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
        return <Flask className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">My Health Records</h1>
                <p className="text-white">View and manage your EHR analysis history</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/analysis')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Analysis
            </button>
          </div>
        </div>

        {analyses.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <Activity className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No analyses yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by analyzing your first report.</p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/analysis')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Analysis
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {analyses.map((analysis) => {
              const severityColor = getSeverityColor(analysis.output_format?.severity_assessment?.category || 'Normal');
              const SeverityIcon = getSeverityIcon(analysis.output_format?.severity_assessment?.category || 'Normal');

              return (
                <div
                  key={analysis.id}
                  className="bg-black border border-white  rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => setSelectedAnalysis(analysis)}
                >
                  <div className="p-6 ">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getIcon(analysis.reportType)}
                        <span className="font-medium">{analysis.reportType} Analysis</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${severityColor}`}>
                        {analysis.output_format?.severity_assessment?.category || 'Normal'}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <SeverityIcon className="w-5 h-5" />
                        <p className="text-sm text-white line-clamp-2">
                          {analysis.output_format?.disease_detection?.analysis || 'No analysis available'}
                        </p>
                      </div>

                      <div className="flex items-center text-xs text-white">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(analysis.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedAnalysis && (
        <AnalysisDialog
          analysis={selectedAnalysis}
          open={!!selectedAnalysis}
          onOpenChange={(open) => !open && setSelectedAnalysis(null)}
        />
      )}
    </div>
  );
}
