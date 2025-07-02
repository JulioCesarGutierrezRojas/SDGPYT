package com.praga.backend.modules.users.service;


import com.praga.backend.kernel.ApiResponse;
import com.praga.backend.kernel.TypesResponse;
import com.praga.backend.modules.users.controller.dto.SaveUserDto;
import com.praga.backend.modules.users.controller.dto.ChangeStatusUserDto;
import com.praga.backend.modules.users.controller.dto.GetUserDto;
import com.praga.backend.modules.users.controller.dto.GetUsersDto;
import com.praga.backend.modules.users.model.IUserRepository;
import com.praga.backend.modules.users.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.Objects;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public ResponseEntity<Object> getAllUsers() {
        List<GetUsersDto> users = userRepository.findAll()
                .stream()
                .map(user -> new GetUsersDto(
                        user.getUserId(),
                        user.getName(),
                        user.getLastname(),
                        user.getEmail(),
                        user.getPhoneNumber(),
                        user.getStatus()
                ))
                .collect(Collectors.toList());
        return new ResponseEntity<>(
                new ApiResponse<>(users, TypesResponse.SUCCESS, "Lista de usuarios obtenida correctamente"), HttpStatus.OK
        );
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Object> getUserById(GetUserDto dto) {
        Optional<User> optionalUser = userRepository.findById(dto.getId());

        if (optionalUser.isPresent()) {
            GetUsersDto user = new GetUsersDto(
                    optionalUser.get().getUserId(),
                    optionalUser.get().getName(),
                    optionalUser.get().getLastname(),
                    optionalUser.get().getEmail(),
                    optionalUser.get().getPhoneNumber(),
                    optionalUser.get().getStatus()
            );
            return new ResponseEntity<>(
                    new ApiResponse<>(user, TypesResponse.SUCCESS, "Usuario encontrado correctamente"), HttpStatus.OK
            );
        } else {
            return new ResponseEntity<>(
                    new ApiResponse<>(null, TypesResponse.ERROR, "Usuario no encontrado"), HttpStatus.NOT_FOUND
            );
        }
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> changeUserStatus(ChangeStatusUserDto dto) {
        User user = userRepository.findById(dto.getId()).orElse(null);
        if (Objects.isNull(user)) {
            return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "No existe el usuario."), HttpStatus.NOT_FOUND);
        }
        user.setStatus(!user.getStatus());
        userRepository.save(user);
        return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.SUCCESS, "Usuario actualizado correctamente"), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> saveUser(SaveUserDto dto) {
        User foundUser = userRepository.findByEmail(dto.getEmail()).orElse(null);

        if (!Objects.isNull(foundUser))
            return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "Ese correo ya esta en uso."), HttpStatus.BAD_REQUEST);

        User user = new User(dto.getName(), dto.getLastname(), dto.getEmail(), dto.getPhoneNumber(), passwordEncoder.encode(dto.getPassword()));
        user.setStatus(true);
        user.setAttempts(0);
        userRepository.save(user);

        return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.SUCCESS, "Usuario registrado correctamente"), HttpStatus.OK);
    }
}
