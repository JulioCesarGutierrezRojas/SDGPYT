package com.praga.backend.modules.users.service;


import com.praga.backend.kernel.ApiResponse;
import com.praga.backend.kernel.TypesResponse;
import com.praga.backend.modules.users.controller.dto.UserDto;
import com.praga.backend.modules.users.model.IUserRepository;
import com.praga.backend.modules.users.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final IUserRepository userRepository;

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
                    user.getUserId().intValue(),
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


}
