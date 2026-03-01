package vn.tuhoc.vinaeatery.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.entity.PayMethod;
import vn.tuhoc.vinaeatery.service.PayMethodService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/pay-methods")
@RequiredArgsConstructor
public class PayMethodApiController {
    // Properties
    private final PayMethodService payMethodService;

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listPayMethod(@RequestBody FormSecurityDTO formSecurityDTO) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "pay-methods", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<PayMethod> listPayMethod = this.payMethodService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(listPayMethod);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailPayMethod(@RequestBody FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "pay-methods", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        PayMethod PayMethodSelected = this.payMethodService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(PayMethodSelected);
    }
}
