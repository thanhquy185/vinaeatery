package vn.tuhoc.vinaeatery.modules.food.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import vn.tuhoc.vinaeatery.modules.food.domains.entities.RecipeEntity;
import vn.tuhoc.vinaeatery.modules.food.domains.entities.RecipeIdEntity;

public interface RecipeRepository
                extends JpaRepository<RecipeEntity, RecipeIdEntity>, JpaSpecificationExecutor<RecipeEntity> {
        @Query("""
                            select distinct r
                            from RecipeEntity r
                            left join fetch r.ingredient i
                            left join fetch i.categoryIngredient
                            where r.food.id in (:foodIds)
                        """)
        List<RecipeEntity> findAllByFoodIds(@Param("foodIds") List<Integer> foodIds);
}