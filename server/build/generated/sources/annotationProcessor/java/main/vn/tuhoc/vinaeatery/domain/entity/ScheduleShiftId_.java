package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EmbeddableType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(ScheduleShiftId.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class ScheduleShiftId_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.ScheduleShiftId#shiftId
	 **/
	public static volatile SingularAttribute<ScheduleShiftId, Integer> shiftId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.ScheduleShiftId
	 **/
	public static volatile EmbeddableType<ScheduleShiftId> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.ScheduleShiftId#scheduleId
	 **/
	public static volatile SingularAttribute<ScheduleShiftId, Integer> scheduleId;

	public static final String SHIFT_ID = "shiftId";
	public static final String SCHEDULE_ID = "scheduleId";

}

