'use client';

import React from 'react';
import { X } from 'lucide-react';
import type { StoredAnalysis } from '@/components/types';
import { getSeverityColor, getSeverityIcon } from '@/components/utils';

interface AnalysisDialogProps {
  analysis: StoredAnalysis;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AnalysisDialog({ analysis, open, onOpenChange }: AnalysisDialogProps) {
  if (!open) return null;

  const severityColor = getSeverityColor(analysis.output_format.severity_assessment.category);
  const SeverityIcon = getSeverityIcon(analysis.output_format.severity_assessment.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-black">{analysis.reportType} Analysis</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className={`p-4 rounded-lg ${severityColor}`}>
              <div className="flex items-center space-x-2 mb-2">
                <SeverityIcon className="w-5 h-5" />
                <h3 className="font-semibold">Severity Assessment</h3>
              </div>
              <p>{analysis.output_format.severity_assessment.explanation}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-black">Disease Detection</h3>
              <p className="mb-2 text-black">{analysis.output_format.disease_detection.analysis}</p>
              <ul className="list-disc pl-5 space-y-1 text-black">
                {analysis.output_format.disease_detection.possible_conditions.map((condition, index) => (
                  <li key={index}>{condition}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-black">Recommendations</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-black">Dietary Changes</h4>
                  <p className='text-black'>{analysis.output_format.recommendations.dietary_changes}</p>
                </div>
                <div>
                  <h4 className="font-medium text-black">Lifestyle Changes</h4>
                  <p className='text-black'>{analysis.output_format.recommendations.lifestyle_changes}</p>
                </div>
                <div>
                  <h4 className="font-medium text-black">Medical Attention</h4>
                  <p className='text-black'>{analysis.output_format.recommendations.medical_attention}</p>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Analysis Date: {new Date(analysis.date).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
