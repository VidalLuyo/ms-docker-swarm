import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { PsychologyService } from "../service/Psychology.service";
import { type PsychologicalEvaluation } from "../interfaces/Psychology";

export function PsychologyPage() {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState<PsychologicalEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentNames, setStudentNames] = useState<{ [key: string]: string }>({});
  const [classroomNames, setClassroomNames] = useState<{ [key: string]: string }>({});
  const [evaluatorNames, setEvaluatorNames] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedFollowUp, setSelectedFollowUp] = useState("");

  const loadReferenceData = async (evaluations: PsychologicalEvaluation[]) => {
    const studentIds = [...new Set(evaluations.map((e) => e.studentId))];
    const classroomIds = [...new Set(evaluations.map((e) => e.classroomId))];
    const evaluatorIds = [...new Set(evaluations.map((e) => e.evaluatedBy))];

    // Cargar nombres de estudiantes
    const studentNamesMap: { [key: string]: string } = {};
    for (const id of studentIds) {
      try {
        studentNamesMap[id] = await PsychologyService.getStudentName(id);
      } catch {
        studentNamesMap[id] = "Estudiante no encontrado";
      }
    }
    setStudentNames(studentNamesMap);

    // Cargar nombres de aulas
    const classroomNamesMap: { [key: string]: string } = {};
    for (const id of classroomIds) {
      try {
        classroomNamesMap[id] = await PsychologyService.getClassroomName(id);
      } catch {
        classroomNamesMap[id] = "Aula no encontrada";
      }
    }
    setClassroomNames(classroomNamesMap);

    // Cargar nombres de evaluadores
    const evaluatorNamesMap: { [key: string]: string } = {};
    for (const id of evaluatorIds) {
      try {
        evaluatorNamesMap[id] = await PsychologyService.getEvaluatorName(id);
      } catch {
        evaluatorNamesMap[id] = "Evaluador no encontrado";
      }
    }
    setEvaluatorNames(evaluatorNamesMap);
  };

  const loadEvaluations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await PsychologyService.getAllEvaluations();
      setEvaluations(data);
      await loadReferenceData(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar las evaluaciones psicológicas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvaluations();
  }, [loadEvaluations]);

  // Funciones de navegación
  const handleCreate = () => {
    navigate("/psicologia/nuevo");
  };

  const handleEdit = (id: string) => {
    navigate(`/psicologia/editar/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/psicologia/ver/${id}`);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Eliminar evaluación?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await PsychologyService.deleteEvaluation(id);
        await loadEvaluations();
        Swal.fire({
          title: '¡Eliminado!',
          text: 'La evaluación ha sido eliminada exitosamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar la evaluación',
          icon: 'error'
        });
      }
    }
  };

  // Filtrar evaluaciones
  const filteredEvaluations = evaluations.filter((evaluation) => {
    if (searchTerm) {
      const studentName = studentNames[evaluation.studentId]?.toLowerCase() || "";
      const classroomName = classroomNames[evaluation.classroomId]?.toLowerCase() || "";
      const evaluatorName = evaluatorNames[evaluation.evaluatedBy]?.toLowerCase() || "";
      const searchLower = searchTerm.toLowerCase();

      const matchesSearch = (
        studentName.includes(searchLower) ||
        classroomName.includes(searchLower) ||
        evaluatorName.includes(searchLower) ||
        evaluation.evaluationType.toLowerCase().includes(searchLower)
      );

      if (!matchesSearch) return false;
    }

    if (selectedYear && evaluation.academicYear.toString() !== selectedYear) {
      return false;
    }

    if (selectedType && evaluation.evaluationType !== selectedType) {
      return false;
    }

    if (selectedFollowUp !== "") {
      const requiresFollowUp = selectedFollowUp === "true";
      if (evaluation.requiresFollowUp !== requiresFollowUp) {
        return false;
      }
    }

    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDevelopmentColor = (level: string) => {
    switch (level) {
      case "ESPERADO": return "bg-green-500";
      case "EN_PROCESO": return "bg-yellow-500";
      case "REQUIERE_APOYO": return "bg-red-500";
      case "NO_EVALUADO": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "INICIAL": return "bg-blue-100 text-blue-800";
      case "SEGUIMIENTO": return "bg-orange-100 text-orange-800";
      case "ESPECIAL": return "bg-purple-100 text-purple-800";
      case "DERIVACION": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white border-b border-gray-200 px-8 py-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="px-8 py-6 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Gestión Psicológica</h1>
        </div>
        <div className="px-8 py-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 className="text-base font-medium text-red-800">Error al cargar el sistema</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
                <button
                  onClick={loadEvaluations}
                  className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                >
                  Reintentar conexión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calcular estadísticas
  const stats = {
    total: evaluations.length,
    casesOpen: evaluations.filter((e) => e.requiresFollowUp).length,
    followUps: evaluations.filter((e) => e.evaluationType === "SEGUIMIENTO").length,
    reports: evaluations.filter((e) => e.evaluationType === "ESPECIAL").length,
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header compacto */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión Psicológica</h1>
            <p className="text-sm text-gray-600">Evaluaciones del bienestar estudiantil</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Evaluación
          </button>
        </div>
      </div>

      <div className="px-6 py-4 space-y-4">
        {/* Filtros compactos */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar estudiante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <svg className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Todos los años</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Tipo de evaluación</option>
              <option value="INICIAL">Inicial</option>
              <option value="SEGUIMIENTO">Seguimiento</option>
              <option value="ESPECIAL">Especial</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedYear('');
                  setSelectedType('');
                  setSelectedFollowUp('');
                }}
                className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas compactas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-600">Total</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{stats.casesOpen}</p>
                <p className="text-xs text-gray-600">Abiertos</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{stats.followUps}</p>
                <p className="text-xs text-gray-600">Seguimiento</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{stats.reports}</p>
                <p className="text-xs text-gray-600">Informes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla compacta */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Evaluaciones ({filteredEvaluations.length})</h2>
          </div>

          {filteredEvaluations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">
                {evaluations.length === 0 ? "No hay casos registrados" : "No se encontraron resultados"}
              </h3>
              <p className="text-gray-600 text-sm">
                {evaluations.length === 0
                  ? "Aún no se han registrado casos psicológicos en el sistema."
                  : "Intenta ajustar los filtros de búsqueda."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estudiante</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha/Tipo</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Desarrollo</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Evaluador</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEvaluations.slice(0, 15).map((evaluation) => (
                    <tr key={evaluation.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-sm font-medium">
                              {(studentNames[evaluation.studentId] || "E").charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {studentNames[evaluation.studentId] || "Cargando..."}
                            </div>
                            <div className="text-xs text-gray-500">
                              {classroomNames[evaluation.classroomId] || "Cargando..."} • Año {evaluation.academicYear}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{formatDate(evaluation.evaluationDate)}</div>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(evaluation.evaluationType)}`}>
                          {evaluation.evaluationType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getDevelopmentColor(evaluation.emotionalDevelopment)}`}></div>
                            <span className="text-xs text-gray-600">Emocional: {evaluation.emotionalDevelopment.replace('_', ' ')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getDevelopmentColor(evaluation.socialDevelopment)}`}></div>
                            <span className="text-xs text-gray-600">Social: {evaluation.socialDevelopment.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">
                          {evaluatorNames[evaluation.evaluatedBy] || "Cargando..."}
                        </div>
                        {evaluation.requiresFollowUp && (
                          <span className="inline-flex items-center gap-1 text-orange-600 text-xs">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                            Seguimiento
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleView(evaluation.id)}
                            className="text-gray-600 hover:text-gray-800 p-1.5 rounded hover:bg-gray-100"
                            title="Ver"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEdit(evaluation.id)}
                            className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-50"
                            title="Editar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(evaluation.id)}
                            className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50"
                            title="Eliminar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}