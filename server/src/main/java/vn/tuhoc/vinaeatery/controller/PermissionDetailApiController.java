// package vn.tuhoc.vinaeatery.controller;

// import java.util.List;

// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import lombok.RequiredArgsConstructor;
// import vn.tuhoc.vinaeatery.domain.criteria.PermissionDetailCriteria;
// import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
// import vn.tuhoc.vinaeatery.domain.dto.PermissionDetailDTO;
// import vn.tuhoc.vinaeatery.domain.entity.PermissionDetail;
// import vn.tuhoc.vinaeatery.service.PermissionDetailService;
// import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
// import vn.tuhoc.vinaeatery.util.ValidationUtil;

// @RestController
// @RequestMapping("/api/permission-details")
// @RequiredArgsConstructor
// public class PermissionDetailApiController {
//     // Properties
//     private final PermissionDetailService permissionDetailService;

//     // Methods
//     @PostMapping("/list")
//     public ResponseEntity<?> listPermissionDetail(@RequestBody FormSecurityDTO formSecurityDTO,
//             PermissionDetailCriteria permissionDetailCriteria) {
//         if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "permission-details", "read")) {
//             return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                     .body(ValidationUtil
//                             .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
//         }

//         List<PermissionDetail> listPermissionDetail = this.permissionDetailService.getAll(permissionDetailCriteria);
//         return ResponseEntity.status(HttpStatus.OK).body(listPermissionDetail);
//     }

//     @PostMapping("/list-format")
//     public ResponseEntity<?> listPermissionDetailFormat(@RequestBody FormSecurityDTO formSecurityDTO,
//             PermissionDetailCriteria permissionDetailCriteria) {
//         if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "permission-details", "read")) {
//             return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                     .body(ValidationUtil
//                             .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
//         }

//         List<PermissionDetailDTO> listPermissionDetail = this.permissionDetailService
//                 .getAllFormat(permissionDetailCriteria);
//         return ResponseEntity.status(HttpStatus.OK).body(listPermissionDetail);
//     }
// }