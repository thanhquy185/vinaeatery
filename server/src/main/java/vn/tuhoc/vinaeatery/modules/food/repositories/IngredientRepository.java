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

import vn.tuhoc.vinaeatery.modules.food.domains.entities.IngredientEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.graphs.IngredientEntityGraph;

public interface IngredientRepository
        extends JpaRepository<IngredientEntity, Integer>, JpaSpecificationExecutor<IngredientEntity> {
    @Query("""
                select distinct i
                from IngredientEntity i
                where i.id = :id
            """)
    Optional<IngredientEntity> findOneByIdToCrud(@Param("id") Integer id);

    @EntityGraph(value = IngredientEntityGraph.FULL)
    @Query("""
                select distinct i
                from IngredientEntity i
                where i.id = :id
            """)
    Optional<IngredientEntity> findOneById(@Param("id") Integer id);

    @EntityGraph(value = IngredientEntityGraph.ONLY_CATEGORY_INGREDIENT)
    Page<IngredientEntity> findAll(Specification<IngredientEntity> specification, Pageable pageable);

    @EntityGraph(value = IngredientEntityGraph.ONLY_CATEGORY_INGREDIENT)
    @Query("""
                select i
                from IngredientEntity i
                where i.status = vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum.ACTIVE
            """)
    List<IngredientEntity> findAllCrud();

    @EntityGraph(value = IngredientEntityGraph.ONLY_CATEGORY_INGREDIENT)
    @Query("""
                select i
                from IngredientEntity i
                where i.restaurant.id = :restaurantId
                    and i.status = vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum.ACTIVE
            """)
    List<IngredientEntity> findAllCrud(@Param("restaurantId") Integer restaurantId);

    @Query("""
                select count(i) > 0
                from IngredientEntity i
                where i.categoryIngredient.id = :categoryIngredientId
                  and i.status = vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum.ACTIVE
            """)
    Boolean existsByCategoryIngredientIdAndStatusIsActive(
            @Param("categoryIngredientId") Integer categoryIngredientId);
}