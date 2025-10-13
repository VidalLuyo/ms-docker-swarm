import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { PsychologyService } from "../service/Psychology.service";
import {
  type DevelopmentLevel,
  type EvaluationType,
} from "../interfaces/Psychology";

export function PsychologyFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Listas de referencia
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [classrooms, setClassrooms] = useState<{ id: string; name: string }[]>(
    []
  );
  const [institutions, setInstitutions] = useState<
    { id: string; name: string }[]
  >([]);
  const [evaluators, setEvaluators] = useState<{ id: string; name: string }[]>(
    []
  );

  // Datos del formulario
  const [formData, setFormData] = useState({
    studentId: "",
    classroomId: "",
    institutionId: "",
    evaluationDate: new Date().toISOString().split("T")[0],
    academicYear: new Date().getFullYear(),
    evaluationType: "INICIAL" as EvaluationType,
    evaluationReason:
      "Evaluación de rutina para seguimiento del desarrollo integral del estudiante.",
    emotionalDevelopment: "EN_PROCESO" as DevelopmentLevel,
    socialDevelopment: "EN_PROCESO" as DevelopmentLevel,
    cognitiveDevelopment: "EN_PROCESO" as DevelopmentLevel,
    motorDevelopment: "EN_PROCESO" as DevelopmentLevel,
    observations:
      "El estudiante muestra un desarrollo apropiado para su edad, con áreas de oportunidad identificadas.",
    recommendations:
      "Continuar con el seguimiento regular y reforzar las áreas que requieren mayor atención.",
    requiresFollowUp: true,
    followUpFrequency: "Mensual",
    evaluatedBy: "",
  });

  useEffect(() => {
    loadReferenceData();
    if (isEditing && id) {
      loadEvaluation(id);
    }
  }, [id, isEditing]);

  const loadReferenceData = async () => {
    try {
      const [studentsData, classroomsData, institutionsData, evaluatorsData] =
        await Promise.all([
          PsychologyService.getAllStudents(),
          PsychologyService.getAllClassrooms(),
          PsychologyService.getAllInstitutions(),
          PsychologyService.getAllEvaluators(),
        ]);

      setStudents(studentsData);
      setClassrooms(classroomsData);
      setInstitutions(institutionsData);
      setEvaluators(evaluatorsData);
    } catch (error) {
      console.error("Error al cargar datos de referencia:", error);
      setError("Error al cargar los datos necesarios para el formulario");
    }
  };

  const loadEvaluation = async (evaluationId: string) => {
    try {
      setLoading(true);
      const evaluation = await PsychologyService.getEvaluationById(
        evaluationId
      );
      setFormData({
        studentId: evaluation.studentId,
        classroomId: evaluation.classroomId,
        institutionId: evaluation.institutionId,
        evaluationDate: evaluation.evaluationDate.split("T")[0],
        academicYear: evaluation.academicYear,
        evaluationType: evaluation.evaluationType,
        evaluationReason: evaluation.evaluationReason,
        emotionalDevelopment: evaluation.emotionalDevelopment,
        socialDevelopment: evaluation.socialDevelopment,
        cognitiveDevelopment: evaluation.cognitiveDevelopment,
        motorDevelopment: evaluation.motorDevelopment,
        observations: evaluation.observations,
        recommendations: evaluation.recommendations,
        requiresFollowUp: evaluation.requiresFollowUp,
        followUpFrequency: evaluation.followUpFrequency,
        evaluatedBy: evaluation.evaluatedBy,
      });
    } catch (error) {
      console.error("Error al cargar evaluación:", error);
      setError("Error al cargar la evaluación");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (isEditing && id) {
        await PsychologyService.updateEvaluation(id, formData);
        Swal.fire({
          title: "¡Actualizado!",
          text: "La evaluación ha sido actualizada exitosamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await PsychologyService.createEvaluation(formData);
        Swal.fire({
          title: "¡Creado!",
          text: "La evaluación ha sido creada exitosamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
      navigate("/psicologia");
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar la evaluación",
        icon: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return (
          formData.studentId &&
          formData.classroomId &&
          formData.institutionId &&
          formData.evaluationDate
        );
      case 2:
        return formData.evaluationReason.trim().length > 0;
      case 3:
        return true; // Áreas de desarrollo son opcionales
      case 4:
        return formData.evaluatedBy;
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white border-b border-gray-200 px-6 py-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="px-6 py-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header moderno */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  {isEditing ? "Editar Evaluación" : "Nueva Evaluación Psicológica"}
                </h1>
                <p className="text-sm text-slate-600">
                  Paso {currentStep} de {totalSteps} • {
                    currentStep === 1 ? "Información General" :
                    currentStep === 2 ? "Motivo de Evaluación" :
                    currentStep === 3 ? "Áreas de Desarrollo" : "Evaluador"
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/psicologia")}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Formulario Principal */}
          <div className="xl:col-span-7 space-y-6">
            {/* Indicador de pasos moderno */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 mb-6">
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                          step === currentStep
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                            : step < currentStep
                            ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25"
                            : "bg-slate-100 text-slate-400 border-2 border-slate-200"
                        }`}
                      >
                        {step < currentStep ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          step
                        )}
                      </div>
                      <span className={`text-xs font-medium mt-2 transition-colors ${
                        step === currentStep ? "text-blue-600" : 
                        step < currentStep ? "text-emerald-600" : "text-slate-400"
                      }`}>
                        {step === 1 ? "General" : step === 2 ? "Motivo" : step === 3 ? "Desarrollo" : "Evaluador"}
                      </span>
                    </div>
                    {step < 4 && (
                      <div className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                        step < currentStep ? "bg-gradient-to-r from-emerald-500 to-green-600" : "bg-slate-200"
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Paso 1: Información General */}
              {currentStep === 1 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-slate-200/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">Información General</h2>
                        <p className="text-sm text-slate-600">Datos básicos del estudiante y la evaluación</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">
                          Estudiante *
                        </label>
                        <select
                          name="studentId"
                          value={formData.studentId}
                          onChange={handleInputChange}
                          required
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900"
                        >
                          <option value="">Seleccionar estudiante</option>
                          {students.map((student) => (
                            <option key={student.id} value={student.id}>
                              {student.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">
                          Aula *
                        </label>
                        <select
                          name="classroomId"
                          value={formData.classroomId}
                          onChange={handleInputChange}
                          required
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900"
                        >
                          <option value="">Seleccionar aula</option>
                          {classrooms.map((classroom) => (
                            <option key={classroom.id} value={classroom.id}>
                              {classroom.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">
                          Institución *
                        </label>
                        <select
                          name="institutionId"
                          value={formData.institutionId}
                          onChange={handleInputChange}
                          required
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900"
                        >
                          <option value="">Seleccionar institución</option>
                          {institutions.map((institution) => (
                            <option key={institution.id} value={institution.id}>
                              {institution.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">
                          Fecha de Evaluación *
                        </label>
                        <input
                          type="date"
                          name="evaluationDate"
                          value={formData.evaluationDate}
                          onChange={handleInputChange}
                          required
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">
                          Año Académico *
                        </label>
                        <input
                          type="number"
                          name="academicYear"
                          value={formData.academicYear}
                          onChange={handleInputChange}
                          required
                          min="2020"
                          max="2030"
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">
                          Tipo de Evaluación *
                        </label>
                        <select
                          name="evaluationType"
                          value={formData.evaluationType}
                          onChange={handleInputChange}
                          required
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900"
                        >
                          <option value="INICIAL">Inicial</option>
                          <option value="SEGUIMIENTO">Seguimiento</option>
                          <option value="ESPECIAL">Especial</option>
                          <option value="DERIVACION">Derivación</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 2: Motivo */}
              {currentStep === 2 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-5 border-b border-slate-200/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">Motivo de la Evaluación</h2>
                        <p className="text-sm text-slate-600">Describe el motivo por el cual se realiza esta evaluación</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        Motivo de la Evaluación *
                      </label>
                      <textarea
                        name="evaluationReason"
                        value={formData.evaluationReason}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 resize-none"
                        placeholder="Describe detalladamente el motivo por el cual se realiza esta evaluación psicológica..."
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Proporciona información específica sobre las razones que justifican esta evaluación
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 3: Áreas de Desarrollo */}
              {currentStep === 3 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-5 border-b border-slate-200/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">Áreas de Desarrollo</h2>
                        <p className="text-sm text-slate-600">Evalúa el desarrollo en las diferentes áreas</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">
                          Desarrollo Emocional
                        </label>
                        <select
                          name="emotionalDevelopment"
                          value={formData.emotionalDevelopment}
                          onChange={handleInputChange}
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900"
                        >
                          <option value="NO_EVALUADO">No Evaluado</option>
                          <option value="ESPERADO">Esperado</option>
                          <option value="EN_PROCESO">En Proceso</option>
                          <option value="REQUIERE_APOYO">Requiere Apoyo</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">
                          Desarrollo Social
                        </label>
                        <select
                          name="socialDevelopment"
                          value={formData.socialDevelopment}
                          onChange={handleInputChange}
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900"
                        >
                          <option value="NO_EVALUADO">No Evaluado</option>
                          <option value="ESPERADO">Esperado</option>
                          <option value="EN_PROCESO">En Proceso</option>
                          <option value="REQUIERE_APOYO">Requiere Apoyo</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">
                          Desarrollo Cognitivo
                        </label>
                        <select
                          name="cognitiveDevelopment"
                          value={formData.cognitiveDevelopment}
                          onChange={handleInputChange}
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900"
                        >
                          <option value="NO_EVALUADO">No Evaluado</option>
                          <option value="ESPERADO">Esperado</option>
                          <option value="EN_PROCESO">En Proceso</option>
                          <option value="REQUIERE_APOYO">Requiere Apoyo</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">
                          Desarrollo Motor
                        </label>
                        <select
                          name="motorDevelopment"
                          value={formData.motorDevelopment}
                          onChange={handleInputChange}
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900"
                        >
                          <option value="NO_EVALUADO">No Evaluado</option>
                          <option value="ESPERADO">Esperado</option>
                          <option value="EN_PROCESO">En Proceso</option>
                          <option value="REQUIERE_APOYO">Requiere Apoyo</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">
                          Observaciones
                        </label>
                        <textarea
                          name="observations"
                          value={formData.observations}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 resize-none"
                          placeholder="Observaciones detalladas sobre el comportamiento y desarrollo del estudiante..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">
                          Recomendaciones
                        </label>
                        <textarea
                          name="recommendations"
                          value={formData.recommendations}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900 resize-none"
                          placeholder="Recomendaciones específicas para el estudiante, familia y docentes..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 4: Evaluador y Seguimiento */}
              {currentStep === 4 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-5 border-b border-slate-200/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">Evaluador y Seguimiento</h2>
                        <p className="text-sm text-slate-600">Información del evaluador y seguimiento requerido</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        Evaluado por *
                      </label>
                      <select
                        name="evaluatedBy"
                        value={formData.evaluatedBy}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900"
                      >
                        <option value="">Seleccionar evaluador</option>
                        {evaluators.map((evaluator) => (
                          <option key={evaluator.id} value={evaluator.id}>
                            {evaluator.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <input
                          type="checkbox"
                          name="requiresFollowUp"
                          checked={formData.requiresFollowUp}
                          onChange={handleInputChange}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-slate-300 rounded-lg"
                        />
                        <label className="ml-3 block text-sm font-medium text-slate-700">
                          Requiere seguimiento
                        </label>
                      </div>

                      {formData.requiresFollowUp && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                          <label className="block text-sm font-semibold text-slate-700">
                            Frecuencia de Seguimiento
                          </label>
                          <input
                            type="text"
                            name="followUpFrequency"
                            value={formData.followUpFrequency}
                            onChange={handleInputChange}
                            className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-900"
                            placeholder="Ej: Semanal, Quincenal, Mensual..."
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Botones de navegación */}
              <div className="flex justify-between items-center pt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-6 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Anterior
                </button>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/psicologia")}
                    className="px-6 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-medium transition-all duration-200"
                  >
                    Cancelar
                  </button>

                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid(currentStep)}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all duration-200"
                    >
                      Siguiente
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={saving || !isStepValid(currentStep)}
                      className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all duration-200"
                    >
                      {saving ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {isEditing ? "Actualizar Evaluación" : "Crear Evaluación"}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Vista Previa Moderna */}
          <div className="xl:col-span-5">
            <div className="sticky top-24">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Vista Previa</h3>
                      <p className="text-sm text-slate-300">Cómo se verá la evaluación</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {/* Información General */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h4 className="text-base font-semibold text-slate-900">Información General</h4>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                      <div className="grid grid-cols-1 gap-3 text-sm">
                        <div className="flex justify-between items-center py-2 border-b border-blue-200/50 last:border-0">
                          <span className="text-slate-600 font-medium">Estudiante:</span>
                          <span className="font-semibold text-slate-900 text-right">
                            {formData.studentId
                              ? students.find((s) => s.id === formData.studentId)?.name || "Seleccionado"
                              : "No seleccionado"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-blue-200/50 last:border-0">
                          <span className="text-slate-600 font-medium">Aula:</span>
                          <span className="font-semibold text-slate-900">
                            {formData.classroomId
                              ? classrooms.find((c) => c.id === formData.classroomId)?.name || "Seleccionada"
                              : "No seleccionada"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-blue-200/50 last:border-0">
                          <span className="text-slate-600 font-medium">Fecha:</span>
                          <span className="font-semibold text-slate-900">
                            {new Date(formData.evaluationDate).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-blue-200/50 last:border-0">
                          <span className="text-slate-600 font-medium">Tipo:</span>
                          <span
                            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                              formData.evaluationType === "INICIAL"
                                ? "bg-blue-100 text-blue-800"
                                : formData.evaluationType === "SEGUIMIENTO"
                                ? "bg-orange-100 text-orange-800"
                                : formData.evaluationType === "ESPECIAL"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-pink-100 text-pink-800"
                            }`}
                          >
                            {formData.evaluationType}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-blue-200/50 last:border-0">
                          <span className="text-slate-600 font-medium">Año:</span>
                          <span className="font-semibold text-slate-900">{formData.academicYear}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-slate-600 font-medium">Institución:</span>
                          <span className="font-semibold text-slate-900 text-right max-w-[60%] truncate">
                            {formData.institutionId
                              ? institutions.find((i) => i.id === formData.institutionId)?.name || "Seleccionada"
                              : "No seleccionada"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Motivo */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="text-base font-semibold text-slate-900">Motivo de la Evaluación</h4>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {formData.evaluationReason || "No especificado"}
                      </p>
                    </div>
                  </div>

                  {/* Áreas de Desarrollo */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h4 className="text-base font-semibold text-slate-900">Áreas de Desarrollo</h4>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Emocional", value: formData.emotionalDevelopment },
                          { label: "Social", value: formData.socialDevelopment },
                          { label: "Cognitivo", value: formData.cognitiveDevelopment },
                          { label: "Motor", value: formData.motorDevelopment },
                        ].map((area) => (
                          <div key={area.label} className="bg-white/60 rounded-lg p-3 text-center border border-emerald-200/50">
                            <div className="text-xs font-medium text-slate-600 mb-2">{area.label}</div>
                            <div
                              className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                                area.value === "ESPERADO"
                                  ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
                                  : area.value === "EN_PROCESO"
                                  ? "bg-amber-500 shadow-lg shadow-amber-500/30"
                                  : area.value === "REQUIERE_APOYO"
                                  ? "bg-red-500 shadow-lg shadow-red-500/30"
                                  : "bg-slate-400"
                              }`}
                            ></div>
                            <div className="text-xs text-slate-700 font-semibold">
                              {area.value === "EN_PROCESO"
                                ? "En Proceso"
                                : area.value === "REQUIERE_APOYO"
                                ? "Req. Apoyo"
                                : area.value === "NO_EVALUADO"
                                ? "No Eval."
                                : "Esperado"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Observaciones y Recomendaciones */}
                  {(formData.observations || formData.recommendations) && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <h4 className="text-base font-semibold text-slate-900">Notas</h4>
                      </div>
                      <div className="space-y-3">
                        {formData.observations && (
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                            <div className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              Observaciones:
                            </div>
                            <p className="text-sm text-blue-700 leading-relaxed line-clamp-3">
                              {formData.observations}
                            </p>
                          </div>
                        )}
                        {formData.recommendations && (
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                            <div className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Recomendaciones:
                            </div>
                            <p className="text-sm text-green-700 leading-relaxed line-clamp-3">
                              {formData.recommendations}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Evaluador y Seguimiento */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="text-base font-semibold text-slate-900">Evaluador</h4>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">Evaluado por:</span>
                        <span className="font-semibold text-slate-900 text-right max-w-[60%] truncate">
                          {formData.evaluatedBy
                            ? evaluators.find((e) => e.id === formData.evaluatedBy)?.name || "Seleccionado"
                            : "No seleccionado"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">Seguimiento:</span>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              formData.requiresFollowUp
                                ? "bg-orange-500 shadow-lg shadow-orange-500/30"
                                : "bg-slate-400"
                            }`}
                          ></div>
                          <span className={`text-sm font-semibold ${
                            formData.requiresFollowUp ? "text-orange-600" : "text-slate-500"
                          }`}>
                            {formData.requiresFollowUp ? "Sí" : "No"}
                          </span>
                        </div>
                      </div>
                      {formData.requiresFollowUp && formData.followUpFrequency && (
                        <div className="flex justify-between items-center pt-2 border-t border-purple-200/50">
                          <span className="text-slate-600 font-medium">Frecuencia:</span>
                          <span className="font-semibold text-slate-900">{formData.followUpFrequency}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Indicador de Progreso */}
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Progreso del Formulario
                      </span>
                      <span className="text-sm font-bold text-slate-700">
                        {[
                          formData.studentId && formData.classroomId && formData.institutionId,
                          formData.evaluationReason.trim().length > 0,
                          true,
                          formData.evaluatedBy,
                        ].filter(Boolean).length} / 4
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${([
                            formData.studentId && formData.classroomId && formData.institutionId,
                            formData.evaluationReason.trim().length > 0,
                            true,
                            formData.evaluatedBy,
                          ].filter(Boolean).length / 4) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
