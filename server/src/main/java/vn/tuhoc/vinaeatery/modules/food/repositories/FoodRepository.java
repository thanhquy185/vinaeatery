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

import vn.tuhoc.vinaeatery.modules.food.domains.entities.FoodEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.graphs.FoodEntityGraph;

public interface FoodRepository
                extends JpaRepository<FoodEntity, Integer>, JpaSpecificationExecutor<FoodEntity> {
        @Query("""
                            select distinct f
                            from FoodEntity f
                            where f.id = :id
                        """)
        Optional<FoodEntity> findOneByIdToCrud(@Param("id") Integer id);

        @EntityGraph(value = FoodEntityGraph.HALF)
        @Query("""
                            select distinct f
                            from FoodEntity f
                            left join fetch f.recipes r
                            left join fetch r.ingredient i
                            left join fetch i.categoryIngredient ci
                            where f.id = :id
                        """)
        Optional<FoodEntity> findOneById(@Param("id") Integer id);

        @EntityGraph(value = FoodEntityGraph.ONLY_CATEGORY_FOOD)
        Page<FoodEntity> findAll(Specification<FoodEntity> specification, Pageable pageable);

        @EntityGraph(value = FoodEntityGraph.ONLY_CATEGORY_FOOD)
        @Query("""
                            select f
                            from FoodEntity f
                            where f.status = vn.tuhoc.vinaeatery.modules.food.domains.enums.FoodStatusEnum.SELLING
                        """)
        List<FoodEntity> findAllCrud();

        @EntityGraph(value = FoodEntityGraph.ONLY_CATEGORY_FOOD)
        @Query("""
                            select f
                            from FoodEntity f
                            where f.restaurant.id = :restaurantId
                                and f.status = vn.tuhoc.vinaeatery.modules.food.domains.enums.FoodStatusEnum.SELLING
                        """)
        List<FoodEntity> findAllCrud(@Param("restaurantId") Integer restaurantId);

        @Query("""
                            select count(f) > 0
                            from FoodEntity f
                            where f.categoryFood.id = :categoryFoodId
                              and f.status = vn.tuhoc.vinaeatery.modules.food.domains.enums.FoodStatusEnum.SELLING
                        """)
        Boolean existsByCategoryFoodIdAndStatusIsActive(@Param("categoryFoodId") Integer categoryFoodId);
}