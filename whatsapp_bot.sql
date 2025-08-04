-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-08-2025 a las 19:31:09
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `whatsapp_bot`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL,
  `telefono` varchar(50) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'activo',
  `asesor_asignado` varchar(50) DEFAULT NULL,
  `ultima_interaccion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `cantidad_conversaciones` int(11) DEFAULT 0,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id`, `telefono`, `nombre`, `estado`, `asesor_asignado`, `ultima_interaccion`, `cantidad_conversaciones`, `fecha_creacion`) VALUES
(35, '5491133303995@c.us', NULL, 'manejo_bot', 'juanjo', '2025-07-17 17:22:34', 10, '2025-07-17 17:00:37'),
(36, '5491123542323@c.us', NULL, 'manejo_bot', 'juanjo', '2025-07-21 19:30:47', 2, '2025-07-21 19:25:58'),
(37, '5491122840700@c.us', NULL, 'manejo_bot', 'juanjo', '2025-07-21 19:30:18', 5, '2025-07-21 19:30:13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `conversaciones`
--

CREATE TABLE `conversaciones` (
  `id` int(11) NOT NULL,
  `cliente_id` int(11) DEFAULT NULL,
  `mensaje` text DEFAULT NULL,
  `respuesta` text DEFAULT NULL,
  `derivado_a` varchar(50) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `conversaciones`
--

INSERT INTO `conversaciones` (`id`, `cliente_id`, `mensaje`, `respuesta`, `derivado_a`, `fecha_creacion`) VALUES
(64, 35, 'tengo una duda', '¡Hola! ¿En qué puedo ayudarte hoy? 😊', NULL, '2025-07-17 17:00:37'),
(65, 35, '', '¡Hola! 👋 Bienvenido a El Paraíso de Paso, ¿en qué puedo ayudarte hoy? ¿Ya visitaste nuestro sitio web? ¿Querés hacer una compra o tenés alguna consulta? Estoy aquí para ayudarte.', NULL, '2025-07-17 17:04:59'),
(66, 35, 'tengo una consulta', '¡Hola! 👋 ¿En qué puedo ayudarte hoy? ¿Ya viste nuestros productos en la página, quieres hacer una consulta o necesitas ayuda con algo en específico? 😊', NULL, '2025-07-17 17:05:18'),
(67, 35, 'donde estan?', '¡Hola! 👋 Somos El Paraíso de Paso, un distribuidor mayorista e importador de lencería, ropa interior, marroquinería y blanquería. Estamos ubicados en Once, CABA, y también tenemos un punto de retiro en Moreno para que puedas retirar tus pedidos. ¿En qué más puedo ayudarte hoy?', NULL, '2025-07-17 17:06:00'),
(68, 35, 'en que direccion exacta estan?', '¡Hola! En El Paraíso de Paso, estamos ubicados en Once, CABA, y también tenemos un punto de retiro en Moreno. ¿En qué más puedo ayudarte hoy? 😊', NULL, '2025-07-17 17:06:25'),
(69, 35, 'donde puedo retirar el pedido', '¡Hola! En El Paraíso de Paso, contamos con puntos de retiro en picking point en Once y Moreno. ¿Te gustaría retirar tu pedido en alguno de estos puntos? ¿O necesitás más información al respecto? 😊', NULL, '2025-07-17 17:13:52'),
(70, 35, 'once', '¡Hola! Bienvenido a El Paraíso de Paso. ¿En qué puedo ayudarte hoy? ¿Ya viste nuestros productos en la página, o necesitás información específica sobre nuestra ubicación en Once? 😊', NULL, '2025-07-17 17:14:19'),
(71, 35, 'tengo que retirar un pedido en once', '¡Hola! ¿Ya sos cliente de El Paraíso de Paso o sos cliente nuevo? 🛍️ ¿Necesitás ayuda para retirar tu pedido en Once? ¡Estoy aquí para ayudarte! ¿Me podés decir tu nombre o número de cliente para poder asistirte mejor?', NULL, '2025-07-17 17:14:42'),
(72, 35, 'hola', '¡Hola! 👋 Bienvenido a El Paraíso de Paso. ¿En qué puedo ayudarte hoy? ¿Ya viste nuestros productos en la página? ¿Tenés alguna consulta o necesitás ayuda para hacer un pedido? Estoy aquí para ayudarte. 😊', NULL, '2025-07-17 17:17:12'),
(73, 35, 'quiero comprar', '¡Hola! 👋🏼 ¡Bienvenido/a a El Paraíso de Paso! ¿Ya viste nuestros productos en la página web? Si necesitás ayuda con tu compra, puedo derivarte a Juanjo para que te asesore con los productos y el proceso de compra. ¡Contame en qué puedo ayudarte hoy! 😊🛍️', NULL, '2025-07-17 17:22:34'),
(74, 37, '', '¡Hola! 👋 ¿En qué puedo ayudarte hoy? ¿Ya viste nuestros productos en la página? ¿Querés hacer una compra o tenés alguna consulta en mente? Estoy aquí para ayudarte.', NULL, '2025-07-21 19:30:15'),
(75, 37, '', '¡Hola! Bienvenido a El Paraíso de Paso, ¿en qué puedo ayudarte hoy? ¿Ya viste nuestros productos en la página, querés realizar una compra o hacer alguna consulta específica? 😊👗👛🎉', NULL, '2025-07-21 19:30:15'),
(76, 37, 'hola', '¡Hola! 👋 Bienvenido a El Paraíso de Paso. ¿En qué puedo ayudarte hoy? ¿Ya viste nuestros productos en la página? ¿Tenés alguna consulta o necesitás ayuda para hacer una compra? 😊', NULL, '2025-07-21 19:30:15'),
(77, 37, 'lucas es gay?', '¡Hola! Soy un asistente virtual de El Paraíso de Paso, ¿en qué puedo ayudarte hoy? Si estás interesado en nuestros productos o necesitas información sobre cómo realizar un pedido, ¡soy todo oídos! 😊', NULL, '2025-07-21 19:30:16'),
(78, 37, 'fukin bot de mrd no funciona', '¡Hola! Lamento escuchar que estás teniendo problemas. ¿En qué puedo ayudarte hoy? 😊', NULL, '2025-07-21 19:30:18'),
(79, 36, 'hola', '¡Hola! 👋 ¿Cómo estás? Soy un asistente de El Paraíso de Paso. ¿En qué puedo ayudarte hoy? ¿Ya viste nuestros productos en la página? 😊', NULL, '2025-07-21 19:30:19'),
(80, 36, 'si estan muy buenos, quiero saber que metodos de pago hay', '¡Hola! En El Paraíso de Paso podés abonar tu compra por transferencia bancaria o depósito, tanto en pesos como en dólares. También aceptamos pagos con Mercado Pago y todas las tarjetas de crédito. ¿Necesitás ayuda con alguna otra consulta? 😊', NULL, '2025-07-21 19:30:47');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas`
--

CREATE TABLE `preguntas` (
  `id` int(11) NOT NULL,
  `pregunta` text NOT NULL,
  `respuesta` text NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `preguntas`
--

INSERT INTO `preguntas` (`id`, `pregunta`, `respuesta`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, '¿Dónde informo el pago? ¿Adjunto el comprobante al informa pago de la página?', 'Tenés que iniciar sesión, ir al pedido abonado e informar el pago desde ahí. Ahí mismo podés adjuntar el comprobante.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(2, '¿Tienen catálogos impresos?', 'No, solo trabajamos con catálogo online. Podés verlo en www.catalogoonline.com.ar con precios sugeridos de venta.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(3, '¿Venden por menor?', 'No, vendemos exclusivamente por mayor.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(4, '¿Realizan cambios? ¿Cuál es su política de devolución?', 'Solo hacemos devoluciones por fallas comprobables. No se cambian productos por talle o color. Deben estar sin uso y con su packaging original. Se devuelven en Perón 2809 4°E (CABA) dentro de los 30 días. El envío corre por cuenta del cliente.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(5, '¿Dónde veo mi número de guía?', 'Podés verlo 72 hs hábiles después del despacho desde \'Mi cuenta\' > \'Mis pedidos\'. También se envía al email registrado.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(6, '¿Puedo modificar mis datos?', 'Sí, iniciá sesión e ingresá en \'Mi cuenta\' > \'Mis datos\'. Cualquier cambio es responsabilidad del cliente.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(7, '¿Tiene recargo el pago con tarjeta o MercadoPago?', 'Sí, todos los pagos con tarjeta, Pago Fácil, Rapipago o MercadoPago tienen un recargo del 10% + IVA.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(8, '¿Puedo pagar en cuotas?', 'Sí, podés pagar en cuotas con MercadoPago. También podés aprovechar promociones con cuotas sin interés.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(9, '¿Cómo puedo pagar mi compra?', 'Podés pagar por transferencia, en efectivo en el local o por MercadoPago (tarjetas, Pago Fácil, Link, etc.).', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(10, '¿Cuánto tiempo tengo para pagar mi pedido?', 'Tenés 24 hs para pagar e informar el pago. Pasado ese tiempo, el sistema lo cancela automáticamente.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(11, '¿Cuál es el tiempo de entrega al interior del país?', 'Despachamos tu pedido en 96 hs hábiles. Luego depende del tiempo de entrega del transporte que elijas.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(12, '¿Los precios y stock de la página están actualizados?', 'Sí, la página está siempre actualizada. Solo mostramos productos disponibles.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(13, '¿Cuál es la dirección y cómo puedo contactarlos?', 'Estamos en Perón 2809 4°E, Once, CABA. Podés escribirnos a info@elparaisodepaso.com.ar.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(14, '¿Hacen envíos a todo el país?', 'Sí, enviamos a todo el país. Podés elegir transporte o correo al finalizar la compra.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(15, '¿Puedo retirar en el local?', 'Sí, podés retirar tu pedido por nuestro local en Once, CABA.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(16, '¿Cuál es el monto mínimo de compra?', 'El mínimo es $100.000 + IVA.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(17, '¿Cuáles son las formas de pago?', 'Aceptamos transferencia, efectivo y MercadoPago. Las compras con tarjeta tienen recargo.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(18, '¿Cuánto tarda en llegar mi pedido?', 'Depende del transporte y destino. En general, demora entre 24 y 72 hs luego del despacho.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(19, '¿Cómo sé cuándo mi pedido está listo?', 'Te avisamos por WhatsApp cuando el pedido esté listo para retirar o despachar.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(20, '¿Puedo comprar sin ser revendedor?', 'Sí, podés comprar por mayor sin ser revendedor. Solo tenés que respetar el mínimo.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(21, '¿Qué pasa si el producto que compré no está?', 'Te avisamos y podés elegir cambiarlo o eliminarlo del pedido.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(22, '¿Puedo modificar mi pedido?', 'Sí, podés modificarlo si no está facturado ni armado. Escribinos por WhatsApp lo antes posible.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(23, '¿Cómo se calcula el costo de envío?', 'Depende del transporte, el peso y el destino. Se paga al recibir el pedido.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(24, '¿Qué pasa si no llego al mínimo?', 'No se puede procesar el pedido. Podés sumar productos o compartir el pedido con alguien más.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(25, '¿Puedo pedir el catálogo actualizado?', 'Sí, escribinos por WhatsApp y te mandamos el catálogo digital actualizado.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(26, '¿Qué pasa si no responden mi WhatsApp?', 'Recibimos muchos mensajes, respondemos por orden lo más rápido posible dentro del horario laboral.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(27, '¿Tienen showroom?', 'Si, poseemos un showroom en Perón 2809 4°E, Once, CABA. Comunícate con juanjo para agendar una visita. Solicitame hablar con el y te derivo.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(28, '¿Tienen lista de precios mayorista?', 'Sí, los precios de la página ya son mayoristas.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(29, '¿Cómo sé si mi pedido fue confirmado?', 'Te llega un mail de confirmación de pago y lo podes ver en \'Mi cuenta\' > \'Mis pedidos\'.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(30, '¿Puedo elegir el transporte?', 'Sí, podés elegir transporte al cerrar la compra o sugerir uno por WhatsApp.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(31, '¿Trabajan con Mercado Envíos?', 'No, trabajamos con transporte o correo tradicional. Mercado Envíos no está disponible.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(32, '¿Qué productos venden?', 'Vendemos lenceria y ropa interior, indumentaria, ropa de cama, baño y cocina, blanqueria, valijas y accesorios de moda, camping, iluminacion y electronica, fitness|deportes, bazar y mates, belleza y cuidado personal, bijouterie, perfumeria y arozatizante, textil y barbijos.', '2025-07-15 19:59:09', '2025-07-15 19:59:09'),
(33, '¿Puedo cancelar mi pedido?', 'Sí, mientras no esté facturado ni despachado. Avisanos por WhatsApp.', '2025-07-15 19:59:09', '2025-07-15 19:59:09');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `telefono` (`telefono`);

--
-- Indices de la tabla `conversaciones`
--
ALTER TABLE `conversaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cliente_id` (`cliente_id`);

--
-- Indices de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT de la tabla `conversaciones`
--
ALTER TABLE `conversaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `conversaciones`
--
ALTER TABLE `conversaciones`
  ADD CONSTRAINT `conversaciones_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
