package vn.tuhoc.vinaeatery.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.UseFoodCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.UseFoodDTO;
import vn.tuhoc.vinaeatery.domain.dto.UseFoodUpdateDTO;
import vn.tuhoc.vinaeatery.domain.entity.UseFood;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.service.UseFoodService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/use-foods")
@RequiredArgsConstructor
public class UseFoodApiController {
    // Properties
    private final UseFoodService useFoodService;
    private final TimeService timeService;

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listUseFood(@RequestBody FormSecurityDTO formSecurityDTO,
            UseFoodCriteria useFoodCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "use-foods", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<UseFood> listUseFood = this.useFoodService.getAll(useFoodCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listUseFood);
    }

    @PostMapping("/list-format")
    public ResponseEntity<?> listUseFoodFormat(@RequestBody FormSecurityDTO formSecurityDTO,
            UseFoodCriteria useFoodCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "use-foods", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<UseFoodDTO> listUseFoodFormat = this.useFoodService.getAllFormat(useFoodCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listUseFoodFormat);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailUseFood(@RequestBody FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Long id) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "use-foods", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        UseFood useFoodSelected = this.useFoodService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(useFoodSelected);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> handleUpdateUseFood(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Long id,
            @RequestPart("use-food") @Valid UseFoodUpdateDTO useFood,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "use-foods", "update")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        UseFood useFoodUpdated = this.useFoodService.getOneById(id);
        if (useFoodUpdated != null) {
            useFoodUpdated.setTimeEnd(this.timeService.getDateTimeVN(useFood.getTimeEnd()));
            useFoodUpdated.setEmployeeId(useFood.getEmployeeId());

            UseFood newUseFood = new UseFood();
            newUseFood.setRestaurantId(useFoodUpdated.getRestaurantId());
            newUseFood.setTimeStart(LocalDateTime.now());
            newUseFood.setTimeEnd(null);
            newUseFood.setFoodId(useFoodUpdated.getFoodId());
            newUseFood.setStatus(useFood.getStatus());

            this.useFoodService.upsert(useFoodUpdated);
            this.useFoodService.upsert(newUseFood);
        }

        return ResponseEntity.status(HttpStatus.OK).body(useFoodUpdated);
    }
}
