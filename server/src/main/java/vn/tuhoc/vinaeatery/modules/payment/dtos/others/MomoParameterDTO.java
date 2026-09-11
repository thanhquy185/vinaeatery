package vn.tuhoc.vinaeatery.modules.payment.dtos.others;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PUBLIC)
public class MomoParameterDTO {
    static String PARTNER_CODE = "partnerCode";

    static String PARTNER_CLIENT_ID = "partnerClientId";

    static String CALLBACK_TOKEN = "callbackToken";

    static String DESCRIPTION = "description";

    static String ACCESS_KEY = "accessKey";

    static String REQUEST_ID = "requestId";

    static String AMOUNT = "amount";

    static String ORDER_ID = "orderId";

    static String ORDER_INFO = "orderInfo";

    static String REQUEST_TYPE = "requestType";

    static String EXTRA_DATA = "extraData";

    static String MESSAGE = "message";

    static String PAY_URL = "payUrl";

    static String RESULT_CODE = "resultCode";

    static String REDIRECT_URL = "redirectUrl";

    static String IPN_URL = "ipnUrl";

    static String TOKEN = "token";

    static String TRANS_ID = "transId";
}
