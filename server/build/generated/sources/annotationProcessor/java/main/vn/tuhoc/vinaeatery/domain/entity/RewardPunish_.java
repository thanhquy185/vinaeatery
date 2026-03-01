package vn.tuhoc.vinaeatery.domain.entity;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import vn.tuhoc.vinaeatery.domain.enumm.RewardPunishStatusEnum;

@StaticMetamodel(RewardPunish.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class RewardPunish_ {

	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.RewardPunish#date
	 **/
	public static volatile SingularAttribute<RewardPunish, String> date;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.RewardPunish#reason
	 **/
	public static volatile SingularAttribute<RewardPunish, String> reason;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.RewardPunish#categoryRewardPunishId
	 **/
	public static volatile SingularAttribute<RewardPunish, Integer> categoryRewardPunishId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.RewardPunish#money
	 **/
	public static volatile SingularAttribute<RewardPunish, Long> money;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.RewardPunish#employeeMainId
	 **/
	public static volatile SingularAttribute<RewardPunish, Integer> employeeMainId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.RewardPunish#id
	 **/
	public static volatile SingularAttribute<RewardPunish, Integer> id;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.RewardPunish#employeeHandleId
	 **/
	public static volatile SingularAttribute<RewardPunish, Integer> employeeHandleId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.RewardPunish#restaurantId
	 **/
	public static volatile SingularAttribute<RewardPunish, Integer> restaurantId;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.RewardPunish
	 **/
	public static volatile EntityType<RewardPunish> class_;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.RewardPunish#createAt
	 **/
	public static volatile SingularAttribute<RewardPunish, String> createAt;
	
	/**
	 * @see vn.tuhoc.vinaeatery.domain.entity.RewardPunish#status
	 **/
	public static volatile SingularAttribute<RewardPunish, RewardPunishStatusEnum> status;

	public static final String DATE = "date";
	public static final String REASON = "reason";
	public static final String CATEGORY_REWARD_PUNISH_ID = "categoryRewardPunishId";
	public static final String MONEY = "money";
	public static final String EMPLOYEE_MAIN_ID = "employeeMainId";
	public static final String ID = "id";
	public static final String EMPLOYEE_HANDLE_ID = "employeeHandleId";
	public static final String RESTAURANT_ID = "restaurantId";
	public static final String CREATE_AT = "createAt";
	public static final String STATUS = "status";

}

