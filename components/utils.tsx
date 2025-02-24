import { AlertTriangle, CheckCircle, AlertOctagon, AlertCircle } from 'lucide-react';
import type { SeverityCategory } from './types';

export const getSeverityColor = (severity: SeverityCategory): string => {
  switch (severity) {
    case 'Normal':
      return 'bg-green-100 text-green-800';
    case 'Mild':
      return 'bg-blue-100 text-blue-800';
    case 'Moderate':
      return 'bg-yellow-100 text-yellow-800';
    case 'Severe':
      return 'bg-orange-100 text-orange-800';
    case 'Critical':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getSeverityIcon = (severity: SeverityCategory) => {
  switch (severity) {
    case 'Normal':
      return CheckCircle;
    case 'Mild':
      return AlertCircle;
    case 'Moderate':
      return AlertTriangle;
    case 'Severe':
    case 'Critical':
      return AlertOctagon;
    default:
      return AlertCircle;
  }
};
