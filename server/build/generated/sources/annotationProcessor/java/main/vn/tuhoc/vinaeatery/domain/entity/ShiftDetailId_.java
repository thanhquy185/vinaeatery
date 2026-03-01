package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EmbeddableType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(ShiftDetailId.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class ShiftDetailId_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.ShiftDetailId#timeEnd
	 **/
	public static volatile SingularAttribute<ShiftDetailId, String> timeEnd;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.ShiftDetailId#shiftId
	 **/
	public static volatile SingularAttribute<ShiftDetailId, Integer> shiftId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.ShiftDetailId#dayOfWeek
	 **/
	public static volatile SingularAttribute<ShiftDetailId, Integer> dayOfWeek;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.ShiftDetailId#timeStart
	 **/
	public static volatile SingularAttribute<ShiftDetailId, String> timeStart;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.ShiftDetailId
	 **/
	public static volatile EmbeddableType<ShiftDetailId> class_;

	public static final String TIME_END = "timeEnd";
	public static final String SHIFT_ID = "shiftId";
	public static final String DAY_OF_WEEK = "dayOfWeek";
	public static final String TIME_START = "timeStart";

}

