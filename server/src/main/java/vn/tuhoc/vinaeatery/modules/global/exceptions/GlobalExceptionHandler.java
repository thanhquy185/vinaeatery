package vn.tuhoc.vinaeatery.modules.global.exceptions;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import vn.tuhoc.vinaeatery.modules.active.exceptions.BillIngredientInsufficientInventory;
import vn.tuhoc.vinaeatery.modules.active.exceptions.BillNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.active.exceptions.FeedbackNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.active.exceptions.MessageNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.active.exceptions.OrderSheetIngredientInsufficientInventory;
import vn.tuhoc.vinaeatery.modules.active.exceptions.ReservationNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.active.exceptions.UseFoodNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.active.exceptions.UseTableNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.active.exceptions.UseTableNotFoundByRestaurantIdTableIdAndEndAtIsNull;
import vn.tuhoc.vinaeatery.modules.auth.exceptions.AuthAccessTokenIsNotValidException;
import vn.tuhoc.vinaeatery.modules.auth.exceptions.AuthUserIsLockingException;
import vn.tuhoc.vinaeatery.modules.auth.exceptions.AuthUsernameOrPasswordIsNotAvailable;
import vn.tuhoc.vinaeatery.modules.auth.exceptions.UserNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.auth.exceptions.UserNotFoundByUsernameAndPasswordException;
import vn.tuhoc.vinaeatery.modules.auth.exceptions.UserNotFoundByUsernameAndRefreshTokenException;
import vn.tuhoc.vinaeatery.modules.auth.exceptions.UserNotFoundByUsernameException;
import vn.tuhoc.vinaeatery.modules.auth.exceptions.UserPasswordIsUsingException;
import vn.tuhoc.vinaeatery.modules.auth.exceptions.UserPasswordIsNotMatchException;
import vn.tuhoc.vinaeatery.modules.auth.exceptions.UserUsernameIsExistsException;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.EmployeeEmailIsExistsException;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.EmployeeNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.EmployeeNotFoundByUserIdException;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.EmployeePhoneIsExistsException;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.FunctionNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.PermissionDetailNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.PermissionIsUsingException;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.PermissionNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.RoleHistoryCanNotUpdateOnDayException;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.RoleHistoryLatestNotFoundByEmployeeIdException;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.RoleHistoryNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.RoleIsUsingException;
import vn.tuhoc.vinaeatery.modules.employee.exceptions.RoleNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.food.exceptions.CategoryFoodIsUsingException;
import vn.tuhoc.vinaeatery.modules.food.exceptions.CategoryFoodNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.food.exceptions.CategoryIngredientIsUsingException;
import vn.tuhoc.vinaeatery.modules.food.exceptions.CategoryIngredientNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.food.exceptions.FoodNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.food.exceptions.IngredientNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.food.exceptions.InputTicketDetailNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.food.exceptions.InputTicketNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.food.exceptions.RecipeNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.food.exceptions.SupplierEmailIsExistsException;
import vn.tuhoc.vinaeatery.modules.food.exceptions.SupplierNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.food.exceptions.SupplierPhoneIsExistsException;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.modules.payment.exceptions.MomoOrderIdInavailableException;
import vn.tuhoc.vinaeatery.modules.payment.exceptions.MomoPaymentFailureException;
import vn.tuhoc.vinaeatery.modules.payment.exceptions.PaymentMachineExistsOneIsHandlingException;
import vn.tuhoc.vinaeatery.modules.payment.exceptions.PaymentMachineNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.payment.exceptions.PaymentMachineNotFoundByPaymentIdException;
import vn.tuhoc.vinaeatery.modules.payment.exceptions.PaymentMachineNotFoundByUseTableIdException;
import vn.tuhoc.vinaeatery.modules.payment.exceptions.PaymentMethodNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.payment.exceptions.ZaloPayTransactionInavailableException;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.CustomerEmailIsExistsException;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.CustomerNotFoundByEmailException;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.CustomerNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.CustomerNotFoundByPhoneException;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.CustomerNotFoundByUserIdException;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.CustomerPhoneIsExistsException;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.ManagerEmailIsExistsException;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.ManagerIsUsingException;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.ManagerNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.ManagerNotFoundByUserIdException;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.ManagerPhoneIsExistsException;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.RestaurantEmailIsExistsException;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.RestaurantImageNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.RestaurantNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.restaurant.exceptions.RestaurantPhoneIsExistsException;
import vn.tuhoc.vinaeatery.modules.table.exceptions.CategoryTableIsUsingException;
import vn.tuhoc.vinaeatery.modules.table.exceptions.CategoryTableNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.table.exceptions.FloorIsUsingException;
import vn.tuhoc.vinaeatery.modules.table.exceptions.FloorNotFoundByIdException;
import vn.tuhoc.vinaeatery.modules.table.exceptions.TableNotFoundByIdException;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;

@RestControllerAdvice
public class GlobalExceptionHandler {
        private String formatError(Exception exception) {
                return exception.getClass()
                                .getSimpleName()
                                .replace("Exception", "")
                                .replaceAll("([a-z])([A-Z])", "$1_$2")
                                .toUpperCase();
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<?> validationError(MethodArgumentNotValidException exception) {
                // log.error("Exception: ", exception);

                BindingResult result = exception.getBindingResult();
                List<FieldError> fieldErrors = result.getFieldErrors();

                List<Map<String, String>> errors = fieldErrors.stream()
                                .map(fieldError -> Map.of(
                                                "field", fieldError.getField(),
                                                "message", fieldError.getDefaultMessage()))
                                .collect(Collectors.toList());

                RestResponseDTO<Object> response = RestResponseDTO.builder()
                                .status(HttpStatus.BAD_REQUEST.value())
                                .error("VALIDATION_ERROR")
                                .message("Dữ liệu không hợp lệ!")
                                .data(errors)
                                .build();

                return ResponseEntity.badRequest().body(response);
        }

        @ExceptionHandler({
                        PaymentMachineNotFoundByIdException.class,
                        PaymentMachineNotFoundByUseTableIdException.class,
                        PaymentMachineNotFoundByPaymentIdException.class,
                        PaymentMethodNotFoundByIdException.class,
                        RestaurantNotFoundByIdException.class,
                        RestaurantImageNotFoundByIdException.class,
                        ManagerNotFoundByIdException.class,
                        ManagerNotFoundByUserIdException.class,
                        CustomerNotFoundByIdException.class,
                        CustomerNotFoundByUserIdException.class,
                        CustomerNotFoundByPhoneException.class,
                        CustomerNotFoundByEmailException.class,
                        UserNotFoundByIdException.class,
                        UserNotFoundByUsernameException.class,
                        UserNotFoundByUsernameAndPasswordException.class,
                        UserNotFoundByUsernameAndRefreshTokenException.class,
                        UseTableNotFoundByIdException.class,
                        UseTableNotFoundByRestaurantIdTableIdAndEndAtIsNull.class,
                        UseFoodNotFoundByIdException.class,
                        FeedbackNotFoundByIdException.class,
                        MessageNotFoundByIdException.class,
                        BillNotFoundByIdException.class,
                        ReservationNotFoundByIdException.class,
                        TableNotFoundByIdException.class,
                        FloorNotFoundByIdException.class,
                        CategoryTableNotFoundByIdException.class,
                        InputTicketNotFoundByIdException.class,
                        InputTicketDetailNotFoundByIdException.class,
                        SupplierNotFoundByIdException.class,
                        CategoryIngredientNotFoundByIdException.class,
                        IngredientNotFoundByIdException.class,
                        CategoryFoodNotFoundByIdException.class,
                        FoodNotFoundByIdException.class,
                        RecipeNotFoundByIdException.class,
                        FunctionNotFoundByIdException.class,
                        PermissionNotFoundByIdException.class,
                        PermissionDetailNotFoundByIdException.class,
                        RoleNotFoundByIdException.class,
                        RoleHistoryNotFoundByIdException.class,
                        EmployeeNotFoundByIdException.class,
                        EmployeeNotFoundByUserIdException.class
        })
        public ResponseEntity<?> handleEntityNotFoundByIdException(RuntimeException exception) {
                return RestResponseUtils.notFound(
                                this.formatError(exception),
                                exception.getMessage());
        }

        @ExceptionHandler({
                        FileUploadIsEmptyException.class,
                        FileNameIsEmptyException.class,
                        PaymentMachineExistsOneIsHandlingException.class,
                        RestaurantPhoneIsExistsException.class,
                        RestaurantEmailIsExistsException.class,
                        ManagerIsUsingException.class,
                        ManagerPhoneIsExistsException.class,
                        ManagerEmailIsExistsException.class,
                        CustomerPhoneIsExistsException.class,
                        CustomerEmailIsExistsException.class,
                        AuthUsernameOrPasswordIsNotAvailable.class,
                        AuthUserIsLockingException.class,
                        AuthAccessTokenIsNotValidException.class,
                        UserUsernameIsExistsException.class,
                        UserPasswordIsNotMatchException.class,
                        UserPasswordIsUsingException.class,
                        OrderSheetIngredientInsufficientInventory.class,
                        BillIngredientInsufficientInventory.class,
                        FloorIsUsingException.class,
                        CategoryTableIsUsingException.class,
                        SupplierPhoneIsExistsException.class,
                        SupplierEmailIsExistsException.class,
                        CategoryIngredientIsUsingException.class,
                        CategoryFoodIsUsingException.class,
                        PermissionIsUsingException.class,
                        RoleIsUsingException.class,
                        RoleHistoryLatestNotFoundByEmployeeIdException.class,
                        RoleHistoryCanNotUpdateOnDayException.class,
                        EmployeePhoneIsExistsException.class,
                        EmployeeEmailIsExistsException.class
        })
        public ResponseEntity<?> handleEntityIsUsing(RuntimeException exception) {
                return RestResponseUtils.badRequest(
                                this.formatError(exception),
                                exception.getMessage());
        }

        @ExceptionHandler({
                        MomoPaymentFailureException.class,
                        MomoOrderIdInavailableException.class,
                        ZaloPayTransactionInavailableException.class })
        public ResponseEntity<?> handleResultPayment(RuntimeException exception) {
                return RestResponseUtils.badRequest(
                                this.formatError(exception),
                                exception.getMessage());
        }
}