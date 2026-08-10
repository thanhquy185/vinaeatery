package vn.tuhoc.vinaeatery.modules.active.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import vn.tuhoc.vinaeatery.modules.active.domains.entities.ReservationEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.graphs.ReservationEntityGraph;

public interface ReservationRepository
                extends JpaRepository<ReservationEntity, Integer>, JpaSpecificationExecutor<ReservationEntity> {
        @Query("""
                                select distinct r
                                from ReservationEntity r
                                where r.id = :id
                        """)
        Optional<ReservationEntity> findOneByIdToCrud(@Param("id") Integer id);

        @EntityGraph(value = ReservationEntityGraph.FULL)
        @Query("""
                                select distinct r
                                from ReservationEntity r
                                where r.id = :id
                        """)
        Optional<ReservationEntity> findOneById(@Param("id") Integer id);

        @EntityGraph(value = ReservationEntityGraph.ONLY_RESTAURANT)
        Page<ReservationEntity> findAll(Specification<ReservationEntity> specification, Pageable pageable);

        @Query("""
                            select r
                            from ReservationEntity r
                            where r.status = vn.tuhoc.vinaeatery.modules.active.domains.enums.ReservationStatusEnum.CONFIRMED
                        """)
        List<ReservationEntity> findAllCrud();

        @Query("""
                            select r
                            from ReservationEntity r
                            where r.restaurant.id = :restaurantId
                                and r.status = vn.tuhoc.vinaeatery.modules.active.domains.enums.ReservationStatusEnum.CONFIRMED
                        """)
        List<ReservationEntity> findAllCrud(@Param("restaurantId") Integer restaurantId);
}
