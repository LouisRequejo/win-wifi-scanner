/**
 * Servicio de Envío de Reportes hacia WIN
 * Estructurado bajo el "Contrato de Datos" oficial del Reto 01
 */

export async function sendDiagnosisReport(reportPayload) {
  // Simulación de latencia de red al enviar el reporte
  await new Promise((resolve) => setTimeout(resolve, 1400));

  // Guardamos copia local en el navegador para historial/auditoría
  try {
    const saved = JSON.parse(localStorage.getItem('win_reports_history') || '[]');
    saved.unshift(reportPayload);
    localStorage.setItem('win_reports_history', JSON.stringify(saved.slice(0, 10)));
  } catch (err) {
    console.warn('No se pudo guardar en almacenamiento local', err);
  }

  // Generamos un ticket único de atención WIN
  const ticketId = 'WIN-' + Math.floor(100000 + Math.random() * 900000);
  
  return {
    success: true,
    ticketId,
    timestamp: new Date().toISOString(),
    message: 'Reporte procesado exitosamente por el Centro de Operaciones de Red WIN (NOC/Experiencia)',
    meshEligible: reportPayload.resumen.zonas_criticas > 0,
    meshDiscountPercent: 30
  };
}

/**
 * Generador del Contrato de Datos estándar para el Jurado
 */
export function buildDataContract(clientData, roomsMeasurements, routerRoomId) {
  const criticas = roomsMeasurements.filter(m => m.quality.level === 'poor').length;
  const regulares = roomsMeasurements.filter(m => m.quality.level === 'moderate').length;
  const optimas = roomsMeasurements.filter(m => m.quality.level === 'excellent' || m.quality.level === 'good').length;

  let diagnosticoGlobal = 'COBERTURA_TOTAL_HOMOGENEA';
  if (criticas > 0) {
    diagnosticoGlobal = 'REQUIERE_EXTENSOR_MESH_WIN';
  } else if (regulares > 1) {
    diagnosticoGlobal = 'ZONAS_DE_ATENUACION_MEDIA';
  }

  return {
    version_contrato: '1.0.0-win-hackathon',
    metadata: {
      timestamp_envio: new Date().toISOString(),
      cliente_id: clientData.telefono || 'CLIENTE-INVITADO',
      codigo_suministro: clientData.codigoCliente || null,
      dispositivo_origen: {
        user_agent: navigator.userAgent,
        plataforma: navigator.platform || 'web',
        idioma: navigator.language,
        soporta_network_api: !!(navigator.connection)
      }
    },
    topologia_hogar: {
      ambiente_router_principal: routerRoomId,
      total_ambientes_medidos: roomsMeasurements.length
    },
    mediciones_detalle: roomsMeasurements.map((m) => ({
      ambiente_id: m.id,
      nombre_ambiente: m.name,
      es_ubicacion_router: m.id === routerRoomId,
      metricas_tecnicas: {
        ping_promedio_ms: m.ping,
        jitter_ms: m.jitter,
        velocidad_estimada_mbps: m.speed,
        timestamp_medicion: m.timestamp
      },
      diagnostico_ux: {
        calificacion: m.quality.label,
        nivel: m.quality.level,
        puntuacion_salud: m.quality.score,
        explicacion_cliente: m.quality.verdict
      }
    })),
    resumen: {
      diagnostico_final: diagnosticoGlobal,
      zonas_optimas: optimas,
      zonas_atenuadas: regulares,
      zonas_criticas: criticas,
      recomendacion_comercial: criticas > 0 
        ? 'Ofrecer solución WIN Mesh (30% Descuento) para eliminar zonas muertas' 
        : 'Cliente con buena distribución. Mantener plan actual.'
    }
  };
}
