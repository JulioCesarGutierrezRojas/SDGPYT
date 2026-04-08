package com.praga.backend.modules.invitations.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
@RequestMapping("/api/v1/invitations")
@RequiredArgsConstructor
@Tag(name = "invitations", description = "Endpoints para redirección de invitaciones a la app móvil")
public class InvitationRedirectController {

    private static final Logger logger = LoggerFactory.getLogger(InvitationRedirectController.class);

    @GetMapping(value = "/redirect/{projectId}", produces = MediaType.TEXT_HTML_VALUE)
    @Operation(summary = "Redirige a la aplicación móvil", description = "Página HTML que intenta abrir la app móvil con el deep link")
    public void redirectToApp(
            @PathVariable Long projectId,
            @RequestParam(required = false) String email,
            HttpServletResponse response) throws IOException {

        logger.info("Redireccionando invitación - Project ID: {}, Email: {}", projectId, email);

        // Construir el deep link
        String deepLink = String.format("sdgpyt://invitation/%d?email=%s", projectId, email != null ? email : "");

        // Generar página HTML con redirección automática
        String html = generateRedirectHtml(deepLink, projectId, email);

        response.setContentType("text/html; charset=UTF-8");
        response.getWriter().write(html);
    }

    private String generateRedirectHtml(String deepLink, Long projectId, String email) {
        String safeEmail = email != null ? email : "";
        String intentUrl = String.format("intent://invitation/%d?email=%s#Intent;scheme=sdgpyt;package=com.example.sdgpyt_movil;end",
                                         projectId, safeEmail);

        return "<!DOCTYPE html>\n" +
                "<html lang=\"es\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "    <title>Abriendo la aplicación...</title>\n" +
                "    <style>\n" +
                "        * {\n" +
                "            margin: 0;\n" +
                "            padding: 0;\n" +
                "            box-sizing: border-box;\n" +
                "        }\n" +
                "        body {\n" +
                "            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;\n" +
                "            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n" +
                "            min-height: 100vh;\n" +
                "            display: flex;\n" +
                "            align-items: center;\n" +
                "            justify-content: center;\n" +
                "            padding: 20px;\n" +
                "        }\n" +
                "        .container {\n" +
                "            background: white;\n" +
                "            border-radius: 20px;\n" +
                "            padding: 40px;\n" +
                "            max-width: 500px;\n" +
                "            width: 100%;\n" +
                "            box-shadow: 0 20px 60px rgba(0,0,0,0.3);\n" +
                "            text-align: center;\n" +
                "        }\n" +
                "        .icon {\n" +
                "            font-size: 64px;\n" +
                "            margin-bottom: 20px;\n" +
                "            animation: pulse 2s infinite;\n" +
                "        }\n" +
                "        @keyframes pulse {\n" +
                "            0%, 100% { transform: scale(1); }\n" +
                "            50% { transform: scale(1.1); }\n" +
                "        }\n" +
                "        h1 {\n" +
                "            color: #333;\n" +
                "            margin-bottom: 10px;\n" +
                "            font-size: 24px;\n" +
                "        }\n" +
                "        p {\n" +
                "            color: #666;\n" +
                "            margin-bottom: 30px;\n" +
                "            line-height: 1.6;\n" +
                "        }\n" +
                "        .spinner {\n" +
                "            border: 4px solid #f3f3f3;\n" +
                "            border-top: 4px solid #667eea;\n" +
                "            border-radius: 50%;\n" +
                "            width: 50px;\n" +
                "            height: 50px;\n" +
                "            animation: spin 1s linear infinite;\n" +
                "            margin: 0 auto 20px;\n" +
                "        }\n" +
                "        @keyframes spin {\n" +
                "            0% { transform: rotate(0deg); }\n" +
                "            100% { transform: rotate(360deg); }\n" +
                "        }\n" +
                "        .manual-link {\n" +
                "            display: inline-block;\n" +
                "            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n" +
                "            color: white;\n" +
                "            padding: 15px 30px;\n" +
                "            border-radius: 25px;\n" +
                "            text-decoration: none;\n" +
                "            font-weight: bold;\n" +
                "            margin-top: 20px;\n" +
                "            transition: transform 0.3s ease;\n" +
                "        }\n" +
                "        .manual-link:hover {\n" +
                "            transform: translateY(-2px);\n" +
                "        }\n" +
                "        .info {\n" +
                "            background: #f8f9fa;\n" +
                "            padding: 15px;\n" +
                "            border-radius: 10px;\n" +
                "            margin-top: 20px;\n" +
                "            font-size: 14px;\n" +
                "            color: #666;\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"container\">\n" +
                "        <div class=\"icon\">📱</div>\n" +
                "        <div class=\"spinner\"></div>\n" +
                "        <h1>Abriendo la aplicación SDGPYT...</h1>\n" +
                "        <p>Estás siendo redirigido a la aplicación móvil para aceptar la invitación al proyecto.</p>\n" +
                "        <p style=\"font-size: 14px; color: #999;\">\n" +
                "            Si la aplicación no se abre automáticamente en unos segundos, haz clic en el botón de abajo.\n" +
                "        </p>\n" +
                "        <a href=\"" + deepLink + "\" class=\"manual-link\" id=\"manualLink\">\n" +
                "            🚀 Abrir aplicación manualmente\n" +
                "        </a>\n" +
                "        <div class=\"info\">\n" +
                "            <strong>¿No tienes la aplicación instalada?</strong><br>\n" +
                "            Por favor, instala la aplicación SDGPYT desde tu tienda de aplicaciones.\n" +
                "        </div>\n" +
                "    </div>\n" +
                "    <script>\n" +
                "        // Intentar abrir la app automáticamente\n" +
                "        window.location.href = '" + deepLink + "';\n" +
                "        \n" +
                "        // Fallback: si después de 3 segundos no se abrió, mostrar instrucciones\n" +
                "        setTimeout(function() {\n" +
                "            console.log('Intento de apertura automática completado');\n" +
                "        }, 3000);\n" +
                "        \n" +
                "        // Agregar listener al botón manual\n" +
                "        document.getElementById('manualLink').addEventListener('click', function(e) {\n" +
                "            e.preventDefault();\n" +
                "            window.location.href = '" + deepLink + "';\n" +
                "            \n" +
                "            // Intentar también con intent para Android\n" +
                "            setTimeout(function() {\n" +
                "                window.location.href = '" + intentUrl + "';\n" +
                "            }, 500);\n" +
                "        });\n" +
                "    </script>\n" +
                "</body>\n" +
                "</html>";
    }
}
