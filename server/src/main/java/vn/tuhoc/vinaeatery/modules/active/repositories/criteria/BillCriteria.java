package vn.tuhoc.vinaeatery.modules.active.repositories.criteria;

import java.util.Optional;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BillCriteria {
    Integer page;
    Integer size;
    Optional<String> id;
    Optional<String> restaurantId;
    Optional<String> employeeId;
    Optional<String> customerId;
    Optional<String> paymentMethodId;
    Optional<String> createAtStart;
    Optional<String> createAtEnd;
    Optional<String> paymentStatus;
    Optional<String> status;
    Optional<String> sort;

    public String getCacheKey() {
        StringBuilder cacheKey = new StringBuilder();
        if (ValidationUtil.nonNull(page)) {
            cacheKey.append(String.format("page=%s", page));
        }
        if (ValidationUtil.nonNull(size)) {
            cacheKey.append(String.format("size=%s", size));
        }
        if (ValidationUtil.optionalStringIsValid(id)) {
            cacheKey.append(String.format("id=%s", id.get()));
        }
        if (ValidationUtil.optionalStringIsValid(restaurantId)) {
            cacheKey.append(String.format("restaurantId=%s", restaurantId.get()));
        }
        if (ValidationUtil.optionalStringIsValid(employeeId)) {
            cacheKey.append(String.format("employeeId=%s", employeeId.get()));
        }
        if (ValidationUtil.optionalStringIsValid(customerId)) {
            cacheKey.append(String.format("customerId=%s", customerId.get()));
        }
        if (ValidationUtil.optionalStringIsValid(paymentMethodId)) {
            cacheKey.append(String.format("paymentMethodId=%s", paymentMethodId.get()));
        }
        if (ValidationUtil.optionalStringIsValid(createAtStart)) {
            cacheKey.append(String.format("createAtStart=%s", createAtStart.get()));
        }
        if (ValidationUtil.optionalStringIsValid(createAtEnd)) {
            cacheKey.append(String.format("createAtEnd=%s", createAtEnd.get()));
        }
        if (ValidationUtil.optionalStringIsValid(paymentStatus)) {
            cacheKey.append(String.format("paymentStatus=%s", paymentStatus.get()));
        }
        if (ValidationUtil.optionalStringIsValid(status)) {
            cacheKey.append(String.format("status=%s", status.get()));
        }
        if (ValidationUtil.optionalStringIsValid(sort)) {
            cacheKey.append(String.format("sort=%s", sort.get()));
        }

        return cacheKey.toString();
    }
}
