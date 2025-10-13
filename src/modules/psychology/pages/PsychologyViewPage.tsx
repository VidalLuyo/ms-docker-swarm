import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PsychologyService } from "../service/Psychology.service";
import { type PsychologicalEvaluation } from "../interfaces/Psychology";

export function PsychologyViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [evaluation, setEvaluation] = useState<PsychologicalEvaluation | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentName, setStudentName] = useState("");
  const [classroomName, setClassroomName] = useState("");
  const [evaluatorName, setEvaluatorName] = useState("");

  useEffect(() => {
    if (id) {
      loadEvaluation(id);
    }
  }, [id]);

  const loadEvaluation = async (evaluationId: string) => {
    try {
      setLoading(true);
      const data = await PsychologyService.getEvaluationById(evaluationId);
      setEvaluation(data);

      const [student, classroom, evaluator] = await Promise.all([
        PsychologyService.getStudentName(data.studentId),
        PsychologyService.getClassroomName(data.classroomId),
        PsychologyService.getEvaluatorName(data.evaluatedBy),
      ]);

      setStudentName(student);
      setClassroomName(classroom);
      setEvaluatorName(evaluator);
    } catch (error) {
      console.error("Error al cargar evaluación:", error);
      setError("Error al cargar la evaluación");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDevelopmentColor = (level: string) => {
    switch (level) {
      case "ESPERADO":
        return "bg-green-100 text-green-800";
      case "EN_PROCESO":
        return "bg-yellow-100 text-yellow-800";
      case "REQUIERE_APOYO":
        return "bg-red-100 text-red-800";
      case "NO_EVALUADO":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "INICIAL":
        return "bg-blue-100 text-blue-800";
      case "SEGUIMIENTO":
        return "bg-orange-100 text-orange-800";
      case "ESPECIAL":
        return "bg-purple-100 text-purple-800";
      case "DERIVACION":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white border-b border-gray-200 px-8 py-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="px-8 py-6 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Evaluación Psicológica
          </h1>
        </div>
        <div className="px-8 py-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-medium text-red-800">
                  Error al cargar la evaluación
                </h3>
                <p className="text-red-700 text-sm mt-1">
                  {error || "Evaluación no encontrada"}
                </p>
                <button
                  onClick={() => navigate("/psicologia")}
                  className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                >
                  Volver al listado
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
              <button
                onClick={() => navigate("/psicologia")}
                className="hover:text-gray-700"
              >
                SIGEI
              </button>
              <span className="mx-2">/</span>
              <button
                onClick={() => navigate("/psicologia")}
                className="hover:text-gray-700"
              >
                Gestión Psicológica
              </button>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">Ver Evaluación</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Evaluación Psicológica
            </h1>
            <p className="text-gray-600">
              Detalles completos de la evaluación psicopedagógica
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                evaluation && navigate(`/psicologia/editar/${evaluation.id}`)
              }
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 shadow-sm"
            >
              Editar Evaluación
            </button>
            <button
              onClick={() => navigate("/psicologia")}
              className="text-blue-600 hover:text-blue-700 font-medium border border-blue-200 px-6 py-3 rounded-md hover:bg-blue-50"
            >
              Volver al Listado
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Información General
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Estudiante
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">
                      {studentName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-base font-medium text-gray-900">
                      {studentName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Año {evaluation.academicYear}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Aula
                </label>
                <p className="text-base text-gray-900">{classroomName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Fecha de Evaluación
                </label>
                <p className="text-base text-gray-900">
                  {formatDate(evaluation.evaluationDate)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Tipo de Evaluación
                </label>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getTypeColor(
                    evaluation.evaluationType
                  )}`}
                >
                  {evaluation.evaluationType}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Evaluado por
                </label>
                <p className="text-base text-gray-900">{evaluatorName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Seguimiento
                </label>
                {evaluation.requiresFollowUp ? (
                  <div>
                    <span className="inline-flex items-center gap-1 text-orange-600 text-sm font-medium">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Requerido
                    </span>
                    {evaluation.followUpFrequency && (
                      <p className="text-sm text-gray-500 mt-1">
                        Frecuencia: {evaluation.followUpFrequency}
                      </p>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">No requerido</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Motivo de la Evaluación
            </h2>
          </div>
          <div className="p-6">
            <p className="text-gray-700 leading-relaxed">
              {evaluation.evaluationReason || "No se especificó motivo"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Áreas de Desarrollo
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Desarrollo Emocional
                </h3>
                <span
                  className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getDevelopmentColor(
                    evaluation.emotionalDevelopment
                  )}`}
                >
                  {evaluation.emotionalDevelopment.replace("_", " ")}
                </span>
              </div>

              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Desarrollo Social
                </h3>
                <span
                  className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getDevelopmentColor(
                    evaluation.socialDevelopment
                  )}`}
                >
                  {evaluation.socialDevelopment.replace("_", " ")}
                </span>
              </div>

              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Desarrollo Cognitivo
                </h3>
                <span
                  className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getDevelopmentColor(
                    evaluation.cognitiveDevelopment
                  )}`}
                >
                  {evaluation.cognitiveDevelopment.replace("_", " ")}
                </span>
              </div>

              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Desarrollo Motor
                </h3>
                <span
                  className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getDevelopmentColor(
                    evaluation.motorDevelopment
                  )}`}
                >
                  {evaluation.motorDevelopment.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {evaluation.observations && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Observaciones
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {evaluation.observations}
              </p>
            </div>
          </div>
        )}

        {evaluation.recommendations && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Recomendaciones
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {evaluation.recommendations}
              </p>
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Información del Sistema
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <label className="block font-medium text-gray-500 mb-1">
                  Fecha de Registro
                </label>
                <p className="text-gray-700">
                  {formatDate(evaluation.evaluatedAt)}
                </p>
              </div>
              <div>
                <label className="block font-medium text-gray-500 mb-1">
                  Última Actualización
                </label>
                <p className="text-gray-700">
                  {formatDate(evaluation.updatedAt)}
                </p>
              </div>
              <div>
                <label className="block font-medium text-gray-500 mb-1">
                  ID de Evaluación
                </label>
                <p className="text-gray-700 font-mono text-xs">
                  {evaluation.id}
                </p>
              </div>
              <div>
                <label className="block font-medium text-gray-500 mb-1">
                  Estado
                </label>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  {evaluation.status || "ACTIVE"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
