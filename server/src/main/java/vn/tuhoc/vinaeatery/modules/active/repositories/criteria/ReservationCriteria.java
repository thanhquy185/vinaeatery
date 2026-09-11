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
public class ReservationCriteria {
    Integer page;
    Integer size;
    Optional<String> id;
    Optional<String> restaurantId;
    Optional<String> employeeId;
    Optional<String> customerId;
    Optional<String> createAtStart;
    Optional<String> createAtEnd;
    Optional<String> arriveAtStart;
    Optional<String> arriveAtEnd;
    Optional<String> customerFullname;
    Optional<String> customerPhone;
    Optional<String> customerEmail;
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
        if (ValidationUtil.optionalStringIsValid(createAtStart)) {
            cacheKey.append(String.format("createAtStart=%s", createAtStart.get()));
        }
        if (ValidationUtil.optionalStringIsValid(createAtEnd)) {
            cacheKey.append(String.format("createAtEnd=%s", createAtEnd.get()));
        }
        if (ValidationUtil.optionalStringIsValid(arriveAtStart)) {
            cacheKey.append(String.format("arriveAtStart=%s", arriveAtStart.get()));
        }
        if (ValidationUtil.optionalStringIsValid(arriveAtEnd)) {
            cacheKey.append(String.format("arriveAtEnd=%s", arriveAtEnd.get()));
        }
        if (ValidationUtil.optionalStringIsValid(customerFullname)) {
            cacheKey.append(String.format("customerFullname=%s", customerFullname.get()));
        }
        if (ValidationUtil.optionalStringIsValid(customerPhone)) {
            cacheKey.append(String.format("customerPhone=%s", customerPhone.get()));
        }
        if (ValidationUtil.optionalStringIsValid(customerEmail)) {
            cacheKey.append(String.format("customerEmail=%s", customerEmail.get()));
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
