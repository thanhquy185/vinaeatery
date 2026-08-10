package vn.tuhoc.vinaeatery.modules.active.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import vn.tuhoc.vinaeatery.modules.active.domains.entities.FeedbackExperienceEntity;

public interface FeedbackExperienceRepository
                extends JpaRepository<FeedbackExperienceEntity, String>,
                JpaSpecificationExecutor<FeedbackExperienceEntity> {
        @Query("""
                        select distinct fe
                        from FeedbackExperienceEntity fe
                        order by fe.id asc
                        """)
        List<FeedbackExperienceEntity> findAllForDashboard();
}
