package vn.tuhoc.vinaeatery.controller;

import java.time.LocalDateTime;
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
import vn.tuhoc.vinaeatery.domain.criteria.InputTicketCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.InputTicketDTO;
import vn.tuhoc.vinaeatery.domain.entity.Ingredient;
import vn.tuhoc.vinaeatery.domain.entity.InputTicket;
import vn.tuhoc.vinaeatery.domain.entity.InputTicketDetail;
import vn.tuhoc.vinaeatery.domain.entity.InputTicketDetailForCrud;
import vn.tuhoc.vinaeatery.domain.entity.InputTicketDetailId;
import vn.tuhoc.vinaeatery.domain.enumm.InputTicketStatusEnum;
import vn.tuhoc.vinaeatery.domain.request.InputTicketCreateRequest;
import vn.tuhoc.vinaeatery.domain.request.InputTicketUpdateRequest;
import vn.tuhoc.vinaeatery.service.IngredientService;
import vn.tuhoc.vinaeatery.service.InputTicketDetailService;
import vn.tuhoc.vinaeatery.service.InputTicketService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/input-tickets")
@RequiredArgsConstructor
public class InputTicketApiController {
    // Properties
    private final InputTicketService inputTicketService;
    private final InputTicketDetailService inputTicketDetailService;
    private final IngredientService ingredientService;
    // private final EmployeeService employeeService;

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listInputTicket(@RequestBody FormSecurityDTO formSecurityDTO,
            InputTicketCriteria inputTicketCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "input-tickets", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<InputTicket> listInputTicket = this.inputTicketService.getAll(inputTicketCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listInputTicket);
    }

    @PostMapping("/list-format")
    public ResponseEntity<?> listInputTicketFormat(@RequestBody FormSecurityDTO formSecurityDTO,
            InputTicketCriteria inputTicketCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "input-tickets", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<InputTicketDTO> listInputTicket = this.inputTicketService.getAllFormat(inputTicketCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listInputTicket);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailInputTicket(@RequestBody FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "input-tickets", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        InputTicket inputTicketSelected = this.inputTicketService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(inputTicketSelected);
    }

    @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> handleCreateInputTicket(
            @RequestBody @Valid InputTicketCreateRequest inputTicketCreateRequest,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(inputTicketCreateRequest.getFormSecurity(), "input-tickets",
                "create")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }
        if (inputTicketCreateRequest.getInputTicket() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr("Dữ liệu phiếu nhập không được để trống!"));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        // Cập nhật theo giờ Việt Nam
        inputTicketCreateRequest.getInputTicket().setCreateAt(LocalDateTime.now());

        InputTicket inputTicketCreated = this.inputTicketService.upsert(inputTicketCreateRequest.getInputTicket());
        if (inputTicketCreated != null && inputTicketCreateRequest.getInputTicketDetails() != null
                && !inputTicketCreateRequest.getInputTicketDetails().isEmpty()) {
            for (InputTicketDetailForCrud inputTicketDetailForCrud : inputTicketCreateRequest.getInputTicketDetails()) {
                InputTicketDetail newInputTicketDetail = new InputTicketDetail(
                        new InputTicketDetailId(inputTicketCreated.getId(),
                                inputTicketDetailForCrud.getIngredientId()),
                        inputTicketDetailForCrud.getPrice(), inputTicketDetailForCrud.getQuantity());
                this.inputTicketDetailService.upsert(newInputTicketDetail);
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(inputTicketCreated);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> handleUpdateInputTicket(@PathVariable("id") Integer id,
            @RequestBody @Valid InputTicketUpdateRequest inputTicketUpdateRequest) {
        if (!HandleFormSecurity.isValidFormData(inputTicketUpdateRequest.getFormSecurity(), "input-tickets",
                "update")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        InputTicket inputTicketUpdated = this.inputTicketService.getOneById(id);
        if (inputTicketUpdateRequest.getInputTicket().getPayStatus() != null) {
            inputTicketUpdated.setPayStatus(inputTicketUpdateRequest.getInputTicket().getPayStatus());
        }
        if (inputTicketUpdateRequest.getInputTicket().getStatus() != null) {
            List<InputTicketDetail> inputTicketDetails = inputTicketDetailService.getAllByInputTicketId(id);
            if (!inputTicketDetails.isEmpty() && !inputTicketDetails.isEmpty()) {
                if (inputTicketUpdateRequest.getInputTicket().getStatus() == InputTicketStatusEnum.GIVEBACK) {
                    // - So số lượng trong kho với số lượng trả
                    for (InputTicketDetail inputTicketDetail : inputTicketDetails) {
                        Ingredient ingredient = ingredientService
                                .getOneById(inputTicketDetail.getId().getIngredientId());
                        if (ingredient != null && ingredient.getInventory() < inputTicketDetail.getQuantity()) {
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                    .body(ValidationUtil
                                            .buildRestResponseWithStr("Có thực phẩm không đủ số lượng trả!"));
                        }
                    }
                    // - Giảm số lượng trong kho vì nếu đủ số lượng trả
                    for (InputTicketDetail inputTicketDetail : inputTicketDetails) {
                        Ingredient ingredientUpdateInventory = this.ingredientService
                                .getOneById(inputTicketDetail.getId().getIngredientId());
                        if (ingredientUpdateInventory != null) {
                            Long newInventory = ingredientUpdateInventory.getInventory()
                                    - inputTicketDetail.getQuantity();
                            ingredientUpdateInventory.setInventory(newInventory);
                            // if (newInventory == 0) {
                            // ingredientUpdateInventory.setStatus(IngredientStatusEnum.INACTIVE);
                            // }

                            this.ingredientService.upsert(ingredientUpdateInventory);
                        }
                    }
                } else if (inputTicketUpdateRequest.getInputTicket().getStatus() == InputTicketStatusEnum.CONFIRM) {
                    // - Tăng số lượng trong kho vì nhập hàng
                    for (InputTicketDetail inputTicketDetail : inputTicketDetails) {
                        Ingredient ingredientUpdateInventory = this.ingredientService
                                .getOneById(inputTicketDetail.getId().getIngredientId());
                        if (ingredientUpdateInventory != null) {
                            Long newInventory = ingredientUpdateInventory.getInventory()
                                    + inputTicketDetail.getQuantity();
                            ingredientUpdateInventory.setInventory(newInventory);
                            // if (newInventory == inputTicketDetail.getQuantity()) {
                            // ingredientUpdateInventory.setStatus(IngredientStatusEnum.ACTIVE);
                            // }
                            this.ingredientService.upsert(ingredientUpdateInventory);
                        }
                    }
                }
            }

            inputTicketUpdated.setStatus(inputTicketUpdateRequest.getInputTicket().getStatus());
        }
        this.inputTicketService.upsert(inputTicketUpdated);

        return ResponseEntity.status(HttpStatus.OK).body(inputTicketUpdated);
    }
}
