package com.praga.backend.security.service;

import com.praga.backend.modules.users.model.IUserRepository;
import com.praga.backend.modules.users.model.User;
import com.praga.backend.security.model.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserDetailsServiceImpl implements UserDetailsService {
    private final IUserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User foundUser = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        if (!foundUser.getStatus())
            throw new DisabledException("El usuario esta deshabilitado");

        return UserDetailsImpl.build(foundUser);
    }
}
