package vn.tuhoc.vinaeatery.domain.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class FormGetDataDTO {
    // Properties
    private Project project;
    private Developer developer;

    // Classes
    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    public static class Project {
        // Class-Properties
        private String name;
        private String dateCreate;
        private String frontend;
        private String backend;
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    public static class Developer {
        // Class-Properties
        private String fullname;
        private String phone;
        private String email;
    }
}
