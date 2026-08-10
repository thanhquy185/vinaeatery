package vn.tuhoc.vinaeatery.modules.active.repositories.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Fetch;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MessageEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.MessageEntity_;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseTableEntity;
import vn.tuhoc.vinaeatery.modules.active.domains.entities.UseTableEntity_;
import vn.tuhoc.vinaeatery.modules.active.repositories.criteria.MessageCriteria;
import vn.tuhoc.vinaeatery.modules.table.domains.entities.TableEntity;
import vn.tuhoc.vinaeatery.modules.table.domains.entities.TableEntity_;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

public class MessageSpecification {
        public static Specification<MessageEntity> filterMessages(MessageCriteria messageCriteria) {

                return (root, query, criteriaBuilder) -> {
                        if (!Long.class.equals(query.getResultType())
                                        && !long.class.equals(query.getResultType())) {

                                Fetch<MessageEntity, UseTableEntity> useTable = root
                                                .fetch(MessageEntity_.USE_TABLE, JoinType.INNER);

                                Fetch<UseTableEntity, TableEntity> table = useTable.fetch(UseTableEntity_.TABLE,
                                                JoinType.INNER);

                                table.fetch(TableEntity_.FLOOR, JoinType.LEFT);
                                table.fetch(TableEntity_.CATEGORY_TABLE, JoinType.LEFT);

                                query.distinct(true);
                        }

                        if (ValidationUtil.isNull(messageCriteria.getId())
                                        && ValidationUtil.isNull(messageCriteria.getRestaurantId())
                                        && ValidationUtil.isNull(messageCriteria.getUseTableId())
                                        && ValidationUtil.isNull(messageCriteria.getCreateAtStart())
                                        && ValidationUtil.isNull(messageCriteria.getCreateAtEnd())
                                        && ValidationUtil.isNull(messageCriteria.getSort())) {
                                return null;
                        }

                        List<Predicate> predicates = new ArrayList<>();
                        // Id
                        if (ValidationUtil.nonNull(messageCriteria.getId())) {
                                messageCriteria.getId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(id -> predicates.add(
                                                                criteriaBuilder.equal(root.get(MessageEntity_.ID),
                                                                                Long.valueOf(id))));
                        }
                        // Restaurant Id
                        if (ValidationUtil.nonNull(messageCriteria.getRestaurantId())) {
                                messageCriteria.getRestaurantId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(restaurantId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(MessageEntity_.RESTAURANT)
                                                                                                .get("id"),
                                                                                Long.valueOf(restaurantId))));
                        }
                        // Use Table Id
                        if (ValidationUtil.nonNull(messageCriteria.getUseTableId())) {
                                messageCriteria.getUseTableId()
                                                .filter(ValidationUtil::isNumeric)
                                                .ifPresent(useTableId -> predicates.add(
                                                                criteriaBuilder.equal(
                                                                                root.get(MessageEntity_.USE_TABLE)
                                                                                                .get("id"),
                                                                                Long.valueOf(useTableId))));
                        }
                        // Create At Start
                        if (ValidationUtil.nonNull(messageCriteria.getCreateAtStart())) {
                                messageCriteria.getCreateAtStart()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(createAtStart -> predicates.add(
                                                                criteriaBuilder.greaterThanOrEqualTo(
                                                                                root.get(MessageEntity_.CREATE_AT),
                                                                                createAtStart)));
                        }
                        // Create At End
                        if (ValidationUtil.nonNull(messageCriteria.getCreateAtEnd())) {
                                messageCriteria.getCreateAtEnd()
                                                .filter(ValidationUtil::hasText)
                                                .ifPresent(createAtEnd -> predicates.add(
                                                                criteriaBuilder.lessThanOrEqualTo(
                                                                                root.get(MessageEntity_.CREATE_AT),
                                                                                createAtEnd)));
                        }

                        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
                };
        }
}
