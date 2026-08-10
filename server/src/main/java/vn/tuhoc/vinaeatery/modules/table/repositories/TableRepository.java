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

import vn.tuhoc.vinaeatery.modules.table.domains.entities.TableEntity;
import vn.tuhoc.vinaeatery.modules.table.domains.graphs.TableEntityGraph;

public interface TableRepository extends JpaRepository<TableEntity, Integer>, JpaSpecificationExecutor<TableEntity> {
        @Query("""
                        select distinct t
                        from TableEntity t
                        where t.id = :id
                        """)
        Optional<TableEntity> findOneByIdToCrud(@Param("id") Integer id);

        @EntityGraph(value = TableEntityGraph.FULL)
        @Query("""
                        select distinct t
                        from TableEntity t
                        where t.id = :id
                        """)
        Optional<TableEntity> findOneById(@Param("id") Integer id);

        @EntityGraph(value = TableEntityGraph.HALF)
        Page<TableEntity> findAll(Specification<TableEntity> specification, Pageable pageable);

        @EntityGraph(value = TableEntityGraph.HALF)
        @Query("""
                            select t
                            from TableEntity t
                             where t.restaurant.id = :restaurantId
                        """)
        List<TableEntity> findAllByRestaurantId(@Param("restaurantId") Integer restaurantId);

        @EntityGraph(value = TableEntityGraph.HALF)
        @Query("""
                            select t
                            from TableEntity t
                            where t.status = vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum.ACTIVE
                        """)
        List<TableEntity> findAllCrud();

        @EntityGraph(value = TableEntityGraph.HALF)
        @Query("""
                            select t
                            from TableEntity t
                            where t.restaurant.id = :restaurantId
                                and t.status = vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum.ACTIVE
                        """)
        List<TableEntity> findAllCrud(@Param("restaurantId") Integer restaurantId);

        @Query("""
                            select count(t) > 0
                            from TableEntity t
                            where t.floor.id = :floorId
                              and t.status = vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum.ACTIVE
                        """)
        Boolean existsByFloorIdAndStatusIsActive(@Param("floorId") Integer floorId);

        @Query("""
                            select count(t) > 0
                            from TableEntity t
                            where t.categoryTable.id = :categoryTableId
                              and t.status = vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum.ACTIVE
                        """)
        Boolean existsByCategoryTableIdAndStatusIsActive(@Param("categoryTableId") Integer categoryTableId);
}