package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UserIsUsingEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UserMethodEnum;
import vn.tuhoc.vinaeatery.domain.enumm.UserRoleEnum;

@StaticMetamodel(User.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class User_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.User#password
	 **/
	public static volatile SingularAttribute<User, String> password;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.User#role
	 **/
	public static volatile SingularAttribute<User, UserRoleEnum> role;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.User#method
	 **/
	public static volatile SingularAttribute<User, UserMethodEnum> method;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.User#isUsing
	 **/
	public static volatile SingularAttribute<User, UserIsUsingEnum> isUsing;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.User#updateAt
	 **/
	public static volatile SingularAttribute<User, String> updateAt;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.User#id
	 **/
	public static volatile SingularAttribute<User, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.User
	 **/
	public static volatile EntityType<User> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.User#createAt
	 **/
	public static volatile SingularAttribute<User, String> createAt;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.User#username
	 **/
	public static volatile SingularAttribute<User, String> username;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.User#refreshToken
	 **/
	public static volatile SingularAttribute<User, String> refreshToken;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.User#status
	 **/
	public static volatile SingularAttribute<User, CommonStatusEnum> status;

	public static final String PASSWORD = "password";
	public static final String ROLE = "role";
	public static final String METHOD = "method";
	public static final String IS_USING = "isUsing";
	public static final String UPDATE_AT = "updateAt";
	public static final String ID = "id";
	public static final String CREATE_AT = "createAt";
	public static final String USERNAME = "username";
	public static final String REFRESH_TOKEN = "refreshToken";
	public static final String STATUS = "status";

}

