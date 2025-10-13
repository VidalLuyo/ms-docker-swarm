package pe.edu.vallegrande.vg_ms_psychology_welfare.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import pe.edu.vallegrande.vg_ms_psychology_welfare.domain.model.PsychologicalEvaluation;
import reactor.core.publisher.Flux;

import java.util.UUID;

@Repository
public interface PsychologicalEvaluationRepository extends R2dbcRepository<PsychologicalEvaluation, UUID> {
    
    Flux<PsychologicalEvaluation> findByStudentId(UUID studentId);
    
    Flux<PsychologicalEvaluation> findByInstitutionId(UUID institutionId);
    
    Flux<PsychologicalEvaluation> findByEvaluationType(String evaluationType);
}