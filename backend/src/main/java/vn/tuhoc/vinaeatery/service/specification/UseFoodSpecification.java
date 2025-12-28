package vn.tuhoc.vinaeatery.service.specification;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import vn.tuhoc.vinaeatery.domain.entity.Food;
import vn.tuhoc.vinaeatery.domain.entity.UseFood;
import vn.tuhoc.vinaeatery.domain.entity.UseFood_;

public class UseFoodSpecification {
    // Methods
    public static Specification<UseFood> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(UseFood_.ID), id);
    }
    
    public static Specification<UseFood> restaurantIdEqual(String restaurantId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(UseFood_.RESTAURANT_ID), restaurantId);
    }

    public static Specification<UseFood> timeAfter(String timeStart) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .greaterThanOrEqualTo(root.get(UseFood_.TIME_START),
                        LocalDateTime.parse(timeStart, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }

    public static Specification<UseFood> timeBefore(String timeEnd) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .lessThanOrEqualTo(root.get(UseFood_.TIME_END),
                        LocalDateTime.parse(timeEnd, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }

    public static Specification<UseFood> timeEndIsNull() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.isNull(root.get(UseFood_.TIME_END));
    }

    public static Specification<UseFood> foodIdEqual(String foodId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(UseFood_.FOOD_ID),
                foodId);
    }

    public static Specification<UseFood> foodNameLike(String foodName) {
        return (root, query, cb) -> {
            // Tạo subquery Food
            Subquery<Integer> subquery = query.subquery(Integer.class);
            Root<Food> foodRoot = subquery.from(Food.class);
            subquery.select(foodRoot.get("id"))
                    .where(cb.like(foodRoot.get("name"), "%" + foodName + "%"));

            // So sánh foodId của UseFood nằm trong danh sách foodId từ Food
            return root.get("foodId").in(subquery);
        };
    }

    public static Specification<UseFood> categoryFoodIdEqual(String categoryFoodId) {
        return (root, query, cb) -> {
            // ...
            Subquery<Integer> subquery = query.subquery(Integer.class);
            Root<Food> foodRoot = subquery.from(Food.class);

            // ép categoryFoodId sang Integer
            Predicate categoryFoodPredicate = cb.equal(
                    foodRoot.get("categoryFoodId"), Integer.valueOf(categoryFoodId));

            subquery.select(foodRoot.get("id")).where(categoryFoodPredicate);

            // WHERE foodId IN (SELECT id FROM Food WHERE categoryFoodId = ...)
            return root.get("foodId").in(subquery);
        };
    }

    public static Specification<UseFood> employeeIdEqual(String employeeId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(UseFood_.EMPLOYEE_ID),
                employeeId);
    }

    public static Specification<UseFood> statusEqual(Integer status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(UseFood_.STATUS), status);
    }
}