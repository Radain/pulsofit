export type LegalPage = {
  slug: string;
  title: string;
  description: string;
  updatedAt: string;
  sections: {
    heading: string;
    body: string[];
  }[];
};

export const legalPages: LegalPage[] = [
  {
    slug: "privacy",
    title: "Política de privacidad",
    description:
      "Información sobre tratamiento de datos personales, derechos GDPR y encargados de tratamiento.",
    updatedAt: "26 de abril de 2026",
    sections: [
      {
        heading: "Responsable y alcance",
        body: [
          "PulsoFit es una aplicación de fitness en fase MVP. Antes de una explotación comercial real, el titular deberá completar esta página con su denominación legal, NIF/CIF, domicilio y correo de privacidad.",
          "Esta política se aplica al uso de PulsoFit, sus páginas públicas, checkout de Stripe y comunicaciones relacionadas con la suscripción.",
        ],
      },
      {
        heading: "Datos que se tratan",
        body: [
          "En la versión actual, el dashboard usa datos locales de demostración y no crea cuentas de usuario ni una base de datos propia.",
          "Cuando una persona inicia una suscripción, Stripe procesa datos de pago, facturación, identificadores de sesión y datos necesarios para cumplir obligaciones legales y antifraude. PulsoFit no almacena números completos de tarjeta.",
        ],
      },
      {
        heading: "Base jurídica",
        body: [
          "El tratamiento necesario para prestar una suscripción se basa en la ejecución de un contrato. La conservación de facturación se basa en obligaciones legales. La seguridad, prevención de abuso y mejora del servicio se basan en interés legítimo, siempre ponderado con los derechos de las personas usuarias.",
          "Las cookies o analítica no esenciales solo deberán activarse con consentimiento previo.",
        ],
      },
      {
        heading: "Derechos GDPR",
        body: [
          "Las personas usuarias pueden solicitar acceso, rectificación, supresión, oposición, limitación, portabilidad y retirada de consentimiento cuando proceda.",
          "También pueden presentar una reclamación ante la Agencia Española de Protección de Datos si consideran que el tratamiento no respeta la normativa aplicable.",
        ],
      },
      {
        heading: "Encargados y transferencias",
        body: [
          "PulsoFit usa proveedores como Vercel para hosting y Stripe para pagos. Estos proveedores pueden tratar datos fuera del Espacio Económico Europeo bajo mecanismos de transferencia reconocidos, como cláusulas contractuales tipo u otras salvaguardas aplicables.",
          "Solo se deben contratar proveedores con acuerdos de tratamiento de datos adecuados antes del lanzamiento comercial.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Condiciones de uso",
    description:
      "Reglas de uso de PulsoFit, planes Free y Pro, suscripciones y límites del servicio.",
    updatedAt: "26 de abril de 2026",
    sections: [
      {
        heading: "Servicio",
        body: [
          "PulsoFit ofrece planificación de entrenamientos, hábitos y visualización de progreso. No sustituye el consejo médico, diagnóstico, tratamiento ni supervisión de un profesional sanitario o entrenador cualificado.",
          "No uses PulsoFit para entrenar con dolor, lesión, mareos u otras señales de riesgo. Consulta con un profesional si tienes dudas sobre tu salud.",
        ],
      },
      {
        heading: "Planes",
        body: [
          "PulsoFit Free permite usar funciones básicas con límites razonables: 3 entrenamientos semanales, 3 hábitos activos y vista básica de intensidad.",
          "PulsoFit Pro desbloquea planificación semanal completa, señales de recuperación, más hábitos y más historial. Puede contratarse de forma mensual o anual.",
        ],
      },
      {
        heading: "Suscripción",
        body: [
          "Los pagos se procesan mediante Stripe Checkout. El plan mensual cuesta 14,99 EUR al mes. El plan anual cuesta 152,90 EUR al año e incluye un descuento aproximado del 15% frente a pagar 12 meses mensuales.",
          "La suscripción se renueva automáticamente salvo cancelación antes del siguiente ciclo. La cancelación evita renovaciones futuras, pero no bloquea el acceso ya pagado durante el periodo activo salvo abuso o incumplimiento grave.",
        ],
      },
      {
        heading: "Uso aceptable",
        body: [
          "No está permitido intentar vulnerar el servicio, automatizar abuso, interferir con otros usuarios, usar credenciales ajenas ni eludir límites técnicos o comerciales.",
          "PulsoFit puede bloquear tráfico malicioso, bots, escaneos, intentos de explotación o patrones que pongan en riesgo la disponibilidad del servicio.",
        ],
      },
    ],
  },
  {
    slug: "refunds",
    title: "Pagos, cancelaciones y devoluciones",
    description:
      "Política sencilla de devoluciones, desistimiento, renovación y cancelación de PulsoFit Pro.",
    updatedAt: "26 de abril de 2026",
    sections: [
      {
        heading: "Derecho de desistimiento",
        body: [
          "Si contratas como consumidor en la Unión Europea, conservas tus derechos legales, incluido el derecho de desistimiento de 14 días cuando sea aplicable.",
          "Nada en esta política limita derechos irrenunciables reconocidos por la normativa española o europea de consumo.",
        ],
      },
      {
        heading: "Devolución fácil",
        body: [
          "Además del mínimo legal, PulsoFit ofrece devolución sin preguntas durante los primeros 30 días de la primera suscripción de pago.",
          "No tendrás que justificar por qué no te encaja el producto. El reembolso se enviará al método de pago original a través de Stripe cuando sea técnicamente posible.",
        ],
      },
      {
        heading: "Plan anual",
        body: [
          "El plan anual tiene el mismo periodo amistoso de 30 días para pedir devolución completa si es la primera compra.",
          "Después de ese periodo, podrás cancelar la renovación futura. Para incidencias claras de cobro duplicado, error técnico o imposibilidad prolongada de acceso atribuible al servicio, PulsoFit aplicará una devolución razonable y sencilla.",
        ],
      },
      {
        heading: "Autoservicio",
        body: [
          "La experiencia de pago está preparada para gestionarse con Stripe. La intención operativa es que cancelaciones, facturas y devoluciones se tramiten mediante enlaces de Stripe o portal de cliente cuando esté habilitado, reduciendo correos manuales.",
          "Hasta que el portal de cliente esté publicado en producción, cualquier texto comercial debe incluir un canal mínimo de soporte para cumplir obligaciones legales.",
        ],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Política de cookies",
    description:
      "PulsoFit usa solo cookies técnicas necesarias en esta versión MVP.",
    updatedAt: "26 de abril de 2026",
    sections: [
      {
        heading: "Cookies actuales",
        body: [
          "La versión actual no incluye cookies de marketing, publicidad comportamental ni analítica no esencial.",
          "Pueden existir cookies o almacenamiento técnico estrictamente necesario para seguridad, sesión de checkout de Stripe o funcionamiento básico de la plataforma.",
        ],
      },
      {
        heading: "Consentimiento",
        body: [
          "Si en el futuro se añaden analíticas, píxeles publicitarios, mapas de calor u otras cookies no necesarias, PulsoFit deberá pedir consentimiento previo, granular y revocable antes de activarlas.",
          "El rechazo de cookies no esenciales no debe impedir el acceso al servicio básico.",
        ],
      },
    ],
  },
  {
    slug: "security",
    title: "Seguridad y cumplimiento",
    description:
      "Medidas de seguridad aplicadas en PulsoFit y límites de la versión MVP.",
    updatedAt: "26 de abril de 2026",
    sections: [
      {
        heading: "Pagos seguros",
        body: [
          "PulsoFit delega el checkout en Stripe. Los datos completos de tarjeta no pasan por servidores propios de la aplicación.",
          "El checkout usa sesiones de suscripción y precios configurados en Stripe Billing.",
        ],
      },
      {
        heading: "Protecciones de aplicación",
        body: [
          "La aplicación envía cabeceras de seguridad como HSTS, protección contra clickjacking, no-sniff, política de permisos y una política de seguridad de contenido compatible con Next.js.",
          "También se aplican controles de middleware para bloquear rutas típicas de escaneo y agentes de abuso conocidos antes de que lleguen a las pantallas principales.",
        ],
      },
      {
        heading: "Vercel",
        body: [
          "Vercel aplica mitigación DDoS automática a nivel de plataforma. Para una operación comercial de mayor riesgo, conviene activar y revisar reglas avanzadas de Vercel Firewall, rate limiting y alertas desde el panel de Vercel según el plan contratado.",
          "Ninguna configuración elimina todo riesgo. La seguridad requiere revisión continua, logs, actualizaciones y respuesta ante incidentes.",
        ],
      },
    ],
  },
];

export function getLegalPage(slug: string) {
  return legalPages.find((page) => page.slug === slug);
}
