package vn.tuhoc.vinaeatery.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.PermissionTicketCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.PermissionTicketDTO;
import vn.tuhoc.vinaeatery.domain.entity.PermissionTicket;
import vn.tuhoc.vinaeatery.domain.request.PermissionTicketCreateRequest;
import vn.tuhoc.vinaeatery.domain.request.PermissionTicketUpdateRequest;
// import vn.tuhoc.vinaeatery.service.EmployeeService;
import vn.tuhoc.vinaeatery.service.PermissionTicketService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/permission-tickets")
@RequiredArgsConstructor
public class PermissionTicketApiController {
        // Properties
        private final PermissionTicketService permissionTicketService;
        // private final EmployeeService employeeService;

        // Methods
        @PostMapping("/list")
        public ResponseEntity<?> listPermissionTicket(@RequestBody FormSecurityDTO formSecurityDTO,
                        PermissionTicketCriteria permissionTicketCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "permission-tickets", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<PermissionTicket> listPermissionTicket = this.permissionTicketService
                                .getAll(permissionTicketCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listPermissionTicket);
        }

        @PostMapping("/list-format")
        public ResponseEntity<?> listPermissionTicketFormat(@RequestBody FormSecurityDTO formSecurityDTO,
                        PermissionTicketCriteria permissionTicketCriteria) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "permission-tickets", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                List<PermissionTicketDTO> listPermissionTicket = this.permissionTicketService
                                .getAllFormat(permissionTicketCriteria);
                return ResponseEntity.status(HttpStatus.OK).body(listPermissionTicket);
        }

        @PostMapping("/detail/{id}")
        public ResponseEntity<?> detailPermissionTicket(@RequestBody FormSecurityDTO formSecurityDTO,
                        @PathVariable("id") Integer id) {
                if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "permission-tickets", "read")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                PermissionTicket PermissionTicketSelected = this.permissionTicketService.getOneById(id);
                return ResponseEntity.status(HttpStatus.OK).body(PermissionTicketSelected);
        }

        @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleCreatePermissionTicket(
                        @RequestBody @Valid PermissionTicketCreateRequest permissionTicketCreateRequest,
                        BindingResult bindingResult) {
                if (!HandleFormSecurity.isValidFormData(permissionTicketCreateRequest.getFormSecurity(),
                                "permission-tickets",
                                "create")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }
                if (permissionTicketCreateRequest.getPermissionTicket() == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(
                                                                        "Dữ liệu phiếu nhập không được để trống!"));
                }

                if (bindingResult.hasErrors()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
                }

                PermissionTicket permissionTicketCreated = this.permissionTicketService
                                .upsert(permissionTicketCreateRequest.getPermissionTicket());

                return ResponseEntity.status(HttpStatus.OK).body(permissionTicketCreated);
        }

        @PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<?> handleUpdatePermissionTicket(@PathVariable("id") Integer id,
                        @RequestBody @Valid PermissionTicketUpdateRequest permissionTicketUpdateRequest) {
                if (!HandleFormSecurity.isValidFormData(permissionTicketUpdateRequest.getFormSecurity(),
                                "permission-tickets",
                                "update")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(ValidationUtil
                                                        .buildRestResponseWithStr(HandleFormSecurity
                                                                        .getErrorMessageByHandleFormData()));
                }

                PermissionTicket permissionTicketUpdated = this.permissionTicketService.getOneById(id);
                if (permissionTicketUpdateRequest.getPermissionTicket().getEmployeeHandleId() != null) {
                        permissionTicketUpdated
                                        .setEmployeeHandleId(permissionTicketUpdateRequest.getPermissionTicket()
                                                        .getEmployeeHandleId());
                }
                if (permissionTicketUpdateRequest.getPermissionTicket().getStatus() != null) {
                        permissionTicketUpdated
                                        .setStatus(permissionTicketUpdateRequest.getPermissionTicket().getStatus());
                }
                this.permissionTicketService.upsert(permissionTicketUpdated);

                return ResponseEntity.status(HttpStatus.OK).body(permissionTicketUpdated);
        }
}
