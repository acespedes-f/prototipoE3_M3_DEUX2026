# Fonasa · prototipo funcional y editable del componente de trámites

## Cómo abrirlo
1. Descomprime el ZIP conservando la carpeta `assets`.
2. Abre `index.html` en Chrome, Firefox o Edge. No requiere instalación, conexión ni servidor.
3. Modifica `index.html`, `styles.css` y `script.js` en tu editor.

## Fidelidad visual
La interfaz inicial se reconstruyó en HTML y CSS tomando como referencia la captura seleccionada. No es una captura puesta como fondo: las tarjetas, botones, título, buscador y menús son elementos reales editables. Las imágenes del logotipo y la franja fotográfica se recortaron de la referencia proporcionada; la capa de color del encabezado es CSS para proteger el contraste del H1.

## Jerarquía semántica
- H1: Realiza tus trámites Fonasa (único de la página).
- H2: Escribe lo que buscas.
- Etiqueta HTML `label` asociada al campo de búsqueda; no se usa H3 para el campo.
- H2: Los trámites más frecuentes.
- Ocho H3: títulos de cada acceso directo, cada uno con botón de acción.
- El diálogo de detalle y otros diálogos contienen sus propios H2 dentro del contexto del diálogo, no se crean subsecciones adicionales en el documento principal.

## Búsqueda interactiva
- Muestra sugerencias desde la primera letra.
- Reconoce tildes y palabras relacionadas.
- Si no encuentra coincidencias, ofrece ejemplos y alternativas; no inventa una coincidencia exacta.
- Flechas arriba/abajo para recorrer opciones; Enter para elegir; Escape para cerrar; Tab para salir.
- Anuncia resultados con `role=status` y `aria-live`.
- La acción Buscar abre un detalle demostrativo; no se conecta con datos reales de Fonasa.

## Accesibilidad prevista
HTML semántico, atajo saltar al contenido, un H1 con dos H2 y ocho H3, foco visible, etiqueta asociada al buscador, combobox ARIA con listbox y `aria-activedescendant`, botones nativos, `dialog` con cierre por Escape, estados sin depender solo del color, controles amplios, adaptación responsive, soporte de movimiento reducido y `forced-colors`.

## Validación pendiente
El prototipo no equivale a una certificación WCAG. Para tu entrega, prueba contraste real y su variante de alto contraste; zoom de texto al 200 % y reflow al 400 %; teclado sin mouse; NVDA + Chrome y VoiceOver + Safari; anuncios y cambio de foco del autocompletado; móvil táctil; y herramientas como axe o Accessibility Auditor. Documenta capturas y resultados.

## Alcance
Es un prototipo de un componente dentro de una apariencia de home. Las pestañas y Mi Fonasa muestran un aviso de sección no implementada. Los trámites abren ventanas demostrativas y ofrecen acceso separado al sitio oficial, pero no procesan solicitudes reales.

## Fuentes normativas para la implementación
- WAI-ARIA Authoring Practices Guide, Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- WCAG 2.2: https://www.w3.org/TR/WCAG22/


## Cambios de la versión 3

- Se mantiene el diseño y comportamiento del prototipo anterior.
- La distribución de escritorio es más compacta a **100% de zoom**: encabezado, hero, barra de búsqueda, ocho trámites y botón final pensados para verse juntos en pantallas de escritorio de altura aproximada 830–900 px. En otras resoluciones, al aumentar el texto o con zoom del navegador, **es normal y preferible poder desplazarse** antes que cortar contenido.
- Tipografía: `Roboto`, cargada desde Google Fonts cuando hay conexión. El ZIP no incluye archivos tipográficos; sin conexión se aplica Arial como respaldo.
- Se conservan los encabezados H1 → H2 → H3, sugerencias del buscador y diálogos demostrativos.
- Para probar el zoom y la navegación con tecnologías de apoyo, abrir `index.html` y utilizar Tab, flechas, Enter, Escape y zoom 200%.
