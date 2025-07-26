package vn.tuhoc.vinaeatery.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.Customer_;
import vn.tuhoc.vinaeatery.domain.Customer;
import vn.tuhoc.vinaeatery.domain.criteria.CustomerCriteria;
import vn.tuhoc.vinaeatery.domain.dto.CustomerDTO;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.CustomerCardRepository;
import vn.tuhoc.vinaeatery.repository.CustomerRepository;
import vn.tuhoc.vinaeatery.service.specification.CustomerSpecification;

@Service
@AllArgsConstructor
public class CustomerService {
    // Properties
    private final CustomerCardRepository customerCardRepository;
    private final CustomerRepository customerRepository;

    // Methods
    public Customer getOneById(Integer id) {
        return this.customerRepository.findOneById(id);
    }

    public CustomerDTO getOneFormatById(Integer id) {
        CustomerDTO customerDTO = new CustomerDTO();
        Customer customer = getOneById(id);
        if (customer != null) {
            customerDTO.setId(customer.getId());
            customerDTO.setFullname(customer.getFullname());
            customerDTO.setBirthday(customer.getBirthday());
            customerDTO.setGender(customer.getGender());
            customerDTO.setPhone(customer.getPhone());
            customerDTO.setEmail(customer.getEmail());
            customerDTO.setAddress(customer.getAddress());
            customerDTO.setDescription(customer.getDescription());
            if (customer.getCustomerCardId() != null) {
                customerDTO.setCustomerCard(customerCardRepository.findOneById(customer.getCustomerCardId()));
            }
            customerDTO.setTotalThreshold(customer.getTotalThreshold());
            customerDTO.setStatus(customer.getStatus());
            customerDTO.setTimeUpdate(customer.getTimeUpdate());
        }

        return customerDTO;
    }

    public List<Customer> getAll() {
        return this.customerRepository.findAll();
    }

    public List<Customer> getAll(CustomerCriteria customerCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (customerCriteria.getSort() != null && customerCriteria.getSort().isPresent()) {
            String sortStr = customerCriteria.getSort().get();
            switch (sortStr) {
                case "Mã khách hàng tăng dần" -> sort = Sort.by(Customer_.ID).ascending();
                case "Mã khách hàng giảm dần" -> sort = Sort.by(Customer_.ID).descending();
                case "Tên khách hàng tăng dần" -> sort = Sort.by(Customer_.FULLNAME).ascending();
                case "Tên khách hàng giảm dần" -> sort = Sort.by(Customer_.FULLNAME).descending();
            }
        }

        //
        if (customerCriteria.getId() == null && customerCriteria.getFullname() == null
                && customerCriteria.getCustomerCardId() == null && customerCriteria.getPhone() == null
                && customerCriteria.getEmail() == null && customerCriteria.getStatus() == null
                && customerCriteria.getSort() == null) {
            return this.customerRepository.findAll(sort);
        }
        //
        Specification<Customer> combinedSpec = Specification.where(null);
        if (customerCriteria.getId() != null && customerCriteria.getId().isPresent()) {
            if (customerCriteria.getId().get().matches("\\d+")) {
                Specification<Customer> currentSpec = CustomerSpecification.idEqual(customerCriteria.getId().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (customerCriteria.getCustomerCardId() != null && customerCriteria.getCustomerCardId().isPresent()) {
            String[] listCustomerCardId = customerCriteria.getCustomerCardId().get().split(",");
            for (String customerCardId : listCustomerCardId) {
                if (customerCardId.matches("\\d+")) {
                    Specification<Customer> currentSpec = CustomerSpecification.customerCardIdEqual(customerCardId);
                    combinedSpec = combinedSpec.or(currentSpec);
                }
            }
        }
        if (customerCriteria.getFullname() != null && customerCriteria.getFullname().isPresent()) {
            Specification<Customer> currentSpec = CustomerSpecification
                    .fullnameLike(customerCriteria.getFullname().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (customerCriteria.getPhone() != null && customerCriteria.getPhone().isPresent()) {
            if (customerCriteria.getPhone().get().matches("\\d+")) {
                Specification<Customer> currentSpec = CustomerSpecification
                        .phoneLike(customerCriteria.getPhone().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (customerCriteria.getEmail() != null && customerCriteria.getEmail().isPresent()) {
            Specification<Customer> currentSpec = CustomerSpecification.emailLike(customerCriteria.getEmail().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (customerCriteria.getStatus() != null && customerCriteria.getStatus().isPresent()) {
            String statusString = customerCriteria.getStatus().get();
            Boolean statusBoolean = false;
            for (CommonStatusEnum commonStatus : CommonStatusEnum.values()) {
                if (commonStatus.getDescription().equals(statusString)) {
                    statusBoolean = commonStatus.getValue();
                    break;
                }
            }
            Specification<Customer> currentSpec = CustomerSpecification.statusEqual(statusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.customerRepository.findAll(combinedSpec, sort);
    }

    public List<CustomerDTO> getAllFormat(CustomerCriteria customerCriteria) {
        List<CustomerDTO> listFormat = new ArrayList<>();
        for (Customer customer : getAll(customerCriteria)) {
            CustomerDTO customerDTO = new CustomerDTO();
            customerDTO.setId(customer.getId());
            customerDTO.setFullname(customer.getFullname());
            customerDTO.setBirthday(customer.getBirthday());
            customerDTO.setGender(customer.getGender());
            customerDTO.setPhone(customer.getPhone());
            customerDTO.setEmail(customer.getEmail());
            customerDTO.setAddress(customer.getAddress());
            customerDTO.setDescription(customer.getDescription());
            if (customer.getCustomerCardId() != null) {
                customerDTO.setCustomerCard(customerCardRepository.findOneById(customer.getCustomerCardId()));
            }
            customerDTO.setTotalThreshold(customer.getTotalThreshold());
            customerDTO.setStatus(customer.getStatus());
            customerDTO.setTimeUpdate(customer.getTimeUpdate());

            listFormat.add(customerDTO);
        }

        return listFormat;
    }

    public List<Customer> getAllByCustomerCardId(Integer customerCardId) {
        return this.customerRepository.findAllByCustomerCardId(customerCardId);
    }

    public Customer upsert(Customer customer) {
        return this.customerRepository.save(customer);
    }

    public void delete(Integer id) {
        this.customerRepository.deleteById(id);
    }

    public void lock(Customer customer) {
        this.customerRepository.save(customer);
    }
}