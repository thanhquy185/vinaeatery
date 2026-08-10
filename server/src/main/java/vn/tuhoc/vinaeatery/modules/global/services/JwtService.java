// package vn.tuhoc.vinaeatery.modules.global.services;

// import java.util.Date;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.stereotype.Service;

// import io.jsonwebtoken.Claims;
// import io.jsonwebtoken.Jwts;

// @Service
// public class JwtService {
//     @Value("${jwt.base64-secret}")
//     private String SECRET_KEY;

//     private String extractUsername(String token) {
//         return extractAllClaims(token).getSubject();
//     }

//     private boolean isTokenValid(String token, UserDetails userDetails) {
//         final String username = this.extractUsername(token);

//         return (username.equals(userDetails.getUsername()) && !this.isTokenExpired(token));
//     }

//     private boolean isTokenExpired(String token) {
//         return this.extractAllClaims(token).getExpiration().before(new Date());
//     }

//     private Claims extractAllClaims(String token) {
//         return Jwts.parser()
//                 .setSigningKey(this.SECRET_KEY)
//                 .parseClaimsJws(token)
//                 .getBody();
//     }
// }
