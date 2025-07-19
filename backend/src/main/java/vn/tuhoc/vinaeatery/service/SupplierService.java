package vn.tuhoc.vinaeatery.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import vn.tuhoc.vinaeatery.domain.Supplier_;
import vn.tuhoc.vinaeatery.domain.Supplier;
import vn.tuhoc.vinaeatery.domain.criteria.SupplierCriteria;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.repository.SupplierRepository;
import vn.tuhoc.vinaeatery.service.specification.SupplierSpecification;

@Service
@AllArgsConstructor
public class SupplierService {
    // Properties
    private final SupplierRepository supplierRepository;

    // Methods
    public Supplier getOneById(Integer id) {
        return this.supplierRepository.findOneById(id);
    }

    public List<Supplier> getAll() {
        return this.supplierRepository.findAll();
    }

    public List<Supplier> getAll(SupplierCriteria supplierCriteria) {
        //
        Sort sort = Sort.unsorted();
        if (supplierCriteria.getSort() != null && supplierCriteria.getSort().isPresent()) {
            String sortStr = supplierCriteria.getSort().get();
            switch (sortStr) {
                case "Mã nhà cung cấp tăng dần" -> sort = Sort.by(Supplier_.ID).ascending();
                case "Mã nhà cung cấp giảm dần" -> sort = Sort.by(Supplier_.ID).descending();
                case "Tên nhà cung cấp tăng dần" -> sort = Sort.by(Supplier_.NAME).ascending();
                case "Tên nhà cung cấp giảm dần" -> sort = Sort.by(Supplier_.NAME).descending();
            }
        }

        //
        if (supplierCriteria.getId() == null && supplierCriteria.getName() == null
                && supplierCriteria.getPhone() == null && supplierCriteria.getEmail() == null
                && supplierCriteria.getStatus() == null && supplierCriteria.getSort() == null) {
            return this.supplierRepository.findAll(sort);
        }
        //
        Specification<Supplier> combinedSpec = Specification.where(null);
        if (supplierCriteria.getId() != null && supplierCriteria.getId().isPresent()) {
            if (supplierCriteria.getId().get().matches("\\d+")) {
                Specification<Supplier> currentSpec = SupplierSpecification.idEqual(supplierCriteria.getId().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (supplierCriteria.getName() != null && supplierCriteria.getName().isPresent()) {
            Specification<Supplier> currentSpec = SupplierSpecification.nameLike(supplierCriteria.getName().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (supplierCriteria.getPhone() != null && supplierCriteria.getPhone().isPresent()) {
            if (supplierCriteria.getPhone().get().matches("\\d+")) {
                Specification<Supplier> currentSpec = SupplierSpecification
                        .phoneLike(supplierCriteria.getPhone().get());
                combinedSpec = combinedSpec.or(currentSpec);
            }
        }
        if (supplierCriteria.getEmail() != null && supplierCriteria.getEmail().isPresent()) {
            Specification<Supplier> currentSpec = SupplierSpecification.emailLike(supplierCriteria.getEmail().get());
            combinedSpec = combinedSpec.or(currentSpec);
        }
        if (supplierCriteria.getStatus() != null && supplierCriteria.getStatus().isPresent()) {
            String statusString = supplierCriteria.getStatus().get();
            Boolean statusBoolean = false;
            for (CommonStatusEnum commonStatus : CommonStatusEnum.values()) {
                if (commonStatus.getDescription().equals(statusString)) {
                    statusBoolean = commonStatus.getValue();
                    break;
                }
            }
            Specification<Supplier> currentSpec = SupplierSpecification.statusEqual(statusBoolean);
            combinedSpec = combinedSpec.and(currentSpec);
        }

        return this.supplierRepository.findAll(combinedSpec, sort);
    }

    public Supplier upsert(Supplier supplier) {
        return this.supplierRepository.save(supplier);
    }

    public void delete(Integer id) {
        this.supplierRepository.deleteById(id);
    }

    public void lock(Supplier supplier) {
        this.supplierRepository.save(supplier);
    }
}