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
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

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
}
