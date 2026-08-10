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

import vn.tuhoc.vinaeatery.modules.food.domains.entities.CategoryIngredientEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.graphs.CategoryIngredientEntityGraph;

public interface CategoryIngredientRepository extends JpaRepository<CategoryIngredientEntity, Integer>,
        JpaSpecificationExecutor<CategoryIngredientEntity> {
    @Query("""
                select distinct ci
                from CategoryIngredientEntity ci
                where ci.id = :id
            """)
    Optional<CategoryIngredientEntity> findOneByIdToCrud(@Param("id") Integer id);

    @EntityGraph(value = CategoryIngredientEntityGraph.FULL)
    @Query("""
                select distinct ci
                from CategoryIngredientEntity ci
                where ci.id = :id
            """)
    Optional<CategoryIngredientEntity> findOneById(@Param("id") Integer id);

    Page<CategoryIngredientEntity> findAll(Specification<CategoryIngredientEntity> specification, Pageable pageable);

    @Query("""
                select ci
                from CategoryIngredientEntity ci
                where ci.status = vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum.ACTIVE
            """)
    List<CategoryIngredientEntity> findAllCrud();

    @Query("""
                select ci
                from CategoryIngredientEntity ci
                where ci.restaurant.id = :restaurantId
                    and ci.status = vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum.ACTIVE
            """)
    List<CategoryIngredientEntity> findAllCrud(@Param("restaurantId") Integer restaurantId);
}
