package program.service.api.brainsproject.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String name;
    private String surname;
    private String mail;
    private Byte freeAttempts;
    private String status;
    private LocalDate subscribedUntil;
}
