package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.CategoryFood;

@Repository
public interface CategoryFoodRepository
        extends JpaRepository<CategoryFood, Integer>, JpaSpecificationExecutor<CategoryFood> {
    // Methods
    CategoryFood findOneById(Integer id);

    @Query(value = "SELECT * FROM vinaeatery.category_foods ORDER BY id DESC LIMIT 1", nativeQuery = true)
    CategoryFood findLastOne();

    void deleteById(Integer id);
}
