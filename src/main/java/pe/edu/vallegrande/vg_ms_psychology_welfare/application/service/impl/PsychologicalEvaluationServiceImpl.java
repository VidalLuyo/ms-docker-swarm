package pe.edu.vallegrande.vg_ms_psychology_welfare.application.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pe.edu.vallegrande.vg_ms_psychology_welfare.domain.model.PsychologicalEvaluation;
import pe.edu.vallegrande.vg_ms_psychology_welfare.infrastructure.repository.PsychologicalEvaluationRepository;
import pe.edu.vallegrande.vg_ms_psychology_welfare.application.service.PsychologicalEvaluationService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PsychologicalEvaluationServiceImpl implements PsychologicalEvaluationService {

    private final PsychologicalEvaluationRepository repository;

    @Override
    public Mono<PsychologicalEvaluation> createEvaluation(PsychologicalEvaluation evaluation) {
        log.info("Creando evaluación para estudiante: {}", evaluation.getStudentId());

        evaluation.setId(UUID.randomUUID());
        evaluation.setEvaluatedAt(LocalDateTime.now());
        evaluation.setUpdatedAt(LocalDateTime.now());

        if (evaluation.getRequiresFollowUp() == null) {
            evaluation.setRequiresFollowUp(false);
        }

        return repository.save(evaluation);
    }

    @Override
    public Mono<PsychologicalEvaluation> updateEvaluation(UUID id, PsychologicalEvaluation evaluation) {
        log.info("Actualizando evaluación: {}", id);

        return repository.findById(id)
                .switchIfEmpty(Mono.error(new RuntimeException("No se encontró la evaluación: " + id)))
                .map(existing -> {
                    evaluation.setId(id);
                    evaluation.setEvaluatedAt(existing.getEvaluatedAt());
                    evaluation.setUpdatedAt(LocalDateTime.now());
                    return evaluation;
                })
                .flatMap(repository::save);
    }

    @Override
    public Mono<PsychologicalEvaluation> getEvaluationById(UUID id) {
        return repository.findById(id)
                .switchIfEmpty(Mono.error(new RuntimeException("No se encontró la evaluación: " + id)));
    }

    @Override
    public Flux<PsychologicalEvaluation> getAllEvaluations() {
        return repository.findAll();
    }

    @Override
    public Flux<PsychologicalEvaluation> getEvaluationsByStudentId(UUID studentId) {
        return repository.findByStudentId(studentId);
    }

    @Override
    public Flux<PsychologicalEvaluation> getEvaluationsByClassroomId(UUID classroomId) {
        return repository.findByClassroomId(classroomId);
    }

    @Override
    public Flux<PsychologicalEvaluation> getEvaluationsByInstitutionId(UUID institutionId) {
        return repository.findByInstitutionId(institutionId);
    }

    @Override
    public Flux<PsychologicalEvaluation> getEvaluationsByEvaluatedBy(UUID evaluatedBy) {
        return repository.findByEvaluatedBy(evaluatedBy);
    }

    @Override
    public Flux<PsychologicalEvaluation> getEvaluationsByAcademicYear(Integer academicYear) {
        return repository.findByAcademicYear(academicYear);
    }

    @Override
    public Mono<Void> deleteEvaluation(UUID id) {
        log.info("Eliminando evaluación: {}", id);

        return repository.existsById(id)
                .flatMap(exists -> {
                    if (!exists) {
                        return Mono.error(new RuntimeException("No se encontró la evaluación: " + id));
                    }
                    return repository.deleteById(id);
                });
    }
}