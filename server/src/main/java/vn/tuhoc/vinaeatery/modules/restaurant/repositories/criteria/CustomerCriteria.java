package vn.tuhoc.vinaeatery.modules.restaurant.repositories.criteria;

import java.util.Optional;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tuhoc.vinaeatery.utils.ValidationUtil;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CustomerCriteria {
    private Integer page;

    private Integer size;

    private Optional<String> id;

    private Optional<String> fullname;

    private Optional<String> username;

    private Optional<String> phone;

    private Optional<String> email;

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
        if (ValidationUtil.optionalStringIsValid(fullname)) {
            cacheKey.append(String.format("fullname=%s", fullname.get()));
        }
        if (ValidationUtil.optionalStringIsValid(username)) {
            cacheKey.append(String.format("username=%s", username.get()));
        }
        if (ValidationUtil.optionalStringIsValid(phone)) {
            cacheKey.append(String.format("phone=%s", phone.get()));
        }
        if (ValidationUtil.optionalStringIsValid(email)) {
            cacheKey.append(String.format("email=%s", email.get()));
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
