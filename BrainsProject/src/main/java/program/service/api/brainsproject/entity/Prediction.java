package program.service.api.brainsproject.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "predictions_history")
@Data
@NoArgsConstructor
public class Prediction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "result")
    private String result;

    @Column(name = "date")
    private String date;

    public Prediction(Long userId, String result){
        this.userId = userId;
        this.result = result;
        SimpleDateFormat formatter = new SimpleDateFormat("dd.MM.yyyy k:m");
        this.date = formatter.format(new Date());

    }
}
