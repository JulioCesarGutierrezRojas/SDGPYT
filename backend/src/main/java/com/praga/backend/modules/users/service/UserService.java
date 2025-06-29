package com.praga.backend.modules.users.service;


import com.praga.backend.kernel.ApiResponse;
import com.praga.backend.kernel.TypesResponse;
import com.praga.backend.modules.users.controller.dto.UpdateUserDto;
import com.praga.backend.modules.users.controller.dto.UserDto;
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
        List<UserDto> users = userRepository.findAll()
                .stream()
                .map(user -> new UserDto(
                        //falta aqi
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(
                new ApiResponse<>(users, TypesResponse.SUCCESS, "Lista de usuarios obtenida correctamente")
        );
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Object> getUserById(Long id) {
        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            UserDto userDto = new UserDto(
                    user.getUserId().longValue(),
                    user.getName(),
                    user.getLastname(),
                    user.getEmail(),
                    Integer.parseInt(user.getPhoneNumber()),
                    "ROL_NO_DEFINIDO" 
            );
            return ResponseEntity.ok(
                    new ApiResponse<>(userDto, TypesResponse.SUCCESS, "Usuario encontrado correctamente")
            );
        } else {
            return ResponseEntity.status(404).body(
                    new ApiResponse<>(null, TypesResponse.ERROR, "Usuario no encontrado")
            );
        }
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> changeUserStatus(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (Objects.isNull(user)) {
            return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "No existe el usuario."), HttpStatus.NOT_FOUND);
        }
        user.setStatus(!user.getStatus());
        userRepository.save(user);
        return new ResponseEntity<>(new ApiResponse<>(user, TypesResponse.SUCCESS, "Usuario actualizado correctamente"), HttpStatus.OK);
    }

    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<Object> updateUser(UpdateUserDto dto){
        User foundUser = userRepository.findById(dto.getId()).orElse(null);

        if (Objects.isNull(foundUser))
            return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.WARNING, "No existe el usuario."), HttpStatus.NOT_FOUND);

        foundUser.setName(dto.getName());
        foundUser.setLastname(dto.getLastname());
        foundUser.setEmail(dto.getEmail());
        foundUser.setPhoneNumber(dto.getPhoneNumber());
        foundUser.setPassword(passwordEncoder.encode(dto.getPassword()));

        userRepository.save(foundUser);

        return new ResponseEntity<>(new ApiResponse<>(null, TypesResponse.SUCCESS, "Usuario actualizado correctamente"), HttpStatus.OK);
    }
}
