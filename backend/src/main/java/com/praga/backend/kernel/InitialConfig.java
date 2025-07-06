package com.praga.backend.kernel;

import com.praga.backend.modules.projects.model.IProjectUserRepository;
import com.praga.backend.modules.projects.model.ProjectUser;
import com.praga.backend.modules.users.model.IUserRepository;
import com.praga.backend.modules.users.model.Role;
import com.praga.backend.modules.users.model.User;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;

@Configuration
@RequiredArgsConstructor
public class InitialConfig implements CommandLineRunner {
    private final Logger logger = LoggerFactory.getLogger(InitialConfig.class);
    private final IUserRepository userRepository;
    private final IProjectUserRepository projectUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(rollbackFor = {SQLException.class})
    public void run(String... args) throws Exception {
        String adminEmail = "admin@gmail.com";

        try {
            if (!userRepository.existsByEmail(adminEmail)) {
                User user = new User();
                user.setName("Administrador");
                user.setLastname("Root");
                user.setEmail(adminEmail);
                user.setPhoneNumber("0987654321");
                user.setPassword(passwordEncoder.encode("admin"));
                user.setStatus(true);
                user.setAttempts(0);
                userRepository.save(user);

                ProjectUser projectUser = new ProjectUser();
                projectUser.setUserId(user);
                projectUser.setRole(Role.ADMIN);
                projectUserRepository.save(projectUser);

                logger.info("Usuario ADMIN creado correctamente");
            } else {
                logger.info("Usuario MASTER ya existe");
            }
        } catch (Exception e) {
            logger.error("Error al crear usuario ADMIN: {}", e.getMessage());
        }

    }
}
