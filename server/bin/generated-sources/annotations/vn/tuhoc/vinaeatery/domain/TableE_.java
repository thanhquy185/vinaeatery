package vn.tuhoc.vinaeatery.domain;

import jakarta.annotation.Generated;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;
import java.time.LocalDateTime;
import vn.tuhoc.vinaeatery.domain.enumm.CommonStatusEnum;

@StaticMetamodel(TableE.class)
@Generated("org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
public abstract class TableE_ {

	/**
	 * @see vn.tuhoc.vinaeatery.domain.TableE#floorId
	 **/
	public static volatile SingularAttribute<TableE, Integer> floorId;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.TableE#updateAt
	 **/
	public static volatile SingularAttribute<TableE, LocalDateTime> updateAt;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.TableE#name
	 **/
	public static volatile SingularAttribute<TableE, String> name;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.TableE#description
	 **/
	public static volatile SingularAttribute<TableE, String> description;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.TableE#id
	 **/
	public static volatile SingularAttribute<TableE, Integer> id;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.TableE
	 **/
	public static volatile EntityType<TableE> class_;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.TableE#seats
	 **/
	public static volatile SingularAttribute<TableE, Integer> seats;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.TableE#categoryTableId
	 **/
	public static volatile SingularAttribute<TableE, Integer> categoryTableId;

	/**
	 * @see vn.tuhoc.vinaeatery.domain.TableE#status
	 **/
	public static volatile SingularAttribute<TableE, CommonStatusEnum> status;

	public static final String FLOOR_ID = "floorId";
	public static final String TIME_UPDATE = "updateAt";
	public static final String NAME = "name";
	public static final String DESCRIPTION = "description";
	public static final String ID = "id";
	public static final String SEATS = "seats";
	public static final String CATEGORY_TABLE_ID = "categoryTableId";
	public static final String STATUS = "status";

}
