package program.service.api.brainsproject.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import program.service.api.brainsproject.dto.AuthResponse;
import program.service.api.brainsproject.dto.RegisterDto;
import program.service.api.brainsproject.dto.SignInDto;
import program.service.api.brainsproject.entity.User;
import program.service.api.brainsproject.repository.UserRepository;

import java.time.LocalDate;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthController(
            UserRepository userRepository,
            PasswordEncoder encoder,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.authenticationManager = authenticationManager;
    }


    @PostMapping("/register")
    public ResponseEntity<HashMap<String, String>> register(@RequestBody RegisterDto dto){
        HashMap<String, String> response = new HashMap<>();

        if(userRepository.existsByMail(dto.getMail()))
            response.put("status", "ОШИБКА: Почта занята!");
        else {
            User user = new User(
                    dto.getName(),
                    dto.getSurname(),
                    dto.getMail(),
                    encoder.encode(dto.getPassword())
            );

            userRepository.save(user);

            response.put("status", "Пользователь создан!");
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody SignInDto dto){
        if(!userRepository.existsByMail(dto.getMail())){
            HashMap<String, String> response = new HashMap<>();
            response.put("status", "ОШИБКА: Неверная почта!");
            return ResponseEntity.status(404).body(response);
        }
        else {
            org.springframework.security.core.Authentication authentication = authenticationManager.authenticate
                    (new UsernamePasswordAuthenticationToken
                            (dto.getMail(),
                                    dto.getPassword()));

            SecurityContextHolder.getContext()
                    .setAuthentication(authentication);

            HashMap<String, AuthResponse> response = new HashMap<>();

            User user = userRepository.findByMail(dto.getMail()).get();

            if (user.getSubscribedUntil() != null){
                if(user.getSubscribedUntil().isBefore(LocalDate.now())){
                    user.setStatus("FREE");
                    user.setSubscribedUntil(null);

                    userRepository.save(user);
                }
            }

            response.put("user", new AuthResponse(
                    user.getId(),
                    user.getName(),
                    user.getSurname(),
                    user.getMail(),
                    user.getFreeAttempts(),
                    user.getStatus(),
                    user.getSubscribedUntil()
            ));



            return ResponseEntity.ok(response);
        }
    }
}
