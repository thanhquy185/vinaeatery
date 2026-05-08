package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EmbeddableType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(InsuranceDetailId.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class InsuranceDetailId_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.InsuranceDetailId#categoryInsuranceId
	 **/
	public static volatile SingularAttribute<InsuranceDetailId, Integer> categoryInsuranceId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.InsuranceDetailId#insuranceId
	 **/
	public static volatile SingularAttribute<InsuranceDetailId, Integer> insuranceId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.InsuranceDetailId#employeeId
	 **/
	public static volatile SingularAttribute<InsuranceDetailId, Integer> employeeId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.InsuranceDetailId
	 **/
	public static volatile EmbeddableType<InsuranceDetailId> class_;

	public static final String CATEGORY_INSURANCE_ID = "categoryInsuranceId";
	public static final String INSURANCE_ID = "insuranceId";
	public static final String EMPLOYEE_ID = "employeeId";

}

