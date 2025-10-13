package pe.edu.vallegrande.vg_ms_psychology_welfare.infrastructure.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.test.StepVerifier;

import java.util.UUID;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @InjectMocks
    private UserService userService;

    private UUID studentId;
    private UUID classroomId;
    private UUID institutionId;
    private UUID evaluatorId;

    @BeforeEach
    void setUp() {
        studentId = UUID.fromString("550e8400-e29b-41d4-a716-446655440001");
        classroomId = UUID.fromString("550e8400-e29b-41d4-a716-446655440002");
        institutionId = UUID.fromString("550e8400-e29b-41d4-a716-446655440003");
        evaluatorId = UUID.fromString("550e8400-e29b-41d4-a716-446655440004");
    }

    @Test
    void obtenerNombreEstudiante_DeberiaRetornarNombreCorrect() {
        StepVerifier.create(userService.obtenerNombreEstudiante(studentId))
                .expectNext("Juan Carlos Pérez López")
                .verifyComplete();
    }

    @Test
    void obtenerNombreAula_DeberiaRetornarAulaCorrecta() {
        StepVerifier.create(userService.obtenerNombreAula(classroomId))
                .expectNext("Aula 1A - Inicial 3 años")
                .verifyComplete();
    }

    @Test
    void obtenerNombreInstitucion_DeberiaRetornarInstitucionCorrecta() {
        StepVerifier.create(userService.obtenerNombreInstitucion(institutionId))
                .expectNext("I.E. San Martín de Porres")
                .verifyComplete();
    }

    @Test
    void obtenerNombreEvaluador_DeberiaRetornarEvaluadorCorrect() {
        StepVerifier.create(userService.obtenerNombreEvaluador(evaluatorId))
                .expectNext("Dra. Patricia Gonzales - Psicóloga")
                .verifyComplete();
    }

    @Test
    void obtenerNombreEstudiante_ConIdInexistente_DeberiaRetornarMensajeError() {
        UUID idInexistente = UUID.randomUUID();
        
        StepVerifier.create(userService.obtenerNombreEstudiante(idInexistente))
                .expectNext("Estudiante no encontrado")
                .verifyComplete();
    }

    @Test
    void obtenerTodosLosEstudiantes_DeberiaRetornarCincoEstudiantes() {
        StepVerifier.create(userService.obtenerTodosLosEstudiantes())
                .expectNextCount(5)
                .verifyComplete();
    }

    @Test
    void obtenerTodasLasAulas_DeberiaRetornarCincoAulas() {
        StepVerifier.create(userService.obtenerTodasLasAulas())
                .expectNextCount(5)
                .verifyComplete();
    }
}