package pe.edu.vallegrande.vg_ms_psychology_welfare.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pe.edu.vallegrande.vg_ms_psychology_welfare.domain.enums.DevelopmentLevel;
import pe.edu.vallegrande.vg_ms_psychology_welfare.domain.enums.EvaluationType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PsychologicalEvaluation {
    
    private UUID id;
    private UUID studentId;
    private UUID classroomId;
    private UUID institutionId;
    private LocalDate evaluationDate;
    private Integer academicYear;
    private EvaluationType evaluationType;
    private String evaluationReason;
    private DevelopmentLevel emotionalDevelopment;
    private DevelopmentLevel socialDevelopment;
    private DevelopmentLevel cognitiveDevelopment;
    private DevelopmentLevel motorDevelopment;
    private String observations;
    private String recommendations;
    private Boolean requiresFollowUp;
    private String followUpFrequency;
    private UUID evaluatedBy;
    private LocalDateTime evaluatedAt;
    private LocalDateTime updatedAt;
}