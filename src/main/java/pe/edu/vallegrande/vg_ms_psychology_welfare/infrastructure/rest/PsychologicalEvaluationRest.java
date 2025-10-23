package pe.edu.vallegrande.vg_ms_psychology_welfare.infrastructure.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import pe.edu.vallegrande.vg_ms_psychology_welfare.domain.enums.DevelopmentLevel;
import pe.edu.vallegrande.vg_ms_psychology_welfare.domain.enums.EvaluationType;
import pe.edu.vallegrande.vg_ms_psychology_welfare.domain.model.PsychologicalEvaluation;
import pe.edu.vallegrande.vg_ms_psychology_welfare.application.service.PsychologicalEvaluationService;
import pe.edu.vallegrande.vg_ms_psychology_welfare.infrastructure.dto.request.PsychologicalEvaluationCreateRequest;
import pe.edu.vallegrande.vg_ms_psychology_welfare.infrastructure.dto.response.PsychologicalEvaluationResponse;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import jakarta.validation.Valid;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/psychological-evaluations")
@RequiredArgsConstructor
@Tag(name = "Evaluaciones Psicológicas", description = "API para gestionar evaluaciones psicológicas")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PsychologicalEvaluationRest {

    private final PsychologicalEvaluationService service;

    @Operation(summary = "Crear evaluación")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<PsychologicalEvaluationResponse> createEvaluation(
            @Valid @RequestBody PsychologicalEvaluationCreateRequest request) {
        
        PsychologicalEvaluation evaluation = mapToModel(request);
        return service.createEvaluation(evaluation).map(this::mapToResponse);
    }

    @Operation(summary = "Actualizar evaluación")
    @PutMapping("/{id}")
    public Mono<PsychologicalEvaluationResponse> updateEvaluation(
            @PathVariable UUID id,
            @Valid @RequestBody PsychologicalEvaluationCreateRequest request) {
        
        PsychologicalEvaluation evaluation = mapToModel(request);
        return service.updateEvaluation(id, evaluation).map(this::mapToResponse);
    }

    @Operation(summary = "Obtener evaluación por ID")
    @GetMapping("/{id}")
    public Mono<PsychologicalEvaluationResponse> getEvaluationById(@PathVariable UUID id) {
        return service.getEvaluationById(id).map(this::mapToResponse);
    }

    @Operation(summary = "Obtener todas las evaluaciones")
    @GetMapping
    public Flux<PsychologicalEvaluationResponse> getAllEvaluations() {
        return service.getAllEvaluations().map(this::mapToResponse);
    }

    @Operation(summary = "Obtener evaluaciones por estudiante")
    @GetMapping("/student/{studentId}")
    public Flux<PsychologicalEvaluationResponse> getEvaluationsByStudentId(@PathVariable UUID studentId) {
        return service.getEvaluationsByStudentId(studentId).map(this::mapToResponse);
    }

    @Operation(summary = "Obtener evaluaciones por aula")
    @GetMapping("/classroom/{classroomId}")
    public Flux<PsychologicalEvaluationResponse> getEvaluationsByClassroomId(@PathVariable UUID classroomId) {
        return service.getEvaluationsByClassroomId(classroomId).map(this::mapToResponse);
    }

    @Operation(summary = "Obtener evaluaciones por institución")
    @GetMapping("/institution/{institutionId}")
    public Flux<PsychologicalEvaluationResponse> getEvaluationsByInstitutionId(@PathVariable UUID institutionId) {
        return service.getEvaluationsByInstitutionId(institutionId).map(this::mapToResponse);
    }

    @Operation(summary = "Obtener evaluaciones por evaluador")
    @GetMapping("/evaluator/{evaluatorId}")
    public Flux<PsychologicalEvaluationResponse> getEvaluationsByEvaluatorId(@PathVariable UUID evaluatorId) {
        return service.getEvaluationsByEvaluatedBy(evaluatorId).map(this::mapToResponse);
    }

    @Operation(summary = "Obtener evaluaciones por año")
    @GetMapping("/year/{academicYear}")
    public Flux<PsychologicalEvaluationResponse> getEvaluationsByAcademicYear(@PathVariable Integer academicYear) {
        return service.getEvaluationsByAcademicYear(academicYear).map(this::mapToResponse);
    }

    @Operation(summary = "Eliminar evaluación")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> deleteEvaluation(@PathVariable UUID id) {
        return service.deleteEvaluation(id);
    }

    private PsychologicalEvaluation mapToModel(PsychologicalEvaluationCreateRequest request) {
        return PsychologicalEvaluation.builder()
                .studentId(request.getStudentId())
                .classroomId(request.getClassroomId())
                .institutionId(request.getInstitutionId())
                .evaluationDate(request.getEvaluationDate())
                .academicYear(request.getAcademicYear())
                .evaluationType(request.getEvaluationType() != null ? 
                    EvaluationType.valueOf(request.getEvaluationType()) : null)
                .evaluationReason(request.getEvaluationReason())
                .emotionalDevelopment(request.getEmotionalDevelopment() != null ? 
                    DevelopmentLevel.valueOf(request.getEmotionalDevelopment()) : null)
                .socialDevelopment(request.getSocialDevelopment() != null ? 
                    DevelopmentLevel.valueOf(request.getSocialDevelopment()) : null)
                .cognitiveDevelopment(request.getCognitiveDevelopment() != null ? 
                    DevelopmentLevel.valueOf(request.getCognitiveDevelopment()) : null)
                .motorDevelopment(request.getMotorDevelopment() != null ? 
                    DevelopmentLevel.valueOf(request.getMotorDevelopment()) : null)
                .observations(request.getObservations())
                .recommendations(request.getRecommendations())
                .requiresFollowUp(request.getRequiresFollowUp())
                .followUpFrequency(request.getFollowUpFrequency())
                .evaluatedBy(request.getEvaluatedBy())
                .build();
    }

    private PsychologicalEvaluationResponse mapToResponse(PsychologicalEvaluation evaluation) {
        return PsychologicalEvaluationResponse.builder()
                .id(evaluation.getId())
                .studentId(evaluation.getStudentId())
                .classroomId(evaluation.getClassroomId())
                .institutionId(evaluation.getInstitutionId())
                .evaluationDate(evaluation.getEvaluationDate())
                .academicYear(evaluation.getAcademicYear())
                .evaluationType(evaluation.getEvaluationType() != null ? evaluation.getEvaluationType().name() : null)
                .evaluationReason(evaluation.getEvaluationReason())
                .emotionalDevelopment(evaluation.getEmotionalDevelopment() != null ? evaluation.getEmotionalDevelopment().name() : null)
                .socialDevelopment(evaluation.getSocialDevelopment() != null ? evaluation.getSocialDevelopment().name() : null)
                .cognitiveDevelopment(evaluation.getCognitiveDevelopment() != null ? evaluation.getCognitiveDevelopment().name() : null)
                .motorDevelopment(evaluation.getMotorDevelopment() != null ? evaluation.getMotorDevelopment().name() : null)
                .observations(evaluation.getObservations())
                .recommendations(evaluation.getRecommendations())
                .requiresFollowUp(evaluation.getRequiresFollowUp())
                .followUpFrequency(evaluation.getFollowUpFrequency())
                .evaluatedBy(evaluation.getEvaluatedBy())
                .evaluatedAt(evaluation.getEvaluatedAt())
                .updatedAt(evaluation.getUpdatedAt())
                .build();
    }
}