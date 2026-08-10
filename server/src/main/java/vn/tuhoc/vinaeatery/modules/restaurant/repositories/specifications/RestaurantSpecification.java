package vn.tuhoc.vinaeatery.modules.restaurant.repositories.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantEntity;
import vn.tuhoc.vinaeatery.modules.restaurant.domains.entities.RestaurantEntity_;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.criteria.RestaurantCriteria;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

public class RestaurantSpecification {
    public static Specification<RestaurantEntity> filterRestaurants(RestaurantCriteria RestaurantCriteria) {
        if (ValidationUtil.isNull(RestaurantCriteria.getId())
                && ValidationUtil.isNull(RestaurantCriteria.getName())
                && ValidationUtil.isNull(RestaurantCriteria.getPhone())
                && ValidationUtil.isNull(RestaurantCriteria.getEmail())
                && ValidationUtil.isNull(RestaurantCriteria.getStatus())
                && ValidationUtil.isNull(RestaurantCriteria.getSort())) {
            return null;
        }

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Id
            if (ValidationUtil.nonNull(RestaurantCriteria.getId())) {
                RestaurantCriteria.getId()
                        .filter(ValidationUtil::isNumeric)
                        .ifPresent(id -> predicates.add(
                                criteriaBuilder.equal(root.get(RestaurantEntity_.ID),
                                        Long.valueOf(id))));
            }
            // Name
            if (ValidationUtil.nonNull(RestaurantCriteria.getName())) {
                RestaurantCriteria.getName()
                        .filter(ValidationUtil::hasText)
                        .ifPresent(name -> predicates.add(
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(root.get(
                                                RestaurantEntity_.NAME)),
                                        "%" + name.toLowerCase() + "%")));
            }
            // Phone
            if (ValidationUtil.nonNull(RestaurantCriteria.getPhone())) {
                RestaurantCriteria.getPhone()
                        .filter(ValidationUtil::isNumeric)
                        .ifPresent(phone -> predicates.add(
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(root.get(
                                                RestaurantEntity_.PHONE)),
                                        phone + "%")));
            }
            // Email
            if (ValidationUtil.nonNull(RestaurantCriteria.getEmail())) {
                RestaurantCriteria.getEmail()
                        .filter(ValidationUtil::hasText)
                        .ifPresent(email -> predicates.add(
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(root.get(
                                                RestaurantEntity_.EMAIL)),
                                        email.toLowerCase() + "%")));
            }
            // Status
            if (ValidationUtil.nonNull(RestaurantCriteria.getStatus())) {
                RestaurantCriteria.getStatus()
                        .filter(ValidationUtil::hasText)
                        .ifPresent(status -> {
                            CommonStatusEnum statusEnum = CommonStatusEnum.fromDescription(status);
                            predicates.add(criteriaBuilder.equal(
                                    root.get(RestaurantEntity_.STATUS),
                                    statusEnum.getValue()));
                        });
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}