package vn.tuhoc.vinaeatery.service.specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import vn.tuhoc.vinaeatery.domain.entity.OrderSheet;
import vn.tuhoc.vinaeatery.domain.entity.OrderSheet_;
import vn.tuhoc.vinaeatery.domain.entity.TableE;

public class OrderSheetSpecification {
    // Methods
    public static Specification<OrderSheet> idEqual(String id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(OrderSheet_.ID), id);
    }

    public static Specification<OrderSheet> restaurantIdEqual(String restaurantId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(OrderSheet_.RESTAURANT_ID), restaurantId);
    }

    public static Specification<OrderSheet> createAtAfter(String createAtStart) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .greaterThanOrEqualTo(root.get(OrderSheet_.CREATE_AT),
                        LocalDateTime.parse(createAtStart, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }

    public static Specification<OrderSheet> createAtBefore(String createAtEnd) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .lessThanOrEqualTo(root.get(OrderSheet_.CREATE_AT),
                        LocalDateTime.parse(createAtEnd, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }

    public static Specification<OrderSheet> serviceAtAfter(String serviceAtStart) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .greaterThanOrEqualTo(root.get(OrderSheet_.SERVICE_AT),
                        LocalDateTime.parse(serviceAtStart, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }

    public static Specification<OrderSheet> serviceAtBefore(String serviceAtEnd) {
        return (root, query, criteriaBuilder) -> criteriaBuilder
                .lessThanOrEqualTo(root.get(OrderSheet_.SERVICE_AT),
                        LocalDateTime.parse(serviceAtEnd, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }

    public static Specification<OrderSheet> currentDate() {
        return (root, query, criteriaBuilder) -> {
            LocalDateTime startOfDay = LocalDate.now(ZoneId.of("Asia/Ho_Chi_Minh")).atStartOfDay(); // 00:00:00
            LocalDateTime endOfDay = startOfDay.plusDays(1); // ngày mai 00:00:00 (exclusive)

            return criteriaBuilder.between(
                    root.get(OrderSheet_.CREATE_AT),
                    startOfDay,
                    endOfDay);
        };
    }

    public static Specification<OrderSheet> employeeIdEqual(String employeeId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(OrderSheet_.EMPLOYEE_ID),
                employeeId);
    }

    public static Specification<OrderSheet> tableIdEqual(String tableId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(OrderSheet_.TABLE_ID),
                tableId);
    }

    public static Specification<OrderSheet> tableNameLike(String tableName) {
        return (root, query, cb) -> {
            // Tạo subquery Table
            Subquery<Integer> subquery = query.subquery(Integer.class);
            Root<TableE> tableRoot = subquery.from(TableE.class);
            subquery.select(tableRoot.get("id"))
                    .where(cb.like(tableRoot.get("name"), "%" + tableName + "%"));

            // So sánh tableId của OrderSheet nằm trong danh sách tableId từ Table
            return root.get("tableId").in(subquery);
        };
    }

    public static Specification<OrderSheet> floorIdEqual(String floorId) {
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

    public static Specification<OrderSheet> statusEqual(Integer status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(OrderSheet_.STATUS), status);
    }
}