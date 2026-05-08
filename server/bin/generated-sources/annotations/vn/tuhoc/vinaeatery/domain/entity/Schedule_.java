package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(Schedule.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Schedule_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Schedule#note
	 **/
	public static volatile SingularAttribute<Schedule, String> note;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Schedule#dateStart
	 **/
	public static volatile SingularAttribute<Schedule, String> dateStart;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Schedule#name
	 **/
	public static volatile SingularAttribute<Schedule, String> name;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Schedule#id
	 **/
	public static volatile SingularAttribute<Schedule, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Schedule#dateEnd
	 **/
	public static volatile SingularAttribute<Schedule, String> dateEnd;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Schedule#restaurantId
	 **/
	public static volatile SingularAttribute<Schedule, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Schedule
	 **/
	public static volatile EntityType<Schedule> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Schedule#status
	 **/
	public static volatile SingularAttribute<Schedule, CommonStatusEnum> status;

	public static final String NOTE = "note";
	public static final String DATE_START = "dateStart";
	public static final String NAME = "name";
	public static final String ID = "id";
	public static final String DATE_END = "dateEnd";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String STATUS = "status";

}

