package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EmbeddableType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(ScheduleEmployeeId.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class ScheduleEmployeeId_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.ScheduleEmployeeId#employeeId
	 **/
	public static volatile SingularAttribute<ScheduleEmployeeId, Integer> employeeId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.ScheduleEmployeeId
	 **/
	public static volatile EmbeddableType<ScheduleEmployeeId> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.ScheduleEmployeeId#scheduleId
	 **/
	public static volatile SingularAttribute<ScheduleEmployeeId, Integer> scheduleId;

	public static final String EMPLOYEE_ID = "employeeId";
	public static final String SCHEDULE_ID = "scheduleId";

}

