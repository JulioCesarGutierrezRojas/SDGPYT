package com.praga.backend.kernel;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component("auditorProvider")
public class AuditorAwareImpl implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {
        Authentication autentication = SecurityContextHolder.getContext().getAuthentication();

        if (autentication == null || !autentication.isAuthenticated()) {
            return Optional.of("anonymousUser");
        }

        return Optional.of(autentication.getName());
    }
}
