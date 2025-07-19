package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vn.tuhoc.vinaeatery.domain.Recipe;
import vn.tuhoc.vinaeatery.domain.RecipeId;

@Repository
public interface RecipeRepository
        extends JpaRepository<Recipe, RecipeId>, JpaSpecificationExecutor<Recipe> {
    // Methods
    Recipe findOneById(RecipeId id);

    @Query(value = "SELECT * FROM vinaeatery.recipes WHERE food_id = :foodId", nativeQuery = true)
    List<Recipe> findAllByFoodId(@Param("foodId") Integer foodId);

    void deleteById(RecipeId id);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM vinaeatery.recipes WHERE food_id = :foodId", nativeQuery = true)
    void deleteAllByFoodId(@Param("foodId") Integer foodId);
}