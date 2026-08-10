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

import vn.tuhoc.vinaeatery.modules.table.domains.entities.CategoryTableEntity;
import vn.tuhoc.vinaeatery.modules.table.domains.graphs.CategoryTableEntityGraph;

public interface CategoryTableRepository
        extends JpaRepository<CategoryTableEntity, Integer>, JpaSpecificationExecutor<CategoryTableEntity> {
    @Query("""
                select distinct ct
                from CategoryTableEntity ct
                where ct.id = :id
            """)
    Optional<CategoryTableEntity> findOneByIdToCrud(@Param("id") Integer id);

    @EntityGraph(value = CategoryTableEntityGraph.FULL)
    @Query("""
                select distinct ct
                from CategoryTableEntity ct
                where ct.id = :id
            """)
    Optional<CategoryTableEntity> findOneById(@Param("id") Integer id);

    Page<CategoryTableEntity> findAll(Specification<CategoryTableEntity> specification, Pageable pageable);

    @Query("""
                select ct
                from CategoryTableEntity ct
                where ct.status = vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum.ACTIVE
            """)
    List<CategoryTableEntity> findAllCrud();

    @Query("""
                select ct
                from CategoryTableEntity ct
                where ct.restaurant.id = :restaurantId
                    and ct.status = vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum.ACTIVE
            """)
    List<CategoryTableEntity> findAllCrud(@Param("restaurantId") Integer restaurantId);
}
