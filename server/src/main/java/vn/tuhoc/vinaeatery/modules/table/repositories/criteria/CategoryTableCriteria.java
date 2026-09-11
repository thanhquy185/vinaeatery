package vn.tuhoc.vinaeatery.modules.table.repositories.criteria;

import java.util.Optional;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryTableCriteria {
    Integer page;
    Integer size;
    Optional<String> id;
    Optional<String> restaurantId;
    Optional<String> name;
    Optional<String> surchargeType;
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
        if (ValidationUtil.optionalStringIsValid(name)) {
            cacheKey.append(String.format("name=%s", name.get()));
        }
        if (ValidationUtil.optionalStringIsValid(surchargeType)) {
            cacheKey.append(String.format("surchargeType=%s", surchargeType.get()));
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
