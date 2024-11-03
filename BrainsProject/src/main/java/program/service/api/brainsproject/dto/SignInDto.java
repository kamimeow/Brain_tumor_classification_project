package program.service.api.brainsproject.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SignInDto {
    private String mail;
    private String password;
}
