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
// import vn.tuhoc.vinaeatery.domain.Food;
import vn.tuhoc.vinaeatery.domain.Ingredient;
import vn.tuhoc.vinaeatery.domain.OrderSheet;
import vn.tuhoc.vinaeatery.domain.OrderSheetDetail;
import vn.tuhoc.vinaeatery.domain.OrderSheetDetailForCrud;
import vn.tuhoc.vinaeatery.domain.OrderSheetDetailId;
import vn.tuhoc.vinaeatery.domain.Recipe;
import vn.tuhoc.vinaeatery.domain.criteria.OrderSheetCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.OrderSheetDTO;
import vn.tuhoc.vinaeatery.domain.dto.OrderSheetUpdateDTO;
import vn.tuhoc.vinaeatery.domain.enumm.OrderSheetStatusEnum;
// import vn.tuhoc.vinaeatery.service.FoodService;
// import vn.tuhoc.vinaeatery.service.EmployeeService;
// import vn.tuhoc.vinaeatery.domain.enumm.PayStatusEnum;
import vn.tuhoc.vinaeatery.service.IngredientService;
import vn.tuhoc.vinaeatery.service.OrderSheetDetailService;
import vn.tuhoc.vinaeatery.service.OrderSheetService;
import vn.tuhoc.vinaeatery.service.RecipeService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/order-sheets")
@RequiredArgsConstructor
public class OrderSheetApiController {
    // Properties
    private final OrderSheetService orderSheetService;
    private final OrderSheetDetailService orderSheetDetailService;
    private final IngredientService ingredientService;
    // private final FoodService foodService;
    private final RecipeService recipeService;
    // private final EmployeeService employeeService;
    private final TimeService timeService;

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listOrderSheet(@RequestBody FormSecurityDTO formSecurityDTO,
            OrderSheetCriteria orderSheetCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "order-sheets", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<OrderSheet> listOrderSheet = this.orderSheetService.getAll(orderSheetCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listOrderSheet);
    }

    @PostMapping("/list-format")
    public ResponseEntity<?> listOrderSheetFormat(@RequestBody FormSecurityDTO formSecurityDTO,
            OrderSheetCriteria orderSheetCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "order-sheets", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<OrderSheetDTO> listOrderSheet = this.orderSheetService.getAllFormat(orderSheetCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listOrderSheet);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailOrderSheet(@RequestBody FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "order-sheets", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        OrderSheet orderSheetSelected = this.orderSheetService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(orderSheetSelected);
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleCreateOrderSheet(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @RequestPart("order-sheet") @Valid OrderSheet orderSheet,
            @RequestPart("order-sheet-details") @Valid List<OrderSheetDetailForCrud> orderSheetDetails,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "order-sheets", "create")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        // Cập nhật theo giờ Việt Nam
        orderSheet.setTimeCreate(this.timeService.getDateTimeVN(orderSheet.getTimeCreate()));

        // // Mặc định là Chưa thanh toán
        // orderSheet.setPayStatus(PayStatusEnum.NOTPAY);
        // // Mặc định là Đang chờ xác nhận
        // orderSheet.setStatus(OrderSheetStatusEnum.PENDING);

        OrderSheet orderSheetCreated = this.orderSheetService.upsert(orderSheet);
        if (orderSheetCreated != null && orderSheetDetails != null && !orderSheetDetails.isEmpty()) {
            for (OrderSheetDetailForCrud orderSheetDetailForCrud : orderSheetDetails) {
                OrderSheetDetail newOrderSheetDetail = new OrderSheetDetail(
                        new OrderSheetDetailId(orderSheetCreated.getId(),
                                orderSheetDetailForCrud.getFoodId()),
                        orderSheetDetailForCrud.getPrice(), orderSheetDetailForCrud.getQuantity());
                this.orderSheetDetailService.upsert(newOrderSheetDetail);
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(orderSheetCreated);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleUpdateOrderSheet(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("order-sheet") OrderSheetUpdateDTO orderSheet) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "order-sheets", "update")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        OrderSheet orderSheetUpdated = this.orderSheetService.getOneById(id);
        if (orderSheet.getStatus() != null) {
            if (orderSheet.getStatus() == OrderSheetStatusEnum.SERVICED) {
                orderSheetUpdated.setTimeService(this.timeService.getDateTimeVN(orderSheet.getTimeService()));
            }
            if (orderSheet.getStatus() == OrderSheetStatusEnum.CONFIRM
                    || orderSheet.getStatus() == OrderSheetStatusEnum.CANCELLED) {
                orderSheetUpdated.setEmployeeId(orderSheet.getEmployeeId());
            }

            List<OrderSheetDetail> orderSheetDetails = orderSheetDetailService.getAllByOrderSheetId(id);
            if (!orderSheetDetails.isEmpty() && !orderSheetDetails.isEmpty()) {
                if (orderSheet.getStatus() == OrderSheetStatusEnum.CONFIRM) {
                    // - Kiểm tra đủ số nguyên liệu cho từng món
                    String errors = "";
                    for (OrderSheetDetail orderSheetDetail : orderSheetDetails) {
                        List<Recipe> recipes = recipeService.getAllByFoodId(orderSheetDetail.getId().getFoodId());
                        for (Recipe recipe : recipes) {
                            Ingredient ingredient = ingredientService.getOneById(recipe.getId().getIngredientId());
                            if (ingredient.getInventory() < recipe.getQuantity() * orderSheetDetail.getQuantity()) {
                                errors += String.format("- Món %d không đủ %s (#%d)|",
                                        orderSheetDetail.getId().getFoodId(),
                                        ingredient.getName(), ingredient.getId());
                            }
                        }
                    }
                    if (!errors.equals("") && errors.length() > 0) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(ValidationUtil
                                        .buildRestResponseWithStr(errors));
                    }
                    // - Giảm số lượng trong kho vì bán món ăn theo công thức
                    for (OrderSheetDetail orderSheetDetail : orderSheetDetails) {
                        List<Recipe> recipes = recipeService.getAllByFoodId(orderSheetDetail.getId().getFoodId());
                        for (Recipe recipe : recipes) {
                            Ingredient ingredientUpdate = ingredientService
                                    .getOneById(recipe.getId().getIngredientId());
                            ingredientUpdate.setInventory(
                                    ingredientUpdate.getInventory()
                                            - recipe.getQuantity() * orderSheetDetail.getQuantity());
                            this.ingredientService.upsert(ingredientUpdate);
                        }
                    }
                }
            }

            orderSheetUpdated.setMessage(orderSheet.getMessage());
            orderSheetUpdated.setStatus(orderSheet.getStatus());
        }
        this.orderSheetService.upsert(orderSheetUpdated);

        return ResponseEntity.status(HttpStatus.OK).body(orderSheetUpdated);
    }
}
