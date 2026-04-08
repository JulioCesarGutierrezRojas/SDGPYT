package com.praga.backend.modules.notifications.service;

import com.google.firebase.messaging.*;
import com.praga.backend.modules.users.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class FirebaseNotificationService {

    /**
     * Envía una notificación push a un usuario específico
     *
     * @param user Usuario destinatario
     * @param title Título de la notificación
     * @param body Cuerpo de la notificación
     * @param data Datos adicionales (opcional)
     */
    public void sendNotificationToUser(User user, String title, String body, Map<String, String> data) {
        if (user.getFcmToken() == null || user.getFcmToken().isEmpty()) {
            log.warn("Usuario {} no tiene token FCM configurado", user.getEmail());
            return;
        }

        try {
            Message.Builder messageBuilder = Message.builder()
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .setToken(user.getFcmToken());

            // Agregar datos personalizados si existen
            if (data != null && !data.isEmpty()) {
                messageBuilder.putAllData(data);
            }

            // Configuración para Android
            messageBuilder.setAndroidConfig(AndroidConfig.builder()
                    .setPriority(AndroidConfig.Priority.HIGH)
                    .setNotification(AndroidNotification.builder()
                            .setChannelId("high_importance_channel")
                            .setPriority(AndroidNotification.Priority.HIGH)
                            .build())
                    .build());

            Message message = messageBuilder.build();
            String response = FirebaseMessaging.getInstance().send(message);

            log.info("Notificación enviada exitosamente al usuario {}: {}", user.getEmail(), response);

        } catch (FirebaseMessagingException e) {
            log.error("Error al enviar notificación al usuario {}: {}", user.getEmail(), e.getMessage());
        }
    }

    /**
     * Envía una notificación cuando se crea una nueva tarea
     */
    public void sendTaskAssignedNotification(User user, String taskName, String projectName) {
        Map<String, String> data = new HashMap<>();
        data.put("type", "task_assigned");
        data.put("screen", "task_detail");

        sendNotificationToUser(
                user,
                "Nueva tarea asignada",
                "Se te ha asignado la tarea '" + taskName + "' en el proyecto '" + projectName + "'",
                data
        );
    }

    /**
     * Envía una notificación cuando se actualiza una tarea
     */
    public void sendTaskUpdatedNotification(User user, String taskName) {
        Map<String, String> data = new HashMap<>();
        data.put("type", "task_updated");
        data.put("screen", "task_detail");

        sendNotificationToUser(
                user,
                "Tarea actualizada",
                "La tarea '" + taskName + "' ha sido actualizada",
                data
        );
    }

    /**
     * Envía una notificación cuando se asigna un usuario a un proyecto
     */
    public void sendProjectAssignedNotification(User user, String projectName) {
        Map<String, String> data = new HashMap<>();
        data.put("type", "project_assigned");
        data.put("screen", "project_detail");

        sendNotificationToUser(
                user,
                "Nuevo proyecto asignado",
                "Has sido asignado al proyecto '" + projectName + "'",
                data
        );
    }

    /**
     * Envía una notificación cuando cambia el estado de una tarea
     */
    public void sendTaskStatusChangedNotification(User user, String taskName, boolean newStatus) {
        Map<String, String> data = new HashMap<>();
        data.put("type", "task_status_changed");
        data.put("screen", "task_detail");

        String statusText = newStatus ? "activada" : "desactivada";

        sendNotificationToUser(
                user,
                "Estado de tarea modificado",
                "La tarea '" + taskName + "' ha sido " + statusText,
                data
        );
    }

    /**
     * Envía una notificación a un topic (grupo de usuarios)
     */
    public void sendNotificationToTopic(String topic, String title, String body) {
        try {
            Message message = Message.builder()
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .setTopic(topic)
                    .setAndroidConfig(AndroidConfig.builder()
                            .setPriority(AndroidConfig.Priority.HIGH)
                            .build())
                    .build();

            String response = FirebaseMessaging.getInstance().send(message);
            log.info("Notificación enviada al topic {}: {}", topic, response);

        } catch (FirebaseMessagingException e) {
            log.error("Error al enviar notificación al topic {}: {}", topic, e.getMessage());
        }
    }
}
