package com.praga.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;

@Configuration
@Slf4j
public class FirebaseConfig {

    @PostConstruct
    public void initialize() {
        try {
            // Intentar cargar el archivo de credenciales desde resources
            InputStream serviceAccount = new ClassPathResource("firebase-service-account.json").getInputStream();

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                log.info("✅ Firebase Admin SDK inicializado correctamente");
            }

        } catch (IOException e) {
            log.warn("⚠️ No se pudo inicializar Firebase Admin SDK: {}", e.getMessage());
            log.warn("⚠️ Las notificaciones push NO funcionarán hasta que configures firebase-service-account.json");
            log.warn("⚠️ Para configurar Firebase:");
            log.warn("   1. Ve a Firebase Console > Project Settings > Service Accounts");
            log.warn("   2. Click en 'Generate new private key'");
            log.warn("   3. Guarda el archivo como 'firebase-service-account.json'");
            log.warn("   4. Colócalo en: src/main/resources/firebase-service-account.json");
        }
    }
}
