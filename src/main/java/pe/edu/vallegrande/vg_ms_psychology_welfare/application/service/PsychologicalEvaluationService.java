package pe.edu.vallegrande.vg_ms_psychology_welfare.application.service;

import pe.edu.vallegrande.vg_ms_psychology_welfare.domain.model.PsychologicalEvaluation;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface PsychologicalEvaluationService {
    
    Mono<PsychologicalEvaluation> createEvaluation(PsychologicalEvaluation evaluation);
    
    Mono<PsychologicalEvaluation> updateEvaluation(UUID id, PsychologicalEvaluation evaluation);
    
    Mono<PsychologicalEvaluation> getEvaluationById(UUID id);
    
    Flux<PsychologicalEvaluation> getAllEvaluations();
    
    Flux<PsychologicalEvaluation> getEvaluationsByStudentId(UUID studentId);
    
    Flux<PsychologicalEvaluation> getEvaluationsByClassroomId(UUID classroomId);
    
    Flux<PsychologicalEvaluation> getEvaluationsByInstitutionId(UUID institutionId);
    
    Flux<PsychologicalEvaluation> getEvaluationsByEvaluatedBy(UUID evaluatedBy);
    
    Flux<PsychologicalEvaluation> getEvaluationsByAcademicYear(Integer academicYear);
    
    Mono<Void> deleteEvaluation(UUID id);
}