package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import vn.tuhoc.vinaeatery.domain.enumm.CommonGenderEnum;
import vn.tuhoc.vinaeatery.domain.enumm.EmployeeStatusEnum;

@StaticMetamodel(Employee.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Employee_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Employee#birthday
	 **/
	public static volatile SingularAttribute<Employee, String> birthday;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Employee#image
	 **/
	public static volatile SingularAttribute<Employee, String> image;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Employee#permissionId
	 **/
	public static volatile SingularAttribute<Employee, Integer> permissionId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Employee#address
	 **/
	public static volatile SingularAttribute<Employee, String> address;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Employee#gender
	 **/
	public static volatile SingularAttribute<Employee, CommonGenderEnum> gender;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Employee#updateAt
	 **/
	public static volatile SingularAttribute<Employee, String> updateAt;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Employee#restaurantId
	 **/
	public static volatile SingularAttribute<Employee, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Employee#userId
	 **/
	public static volatile SingularAttribute<Employee, Integer> userId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Employee#createAt
	 **/
	public static volatile SingularAttribute<Employee, String> createAt;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Employee#phone
	 **/
	public static volatile SingularAttribute<Employee, String> phone;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Employee#id
	 **/
	public static volatile SingularAttribute<Employee, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Employee#fullname
	 **/
	public static volatile SingularAttribute<Employee, String> fullname;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Employee
	 **/
	public static volatile EntityType<Employee> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Employee#email
	 **/
	public static volatile SingularAttribute<Employee, String> email;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Employee#status
	 **/
	public static volatile SingularAttribute<Employee, EmployeeStatusEnum> status;

	public static final String BIRTHDAY = "birthday";
	public static final String IMAGE = "image";
	public static final String PERMISSION_ID = "permissionId";
	public static final String ADDRESS = "address";
	public static final String GENDER = "gender";
	public static final String UPDATE_AT = "updateAt";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String USER_ID = "userId";
	public static final String CREATE_AT = "createAt";
	public static final String PHONE = "phone";
	public static final String ID = "id";
	public static final String FULLNAME = "fullname";
	public static final String EMAIL = "email";
	public static final String STATUS = "status";

}

