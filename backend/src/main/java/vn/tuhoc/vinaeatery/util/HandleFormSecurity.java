package vn.tuhoc.vinaeatery.util;

import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;

public class HandleFormSecurity {
    // Properties
    private static String projectName = "vinaeatery";
    private static String projectDateCreate = "2025-06-01";
    private static String projectFrontend = "react.js";
    private static String projectBackend = "spring-boot";
    private static String developerFullname = "tranthanhquy";
    private static String developerPhone = "0923073724";
    private static String developerEmail = "thanhquyfu@gmail.com";

    // Methods
    public static String getErrorMessageByHandleFormData() {
        return "Không thể thực hiện các thao tác xử lý dữ liệu !";
    }

    public static boolean isValidFormData(FormSecurityDTO formSecurityDTO, String fieldName, String fieldAction) {
        if (formSecurityDTO == null || formSecurityDTO.getProject() == null || formSecurityDTO.getDeveloper() == null
                || formSecurityDTO.getField() == null || fieldName == null || fieldName.equals("")
                || fieldAction == null || fieldAction.equals("")
                || formSecurityDTO.getProject().getName() == null
                || !formSecurityDTO.getProject().getName().equals(projectName)
                || formSecurityDTO.getProject().getDateCreate() == null
                || !formSecurityDTO.getProject().getDateCreate().equals(projectDateCreate)
                || formSecurityDTO.getProject().getFrontend() == null
                || !formSecurityDTO.getProject().getFrontend().equals(projectFrontend)
                || formSecurityDTO.getProject().getBackend() == null
                || !formSecurityDTO.getProject().getBackend().equals(projectBackend)
                || formSecurityDTO.getDeveloper().getFullname() == null
                || !formSecurityDTO.getDeveloper().getFullname().equals(developerFullname)
                || formSecurityDTO.getDeveloper().getPhone() == null
                || !formSecurityDTO.getDeveloper().getPhone().equals(developerPhone)
                || formSecurityDTO.getDeveloper().getEmail() == null
                || !formSecurityDTO.getDeveloper().getEmail().equals(developerEmail)
                || formSecurityDTO.getField().getName() == null
                || !formSecurityDTO.getField().getName().equals(fieldName)
                || formSecurityDTO.getField().getAction() == null
                || !formSecurityDTO.getField().getAction().equals(fieldAction)) {
            return false;
        }

        return true;
    }
}
