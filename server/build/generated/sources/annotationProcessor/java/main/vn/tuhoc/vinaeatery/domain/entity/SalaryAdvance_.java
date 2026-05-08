package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import vn.tuhoc.vinaeatery.domain.enumm.SalaryAdvanceStatusEnum;

@StaticMetamodel(SalaryAdvance.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class SalaryAdvance_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.SalaryAdvance#date
	 **/
	public static volatile SingularAttribute<SalaryAdvance, String> date;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.SalaryAdvance#reason
	 **/
	public static volatile SingularAttribute<SalaryAdvance, String> reason;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.SalaryAdvance#money
	 **/
	public static volatile SingularAttribute<SalaryAdvance, Long> money;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.SalaryAdvance#employeeMainId
	 **/
	public static volatile SingularAttribute<SalaryAdvance, Integer> employeeMainId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.SalaryAdvance#id
	 **/
	public static volatile SingularAttribute<SalaryAdvance, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.SalaryAdvance#employeeHandleId
	 **/
	public static volatile SingularAttribute<SalaryAdvance, Integer> employeeHandleId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.SalaryAdvance#restaurantId
	 **/
	public static volatile SingularAttribute<SalaryAdvance, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.SalaryAdvance
	 **/
	public static volatile EntityType<SalaryAdvance> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.SalaryAdvance#createAt
	 **/
	public static volatile SingularAttribute<SalaryAdvance, String> createAt;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.SalaryAdvance#status
	 **/
	public static volatile SingularAttribute<SalaryAdvance, SalaryAdvanceStatusEnum> status;

	public static final String DATE = "date";
	public static final String REASON = "reason";
	public static final String MONEY = "money";
	public static final String EMPLOYEE_MAIN_ID = "employeeMainId";
	public static final String ID = "id";
	public static final String EMPLOYEE_HANDLE_ID = "employeeHandleId";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String CREATE_AT = "createAt";
	public static final String STATUS = "status";

}

