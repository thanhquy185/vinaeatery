package vn.tuhoc.vinaeatery.util;

import vn.tuhoc.vinaeatery.domain.dto.FormGetDataDTO;

public class HandleFormGetData {
    // Properties
    private static String projectName = "vinaeatery";
    private static String projectDateCreate = "2025-06-01";
    private static String projectFrontend = "react.js";
    private static String projectBackend = "spring-boot";
    private static String developerFullname = "tranthanhquy";
    private static String developerPhone = "0923073724";
    private static String developerEmail = "thanhquyfu@gmail.com";

    // Methods
    public static String getErrorMessageByGetData() {
        return "Không thể truy vấn dữ liệu !";
    }

    public static boolean isValidFormGetData(FormGetDataDTO formGetDataDTO) {
        if (formGetDataDTO == null || formGetDataDTO.getProject() == null || formGetDataDTO.getDeveloper() == null
                || formGetDataDTO.getProject().getName() == null
                || !formGetDataDTO.getProject().getName().equals(projectName)
                || formGetDataDTO.getProject().getDateCreate() == null
                || !formGetDataDTO.getProject().getDateCreate().equals(projectDateCreate)
                || formGetDataDTO.getProject().getFrontend() == null
                || !formGetDataDTO.getProject().getFrontend().equals(projectFrontend)
                || formGetDataDTO.getProject().getBackend() == null
                || !formGetDataDTO.getProject().getBackend().equals(projectBackend)
                || formGetDataDTO.getDeveloper().getFullname() == null
                || !formGetDataDTO.getDeveloper().getFullname().equals(developerFullname)
                || formGetDataDTO.getDeveloper().getPhone() == null
                || !formGetDataDTO.getDeveloper().getPhone().equals(developerPhone)
                || formGetDataDTO.getDeveloper().getEmail() == null
                || !formGetDataDTO.getDeveloper().getEmail().equals(developerEmail)) {
            return false;
        }

        return true;
    }
}
