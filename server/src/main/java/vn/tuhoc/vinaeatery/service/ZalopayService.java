package vn.tuhoc.vinaeatery.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
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
import java.util.*;

@Service
@RequiredArgsConstructor
public class ZalopayService {
    // Values
    @Value("${zalopay.appid}")
    private String appId;
    @Value("${zalopay.key1}")
    private String key1;
    @Value("${zalopay.endpoint}")
    private String endpoint;
    @Value("${zalopay.callback-url}")
    private String callbackUrl;
    // Properties
    private final HandlePaymentService handlePaymentService;

    // Methods
    private String getCurrentDateYYMMDD() {
        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("GMT+7"));
        java.text.SimpleDateFormat fmt = new java.text.SimpleDateFormat("yyMMdd");
        fmt.setCalendar(cal);
        return fmt.format(cal.getTime());
    }
    
    public JSONObject handleCreateOrder(Integer handlePaymentId) throws Exception {
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
        Long amount = handlePaymentService.getOneFormatById(handlePaymentId).getPayTotalPrice();

        // Tạo mac
        String macData = String.join("|",
                appId,
                appTransID,
                appUser,
                String.valueOf(amount),
                String.valueOf(appTime),
                embedData.toString(),
                items.toString());
        String mac = HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256, key1, macData);

        // Tạo form params
        Map<String, String> paramsMap = new LinkedHashMap<>();
        paramsMap.put("app_id", appId);
        paramsMap.put("app_trans_id", appTransID);
        paramsMap.put("app_user", appUser);
        paramsMap.put("app_time", String.valueOf(appTime));
        paramsMap.put("item", items.toString());
        paramsMap.put("embed_data", embedData.toString());
        paramsMap.put("amount", String.valueOf(amount));
        paramsMap.put("description", description);
        paramsMap.put("bank_code", "zalopayapp");
        paramsMap.put("callback_url", callbackUrl);
        paramsMap.put("mac", mac);

        // Gửi POST
        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost post = new HttpPost(endpoint); // endpoint + create
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

        // 
        JSONObject resultJson = new JSONObject(resultJsonStr.toString());
        resultJson.put("app_trans_id", appTransID);
        resultJson.put("app_time", appTime);
        resultJson.put("amount", amount);

        return resultJson;
    }
}
