package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.Ingredient;

@Repository
public interface IngredientRepository
        extends JpaRepository<Ingredient, Integer>, JpaSpecificationExecutor<Ingredient> {
    // Methods
    Ingredient findOneById(Integer id);

    List<Ingredient> findAllByCategoryIngredientId(Integer categoryIngredientId);

    void deleteById(Integer id);
}