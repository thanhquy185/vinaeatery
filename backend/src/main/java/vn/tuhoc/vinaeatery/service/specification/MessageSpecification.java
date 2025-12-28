package vn.tuhoc.vinaeatery.service.specification;

import org.springframework.data.jpa.domain.Specification;

import vn.tuhoc.vinaeatery.domain.entity.Message;
import vn.tuhoc.vinaeatery.domain.entity.Message_;
import vn.tuhoc.vinaeatery.domain.entity.UseTable;

public class MessageSpecification {
    // Methods
    public static Specification<Message> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Message_.ID), id);
    }

    public static Specification<Message> restaurantIdEqual(String restaurantId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Message_.RESTAURANT_ID), restaurantId);
    }

    public static Specification<Message> useTableIdEqual(String useTableId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Message_.USE_TABLE_ID), useTableId);
    }

    public static Specification<Message> useTableTimeEndIsNull() {
        return (root, query, cb) -> {
            var subquery = query.subquery(Long.class);
            var useTable = subquery.from(UseTable.class);
            subquery.select(useTable.get("id"))
                    .where(cb.isNull(useTable.get("timeEnd")));

            return root.get("useTableId").in(subquery);
        };
    }

}
