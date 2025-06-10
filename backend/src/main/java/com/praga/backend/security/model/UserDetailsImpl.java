package com.praga.backend.security.model;

import lombok.Builder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

@Builder
public class UserDetailsImpl implements UserDetails {
    private String username;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;

    /*public static UserDetailsImpl build(Employee employee) {
        List<GrantedAuthority> authorities = new ArrayList<>();

        Rol rol = employee.getRol();
        authorities.add(new SimpleGrantedAuthority(rol.getRol().name()));

        return UserDetailsImpl.builder()
                .username(employee.getEmail())
                .password(employee.getPassword())
                .authorities(authorities)
                .build();
    }*/

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
}
