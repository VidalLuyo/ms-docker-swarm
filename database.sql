-- Neon PostgreSQL Database Script
-- Psychological Evaluations Microservice

CREATE TABLE psychological_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    classroom_id UUID NOT NULL,
    institution_id UUID NOT NULL,
    evaluation_date DATE NOT NULL,
    academic_year INT NOT NULL,
    
    -- Tipo de evaluación
    evaluation_type VARCHAR(50) NOT NULL,
    evaluation_reason TEXT,
    
    -- Áreas evaluadas
    emotional_development VARCHAR(20),
    social_development VARCHAR(20),
    cognitive_development VARCHAR(20),
    motor_development VARCHAR(20),
    
    -- Resultados
    observations TEXT NOT NULL,
    recommendations TEXT,
    requires_follow_up BOOLEAN DEFAULT FALSE,
    follow_up_frequency VARCHAR(30),
    
    -- Registro
    evaluated_by UUID NOT NULL,
    evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_evaluation_type CHECK (
        evaluation_type IN ('INICIAL', 'SEGUIMIENTO', 'ESPECIAL', 'DERIVACION')
    ),
    CONSTRAINT chk_development_level CHECK (
        emotional_development IN ('ESPERADO', 'EN_PROCESO', 'REQUIERE_APOYO', 'NO_EVALUADO') AND
        social_development IN ('ESPERADO', 'EN_PROCESO', 'REQUIERE_APOYO', 'NO_EVALUADO') AND
        cognitive_development IN ('ESPERADO', 'EN_PROCESO', 'REQUIERE_APOYO', 'NO_EVALUADO') AND
        motor_development IN ('ESPERADO', 'EN_PROCESO', 'REQUIERE_APOYO', 'NO_EVALUADO')
    )
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_psychological_evaluations_student_id ON psychological_evaluations(student_id);
CREATE INDEX idx_psychological_evaluations_classroom_id ON psychological_evaluations(classroom_id);
CREATE INDEX idx_psychological_evaluations_institution_id ON psychological_evaluations(institution_id);
CREATE INDEX idx_psychological_evaluations_evaluation_date ON psychological_evaluations(evaluation_date);
CREATE INDEX idx_psychological_evaluations_academic_year ON psychological_evaluations(academic_year);

-- Datos de ejemplo
INSERT INTO psychological_evaluations (
    student_id, classroom_id, institution_id, evaluation_date, academic_year,
    evaluation_type, evaluation_reason, emotional_development, social_development,
    cognitive_development, motor_development, observations, recommendations,
    requires_follow_up, follow_up_frequency, evaluated_by
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440003',
    '2024-12-10',
    2024,
    'INICIAL',
    'Evaluación inicial de ingreso',
    'ESPERADO',
    'EN_PROCESO',
    'ESPERADO',
    'ESPERADO',
    'El estudiante muestra un desarrollo adecuado en la mayoría de áreas. Se observa que necesita refuerzo en habilidades sociales para mejorar su interacción con compañeros.',
    'Implementar actividades grupales. Seguimiento mensual del progreso social. Involucrar a los padres en el proceso.',
    true,
    'mensual',
    '550e8400-e29b-41d4-a716-446655440004'
),
(
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440003',
    '2024-12-11',
    2024,
    'SEGUIMIENTO',
    'Evaluación de seguimiento trimestral',
    'ESPERADO',
    'ESPERADO',
    'EN_PROCESO',
    'ESPERADO',
    'El estudiante ha mostrado mejoras significativas en el área social. Se observa un leve retraso en el desarrollo cognitivo que requiere atención especializada.',
    'Continuar con actividades de refuerzo cognitivo. Programar sesiones individuales de apoyo académico. Evaluación neuropsicológica recomendada.',
    true,
    'quincenal',
    '550e8400-e29b-41d4-a716-446655440004'
);