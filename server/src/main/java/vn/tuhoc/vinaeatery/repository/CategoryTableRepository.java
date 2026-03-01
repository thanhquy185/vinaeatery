package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.entity.CategoryTable;

@Repository
public interface CategoryTableRepository
        extends JpaRepository<CategoryTable, Integer>, JpaSpecificationExecutor<CategoryTable> {
    // Methods
    CategoryTable findOneById(Integer id);

    void deleteById(Integer id);
}
