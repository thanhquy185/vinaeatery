package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import vn.tuhoc.vinaeatery.domain.enumm.CommonGenderEnum;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(Manager.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class Manager_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Manager#birthday
	 **/
	public static volatile SingularAttribute<Manager, String> birthday;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Manager#image
	 **/
	public static volatile SingularAttribute<Manager, String> image;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Manager#address
	 **/
	public static volatile SingularAttribute<Manager, String> address;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Manager#gender
	 **/
	public static volatile SingularAttribute<Manager, CommonGenderEnum> gender;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Manager#description
	 **/
	public static volatile SingularAttribute<Manager, String> description;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Manager#userId
	 **/
	public static volatile SingularAttribute<Manager, Integer> userId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Manager#createAt
	 **/
	public static volatile SingularAttribute<Manager, String> createAt;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Manager#phone
	 **/
	public static volatile SingularAttribute<Manager, String> phone;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Manager#id
	 **/
	public static volatile SingularAttribute<Manager, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Manager#fullname
	 **/
	public static volatile SingularAttribute<Manager, String> fullname;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Manager
	 **/
	public static volatile EntityType<Manager> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Manager#email
	 **/
	public static volatile SingularAttribute<Manager, String> email;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.Manager#status
	 **/
	public static volatile SingularAttribute<Manager, CommonStatusEnum> status;

	public static final String BIRTHDAY = "birthday";
	public static final String IMAGE = "image";
	public static final String ADDRESS = "address";
	public static final String GENDER = "gender";
	public static final String DESCRIPTION = "description";
	public static final String USER_ID = "userId";
	public static final String CREATE_AT = "createAt";
	public static final String PHONE = "phone";
	public static final String ID = "id";
	public static final String FULLNAME = "fullname";
	public static final String EMAIL = "email";
	public static final String STATUS = "status";

}

