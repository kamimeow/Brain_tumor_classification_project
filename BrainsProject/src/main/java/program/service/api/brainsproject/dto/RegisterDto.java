package program.service.api.brainsproject.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RegisterDto {
    private String name;
    private String surname;
    private String mail;
    private String password;
}
