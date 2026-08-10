package vn.tuhoc.vinaeatery.modules.table.repositories.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;

import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.modules.table.domains.entities.FloorEntity;
import vn.tuhoc.vinaeatery.modules.table.domains.entities.FloorEntity_;
import vn.tuhoc.vinaeatery.modules.table.repositories.criteria.FloorCriteria;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

public class FloorSpecification {
    public static Specification<FloorEntity> filterFloors(FloorCriteria floorCriteria) {
        if (ValidationUtil.isNull(floorCriteria.getId())
                && ValidationUtil.isNull(floorCriteria.getRestaurantId())
                && ValidationUtil.isNull(floorCriteria.getName())
                && ValidationUtil.isNull(floorCriteria.getStatus())
                && ValidationUtil.isNull(floorCriteria.getSort())) {
            return null;
        }

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Id
            if (ValidationUtil.nonNull(floorCriteria.getId())) {
                floorCriteria.getId()
                        .filter(ValidationUtil::isNumeric)
                        .ifPresent(id -> predicates.add(
                                criteriaBuilder.equal(root.get(FloorEntity_.ID), Long.valueOf(id))));
            }
            // Restaurant Id
            if (ValidationUtil.nonNull(floorCriteria.getRestaurantId())) {
                floorCriteria.getRestaurantId()
                        .filter(ValidationUtil::isNumeric)
                        .ifPresent(restaurantId -> predicates.add(
                                criteriaBuilder.equal(
                                        root.get(FloorEntity_.RESTAURANT).get("id"),
                                        Long.valueOf(restaurantId))));
            }
            // Name
            if (ValidationUtil.nonNull(floorCriteria.getName())) {
                floorCriteria.getName()
                        .filter(ValidationUtil::hasText)
                        .ifPresent(name -> predicates.add(
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(root.get(FloorEntity_.NAME)),
                                        "%" + name.toLowerCase() + "%")));
            }
            // Status
            if (ValidationUtil.nonNull(floorCriteria.getStatus())) {
                floorCriteria.getStatus()
                        .filter(ValidationUtil::hasText)
                        .ifPresent(status -> {
                            CommonStatusEnum statusEnum = CommonStatusEnum.fromDescription(status);
                            predicates.add(
                                    criteriaBuilder.equal(root.get(FloorEntity_.STATUS),
                                            statusEnum.getValue()));
                        });
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
