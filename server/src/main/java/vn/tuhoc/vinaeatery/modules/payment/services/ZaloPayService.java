package vn.tuhoc.vinaeatery.modules.payment.services;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import vn.tuhoc.vinaeatery.modules.payment.domains.entities.PaymentMachineEntity;
import vn.tuhoc.vinaeatery.modules.payment.dtos.others.ZaloPayPropertiesDTO;
import vn.tuhoc.vinaeatery.modules.payment.exceptions.ZaloPayTransactionInavailableException;
import vn.zalopay.crypto.HMACUtil;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.TimeZone;

@Service
@RequiredArgsConstructor
@Transactional
public class ZaloPayService {
    private final ZaloPayPropertiesDTO zaloPayPropertiesDTO;
    private final PaymentMachineService paymentMachineService;

    private String getCurrentDateYYMMDD() {
        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("GMT+7"));
        java.text.SimpleDateFormat fmt = new java.text.SimpleDateFormat("yyMMdd");
        fmt.setCalendar(cal);
        return fmt.format(cal.getTime());
    }

    public JSONObject handleCreateOrder(Integer paymentMachineId) throws Exception {
        PaymentMachineEntity paymentMachineEntity = this.paymentMachineService.getOneById(paymentMachineId);

        String appTransID = getCurrentDateYYMMDD() + "_" + new Random().nextInt(1000000);
        Long appTime = System.currentTimeMillis();
        String appUser = "user123";
        JSONObject embedData = new JSONObject();
        // embedData.put("zlppaymentid", "P271021");
        JSONArray items = new JSONArray();
        // JSONObject item = new JSONObject();
        // item.put("itemid", "knb");
        // item.put("itemname", "kim nguyen bao");
        // item.put("itemprice", 50000);
        // item.put("itemquantity", 1);
        // items.put(item);
        String description = "Thanh toán hoá đơn " + appTransID;
        Long amount = paymentMachineEntity.getTotalPrice();

        // Tạo mac
        String macData = String.join("|",
                this.zaloPayPropertiesDTO.getAppId(),
                appTransID,
                appUser,
                String.valueOf(amount),
                String.valueOf(appTime),
                embedData.toString(),
                items.toString());
        String mac = HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256, this.zaloPayPropertiesDTO.getKey1(), macData);

        // Tạo form params
        Map<String, String> paramsMap = new LinkedHashMap<>();
        paramsMap.put("app_id", this.zaloPayPropertiesDTO.getAppId());
        paramsMap.put("app_trans_id", appTransID);
        paramsMap.put("app_user", appUser);
        paramsMap.put("app_time", String.valueOf(appTime));
        paramsMap.put("item", items.toString());
        paramsMap.put("embed_data", embedData.toString());
        paramsMap.put("amount", String.valueOf(amount));
        paramsMap.put("description", description);
        paramsMap.put("bank_code", "");
        paramsMap.put("callback_url", this.zaloPayPropertiesDTO.getCallbackUrl());
        paramsMap.put("mac", mac);

        // Gửi POST
        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost post = new HttpPost(this.zaloPayPropertiesDTO.getEndpoint()); // endpoint + create
        List<NameValuePair> params = new ArrayList<>();
        for (Map.Entry<String, String> e : paramsMap.entrySet()) {
            params.add(new BasicNameValuePair(e.getKey(), e.getValue()));
        }
        post.setEntity(new UrlEncodedFormEntity(params, "UTF-8"));

        CloseableHttpResponse response = client.execute(post);
        BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
        StringBuilder resultJsonStr = new StringBuilder();
        String line;
        while ((line = rd.readLine()) != null) {
            resultJsonStr.append(line);
        }
        client.close();

        paymentMachineEntity.setPaymentId(appTransID);

        JSONObject resultJson = new JSONObject(resultJsonStr.toString());
        resultJson.put("app_trans_id", appTransID);
        resultJson.put("app_time", appTime);
        resultJson.put("amount", amount);

        return resultJson;
    }

    public void handleCallbackOrder(Map<String, String> payload) {
        System.out.println("============================== 1478127412");
        String data = payload.get("data");
        String mac = payload.get("mac");
        boolean isValid = HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256, this.zaloPayPropertiesDTO.getKey2(), data)
                .equals(mac);
        if (!isValid) {
            throw new ZaloPayTransactionInavailableException();
        }

        JSONObject dataJson = new JSONObject(data);
        String appTransId = dataJson.getString("app_trans_id");
        Long amount = dataJson.getLong("amount");

        this.paymentMachineService.handleUpdateByWallet(appTransId, amount, 5);
    }
}
