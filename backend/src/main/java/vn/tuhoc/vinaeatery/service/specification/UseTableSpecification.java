package vn.tuhoc.vinaeatery.service.specification;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import vn.tuhoc.vinaeatery.domain.TableE;
import vn.tuhoc.vinaeatery.domain.UseTable;
import vn.tuhoc.vinaeatery.domain.UseTable_;

public class UseTableSpecification {
    // Methods
    public static Specification<UseTable> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(UseTable_.ID), id);
    }

    public static Specification<UseTable> timeAfter(String timeStart) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .greaterThanOrEqualTo(root.get(UseTable_.TIME_START),
                        LocalDateTime.parse(timeStart, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }

    public static Specification<UseTable> timeBefore(String timeEnd) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .lessThanOrEqualTo(root.get(UseTable_.TIME_END),
                        LocalDateTime.parse(timeEnd, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }

    public static Specification<UseTable> timeEndIsNull() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.isNull(root.get(UseTable_.TIME_END));
    }

    public static Specification<UseTable> tableIdEqual(String tableId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(UseTable_.TABLE_ID),
                tableId);
    }

    public static Specification<UseTable> tableNameLike(String tableName) {
        return (root, query, cb) -> {
            // Tạo subquery Table
            Subquery<Integer> subquery = query.subquery(Integer.class);
            Root<TableE> tableRoot = subquery.from(TableE.class);
            subquery.select(tableRoot.get("id"))
                    .where(cb.like(tableRoot.get("name"), "%" + tableName + "%"));

            // So sánh tableId của UseTable nằm trong danh sách tableId từ Table
            return root.get("tableId").in(subquery);
        };
    }

    public static Specification<UseTable> floorIdEqual(String floorId) {
        return (root, query, cb) -> {
            // subquery trả về Integer vì tableId là Integer
            Subquery<Integer> subquery = query.subquery(Integer.class);
            Root<TableE> tableRoot = subquery.from(TableE.class);

            // ép floorId sang Integer
            Predicate floorPredicate = cb.equal(
                    tableRoot.get("floorId"), Integer.valueOf(floorId));

            subquery.select(tableRoot.get("id")).where(floorPredicate);

            // WHERE tableId IN (SELECT id FROM Table WHERE floorId = ...)
            return root.get("tableId").in(subquery);
        };
    }

    public static Specification<UseTable> employeeIdEqual(String employeeId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(UseTable_.EMPLOYEE_ID),
                employeeId);
    }

    public static Specification<UseTable> customerIdEqual(String customerId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(UseTable_.CUSTOMER_ID),
                customerId);
    }

    public static Specification<UseTable> orderIdEqual(String orderId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(UseTable_.ORDER_ID),
                orderId);
    }

    public static Specification<UseTable> orderTableIdEqual(String orderTableId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(UseTable_.ORDER_TABLE_ID),
                orderTableId);
    }

    public static Specification<UseTable> statusEqual(Integer status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(UseTable_.STATUS), status);
    }
}