package vn.tuhoc.vinaeatery.modules.food.repositories.criteria;

import java.util.Optional;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InputTicketCriteria {
    private Integer page;

    private Integer size;

    private Optional<String> id;

    private Optional<String> restaurantId;

    private Optional<String> employeeId;

    private Optional<String> supplierId;

    private Optional<String> createAtStart;

    private Optional<String> createAtEnd;

    private Optional<String> paymentStatus;

    private Optional<String> status;

    private Optional<String> sort;

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
        if (ValidationUtil.optionalStringIsValid(supplierId)) {
            cacheKey.append(String.format("supplierId=%s", supplierId.get()));
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
