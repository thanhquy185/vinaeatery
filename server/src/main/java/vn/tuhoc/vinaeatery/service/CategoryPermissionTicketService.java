package vn.tuhoc.vinaeatery.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.domain.criteria.CategoryPermissionTicketCriteria;
import vn.tuhoc.vinaeatery.domain.entity.CategoryPermissionTicket_;
import vn.tuhoc.vinaeatery.domain.entity.CategoryPermissionTicket;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.CategoryPermissionTicketRepository;
import vn.tuhoc.vinaeatery.service.specification.CategoryPermissionTicketSpecification;

@Service
@RequiredArgsConstructor
public class CategoryPermissionTicketService {
    // Properties
    private final CategoryPermissionTicketRepository categoryPermissionTicketRepository;

    // Methods
    public CategoryPermissionTicket getOneById(Integer id) {
        return this.categoryPermissionTicketRepository.findOneById(id);
    }

    public List<CategoryPermissionTicket> getAll() {
        return this.categoryPermissionTicketRepository.findAll();
    }

    public List<CategoryPermissionTicket> getAll(CategoryPermissionTicketCriteria categoryPermissionTicketCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (categoryPermissionTicketCriteria.getSort() != null
                && categoryPermissionTicketCriteria.getSort().isPresent()) {
            String sortStr = categoryPermissionTicketCriteria.getSort().get();
            switch (sortStr) {
                case "Mã loại nguyên liệu tăng dần" -> sort = Sort.by(CategoryPermissionTicket_.ID).ascending();
                case "Mã loại nguyên liệu giảm dần" -> sort = Sort.by(CategoryPermissionTicket_.ID).descending();
                case "Tên loại nguyên liệu tăng dần" -> sort = Sort.by(CategoryPermissionTicket_.NAME).ascending();
                case "Tên loại nguyên liệu giảm dần" -> sort = Sort.by(CategoryPermissionTicket_.NAME).descending();
            }
        }

        //
        if (categoryPermissionTicketCriteria.getId() == null
                && categoryPermissionTicketCriteria.getRestaurantId() == null
                && categoryPermissionTicketCriteria.getName() == null
                && categoryPermissionTicketCriteria.getStatus() == null
                && categoryPermissionTicketCriteria.getSort() == null) {
            return this.categoryPermissionTicketRepository.findAll(sort);
        }
        //
        Specification<CategoryPermissionTicket> combinedSpec = Specification.where(null);
        if (categoryPermissionTicketCriteria.getId() != null && categoryPermissionTicketCriteria.getId().isPresent()) {
            if (categoryPermissionTicketCriteria.getId().get().matches("\\d+")) {
                Specification<CategoryPermissionTicket> currentSpec = CategoryPermissionTicketSpecification
                        .idEqual(categoryPermissionTicketCriteria.getId().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (categoryPermissionTicketCriteria.getRestaurantId() != null
                && categoryPermissionTicketCriteria.getRestaurantId().isPresent()) {
            if (categoryPermissionTicketCriteria.getRestaurantId().get().matches("\\d+")) {
                Specification<CategoryPermissionTicket> currentSpec = CategoryPermissionTicketSpecification
                        .restaurantIdEqual(categoryPermissionTicketCriteria.getRestaurantId().get());
                combinedSpec = combinedSpec.and(currentSpec);
            }
        }
        if (categoryPermissionTicketCriteria.getName() != null
                && categoryPermissionTicketCriteria.getName().isPresent()) {
            Specification<CategoryPermissionTicket> currentSpec = CategoryPermissionTicketSpecification
                    .nameLike(categoryPermissionTicketCriteria.getName().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (categoryPermissionTicketCriteria.getStatus() != null
                && categoryPermissionTicketCriteria.getStatus().isPresent()) {
            String statusString = categoryPermissionTicketCriteria.getStatus().get();
            Boolean statusBoolean = false;
            for (CommonStatusEnum commonStatus : CommonStatusEnum.values()) {
                if (commonStatus.getDescription().equals(statusString)) {
                    statusBoolean = commonStatus.getValue();
                    break;
                }
            }
            Specification<CategoryPermissionTicket> currentSpec = CategoryPermissionTicketSpecification
                    .statusEqual(statusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.categoryPermissionTicketRepository.findAll(combinedSpec, sort);
    }

    public CategoryPermissionTicket upsert(CategoryPermissionTicket categoryPermissionTicket) {
        return this.categoryPermissionTicketRepository.save(categoryPermissionTicket);
    }

    public void delete(Integer id) {
        this.categoryPermissionTicketRepository.deleteById(id);
    }

    public void lock(CategoryPermissionTicket categoryPermissionTicket) {
        this.categoryPermissionTicketRepository.save(categoryPermissionTicket);
    }
}
