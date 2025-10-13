package pe.edu.vallegrande.vg_ms_psychology_welfare.infrastructure.repository.adapter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;

import org.springframework.stereotype.Repository;
import pe.edu.vallegrande.vg_ms_psychology_welfare.domain.enums.DevelopmentLevel;
import pe.edu.vallegrande.vg_ms_psychology_welfare.domain.enums.EvaluationType;
import pe.edu.vallegrande.vg_ms_psychology_welfare.domain.model.PsychologicalEvaluation;
import pe.edu.vallegrande.vg_ms_psychology_welfare.infrastructure.repository.PsychologicalEvaluationRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Repository
@RequiredArgsConstructor
public class PsychologicalEvaluationRepositoryImpl implements PsychologicalEvaluationRepository {

    private final R2dbcEntityTemplate template;

    @Override
    public Mono<PsychologicalEvaluation> save(PsychologicalEvaluation evaluation) {
        String sql = """
                INSERT INTO psychological_evaluations
                (id, student_id, classroom_id, institution_id, evaluation_date, academic_year,
                 evaluation_type, evaluation_reason, emotional_development, social_development,
                 cognitive_development, motor_development, observations, recommendations,
                 requires_follow_up, follow_up_frequency, evaluated_by, evaluated_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
                ON CONFLICT (id) DO UPDATE SET
                    student_id = $2, classroom_id = $3, institution_id = $4, evaluation_date = $5,
                    academic_year = $6, evaluation_type = $7, evaluation_reason = $8,
                    emotional_development = $9, social_development = $10, cognitive_development = $11,
                    motor_development = $12, observations = $13, recommendations = $14,
                    requires_follow_up = $15, follow_up_frequency = $16, evaluated_by = $17,
                    updated_at = $19
                RETURNING *
                """;

        return template.getDatabaseClient()
                .sql(sql)
                .bind("$1", evaluation.getId())
                .bind("$2", evaluation.getStudentId())
                .bind("$3", evaluation.getClassroomId())
                .bind("$4", evaluation.getInstitutionId())
                .bind("$5", evaluation.getEvaluationDate())
                .bind("$6", evaluation.getAcademicYear())
                .bind("$7", evaluation.getEvaluationType() != null ? evaluation.getEvaluationType().name() : null)
                .bind("$8", evaluation.getEvaluationReason())
                .bind("$9",
                        evaluation.getEmotionalDevelopment() != null ? evaluation.getEmotionalDevelopment().name()
                                : null)
                .bind("$10",
                        evaluation.getSocialDevelopment() != null ? evaluation.getSocialDevelopment().name() : null)
                .bind("$11",
                        evaluation.getCognitiveDevelopment() != null ? evaluation.getCognitiveDevelopment().name()
                                : null)
                .bind("$12", evaluation.getMotorDevelopment() != null ? evaluation.getMotorDevelopment().name() : null)
                .bind("$13", evaluation.getObservations())
                .bind("$14", evaluation.getRecommendations())
                .bind("$15", evaluation.getRequiresFollowUp())
                .bind("$16", evaluation.getFollowUpFrequency())
                .bind("$17", evaluation.getEvaluatedBy())
                .bind("$18", evaluation.getEvaluatedAt())
                .bind("$19", evaluation.getUpdatedAt())
                .map(this::mapRow)
                .one();
    }

    @Override
    public Mono<PsychologicalEvaluation> findById(UUID id) {
        return template.getDatabaseClient()
                .sql("SELECT * FROM psychological_evaluations WHERE id = $1")
                .bind("$1", id)
                .map(this::mapRow)
                .one();
    }

    @Override
    public Flux<PsychologicalEvaluation> findAll() {
        return template.getDatabaseClient()
                .sql("SELECT * FROM psychological_evaluations ORDER BY evaluation_date DESC")
                .map(this::mapRow)
                .all();
    }

    @Override
    public Flux<PsychologicalEvaluation> findByStudentId(UUID studentId) {
        return template.getDatabaseClient()
                .sql("SELECT * FROM psychological_evaluations WHERE student_id = $1 ORDER BY evaluation_date DESC")
                .bind("$1", studentId)
                .map(this::mapRow)
                .all();
    }

    @Override
    public Flux<PsychologicalEvaluation> findByClassroomId(UUID classroomId) {
        return template.getDatabaseClient()
                .sql("SELECT * FROM psychological_evaluations WHERE classroom_id = $1 ORDER BY evaluation_date DESC")
                .bind("$1", classroomId)
                .map(this::mapRow)
                .all();
    }

    @Override
    public Flux<PsychologicalEvaluation> findByInstitutionId(UUID institutionId) {
        return template.getDatabaseClient()
                .sql("SELECT * FROM psychological_evaluations WHERE institution_id = $1 ORDER BY evaluation_date DESC")
                .bind("$1", institutionId)
                .map(this::mapRow)
                .all();
    }

    @Override
    public Flux<PsychologicalEvaluation> findByEvaluatedBy(UUID evaluatedBy) {
        return template.getDatabaseClient()
                .sql("SELECT * FROM psychological_evaluations WHERE evaluated_by = $1 ORDER BY evaluation_date DESC")
                .bind("$1", evaluatedBy)
                .map(this::mapRow)
                .all();
    }

    @Override
    public Flux<PsychologicalEvaluation> findByAcademicYear(Integer academicYear) {
        return template.getDatabaseClient()
                .sql("SELECT * FROM psychological_evaluations WHERE academic_year = $1 ORDER BY evaluation_date DESC")
                .bind("$1", academicYear)
                .map(this::mapRow)
                .all();
    }

    @Override
    public Mono<Void> deleteById(UUID id) {
        return template.getDatabaseClient()
                .sql("DELETE FROM psychological_evaluations WHERE id = $1")
                .bind("$1", id)
                .then();
    }

    @Override
    public Mono<Boolean> existsById(UUID id) {
        return template.getDatabaseClient()
                .sql("SELECT COUNT(*) FROM psychological_evaluations WHERE id = $1")
                .bind("$1", id)
                .map(row -> row.get(0, Long.class))
                .one()
                .map(count -> count > 0);
    }

    private PsychologicalEvaluation mapRow(io.r2dbc.spi.Row row, io.r2dbc.spi.RowMetadata metadata) {
        return PsychologicalEvaluation.builder()
                .id(row.get("id", UUID.class))
                .studentId(row.get("student_id", UUID.class))
                .classroomId(row.get("classroom_id", UUID.class))
                .institutionId(row.get("institution_id", UUID.class))
                .evaluationDate(row.get("evaluation_date", java.time.LocalDate.class))
                .academicYear(row.get("academic_year", Integer.class))
                .evaluationType(row.get("evaluation_type", String.class) != null
                        ? EvaluationType.valueOf(row.get("evaluation_type", String.class))
                        : null)
                .evaluationReason(row.get("evaluation_reason", String.class))
                .emotionalDevelopment(row.get("emotional_development", String.class) != null
                        ? DevelopmentLevel.valueOf(row.get("emotional_development", String.class))
                        : null)
                .socialDevelopment(row.get("social_development", String.class) != null
                        ? DevelopmentLevel.valueOf(row.get("social_development", String.class))
                        : null)
                .cognitiveDevelopment(row.get("cognitive_development", String.class) != null
                        ? DevelopmentLevel.valueOf(row.get("cognitive_development", String.class))
                        : null)
                .motorDevelopment(row.get("motor_development", String.class) != null
                        ? DevelopmentLevel.valueOf(row.get("motor_development", String.class))
                        : null)
                .observations(row.get("observations", String.class))
                .recommendations(row.get("recommendations", String.class))
                .requiresFollowUp(row.get("requires_follow_up", Boolean.class))
                .followUpFrequency(row.get("follow_up_frequency", String.class))
                .evaluatedBy(row.get("evaluated_by", UUID.class))
                .evaluatedAt(row.get("evaluated_at", LocalDateTime.class))
                .updatedAt(row.get("updated_at", LocalDateTime.class))
                .build();
    }
}