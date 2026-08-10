package vn.tuhoc.vinaeatery.modules.active.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import vn.tuhoc.vinaeatery.modules.active.domains.entities.FeedbackScoreEntity;

public interface FeedbackScoreRepository
                extends JpaRepository<FeedbackScoreEntity, String>, JpaSpecificationExecutor<FeedbackScoreEntity> {
        @Query("""
                        select distinct fs
                        from FeedbackScoreEntity fs
                        order by fs.index asc
                        """)
        List<FeedbackScoreEntity> findAllForDashboard();
}
