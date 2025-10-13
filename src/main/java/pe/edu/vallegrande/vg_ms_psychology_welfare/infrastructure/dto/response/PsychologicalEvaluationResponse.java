package pe.edu.vallegrande.vg_ms_psychology_welfare.infrastructure.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Respuesta de evaluación psicológica")
public class PsychologicalEvaluationResponse {
    
    @Schema(description = "ID de la evaluación")
    private UUID id;
    
    @Schema(description = "ID del estudiante")
    private UUID studentId;
    
    @Schema(description = "ID del aula")
    private UUID classroomId;
    
    @Schema(description = "ID de la institución")
    private UUID institutionId;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Schema(description = "Fecha de evaluación")
    private LocalDate evaluationDate;
    
    @Schema(description = "Año académico")
    private Integer academicYear;
    
    @Schema(description = "Tipo de evaluación")
    private String evaluationType;
    
    @Schema(description = "Motivo de evaluación")
    private String evaluationReason;
    
    @Schema(description = "Desarrollo emocional")
    private String emotionalDevelopment;
    
    @Schema(description = "Desarrollo social")
    private String socialDevelopment;
    
    @Schema(description = "Desarrollo cognitivo")
    private String cognitiveDevelopment;
    
    @Schema(description = "Desarrollo motor")
    private String motorDevelopment;
    
    @Schema(description = "Observaciones")
    private String observations;
    
    @Schema(description = "Recomendaciones")
    private String recommendations;
    
    @Schema(description = "Requiere seguimiento")
    private Boolean requiresFollowUp;
    
    @Schema(description = "Frecuencia de seguimiento")
    private String followUpFrequency;
    
    @Schema(description = "ID del evaluador")
    private UUID evaluatedBy;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Schema(description = "Fecha de creación")
    private LocalDateTime evaluatedAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Schema(description = "Última actualización")
    private LocalDateTime updatedAt;
}