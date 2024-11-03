package program.service.api.brainsproject.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import program.service.api.brainsproject.dto.AiResponse;
import program.service.api.brainsproject.dto.AuthResponse;
import program.service.api.brainsproject.dto.UserCover;
import program.service.api.brainsproject.entity.Prediction;
import program.service.api.brainsproject.entity.User;
import program.service.api.brainsproject.repository.HistoryRepository;
import program.service.api.brainsproject.repository.UserRepository;

import java.io.IOException;
import java.util.HashMap;
import java.util.Objects;

@Service
public class AiService {
    private final HistoryRepository historyRepository;
    private final UserRepository userRepository;
    private final MailService mailService;

    @Autowired
    public AiService(HistoryRepository historyRepository, UserRepository userRepository, MailService mailService){
        this.historyRepository = historyRepository;
        this.userRepository = userRepository;
        this.mailService = mailService;
    }

    public ResponseEntity<?> sendRequestToAi(
            Long userId,
            MultipartFile image
    ) throws IOException {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        byte[] imageBytes;
        imageBytes = image.getBytes();

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new ByteArrayResource(imageBytes) {
            @Override
            public String getFilename() {
                return image.getOriginalFilename();
            }
        });

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        ResponseEntity<AiResponse> aiResponseResponse = restTemplate.postForEntity(
                "http://localhost:5000/predict",
                requestEntity, AiResponse.class
        );

        String result;

        switch (Objects.requireNonNull(aiResponseResponse.getBody()).getPredicted_class()){
            case "glioma_tumor" -> result = "Глиома";
            case "meningioma_tumor" -> result = "Менингиома";
            case "pituitary_tumor" -> result = "Опухоль гипофиза";
            case "no_tumor" -> result = "Опухолей нет";
            default -> result = "Если видите эту надпись, значит нейронка сломалась";
        }
        Prediction p=new Prediction(userId, result);
        System.out.printf(p.toString());
        historyRepository.save(p);

        User user = userRepository.findById(userId).get();

       //  mailService.sendSimpleEmail(user.getName() + " " + user.getSurname(), result, user.getMail());

        HashMap<String, Object> response = new HashMap<>();
        HashMap<String, Object> cover = new HashMap<>();
        cover.put("result", result);

        response.put("result", cover);

        response.put("user", new UserCover(
                new AuthResponse(
                        user.getId(),
                        user.getName(),
                        user.getSurname(),
                        user.getMail(),
                        user.getFreeAttempts(),
                        user.getStatus(),
                        user.getSubscribedUntil()
                ))
        );


        return ResponseEntity.ok(response);
    }


}
