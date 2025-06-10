package com.praga.backend.kernel;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.apache.tomcat.websocket.AuthenticationException;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.validation.BindingResult;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingPathVariableException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
public class CustomExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleException(Exception ex) {
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.ERROR, "Error en el servidor"),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<String>> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        BindingResult bindingResult = ex.getBindingResult();
        String message = bindingResult.getFieldErrors().stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .reduce("", (acc, error) -> acc + error + ". ");
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.ERROR, message),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(MissingRequestHeaderException.class)
    public ResponseEntity<ApiResponse<String>> handleMissingRequestHeaderException(MissingRequestHeaderException ex) {
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.ERROR, "El token es requerido: " + ex.getHeaderName()),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<String>> handleAccessDeniedException(AccessDeniedException ex) {
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.ERROR, "No tienes permisos para acceder a esta ruta"),
                HttpStatus.FORBIDDEN
        );
    }

    @ExceptionHandler(SignatureException.class)
    public ResponseEntity<ApiResponse<String>> handleSignatureException(SignatureException ex) {
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.ERROR, "El token es inválido"),
                HttpStatus.UNAUTHORIZED
        );
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ApiResponse<String>> handleExpiredJwtException(ExpiredJwtException ex) {
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.ERROR, "El token ha expirado"),
                HttpStatus.UNAUTHORIZED
        );
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<String>> handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException ex) {
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.ERROR, "El método " + ex.getMethod() + " no está permitido en esta ruta"),
                HttpStatus.METHOD_NOT_ALLOWED
        );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<String>> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.ERROR, "El cuerpo de la petición no es válido"),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiResponse<String>> handleNoResourceFoundException(NoResourceFoundException ex) {
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.ERROR, "El recurso solicitado no ha sido encontrado"),
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(MissingPathVariableException.class)
    public ResponseEntity<ApiResponse<String>> handleMissingPathVariableException(MissingPathVariableException ex) {
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.ERROR, "El parámetro " + ex.getVariableName() + " es requerido"),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ApiResponse<String>> handleJwtException(JwtException ex) {
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.ERROR, "El token no es válido"),
                HttpStatus.UNAUTHORIZED
        );
    }

    @ExceptionHandler(MalformedJwtException.class)
    public ResponseEntity<ApiResponse<String>> handleMalformedJwtException(MalformedJwtException ex) {
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.ERROR, "El token está mal formado"),
                HttpStatus.UNAUTHORIZED
        );
    }

    @ExceptionHandler(UnsupportedJwtException.class)
    public ResponseEntity<ApiResponse<String>> handleUnsupportedJwtException(UnsupportedJwtException ex) {
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.ERROR, "El token no es soportado"),
                HttpStatus.UNAUTHORIZED
        );
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<String>> handleAuthenticationException(AuthenticationException ex) {
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.ERROR, "No estás autenticado"),
                HttpStatus.UNAUTHORIZED
        );
    }

    @ExceptionHandler(InsufficientAuthenticationException.class)
    public ResponseEntity<ApiResponse<String>> handleInsufficientAuthenticationException(InsufficientAuthenticationException ex) {
        return new ResponseEntity<>(
                new ApiResponse<>(null, TypesResponse.ERROR, "No tienes permisos para acceder a esta ruta"),
                HttpStatus.UNAUTHORIZED
        );
    }
}
