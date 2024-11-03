package program.service.api.brainsproject.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import program.service.api.brainsproject.dto.AuthResponse;
import program.service.api.brainsproject.dto.SubscriptionDto;
import program.service.api.brainsproject.dto.UserIdDto;
import program.service.api.brainsproject.entity.Prediction;
import program.service.api.brainsproject.entity.User;
import program.service.api.brainsproject.repository.HistoryRepository;
import program.service.api.brainsproject.repository.UserRepository;
import program.service.api.brainsproject.service.AiService;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ai")
public class AiController {
    private final UserRepository userRepository;
    private final HistoryRepository historyRepository;
    private final AiService aiService;

    @Autowired
    public AiController(
            UserRepository userRepository,
            HistoryRepository historyRepository,
            AiService aiService
    ){
        this.userRepository = userRepository;
        this.historyRepository = historyRepository;
        this.aiService = aiService;
    }


    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody SubscriptionDto dto){
        Optional<User> optionalUser = userRepository.findById(dto.getUserId());

        if (optionalUser.isPresent()){
            User user = optionalUser.get();
            String translatedPlan = "";

            switch (dto.getPlan()){
                case "LITE" -> {
                    user.setSubscribedUntil(LocalDate.now().plusMonths(1));
                    translatedPlan = "Новичок";
                }
                case "MASTER" -> {
                    user.setSubscribedUntil(LocalDate.now().plusMonths(3));
                    translatedPlan = "Мастер";
                }
                case "AI" -> {
                    user.setSubscribedUntil(LocalDate.now().plusMonths(12));
                    translatedPlan = "Нейросеть";
                }
                default -> {
                    HashMap<String, String> response = new HashMap<>();
                    response.put("status", "ОШИБКА: неверная подписка!");

                    return ResponseEntity.badRequest().body(response);
                }
            }

            HashMap<String, AuthResponse> response = new HashMap<>();
            response.put("user", new AuthResponse(
                    user.getId(),
                    user.getName(),
                    user.getSurname(),
                    user.getMail(),
                    user.getFreeAttempts(),
                    translatedPlan,
                    user.getSubscribedUntil()
            ));

            user.setStatus(translatedPlan);

            userRepository.save(user);

            return ResponseEntity.ok(response);
        }
        else {
            HashMap<String, String> response = new HashMap<>();
            response.put("status", "ОШИБКА: пользователь не существует!");

            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/predict")
    public ResponseEntity<?> predict(
            @RequestParam(value = "image") MultipartFile image,
            @RequestParam(value = "id") Long id
    ) throws IOException {

        Optional<User> userOptional = userRepository.findById(id);

        if(userOptional.isPresent()){
            User user = userOptional.get();

            if(user.getSubscribedUntil() != null){
                if(user.getSubscribedUntil().isAfter(LocalDate.now()))
                    return aiService.sendRequestToAi(id, image);
                else {
                    if(user.getFreeAttempts() > 0){
                        user.setFreeAttempts((byte) (user.getFreeAttempts() - 1));
                        userRepository.save(user);


                        return  aiService.sendRequestToAi(id, image);
                    }
                    else {
                        HashMap<String, String> response = new HashMap<>();
                        response.put("status", "ОШИБКА: подписка истекла и бесплатные попытки закончились!");

                        return ResponseEntity.badRequest().body(response);
                    }
                }
            }
            else {
                if(user.getFreeAttempts() > 0){
                    user.setFreeAttempts((byte) (user.getFreeAttempts() - 1));
                    userRepository.save(user);

                    return  aiService.sendRequestToAi(id, image);
                }
                else {
                    HashMap<String, String> response = new HashMap<>();
                    response.put("status", "ОШИБКА: бесплатные попытки закончились!");

                    return ResponseEntity.badRequest().body(response);
                }
            }
        }
        else {
            HashMap<String, String> response = new HashMap<>();
            response.put("status", "ОШИБКА: пользователь не существует!");

            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/history")
    public ResponseEntity<?> getUserHistory(@RequestBody UserIdDto dto){
        if(userRepository.existsById(dto.getUserId())){
            List<Prediction> list = historyRepository.findTop3ByUserIdOrderByIdDesc(dto.getUserId());

            return ResponseEntity.ok(list);
        }
        else {
            HashMap<String, String> response = new HashMap<>();
            response.put("status", "ОШИБКА: пользователь не существует!");

            return ResponseEntity.badRequest().body(response);
        }
    }
}
