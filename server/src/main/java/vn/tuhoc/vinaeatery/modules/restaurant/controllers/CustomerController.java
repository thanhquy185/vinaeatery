package vn.tuhoc.vinaeatery.modules.restaurant.controllers;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.restaurant.repositories.criteria.CustomerCriteria;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.PageResponseDTO;
import vn.tuhoc.vinaeatery.modules.global.dtos.responses.RestResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.CustomerCreateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.CustomerDeleteRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.requests.CustomerUpdateRequestDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerCrudResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerDetailResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.dtos.responses.CustomerSummaryResponseDTO;
import vn.tuhoc.vinaeatery.modules.restaurant.services.CustomerService;
import vn.tuhoc.vinaeatery.utils.RestResponseUtils;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
public class CustomerController {
        private final CustomerService customerService;

        @GetMapping("/{id}")
        public ResponseEntity<RestResponseDTO<CustomerDetailResponseDTO>> handleGetDetailById(
                        @PathVariable("id") Integer id) {
                CustomerDetailResponseDTO customerDetail = this.customerService.handleGetDetailById(id);

                return RestResponseUtils.ok(
                                "Truy vấn khách hàng theo mã khách hàng thành công!",
                                customerDetail);
        }

        @GetMapping("")
        public ResponseEntity<RestResponseDTO<PageResponseDTO<CustomerSummaryResponseDTO>>> handleGetSummary(
                        CustomerCriteria customerCriteria) {
                PageResponseDTO<CustomerSummaryResponseDTO> customerSummary = this.customerService
                                .handleGetSummary(customerCriteria);

                return RestResponseUtils.ok(
                                "Truy vấn danh sách khách hàng thành công!",
                                customerSummary);
        }

        @GetMapping("/crud")
        public ResponseEntity<RestResponseDTO<List<CustomerCrudResponseDTO>>> handleGetCrud() {
                List<CustomerCrudResponseDTO> customerCrud = this.customerService.handleGetCrud();

                return RestResponseUtils.ok(
                                "Truy vấn danh sách khách hàng để xử lý thông tin thành công!",
                                customerCrud);
        }

        @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<RestResponseDTO<CustomerDetailResponseDTO>> handleCreate(
                        @RequestPart(value = "image-file", required = false) MultipartFile imageFile,
                        @RequestPart("customer") @Valid CustomerCreateRequestDTO customerCreateRequestDTO) {
                CustomerDetailResponseDTO customerCreated = this.customerService
                                .handleCreate(imageFile, customerCreateRequestDTO);

                return RestResponseUtils.created(
                                "Thêm khách hàng thành công!",
                                customerCreated);
        }

        @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<RestResponseDTO<CustomerDetailResponseDTO>> handleUpdate(
                        @PathVariable("id") Integer id,
                        @RequestPart(value = "image-file", required = false) MultipartFile imageFile,
                        @RequestPart("customer") @Valid CustomerUpdateRequestDTO customerUpdateRequestDTO) {
                CustomerDetailResponseDTO customerUpdated = this.customerService.handleUpdate(
                                id,
                                imageFile,
                                customerUpdateRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật thông tin khách hàng thành công!",
                                customerUpdated);
        }

        @DeleteMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<RestResponseDTO<CustomerDetailResponseDTO>> handleDelete(
                        @PathVariable("id") Integer id,
                        @RequestBody @Valid CustomerDeleteRequestDTO customerDeleteRequestDTO) {
                CustomerDetailResponseDTO customerDeleted = this.customerService.handleDelete(
                                id,
                                customerDeleteRequestDTO);

                return RestResponseUtils.ok(
                                "Cập nhật trạng thái khách hàng thành công!",
                                customerDeleted);
        }
}