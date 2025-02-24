export type ReportType = 'CBC' | 'Thyroid' | 'Lipid' | 'Kidney' | 'PET' | 'Urine';

export type SeverityCategory = 'Normal' | 'Mild' | 'Moderate' | 'Severe' | 'Critical';

export interface AnalysisResult {
  data: ApiResponse | null;
  loading: boolean;
  error: string | null;
}

export interface ApiResponse {
  output_format: {
    severity_assessment: {
      category: SeverityCategory;
      explanation: string;
    };
    urgency: string;
    disease_detection: {
      analysis: string;
      possible_conditions: string[];
    };
    recommendations: {
      dietary_changes: string;
      lifestyle_changes: string;
      medical_attention: string;
    };
  };
}

export interface StoredAnalysis extends ApiResponse {
  id: string;
  date: string;
  reportType: ReportType;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileData: ArrayBuffer;
}
