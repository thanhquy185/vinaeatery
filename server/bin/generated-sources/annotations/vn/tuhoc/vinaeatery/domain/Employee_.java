package vn.tuhoc.vinaeatery.domain;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(Employee.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Employee_ {

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Employee#birthday
	 **/
	public static volatile SingularAttribute<Employee, String> birthday;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Employee#image
	 **/
	public static volatile SingularAttribute<Employee, String> image;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Employee#address
	 **/
	public static volatile SingularAttribute<Employee, String> address;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Employee#gender
	 **/
	public static volatile SingularAttribute<Employee, String> gender;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Employee#updateAt
	 **/
	public static volatile SingularAttribute<Employee, LocalDateTime> updateAt;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Employee#dateEnd
	 **/
	public static volatile SingularAttribute<Employee, String> dateEnd;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Employee#dateStart
	 **/
	public static volatile SingularAttribute<Employee, String> dateStart;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Employee#password
	 **/
	public static volatile SingularAttribute<Employee, String> password;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Employee#phone
	 **/
	public static volatile SingularAttribute<Employee, String> phone;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Employee#id
	 **/
	public static volatile SingularAttribute<Employee, Integer> id;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Employee#fullname
	 **/
	public static volatile SingularAttribute<Employee, String> fullname;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Employee
	 **/
	public static volatile EntityType<Employee> class_;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Employee#email
	 **/
	public static volatile SingularAttribute<Employee, String> email;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Employee#username
	 **/
	public static volatile SingularAttribute<Employee, String> username;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Employee#refreshToken
	 **/
	public static volatile SingularAttribute<Employee, String> refreshToken;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.Employee#status
	 **/
	public static volatile SingularAttribute<Employee, CommonStatusEnum> status;

	public static final String BIRTHDAY = "birthday";
	public static final String IMAGE = "image";
	public static final String ADDRESS = "address";
	public static final String GENDER = "gender";
	public static final String TIME_UPDATE = "updateAt";
	public static final String DATE_END = "dateEnd";
	public static final String DATE_BEGIN = "dateStart";
	public static final String PASSWORD = "password";
	public static final String PHONE = "phone";
	public static final String ID = "id";
	public static final String FULLNAME = "fullname";
	public static final String EMAIL = "email";
	public static final String USERNAME = "username";
	public static final String REFRESH_TOKEN = "refreshToken";
	public static final String STATUS = "status";

}
