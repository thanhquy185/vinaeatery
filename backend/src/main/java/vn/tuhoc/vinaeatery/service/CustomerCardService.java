package vn.tuhoc.vinaeatery.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.CustomerCard_;
import vn.tuhoc.vinaeatery.domain.CustomerCard;
import vn.tuhoc.vinaeatery.domain.criteria.CustomerCardCriteria;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.CustomerCardRepository;
import vn.tuhoc.vinaeatery.service.specification.CustomerCardSpecification;

@Service
@RequiredArgsConstructor
public class CustomerCardService {
    // Properties
    private final CustomerCardRepository customerCardRepository;

    // Methods
    public CustomerCard getOneById(Integer id) {
        return this.customerCardRepository.findOneById(id);
    }

    public CustomerCard getLastOne() {
        return this.customerCardRepository.findLastOne();
    }


    public List<CustomerCard> getAll() {
        return this.customerCardRepository.findAll();
    }

    public List<CustomerCard> getAll(CustomerCardCriteria customerCardCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (customerCardCriteria.getSort() != null && customerCardCriteria.getSort().isPresent()) {
            String sortStr = customerCardCriteria.getSort().get();
            switch (sortStr) {
                case "Mã thẻ khách hàng tăng dần" -> sort = Sort.by(CustomerCard_.ID).ascending();
                case "Mã thẻ khách hàng giảm dần" -> sort = Sort.by(CustomerCard_.ID).descending();
                case "Tên thẻ khách hàng tăng dần" -> sort = Sort.by(CustomerCard_.NAME).ascending();
                case "Tên thẻ khách hàng giảm dần" -> sort = Sort.by(CustomerCard_.NAME).descending();
            }
        }

        //
        if (customerCardCriteria.getId() == null && customerCardCriteria.getName() == null
                && customerCardCriteria.getStatus() == null && customerCardCriteria.getSort() == null) {
            return this.customerCardRepository.findAll(sort);
        }
        //
        Specification<CustomerCard> combinedSpec = Specification.where(null);
        if (customerCardCriteria.getId() != null && customerCardCriteria.getId().isPresent()) {
            if (customerCardCriteria.getId().get().matches("\\d+")) {
                Specification<CustomerCard> currentSpec = CustomerCardSpecification.idEqual(customerCardCriteria.getId().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (customerCardCriteria.getName() != null && customerCardCriteria.getName().isPresent()) {
            Specification<CustomerCard> currentSpec = CustomerCardSpecification.nameLike(customerCardCriteria.getName().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (customerCardCriteria.getStatus() != null && customerCardCriteria.getStatus().isPresent()) {
            String statusString = customerCardCriteria.getStatus().get();
            Boolean statusBoolean = false;
            for (CommonStatusEnum commonStatus : CommonStatusEnum.values()) {
                if (commonStatus.getDescription().equals(statusString)) {
                    statusBoolean = commonStatus.getValue();
                    break;
                }
            }
            Specification<CustomerCard> currentSpec = CustomerCardSpecification.statusEqual(statusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.customerCardRepository.findAll(combinedSpec, sort);
    }

    public CustomerCard upsert(CustomerCard customerCard) {
        return this.customerCardRepository.save(customerCard);
    }

    public void delete(Integer id) {
        this.customerCardRepository.deleteById(id);
    }

    public void lock(CustomerCard customerCard) {
        this.customerCardRepository.save(customerCard);
    }
}