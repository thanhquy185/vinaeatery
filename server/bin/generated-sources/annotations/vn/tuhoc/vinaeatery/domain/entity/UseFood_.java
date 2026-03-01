package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;
import vn.tuhoc.vinaeatery.domain.enumm.UseFoodStatusEnum;

@StaticMetamodel(UseFood.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class UseFood_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.UseFood#timeEnd
	 **/
	public static volatile SingularAttribute<UseFood, LocalDateTime> timeEnd;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.UseFood#timeStart
	 **/
	public static volatile SingularAttribute<UseFood, LocalDateTime> timeStart;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.UseFood#foodId
	 **/
	public static volatile SingularAttribute<UseFood, Integer> foodId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.UseFood#employeeId
	 **/
	public static volatile SingularAttribute<UseFood, Integer> employeeId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.UseFood#id
	 **/
	public static volatile SingularAttribute<UseFood, Long> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.UseFood#restaurantId
	 **/
	public static volatile SingularAttribute<UseFood, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.UseFood
	 **/
	public static volatile EntityType<UseFood> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.UseFood#status
	 **/
	public static volatile SingularAttribute<UseFood, UseFoodStatusEnum> status;

	public static final String TIME_END = "timeEnd";
	public static final String TIME_START = "timeStart";
	public static final String FOOD_ID = "foodId";
	public static final String EMPLOYEE_ID = "employeeId";
	public static final String ID = "id";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String STATUS = "status";

}

