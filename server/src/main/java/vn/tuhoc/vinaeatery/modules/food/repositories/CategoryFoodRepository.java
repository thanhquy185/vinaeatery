package vn.tuhoc.vinaeatery.modules.food.repositories;

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

import vn.tuhoc.vinaeatery.modules.food.domains.entities.CategoryFoodEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.graphs.CategoryFoodEntityGraph;

public interface CategoryFoodRepository
        extends JpaRepository<CategoryFoodEntity, Integer>, JpaSpecificationExecutor<CategoryFoodEntity> {
    @Query("""
                select distinct cf
                from CategoryFoodEntity cf
                where cf.id = :id
            """)
    Optional<CategoryFoodEntity> findOneByIdToCrud(@Param("id") Integer id);

    @EntityGraph(value = CategoryFoodEntityGraph.FULL)
    @Query("""
                select distinct cf
                from CategoryFoodEntity cf
                where cf.id = :id
            """)
    Optional<CategoryFoodEntity> findOneById(@Param("id") Integer id);

    Page<CategoryFoodEntity> findAll(Specification<CategoryFoodEntity> specification, Pageable pageable);

    @Query("""
                select cf
                from CategoryFoodEntity cf
                where cf.status = vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum.ACTIVE
            """)
    List<CategoryFoodEntity> findAllCrud();

    @Query("""
                select cf
                from CategoryFoodEntity cf
                where cf.restaurant.id = :restaurantId
                    and cf.status = vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum.ACTIVE
            """)
    List<CategoryFoodEntity> findAllCrud(@Param("restaurantId") Integer restaurantId);
}
