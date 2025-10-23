package pe.edu.vallegrande.vg_ms_psychology_welfare.application.service.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pe.edu.vallegrande.vg_ms_psychology_welfare.domain.enums.EvaluationType;
import pe.edu.vallegrande.vg_ms_psychology_welfare.domain.model.PsychologicalEvaluation;
import pe.edu.vallegrande.vg_ms_psychology_welfare.infrastructure.repository.PsychologicalEvaluationRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PsychologicalEvaluationServiceImplTest {

    @Mock
    private PsychologicalEvaluationRepository repository;

    @InjectMocks
    private PsychologicalEvaluationServiceImpl service;

    private PsychologicalEvaluation testEvaluation;
    private UUID testId;

    @BeforeEach
    void setUp() {
        testId = UUID.randomUUID();
        testEvaluation = PsychologicalEvaluation.builder()
                .id(testId)
                .studentId(UUID.randomUUID())
                .classroomId(UUID.randomUUID())
                .institutionId(UUID.randomUUID())
                .evaluationDate(LocalDate.now())
                .academicYear(2024)
                .evaluationType(EvaluationType.INICIAL)
                .observations("Test observations")
                .evaluatedBy(UUID.randomUUID())
                .requiresFollowUp(false)
                .evaluatedAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void createEvaluation_ShouldReturnSavedEvaluation() {
        when(repository.save(any(PsychologicalEvaluation.class)))
                .thenReturn(Mono.just(testEvaluation));

        StepVerifier.create(service.createEvaluation(testEvaluation))
                .expectNext(testEvaluation)
                .verifyComplete();
    }

    @Test
    void getEvaluationById_ShouldReturnEvaluation_WhenExists() {
        when(repository.findById(testId))
                .thenReturn(Mono.just(testEvaluation));

        StepVerifier.create(service.getEvaluationById(testId))
                .expectNext(testEvaluation)
                .verifyComplete();
    }

    @Test
    void getEvaluationById_ShouldReturnError_WhenNotExists() {
        when(repository.findById(testId))
                .thenReturn(Mono.empty());

        StepVerifier.create(service.getEvaluationById(testId))
                .expectError(RuntimeException.class)
                .verify();
    }

    @Test
    void getAllEvaluations_ShouldReturnAllEvaluations() {
        when(repository.findAll())
                .thenReturn(Flux.just(testEvaluation));

        StepVerifier.create(service.getAllEvaluations())
                .expectNext(testEvaluation)
                .verifyComplete();
    }

    @Test
    void getEvaluationsByStudentId_ShouldReturnEvaluations() {
        UUID studentId = testEvaluation.getStudentId();
        when(repository.findByStudentId(studentId))
                .thenReturn(Flux.just(testEvaluation));

        StepVerifier.create(service.getEvaluationsByStudentId(studentId))
                .expectNext(testEvaluation)
                .verifyComplete();
    }

    @Test
    void deleteEvaluation_ShouldComplete_WhenExists() {
        when(repository.existsById(testId))
                .thenReturn(Mono.just(true));
        when(repository.deleteById(testId))
                .thenReturn(Mono.empty());

        StepVerifier.create(service.deleteEvaluation(testId))
                .verifyComplete();
    }
}