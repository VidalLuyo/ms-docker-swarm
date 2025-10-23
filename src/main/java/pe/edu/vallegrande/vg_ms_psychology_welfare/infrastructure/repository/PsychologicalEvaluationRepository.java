package pe.edu.vallegrande.vg_ms_psychology_welfare.infrastructure.repository;

import pe.edu.vallegrande.vg_ms_psychology_welfare.domain.model.PsychologicalEvaluation;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface PsychologicalEvaluationRepository {
    
    Mono<PsychologicalEvaluation> save(PsychologicalEvaluation evaluation);
    
    Mono<PsychologicalEvaluation> findById(UUID id);
    
    Flux<PsychologicalEvaluation> findAll();
    
    Flux<PsychologicalEvaluation> findByStudentId(UUID studentId);
    
    Flux<PsychologicalEvaluation> findByClassroomId(UUID classroomId);
    
    Flux<PsychologicalEvaluation> findByInstitutionId(UUID institutionId);
    
    Flux<PsychologicalEvaluation> findByEvaluatedBy(UUID evaluatedBy);
    
    Flux<PsychologicalEvaluation> findByAcademicYear(Integer academicYear);
    
    Mono<Void> deleteById(UUID id);
    
    Mono<Boolean> existsById(UUID id);
}