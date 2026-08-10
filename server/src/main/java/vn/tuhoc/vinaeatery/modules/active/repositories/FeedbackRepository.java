package vn.tuhoc.vinaeatery.modules.active.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import vn.tuhoc.vinaeatery.modules.active.domains.entities.FeedbackEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.graphs.FeedbackEntityGraph;

public interface FeedbackRepository
        extends JpaRepository<FeedbackEntity, Integer>, JpaSpecificationExecutor<FeedbackEntity> {
    @Query("""
                select distinct f
                from FeedbackEntity f
                where f.id = :id
            """)
    Optional<FeedbackEntity> findOneByIdToCrud(@Param("id") Integer id);

    @EntityGraph(value = FeedbackEntityGraph.HALF)
    @Query("""
                select distinct f
                from FeedbackEntity f
                where f.id = :id
            """)
    Optional<FeedbackEntity> findOneById(@Param("id") Integer id);


    @Query("""
                select distinct f
                from FeedbackEntity f
                where f.restaurant.id = :restaurantId
                  and f.at between :createAtStart and :createAtEnd
                order by f.at asc
            """)
    List<FeedbackEntity> findAllInTimeRange(
            @Param("restaurantId") Integer restaurantId,
            @Param("createAtStart") String createAtStart,
            @Param("createAtEnd") String createAtEnd);
}
