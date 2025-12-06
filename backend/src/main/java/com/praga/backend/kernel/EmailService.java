package com.praga.backend.kernel;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Enumeration;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    /**
     * Obtiene la dirección IP local de la máquina de forma dinámica
     */
    private String getLocalIpAddress() {
        try {
            for (Enumeration<NetworkInterface> interfaces = NetworkInterface.getNetworkInterfaces(); interfaces.hasMoreElements();) {
                NetworkInterface networkInterface = interfaces.nextElement();
                if (networkInterface.isLoopback() || !networkInterface.isUp()) {
                    continue;
                }
                for (Enumeration<InetAddress> addresses = networkInterface.getInetAddresses(); addresses.hasMoreElements();) {
                    InetAddress address = addresses.nextElement();
                    if (!address.isLoopbackAddress() && address.getHostAddress().indexOf(':') == -1) {
                        String ipAddress = address.getHostAddress();
                        if (ipAddress.startsWith("192.168.") || ipAddress.startsWith("10.") ||
                            (ipAddress.startsWith("172.") && Integer.parseInt(ipAddress.split("\\.")[1]) >= 16 &&
                             Integer.parseInt(ipAddress.split("\\.")[1]) <= 31)) {
                            logger.info("IP local detectada: {}", ipAddress);
                            return ipAddress;
                        }
                    }
                }
            }
        } catch (SocketException e) {
            logger.error("Error al obtener la dirección IP local: {}", e.getMessage());
        }
        logger.warn("No se pudo determinar la IP local, usando localhost como fallback");
        return "localhost";
    }

    /**
     * Envía un correo de recuperación de contraseña
     */
    public boolean sendPasswordRecoveryEmail(String recipientEmail, String userName, String recoveryToken) {
        try {
            // Preparar las variables para la plantilla
            Map<String, Object> templateModel = new HashMap<>();
            templateModel.put("userName", userName);
            templateModel.put("recoveryToken", recoveryToken);
            templateModel.put("expirationTime", "15 minutos");

            // Procesar la plantilla
            Context thymeleafContext = new Context();
            thymeleafContext.setVariables(templateModel);
            String htmlBody = templateEngine.process("password-recovery-email", thymeleafContext);

            // Crear el mensaje
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(recipientEmail);
            helper.setSubject("Recuperación de Contraseña - SDGPYT");
            helper.setText(htmlBody, true); // true indica que es HTML
            helper.setFrom("noreply@sdgpyt.com", "Sistema SDGPYT");

            // Enviar el correo
            mailSender.send(message);
            logger.info("Correo de recuperación enviado exitosamente a: {}", recipientEmail);
            return true;

        } catch (MessagingException e) {
            logger.error("Error al enviar correo de recuperación a {}: {}", recipientEmail, e.getMessage());
            return false;
        } catch (Exception e) {
            logger.error("Error inesperado al enviar correo: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Envía un correo de confirmación de cambio de contraseña
     */
    public boolean sendPasswordChangeConfirmation(String recipientEmail, String userName) {
        try {
            // Preparar las variables para la plantilla
            Map<String, Object> templateModel = new HashMap<>();
            templateModel.put("userName", userName);

            // Procesar la plantilla
            Context thymeleafContext = new Context();
            thymeleafContext.setVariables(templateModel);
            String htmlBody = templateEngine.process("password-change-confirmation", thymeleafContext);

            // Crear el mensaje
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(recipientEmail);
            helper.setSubject("Contraseña Actualizada - SDGPYT");
            helper.setText(htmlBody, true);
            helper.setFrom("noreply@sdgpyt.com", "Sistema SDGPYT");

            // Enviar el correo
            mailSender.send(message);
            logger.info("Correo de confirmación enviado exitosamente a: {}", recipientEmail);
            return true;

        } catch (MessagingException e) {
            logger.error("Error al enviar correo de confirmación a {}: {}", recipientEmail, e.getMessage());
            return false;
        } catch (Exception e) {
            logger.error("Error inesperado al enviar correo: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Envía invitaciones al proyecto a múltiples destinatarios
     */
    public boolean sendProjectInvitations(List<String> recipientEmails, String projectName, String projectDescription,
                                         String inviterName, String inviterEmail, Long projectId) {
        try {
            // Obtener la IP local dinámicamente para el enlace HTTP
            String localIp = getLocalIpAddress();

            // Preparar las variables para la plantilla
            Map<String, Object> templateModel = new HashMap<>();
            templateModel.put("projectName", projectName);
            templateModel.put("projectDescription", projectDescription);
            templateModel.put("inviterName", inviterName);
            templateModel.put("inviterEmail", inviterEmail);

            // Enviar correo a cada destinatario
            for (String recipientEmail : recipientEmails) {
                try {
                    // Crear enlace HTTP que redirigirá a la app móvil
                    // Este enlace funciona desde navegadores y clientes de correo
                    String personalizedInvitationLink = String.format("http://%s:8080/api/v1/invitations/redirect/%d?email=%s",
                                                                      localIp, projectId, recipientEmail);

                    // Actualizar las variables de la plantilla con el enlace personalizado
                    Map<String, Object> personalizedTemplateModel = new HashMap<>(templateModel);
                    personalizedTemplateModel.put("invitationLink", personalizedInvitationLink);
                    personalizedTemplateModel.put("recipientEmail", recipientEmail);

                    // Procesar la plantilla con variables personalizadas
                    Context personalizedThymeleafContext = new Context();
                    personalizedThymeleafContext.setVariables(personalizedTemplateModel);
                    String personalizedHtmlBody = templateEngine.process("project-invitation-email", personalizedThymeleafContext);

                    MimeMessage message = mailSender.createMimeMessage();
                    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                    helper.setTo(recipientEmail);
                    helper.setSubject("Invitación al Proyecto: " + projectName + " - SDGPYT");
                    helper.setText(personalizedHtmlBody, true);
                    helper.setFrom("noreply@sdgpyt.com", "Sistema SDGPYT");

                    if (inviterEmail != null && !inviterEmail.isEmpty()) {
                        helper.setReplyTo(inviterEmail);
                    }

                    // Enviar el correo
                    mailSender.send(message);
                    logger.info("Invitación al proyecto '{}' enviada exitosamente a: {} con Deep Link: {}",
                                projectName, recipientEmail, personalizedInvitationLink);

                } catch (MessagingException e) {
                    logger.error("Error al enviar invitación a {}: {}", recipientEmail, e.getMessage());
                    // Continúa enviando a los demás destinatarios
                }
            }

            return true;

        } catch (Exception e) {
            logger.error("Error inesperado al enviar invitaciones: {}", e.getMessage());
            return false;
        }
    }
}
