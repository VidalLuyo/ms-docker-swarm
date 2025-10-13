import { useState, useEffect, useCallback } from "react";
import { PsychologyService } from "../service/Psychology.service";
import { type PsychologicalEvaluation } from "../interfaces/Psychology";

export function Psychology() {
  const [evaluations, setEvaluations] = useState<PsychologicalEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentNames, setStudentNames] = useState<{ [key: string]: string }>(
    {}
  );
  const [classroomNames, setClassroomNames] = useState<{
    [key: string]: string;
  }>({});
  const [evaluatorNames, setEvaluatorNames] = useState<{
    [key: string]: string;
  }>({});
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

      // Cargar nombres de referencia
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

  // Filtrar evaluaciones con todos los filtros
  const filteredEvaluations = evaluations.filter((evaluation) => {
    // Filtro por búsqueda
    if (searchTerm) {
      const studentName =
        studentNames[evaluation.studentId]?.toLowerCase() || "";
      const classroomName =
        classroomNames[evaluation.classroomId]?.toLowerCase() || "";
      const evaluatorName =
        evaluatorNames[evaluation.evaluatedBy]?.toLowerCase() || "";
      const searchLower = searchTerm.toLowerCase();

      const matchesSearch =
        studentName.includes(searchLower) ||
        classroomName.includes(searchLower) ||
        evaluatorName.includes(searchLower) ||
        evaluation.evaluationType.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    // Filtro por año
    if (selectedYear && evaluation.academicYear.toString() !== selectedYear) {
      return false;
    }

    // Filtro por tipo
    if (selectedType && evaluation.evaluationType !== selectedType) {
      return false;
    }

    // Filtro por seguimiento
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
      case "ESPERADO":
        return "bg-green-500";
      case "EN_PROCESO":
        return "bg-yellow-500";
      case "REQUIERE_APOYO":
        return "bg-red-500";
      case "NO_EVALUADO":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
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
        {/* Header skeleton */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>

        {/* Tabs skeleton */}
        <div className="bg-white border-b border-gray-200 px-8 animate-pulse">
          <div className="flex space-x-8 py-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-28"></div>
          </div>
        </div>

        <div className="px-8 py-6 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión Psicológica
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
                  Error al cargar el sistema
                </h3>
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
    followUps: evaluations.filter((e) => e.evaluationType === "SEGUIMIENTO")
      .length,
    reports: evaluations.filter((e) => e.evaluationType === "ESPECIAL").length,
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header profesional con breadcrumbs */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
              <span>SIGEI</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Módulos</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-900 font-medium">
                Bienestar Estudiantil
              </span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestión Psicológica
            </h1>
            <p className="text-gray-600">
              Sistema integral de seguimiento y evaluación del bienestar
              estudiantil
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-600 p-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
            <button 
              onClick={() => window.location.href = '/psychology/form'}
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 shadow-sm"
            >
              Nueva Evaluación
            </button>
            <button className="text-blue-600 hover:text-blue-700 font-medium border border-blue-200 px-6 py-3 rounded-md hover:bg-blue-50">
              Ver Reportes
            </button>
          </div>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="bg-white border-b border-gray-200 px-8">
        <nav className="-mb-px flex space-x-8">
          <button className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600 whitespace-nowrap">
            Evaluaciones Activas
          </button>
          <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">
            Reportes y Análisis
          </button>
          <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">
            Configuración
          </button>
          <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">
            Historial
          </button>
        </nav>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Panel de control y filtros */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Panel de Control
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Última actualización:</span>
                <span className="font-medium">Hace 5 minutos</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar estudiante, caso o documento
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Año académico
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos los años</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de evaluación
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos los tipos</option>
                  <option value="INICIAL">Inicial</option>
                  <option value="SEGUIMIENTO">Seguimiento</option>
                  <option value="FINAL">Final</option>
                  <option value="ESPECIAL">Especial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seguimiento
                </label>
                <select
                  value={selectedFollowUp}
                  onChange={(e) => setSelectedFollowUp(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="true">Requiere seguimiento</option>
                  <option value="false">No requiere</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedYear("");
                    setSelectedType("");
                    setSelectedFollowUp("");
                  }}
                  className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Limpiar
                </button>
                <button
                  onClick={loadEvaluations}
                  disabled={loading}
                  className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Actualizar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Estudiantes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.total}
                </p>
                <p className="text-xs text-gray-500">Estudiantes activos</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Casos Abiertos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.casesOpen}
                </p>
                <p className="text-xs text-gray-500">Requieren atención</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-yellow-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">En Seguimiento</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.followUps}
                </p>
                <p className="text-xs text-gray-500">Casos activos</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 15v-3a1 1 0 011-1h2a1 1 0 011 1v3H8z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Notificaciones</p>
                <p className="text-2xl font-semibold text-gray-900">1</p>
                <p className="text-xs text-gray-500">Pendientes de envío</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Informes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.reports}
                </p>
                <p className="text-xs text-gray-500">Generados este período</p>
              </div>
            </div>
          </div>
        </div>

        {/* Indicador de resultados */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>
            Mostrando{" "}
            <span className="font-medium">{filteredEvaluations.length}</span> de{" "}
            <span className="font-medium">{evaluations.length}</span> casos
            {(searchTerm ||
              selectedYear ||
              selectedType ||
              selectedFollowUp) && (
              <span className="ml-1 text-blue-600">(filtrados)</span>
            )}
          </div>
          {(searchTerm || selectedYear || selectedType || selectedFollowUp) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedYear("");
                setSelectedType("");
                setSelectedFollowUp("");
              }}
              className="text-blue-600 hover:text-blue-700"
            >
              Ver todos
            </button>
          )}
        </div>

        {/* Tabla de evaluaciones */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Evaluaciones Recientes
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Gestión y seguimiento de evaluaciones psicopedagógicas
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-gray-400 hover:text-gray-600 p-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-gray-600 p-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {filteredEvaluations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">
                {evaluations.length === 0
                  ? "No hay casos registrados"
                  : "No se encontraron resultados"}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estudiante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aula
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Desarrollo Emocional
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Desarrollo Social
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Evaluador
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seguimiento
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEvaluations.slice(0, 10).map((evaluation) => (
                    <tr key={evaluation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 text-sm font-medium">
                              {(studentNames[evaluation.studentId] || "E")
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {studentNames[evaluation.studentId] || "Cargando..."}
                            </div>
                            <div className="text-sm text-gray-500">Año {evaluation.academicYear}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {classroomNames[evaluation.classroomId] || "Cargando..."}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(evaluation.evaluationDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(evaluation.evaluationType)}`}>
                          {evaluation.evaluationType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getDevelopmentColor(evaluation.emotionalDevelopment)}`}></div>
                          <span className="text-sm text-gray-600">{evaluation.emotionalDevelopment.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getDevelopmentColor(evaluation.socialDevelopment)}`}></div>
                          <span className="text-sm text-gray-600">{evaluation.socialDevelopment.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {evaluatorNames[evaluation.evaluatedBy] || "Cargando..."}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {evaluation.requiresFollowUp ? (
                          <span className="inline-flex items-center gap-1 text-orange-600 text-sm font-medium">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            Requerido
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">No requerido</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredEvaluations.length > 10 && (
            <div className="px-6 py-4 border-t border-gray-200 text-center">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Ver todos los casos ({filteredEvaluations.length})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
