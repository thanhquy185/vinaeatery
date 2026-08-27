package vn.tuhoc.vinaeatery.configs;

import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.stereotype.Component;

@Component
public class AuthorizationConfig {
        public void configure(
                        AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizationManagerRequestMatcherRegistry auth) {
                auth.requestMatchers(
                                "/",
                                "/api/v1/auth/customer/register",
                                "/api/v1/auth/login",
                                "/api/v1/auth/refresh-token",
                                "/api/v1/restaurants/public",
                                "/api/v1/restaurants/public/*",
                                "/api/v1/momo/**",
                                "/api/v1/zalopay/**",
                                "/websocket/**",
                                "/oauth2/**",
                                "/login/oauth2/**").permitAll();

                auth.requestMatchers(
                                HttpMethod.GET,
                                "/api/v1/restaurants/manager/*")
                                .hasRole("MANAGER");

                auth.requestMatchers(
                                HttpMethod.GET,
                                "/api/v1/bills/customer/*")
                                .hasRole("CUSTOMER");
                auth.requestMatchers(
                                HttpMethod.POST,
                                "/api/v1/order-sheets")
                                .hasRole("CUSTOMER");
                auth.requestMatchers(
                                HttpMethod.GET,
                                "/api/v1/reservations/customer")
                                .hasRole("CUSTOMER");
                auth.requestMatchers(
                                HttpMethod.POST,
                                "/api/v1/reservations/customer")
                                .hasRole("CUSTOMER");
                auth.requestMatchers(
                                HttpMethod.DELETE,
                                "/api/v1/reservations/customer/**")
                                .hasRole("CUSTOMER");

                auth.requestMatchers(
                                "/api/v1/restaurants/**",
                                "/api/v1/managers/**",
                                "/api/v1/customers/**")
                                .hasRole("ADMIN");

                auth.requestMatchers(
                                "/api/v1/dashboard-profit/**",
                                "/api/v1/dashboard-revenue/**",
                                "/api/v1/dashboard-expense/**",
                                "/api/v1/dashboard-feedback/**",
                                "/api/v1/use-tables/**",
                                "/api/v1/use-foods/**",
                                "/api/v1/menus/**",
                                "/api/v1/messages/**",
                                "/api/v1/order-sheets/**",
                                "/api/v1/bills/**",
                                "/api/v1/reservations/**",
                                "/api/v1/floors/**",
                                "/api/v1/category-tables/**",
                                "/api/v1/tables/**",
                                "/api/v1/input-tickets/**",
                                "/api/v1/suppliers/**",
                                "/api/v1/category-ingredients/**",
                                "/api/v1/ingredients/**",
                                "/api/v1/category-foods/**",
                                "/api/v1/foods/**",
                                "/api/v1/functions/**",
                                "/api/v1/roles/**",
                                "/api/v1/permissions/**",
                                "/api/v1/employees/**")
                                .hasAnyRole("MANAGER", "EMPLOYEE");

                auth.anyRequest().authenticated();
        }
}
