package vn.tuhoc.vinaeatery.configs;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.util.Base64;

import vn.tuhoc.vinaeatery.customs.AccessDeniedHandlerCustom;
import vn.tuhoc.vinaeatery.customs.AuthenticationEntryPointCustom;
import vn.tuhoc.vinaeatery.customs.BearerTokenResolverCustom;
import vn.tuhoc.vinaeatery.customs.JwtAuthenticationConverterCustom;
import vn.tuhoc.vinaeatery.customs.OAuth2FailureHandlerCustom;
import vn.tuhoc.vinaeatery.customs.OAuth2SuccessHandlerCustom;
import vn.tuhoc.vinaeatery.customs.OAuth2UserServiceCustom;
import vn.tuhoc.vinaeatery.customs.UserDetailsServiceCustom;
import vn.tuhoc.vinaeatery.customs.JwtAuthenticationFilterCustom;
import vn.tuhoc.vinaeatery.utils.SecurityUtil;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    @Value("${jwt.base64-secret}")
    private String jwtKey;
    private final UserDetailsServiceCustom userDetailsServiceCustom;

    SecurityConfig(UserDetailsServiceCustom userDetailsServiceCustom) {
        this.userDetailsServiceCustom = userDetailsServiceCustom;
    }

    private SecretKey getSecretKey() {
        byte[] keyBytes = Base64.from(jwtKey).decode();

        return new SecretKeySpec(keyBytes, 0, keyBytes.length, SecurityUtil.JWT_ALGORITHM.getName());
    }

    @Bean
    public JwtEncoder jwtEncoder() {
        return new NimbusJwtEncoder(new ImmutableSecret<>(this.getSecretKey()));
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(
                this.getSecretKey()).macAlgorithm(SecurityUtil.JWT_ALGORITHM).build();

        return token -> {
            try {
                return jwtDecoder.decode(token);
            } catch (Exception e) {
                System.out.println(">>> JWT error: " + e.getMessage());
                throw e;
            }
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(this.userDetailsServiceCustom);
        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity.getSharedObject(AuthenticationManagerBuilder.class)
                .authenticationProvider(this.authenticationProvider())
                .build();
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            AuthorizationConfig authorizationConfig,
            AuthenticationEntryPointCustom authenticationEntryPointCustom,
            AccessDeniedHandlerCustom accessDeniedHandlerCustom,
            JwtAuthenticationFilterCustom jwtAuthenticationFilterCustom,
            JwtAuthenticationConverterCustom jwtAuthenticationConverterCustom,
            BearerTokenResolverCustom bearerTokenResolverCustom,
            OAuth2UserServiceCustom oAuth2UserServiceCustom,
            OAuth2SuccessHandlerCustom oAuth2SuccessHandlerCustom,
            OAuth2FailureHandlerCustom oAuth2FailureHandlerCustom) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)

                .cors(Customizer.withDefaults())

                .authorizeHttpRequests(authorizationConfig::configure)

                .formLogin(f -> f.disable())

                .addFilterBefore(jwtAuthenticationFilterCustom, UsernamePasswordAuthenticationFilter.class)

                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(authenticationEntryPointCustom)
                        .accessDeniedHandler(accessDeniedHandlerCustom))

                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo.userService(oAuth2UserServiceCustom))
                        .successHandler(oAuth2SuccessHandlerCustom)
                        .failureHandler(oAuth2FailureHandlerCustom))
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverterCustom))
                        .bearerTokenResolver(bearerTokenResolverCustom)
                        .authenticationEntryPoint(authenticationEntryPointCustom))

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

}