package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.TableE;
import vn.tuhoc.vinaeatery.domain.entity.TableE_;

public class TableSpecification {
    // Methods
    public static Specification<TableE> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(TableE_.ID), id);
    }

    public static Specification<TableE> restaurantIdEqual(String restaurantId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(TableE_.RESTAURANT_ID), restaurantId);
    }

    public static Specification<TableE> nameLike(String name) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(root.get(TableE_.NAME), "%" + name + "%");
    }

    public static Specification<TableE> categoryTableIdEqual(String categoryTableId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(TableE_.CATEGORY_TABLE_ID),
                categoryTableId);
    }

    public static Specification<TableE> floorIdEqual(String floorId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(TableE_.FLOOR_ID), floorId);
    }

    public static Specification<TableE> statusEqual(Boolean status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(TableE_.STATUS), status);
    }
}
