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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.Ingredient;
import vn.tuhoc.vinaeatery.domain.InputTicket;
import vn.tuhoc.vinaeatery.domain.InputTicketDetail;
import vn.tuhoc.vinaeatery.domain.InputTicketDetailForCrud;
import vn.tuhoc.vinaeatery.domain.InputTicketDetailId;
import vn.tuhoc.vinaeatery.domain.criteria.InputTicketCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.InputTicketDTO;
import vn.tuhoc.vinaeatery.domain.dto.InputTicketUpdateDTO;
import vn.tuhoc.vinaeatery.domain.enumm.InputTicketStatusEnum;
// import vn.tuhoc.vinaeatery.domain.enumm.PayStatusEnum;
// import vn.tuhoc.vinaeatery.service.EmployeeService;
import vn.tuhoc.vinaeatery.service.IngredientService;
import vn.tuhoc.vinaeatery.service.InputTicketDetailService;
import vn.tuhoc.vinaeatery.service.InputTicketService;
import vn.tuhoc.vinaeatery.service.TimeService;
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
    private final TimeService timeService;

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

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleCreateInputTicket(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @RequestPart("input-ticket") @Valid InputTicket inputTicket,
            @RequestPart("input-ticket-details") @Valid List<InputTicketDetailForCrud> inputTicketDetails,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "input-tickets", "create")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        // Cập nhật theo giờ Việt Nam
        inputTicket.setTimeCreate(this.timeService.getDateTimeVN(inputTicket.getTimeCreate()));

        // // Mặc định là Chưa thanh toán
        // inputTicket.setPayStatus(PayStatusEnum.NOTPAY);
        // // Mặc định là Đang chờ xác nhận
        // inputTicket.setStatus(InputTicketStatusEnum.PENDING);

        InputTicket inputTicketCreated = this.inputTicketService.upsert(inputTicket);
        if (inputTicketCreated != null && inputTicketDetails != null && !inputTicketDetails.isEmpty()) {
            for (InputTicketDetailForCrud inputTicketDetailForCrud : inputTicketDetails) {
                InputTicketDetail newInputTicketDetail = new InputTicketDetail(
                        new InputTicketDetailId(inputTicketCreated.getId(),
                                inputTicketDetailForCrud.getIngredientId()),
                        inputTicketDetailForCrud.getPrice(), inputTicketDetailForCrud.getQuantity());
                this.inputTicketDetailService.upsert(newInputTicketDetail);
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(inputTicketCreated);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleUpdateInputTicket(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("input-ticket") InputTicketUpdateDTO inputTicket) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "input-tickets", "update")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        InputTicket inputTicketUpdated = this.inputTicketService.getOneById(id);
        if (inputTicket.getPayStatus() != null) {
            inputTicketUpdated.setPayStatus(inputTicket.getPayStatus());
        }
        if (inputTicket.getStatus() != null) {
            List<InputTicketDetail> inputTicketDetails = inputTicketDetailService.getAllByInputTicketId(id);
            if (!inputTicketDetails.isEmpty() && !inputTicketDetails.isEmpty()) {
                if (inputTicket.getStatus() == InputTicketStatusEnum.GIVEBACK) {
                    // - So số lượng trong kho với số lượng trả
                    for (InputTicketDetail inputTicketDetail : inputTicketDetails) {
                        Ingredient ingredient = ingredientService
                                .getOneById(inputTicketDetail.getId().getIngredientId());
                        if (ingredient != null && ingredient.getInventory() < inputTicketDetail.getQuantity()) {
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                    .body(ValidationUtil
                                            .buildRestResponseWithStr("Có thực phẩm không đủ số lượng trả !"));
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
                } else if (inputTicket.getStatus() == InputTicketStatusEnum.CONFIRM) {
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

            inputTicketUpdated.setStatus(inputTicket.getStatus());
        }
        this.inputTicketService.upsert(inputTicketUpdated);

        return ResponseEntity.status(HttpStatus.OK).body(inputTicketUpdated);
    }
}
