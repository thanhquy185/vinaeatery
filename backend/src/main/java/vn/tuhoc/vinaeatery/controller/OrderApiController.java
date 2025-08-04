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
import lombok.AllArgsConstructor;
// import vn.tuhoc.vinaeatery.domain.Food;
import vn.tuhoc.vinaeatery.domain.Ingredient;
import vn.tuhoc.vinaeatery.domain.Order;
import vn.tuhoc.vinaeatery.domain.OrderDetail;
import vn.tuhoc.vinaeatery.domain.OrderDetailForCrud;
import vn.tuhoc.vinaeatery.domain.OrderDetailId;
import vn.tuhoc.vinaeatery.domain.Recipe;
import vn.tuhoc.vinaeatery.domain.criteria.OrderCriteria;
import vn.tuhoc.vinaeatery.domain.dto.FormSecurityDTO;
import vn.tuhoc.vinaeatery.domain.dto.OrderDTO;
import vn.tuhoc.vinaeatery.domain.dto.OrderUpdateDTO;
import vn.tuhoc.vinaeatery.domain.enumm.OrderStatusEnum;
// import vn.tuhoc.vinaeatery.service.FoodService;
// import vn.tuhoc.vinaeatery.service.EmployeeService;
// import vn.tuhoc.vinaeatery.domain.enumm.PayStatusEnum;
import vn.tuhoc.vinaeatery.service.IngredientService;
import vn.tuhoc.vinaeatery.service.OrderDetailService;
import vn.tuhoc.vinaeatery.service.OrderService;
import vn.tuhoc.vinaeatery.service.RecipeService;
import vn.tuhoc.vinaeatery.service.TimeService;
import vn.tuhoc.vinaeatery.util.HandleFormSecurity;
import vn.tuhoc.vinaeatery.util.ValidationUtil;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
public class OrderApiController {
    // Properties
    private final OrderService orderService;
    private final OrderDetailService orderDetailService;
    private final IngredientService ingredientService;
    // private final FoodService foodService;
    private final RecipeService recipeService;
    // private final EmployeeService employeeService;
    private final TimeService timeService;

    // Methods
    @PostMapping("/list")
    public ResponseEntity<?> listOrder(@RequestBody FormSecurityDTO formSecurityDTO,
            OrderCriteria orderCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "orders", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<Order> listOrder = this.orderService.getAll(orderCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listOrder);
    }

    @PostMapping("/list-format")
    public ResponseEntity<?> listOrderFormat(@RequestBody FormSecurityDTO formSecurityDTO,
            OrderCriteria orderCriteria) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "orders", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        List<OrderDTO> listOrder = this.orderService.getAllFormat(orderCriteria);
        return ResponseEntity.status(HttpStatus.OK).body(listOrder);
    }

    @PostMapping("/detail/{id}")
    public ResponseEntity<?> detailOrder(@RequestBody FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "orders", "read")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        Order orderSelected = this.orderService.getOneById(id);
        return ResponseEntity.status(HttpStatus.OK).body(orderSelected);
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleCreateOrder(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @RequestPart("order") @Valid Order order,
            @RequestPart("order-details") @Valid List<OrderDetailForCrud> orderDetails,
            BindingResult bindingResult) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "orders", "create")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil.buildRestResponseWithBR(bindingResult));
        }

        // Cập nhật theo giờ Việt Nam
        order.setTimeCreate(this.timeService.getDateTimeVN(order.getTimeCreate()));

        // // Mặc định là Chưa thanh toán
        // order.setPayStatus(PayStatusEnum.NOTPAY);
        // // Mặc định là Đang chờ xác nhận
        // order.setStatus(OrderStatusEnum.PENDING);

        Order orderCreated = this.orderService.upsert(order);
        if (orderCreated != null && orderDetails != null && !orderDetails.isEmpty()) {
            for (OrderDetailForCrud orderDetailForCrud : orderDetails) {
                OrderDetail newOrderDetail = new OrderDetail(
                        new OrderDetailId(orderCreated.getId(),
                                orderDetailForCrud.getFoodId()),
                        orderDetailForCrud.getPrice(), orderDetailForCrud.getQuantity());
                this.orderDetailService.upsert(newOrderDetail);
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(orderCreated);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> handleUpdateOrder(@RequestPart("form-security") FormSecurityDTO formSecurityDTO,
            @PathVariable("id") Integer id,
            @RequestPart("order") OrderUpdateDTO order) {
        if (!HandleFormSecurity.isValidFormData(formSecurityDTO, "orders", "update")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ValidationUtil
                            .buildRestResponseWithStr(HandleFormSecurity.getErrorMessageByHandleFormData()));
        }

        Order orderUpdated = this.orderService.getOneById(id);
        if (order.getPayStatus() != null) {
            orderUpdated.setPayStatus(order.getPayStatus());
        }
        if (order.getStatus() != null) {
            List<OrderDetail> orderDetails = orderDetailService.getAllByOrderId(id);
            if (!orderDetails.isEmpty() && !orderDetails.isEmpty()) {
                if (order.getStatus() == OrderStatusEnum.CONFIRM) {
                    // - Kiểm tra đủ số nguyên liệu cho từng món
                    String errors = "";
                    for (OrderDetail orderDetail : orderDetails) {
                        List<Recipe> recipes = recipeService.getAllByFoodId(orderDetail.getId().getFoodId());
                        for (Recipe recipe : recipes) {
                            Ingredient ingredient = ingredientService.getOneById(recipe.getId().getIngredientId());
                            if (ingredient.getInventory() < recipe.getQuantity() * orderDetail.getQuantity()) {
                                errors += String.format("- Món %d không đủ %s (#%d)|", orderDetail.getId().getFoodId(),
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
                    for (OrderDetail orderDetail : orderDetails) {
                        List<Recipe> recipes = recipeService.getAllByFoodId(orderDetail.getId().getFoodId());
                        for (Recipe recipe : recipes) {
                            Ingredient ingredientUpdate = ingredientService
                                    .getOneById(recipe.getId().getIngredientId());
                            ingredientUpdate.setInventory(
                                    ingredientUpdate.getInventory() - recipe.getQuantity() * orderDetail.getQuantity());
                            this.ingredientService.upsert(ingredientUpdate);
                        }
                    }
                }
            }

            orderUpdated.setStatus(order.getStatus());
        }
        this.orderService.upsert(orderUpdated);

        return ResponseEntity.status(HttpStatus.OK).body(orderUpdated);
    }
}
