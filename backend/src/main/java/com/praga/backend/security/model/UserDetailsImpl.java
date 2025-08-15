package com.praga.backend.security.model;

import com.praga.backend.modules.projects.model.ProjectUser;
import com.praga.backend.modules.users.model.Role;
import com.praga.backend.modules.users.model.User;
import lombok.Builder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Builder
public class UserDetailsImpl implements UserDetails {
    private String username;
    private String password;
    private boolean blocked;
    private boolean enabled;
    private Collection<? extends GrantedAuthority> authorities;

    public static UserDetailsImpl build(User user) {
        List<GrantedAuthority> authorities = new ArrayList<>();

        List<ProjectUser> projectUsers = user.getProjectUsers();
        if (projectUsers != null){
            for (ProjectUser pu : projectUsers) {
                Role role = pu.getRole();
                authorities.add(new SimpleGrantedAuthority(role.name()));
            }
        }

        return UserDetailsImpl.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .blocked(!user.getStatus())
                .enabled(user.getStatus())
                .authorities(authorities)
                .build();
    }

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
    public boolean isAccountNonLocked() {
        return !blocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
