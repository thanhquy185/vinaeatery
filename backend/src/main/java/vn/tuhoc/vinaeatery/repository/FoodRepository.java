package vn.tuhoc.vinaeatery.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.Food;

@Repository
public interface FoodRepository
        extends JpaRepository<Food, Integer>, JpaSpecificationExecutor<Food> {
    // Methods
    Food findOneById(Integer id);

    @Query(value = "SELECT * FROM vinaeatery.foods ORDER BY id DESC LIMIT 1", nativeQuery = true)
    Food findLastOne();

    List<Food> findAllByRestaurantId(Integer restaurantId);

    List<Food> findAllByCategoryFoodId(Integer categoryFoodId);

    void deleteById(Integer id);
}