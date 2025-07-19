package vn.tuhoc.vinaeatery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tuhoc.vinaeatery.domain.Floor;

@Repository
public interface FloorRepository  extends JpaRepository<Floor, Integer>, JpaSpecificationExecutor<Floor> {
     // Methods
    Floor findOneById(Integer id);

    void deleteById(Integer id);
}
