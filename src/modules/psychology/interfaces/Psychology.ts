// Enums del backend
export type DevelopmentLevel = "ESPERADO" | "EN_PROCESO" | "REQUIERE_APOYO" | "NO_EVALUADO";
export type EvaluationType = "INICIAL" | "SEGUIMIENTO" | "ESPECIAL" | "DERIVACION";
export type Status = "ACTIVE" | "INACTIVE";

// Interfaces principales para Psychology
export interface PsychologicalEvaluation {
  id: string;
  studentId: string;
  classroomId: string;
  institutionId: string;
  evaluationDate: string;
  academicYear: number;
  evaluationType: EvaluationType;
  evaluationReason: string;
  emotionalDevelopment: DevelopmentLevel;
  socialDevelopment: DevelopmentLevel;
  cognitiveDevelopment: DevelopmentLevel;
  motorDevelopment: DevelopmentLevel;
  observations: string;
  recommendations: string;
  requiresFollowUp: boolean;
  followUpFrequency: string;
  evaluatedBy: string;
  evaluatedAt: string;
  updatedAt: string;
  status?: Status;
}

// Estadísticas simples
export interface PsychologyStats {
  totalStudents: number;
  casesOpen: number;
  followUps: number;
  reports: number;
}
