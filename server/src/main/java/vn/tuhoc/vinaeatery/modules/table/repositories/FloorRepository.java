package vn.tuhoc.vinaeatery.modules.table.repositories;

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

import vn.tuhoc.vinaeatery.modules.table.domains.entities.FloorEntity;
import vn.tuhoc.vinaeatery.modules.table.domains.graphs.FloorEntityGraph;

public interface FloorRepository extends JpaRepository<FloorEntity, Integer>, JpaSpecificationExecutor<FloorEntity> {
        @Query("""
                        select distinct f
                        from FloorEntity f
                        where f.id = :id
                        """)
        Optional<FloorEntity> findOneByIdToCrud(@Param("id") Integer id);

        @EntityGraph(value = FloorEntityGraph.FULL)
        @Query("""
                        select distinct f
                        from FloorEntity f
                        where f.id = :id
                        """)
        Optional<FloorEntity> findOneById(@Param("id") Integer id);

        Page<FloorEntity> findAll(Specification<FloorEntity> specification, Pageable pageable);

        @Query("""
                            select f
                            from FloorEntity f
                            where f.status = vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum.ACTIVE
                        """)
        List<FloorEntity> findAllCrud();

        @Query("""
                            select f
                            from FloorEntity f
                            where f.restaurant.id = :restaurantId
                                and f.status = vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum.ACTIVE
                        """)
        List<FloorEntity> findAllCrud(@Param("restaurantId") Integer restaurantId);
}
