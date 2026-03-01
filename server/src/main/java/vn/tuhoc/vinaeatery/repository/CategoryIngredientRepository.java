package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.CategoryIngredient;

@Repository
public interface CategoryIngredientRepository
        extends JpaRepository<CategoryIngredient, Integer>, JpaSpecificationExecutor<CategoryIngredient> {
    // Methods
    CategoryIngredient findOneById(Integer id);

    void deleteById(Integer id);
}
