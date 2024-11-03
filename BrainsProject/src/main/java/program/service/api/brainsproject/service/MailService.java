package program.service.api.brainsproject.service;


import lombok.AllArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class MailService{
    private final JavaMailSender emailSender;

    public void sendSimpleEmail(String name, String result, String receiver) {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setTo(receiver);
        simpleMailMessage.setSubject("Нейросеть для диагностики злокачественных опухолей головного мозга");
        simpleMailMessage.setText(
                "Здравствуйте, " + name + "!\n" + "\n" +
                        "НЕЙРОСЕТЬ НЕ ГАРАНТИРУЕТ ТОЧНОСТИ В ДИАГНОСТИКЕ\n" + "\n" +
                        "Предполагаемый диагноз: " + result
        );
        emailSender.send(simpleMailMessage);
    }
}
