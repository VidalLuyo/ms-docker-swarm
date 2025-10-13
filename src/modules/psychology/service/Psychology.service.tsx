import { type PsychologicalEvaluation } from "../interfaces/Psychology.js";

const API_BASE_URL = "http://localhost:8085/api/v1";

export class PsychologyService {
  // Obtener todas las evaluaciones psicológicas
  static async getAllEvaluations(): Promise<PsychologicalEvaluation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/psychological-evaluations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return []; // Retornar array vacío si no hay datos
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error al obtener evaluaciones:", error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('No se pudo conectar con el servidor. Verifique su conexión.');
      }
      throw error;
    }
  }

  // Obtener evaluación por ID
  static async getEvaluationById(id: string): Promise<PsychologicalEvaluation> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/psychological-evaluations/${id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al obtener evaluación:", error);
      throw error;
    }
  }

  // Crear nueva evaluación
  static async createEvaluation(
    evaluation: Omit<
      PsychologicalEvaluation,
      "id" | "evaluatedAt" | "updatedAt"
    >
  ): Promise<PsychologicalEvaluation> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/psychological-evaluations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(evaluation),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al crear evaluación:", error);
      throw error;
    }
  }

  // Actualizar evaluación
  static async updateEvaluation(
    id: string,
    evaluation: Omit<
      PsychologicalEvaluation,
      "id" | "evaluatedAt" | "updatedAt"
    >
  ): Promise<PsychologicalEvaluation> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/psychological-evaluations/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(evaluation),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al actualizar evaluación:", error);
      throw error;
    }
  }

  // Eliminar evaluación
  static async deleteEvaluation(id: string): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/psychological-evaluations/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error al eliminar evaluación:", error);
      throw error;
    }
  }

  // Obtener evaluaciones por año académico
  static async getEvaluationsByYear(
    academicYear: number
  ): Promise<PsychologicalEvaluation[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/psychological-evaluations/year/${academicYear}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al obtener evaluaciones por año:", error);
      throw error;
    }
  }

  // Obtener evaluaciones por tipo
  static async getEvaluationsByType(
    type: string
  ): Promise<PsychologicalEvaluation[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/psychological-evaluations/type/${type}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al obtener evaluaciones por tipo:", error);
      throw error;
    }
  }

  // Obtener evaluaciones por nivel de desarrollo
  static async getEvaluationsByDevelopmentLevel(
    level: string
  ): Promise<PsychologicalEvaluation[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/psychological-evaluations/development/${level}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al obtener evaluaciones por nivel:", error);
      throw error;
    }
  }

  // Obtener nombres de referencia
  static async getStudentName(studentId: string): Promise<string> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/reference-data/student/${studentId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        return `Estudiante ${studentId.substring(0, 8)}...`;
      }
      const name = await response.text();
      return name || `Estudiante ${studentId.substring(0, 8)}...`;
    } catch (error) {
      console.warn("Error al obtener nombre del estudiante:", error);
      return `Estudiante ${studentId.substring(0, 8)}...`;
    }
  }

  static async getClassroomName(classroomId: string): Promise<string> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/reference-data/classroom/${classroomId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        return `Aula ${classroomId.substring(0, 8)}...`;
      }
      const name = await response.text();
      return name || `Aula ${classroomId.substring(0, 8)}...`;
    } catch (error) {
      console.warn("Error al obtener nombre del aula:", error);
      return `Aula ${classroomId.substring(0, 8)}...`;
    }
  }

  static async getEvaluatorName(evaluatorId: string): Promise<string> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/reference-data/evaluator/${evaluatorId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        return `Evaluador ${evaluatorId.substring(0, 8)}...`;
      }
      const name = await response.text();
      return name || `Evaluador ${evaluatorId.substring(0, 8)}...`;
    } catch (error) {
      console.warn("Error al obtener nombre del evaluador:", error);
      return `Evaluador ${evaluatorId.substring(0, 8)}...`;
    }
  }

  // Obtener listas de referencia
  static async getAllStudents(): Promise<{ id: string; name: string }[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/reference-data/students`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
      return [];
    }
  }

  static async getAllClassrooms(): Promise<{ id: string; name: string }[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/reference-data/classrooms`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al obtener aulas:", error);
      return [];
    }
  }

  static async getAllInstitutions(): Promise<{ id: string; name: string }[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/reference-data/institutions`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al obtener instituciones:", error);
      return [];
    }
  }

  static async getAllEvaluators(): Promise<{ id: string; name: string }[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/reference-data/evaluators`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al obtener evaluadores:", error);
      return [];
    }
  }
}
