package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(CategoryInsurance.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class CategoryInsurance_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryInsurance#name
	 **/
	public static volatile SingularAttribute<CategoryInsurance, String> name;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryInsurance#companyPercent
	 **/
	public static volatile SingularAttribute<CategoryInsurance, Float> companyPercent;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryInsurance#description
	 **/
	public static volatile SingularAttribute<CategoryInsurance, String> description;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryInsurance#id
	 **/
	public static volatile SingularAttribute<CategoryInsurance, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryInsurance#restaurantId
	 **/
	public static volatile SingularAttribute<CategoryInsurance, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryInsurance#employeePercent
	 **/
	public static volatile SingularAttribute<CategoryInsurance, Float> employeePercent;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryInsurance
	 **/
	public static volatile EntityType<CategoryInsurance> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.CategoryInsurance#status
	 **/
	public static volatile SingularAttribute<CategoryInsurance, CommonStatusEnum> status;

	public static final String NAME = "name";
	public static final String COMPANY_PERCENT = "companyPercent";
	public static final String DESCRIPTION = "description";
	public static final String ID = "id";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String EMPLOYEE_PERCENT = "employeePercent";
	public static final String STATUS = "status";

}

