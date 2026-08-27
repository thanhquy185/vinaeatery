package vn.tuhoc.vinaeatery.customs;

import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class BearerTokenResolverCustom implements BearerTokenResolver {
    private final BearerTokenResolver delegate = new DefaultBearerTokenResolver();

    @Override
    public String resolve(HttpServletRequest request) {
        String path = request.getServletPath();
        if (path.startsWith("/api/v1/auth/customer/register")
                || path.startsWith("/api/v1/auth/login")
                || path.startsWith("/api/v1/auth/refresh-token")
                || path.startsWith("/api/v1/restaurants/public")
                || path.startsWith("/oauth2/")
                || path.startsWith("/login/oauth2/")) {
            return null;
        }

        return this.delegate.resolve(request);
    }
}
