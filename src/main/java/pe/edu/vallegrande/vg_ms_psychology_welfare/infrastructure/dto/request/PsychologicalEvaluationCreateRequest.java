package pe.edu.vallegrande.vg_ms_psychology_welfare.infrastructure.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Datos para crear evaluación psicológica")
public class PsychologicalEvaluationCreateRequest {
    
    @NotNull(message = "El ID del estudiante es obligatorio")
    @Schema(description = "ID del estudiante evaluado")
    private UUID studentId;
    
    @NotNull(message = "El ID del aula es obligatorio")
    @Schema(description = "ID del aula")
    private UUID classroomId;
    
    @NotNull(message = "El ID de la institución es obligatorio")
    @Schema(description = "ID de la institución")
    private UUID institutionId;
    
    @NotNull(message = "La fecha de evaluación es obligatoria")
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Schema(description = "Fecha de la evaluación")
    private LocalDate evaluationDate;
    
    @NotNull(message = "El año académico es obligatorio")
    @Min(value = 2020, message = "El año académico debe ser mayor a 2020")
    @Schema(description = "Año académico")
    private Integer academicYear;
    
    @NotNull(message = "El tipo de evaluación es obligatorio")
    @Schema(description = "Tipo de evaluación")
    private String evaluationType;
    
    @Schema(description = "Motivo de la evaluación")
    private String evaluationReason;
    
    @Schema(description = "Desarrollo emocional")
    private String emotionalDevelopment;
    
    @Schema(description = "Desarrollo social")
    private String socialDevelopment;
    
    @Schema(description = "Desarrollo cognitivo")
    private String cognitiveDevelopment;
    
    @Schema(description = "Desarrollo motor")
    private String motorDevelopment;
    
    @NotBlank(message = "Las observaciones son obligatorias")
    @Schema(description = "Observaciones de la evaluación")
    private String observations;
    
    @Schema(description = "Recomendaciones")
    private String recommendations;
    
    @Schema(description = "Requiere seguimiento")
    private Boolean requiresFollowUp;
    
    @Schema(description = "Frecuencia del seguimiento")
    private String followUpFrequency;
    
    @NotNull(message = "El ID del evaluador es obligatorio")
    @Schema(description = "ID de quien realizó la evaluación")
    private UUID evaluatedBy;
}