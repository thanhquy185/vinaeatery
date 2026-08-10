package vn.tuhoc.vinaeatery.modules.active.repositories.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MenuEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MenuEntity_;
import vn.tuhoc.vinaeatery.modules.active.domains.enums.MenuTypeEnum;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.MenuCriteria;
import vn.tuhoc.vinaeatery.modules.global.domains.enums.CommonStatusEnum;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

public class MenuSpecification {
        public static Specification<MenuEntity> filterMenus(MenuCriteria menuCriteria) {
                return (root, query, criteriaBuilder) -> {
                        if (ValidationUtil.isNull(menuCriteria.getId())
                                        && ValidationUtil.isNull(menuCriteria.getRestaurantId())
                                        && ValidationUtil.isNull(menuCriteria.getName())
                                        && ValidationUtil.isNull(menuCriteria.getType())
                                        && ValidationUtil.isNull(menuCriteria.getStatus())
                                        && ValidationUtil.isNull(menuCriteria.getSort())) {
                                return null;
                        }

                        List<Predicate> predicates = new ArrayList<>();
                        // Id
                        if (ValidationUtil.nonNull(menuCriteria.getId())) {
                                menuCriteria.getId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(id -> predicates.add(
                                                                criteriaBuilder.equal(root.get(MenuEntity_.ID),
                                                                                Long.valueOf(id))));
                        }
                        // Restaurant Id
                        if (ValidationUtil.nonNull(menuCriteria.getRestaurantId())) {
                                menuCriteria.getRestaurantId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(restaurantId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(MenuEntity_.RESTAURANT)
                                                                                                .get("id"),
                                                                                Long.valueOf(restaurantId))));
                        }
                        // Name
                        if (ValidationUtil.nonNull(menuCriteria.getName())) {
                                menuCriteria.getName()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(name -> predicates.add(
                                                                criteriaBuilder.like(
                                                                                criteriaBuilder.lower(root
                                                                                                .get(MenuEntity_.NAME)),
                                                                                "%" + name.toLowerCase() + "%")));
                        }
                        // Type
                        if (ValidationUtil.nonNull(menuCriteria.getType())) {
                                menuCriteria.getType()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(type -> {
                                                        MenuTypeEnum typeEnum = MenuTypeEnum.fromDescription(type);
                                                        predicates.add(
                                                                        criteriaBuilder.equal(
                                                                                        root.get(MenuEntity_.TYPE),
                                                                                        typeEnum.getValue()));
                                                });
                        }
                        // Status
                        if (ValidationUtil.nonNull(menuCriteria.getStatus())) {
                                menuCriteria.getStatus()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(status -> {
                                                        CommonStatusEnum statusEnum = CommonStatusEnum
                                                                        .fromDescription(status);
                                                        predicates.add(
                                                                        criteriaBuilder.equal(
                                                                                        root.get(MenuEntity_.STATUS),
                                                                                        statusEnum.getValue()));
                                                });
                        }

                        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
                };
        }
}
