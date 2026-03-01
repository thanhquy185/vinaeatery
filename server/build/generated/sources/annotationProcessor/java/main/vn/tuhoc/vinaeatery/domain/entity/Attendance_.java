package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import vn.tuhoc.vinaeatery.domain.enumm.AttendanceLeaveEnum;
import vn.tuhoc.vinaeatery.domain.enumm.AttendanceStatusEnum;

@StaticMetamodel(Attendance.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Attendance_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Attendance#date
	 **/
	public static volatile SingularAttribute<Attendance, String> date;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Attendance#shiftId
	 **/
	public static volatile SingularAttribute<Attendance, Integer> shiftId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Attendance#checkIn
	 **/
	public static volatile SingularAttribute<Attendance, String> checkIn;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Attendance#leave
	 **/
	public static volatile SingularAttribute<Attendance, AttendanceLeaveEnum> leave;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Attendance#employeeId
	 **/
	public static volatile SingularAttribute<Attendance, Integer> employeeId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Attendance#id
	 **/
	public static volatile SingularAttribute<Attendance, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Attendance#restaurantId
	 **/
	public static volatile SingularAttribute<Attendance, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Attendance#checkOut
	 **/
	public static volatile SingularAttribute<Attendance, String> checkOut;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Attendance
	 **/
	public static volatile EntityType<Attendance> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Attendance#status
	 **/
	public static volatile SingularAttribute<Attendance, AttendanceStatusEnum> status;

	public static final String DATE = "date";
	public static final String SHIFT_ID = "shiftId";
	public static final String CHECK_IN = "checkIn";
	public static final String LEAVE = "leave";
	public static final String EMPLOYEE_ID = "employeeId";
	public static final String ID = "id";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String CHECK_OUT = "checkOut";
	public static final String STATUS = "status";

}

