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
import vn.tuhoc.vinaeatery.domain.Function;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.service.FunctionService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/functions")
@RequiredArgsConstructor
public class FunctionApiController {
    // Properties
    private final FunctionService functionService;

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listFunction(@RequestBody FormSecurityDTO formSecurityDTO) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "functions", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<Function> listFunction = this.functionService.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(listFunction);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailFunction(@RequestBody FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "functions", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        Function functionSelected = this.functionService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(functionSelected);
    }
}