package program.service.api.brainsproject.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import program.service.api.brainsproject.entity.Prediction;

import java.util.List;

@Repository
public interface HistoryRepository extends JpaRepository<Prediction, Long> {
    List<Prediction> findTop3ByUserIdOrderByIdDesc(Long userId);
}

