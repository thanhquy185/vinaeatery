package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EmbeddableType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(AllowanceDetailId.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class AllowanceDetailId_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.AllowanceDetailId#getEmployeeId
	 **/
	public static volatile SingularAttribute<AllowanceDetailId, Integer> employeeId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.AllowanceDetailId
	 **/
	public static volatile EmbeddableType<AllowanceDetailId> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.AllowanceDetailId#getCategoryAllowanceId
	 **/
	public static volatile SingularAttribute<AllowanceDetailId, Integer> categoryAllowanceId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.AllowanceDetailId#getAllowanceId
	 **/
	public static volatile SingularAttribute<AllowanceDetailId, Integer> allowanceId;

	public static final String EMPLOYEE_ID = "employeeId";
	public static final String CATEGORY_ALLOWANCE_ID = "categoryAllowanceId";
	public static final String ALLOWANCE_ID = "allowanceId";

}

