package vn.tuhoc.vinaeatery.modules.food.repositories.criteria;

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
public class IngredientCriteria {
    Integer page;
    Integer size;
    Optional<String> id;
    Optional<String> restaurantId;
    Optional<String> categoryIngredientId;
    Optional<String> name;
    Optional<String> unit;
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
        if (ValidationUtil.optionalStringIsValid(categoryIngredientId)) {
            cacheKey.append(String.format("categoryIngredientId=%s", categoryIngredientId.get()));
        }
        if (ValidationUtil.optionalStringIsValid(name)) {
            cacheKey.append(String.format("name=%s", name.get()));
        }
        if (ValidationUtil.optionalStringIsValid(unit)) {
            cacheKey.append(String.format("unit=%s", unit.get()));
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
