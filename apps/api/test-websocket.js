const io = require('socket.io-client');

// ========================================
// CONFIGURACIÓN
// ========================================
const API_URL = 'http://localhost:3001';

// Reemplaza estos IDs con los de tu base de datos
const VENDOR_ID = 'vendor-uuid-123';
const CUSTOMER_ID = 'customer-uuid-123';

// ========================================
// CONEXIONES
// ========================================

console.log('🔌 Conectando clientes WebSocket...\n');

// Cliente Vendedor
const vendorSocket = io(API_URL, {
  query: { userId: VENDOR_ID }
});

// Cliente Customer
const customerSocket = io(API_URL, {
  query: { userId: CUSTOMER_ID }
});

// ========================================
// EVENTOS DE CONEXIÓN
// ========================================

vendorSocket.on('connect', () => {
  console.log('✅ Vendedor conectado (ID:', vendorSocket.id, ')');
});

vendorSocket.on('disconnect', () => {
  console.log('❌ Vendedor desconectado');
});

customerSocket.on('connect', () => {
  console.log('✅ Cliente conectado (ID:', customerSocket.id, ')');
});

customerSocket.on('disconnect', () => {
  console.log('❌ Cliente desconectado');
});

// ========================================
// EVENTOS DEL VENDEDOR
// ========================================

vendorSocket.on('new_booking', (data) => {
  console.log('\n🔔 [VENDEDOR] Nueva reserva recibida:');
  console.log('   Booking ID:', data.id);
  console.log('   Cliente:', data.customer?.email);
  console.log('   Servicio:', data.service?.title);
  console.log('   Fecha:', data.scheduledDate);
  console.log('   Total:', data.details?.grandTotal);
});

vendorSocket.on('booking_paid', (data) => {
  console.log('\n💰 [VENDEDOR] Pago recibido:');
  console.log('   Booking ID:', data.bookingId);
  console.log('   Monto:', data.amount);
});

vendorSocket.on('booking_status_changed', (data) => {
  console.log('\n📝 [VENDEDOR] Estado de reserva actualizado:');
  console.log('   Booking ID:', data.id);
  console.log('   Nuevo estado:', data.status);
});

// ========================================
// EVENTOS DEL CLIENTE
// ========================================

customerSocket.on('payment_confirmed', (data) => {
  console.log('\n✅ [CLIENTE] Pago confirmado:');
  console.log('   Booking ID:', data.bookingId);
  console.log('   Estado:', data.status);
  console.log('   Monto:', data.amount);
});

customerSocket.on('booking_status_changed', (data) => {
  console.log('\n📝 [CLIENTE] Estado de reserva actualizado:');
  console.log('   Booking ID:', data.id);
  console.log('   Nuevo estado:', data.status);
});

customerSocket.on('new_message', (data) => {
  console.log('\n💬 [CLIENTE] Nuevo mensaje:');
  console.log('   De:', data.sender?.email);
  console.log('   Contenido:', data.content);
});

// ========================================
// EVENTOS GLOBALES (AMBOS)
// ========================================

vendorSocket.on('slots_updated', (data) => {
  console.log('\n📅 [VENDEDOR] Slots actualizados:');
  console.log('   Servicio ID:', data.serviceId);
  console.log('   Slots afectados:', data.slotIds);
  console.log('   Nuevo estado:', data.status);
});

customerSocket.on('slots_updated', (data) => {
  console.log('\n📅 [CLIENTE] Slots actualizados:');
  console.log('   Servicio ID:', data.serviceId);
  console.log('   Slots afectados:', data.slotIds);
  console.log('   Nuevo estado:', data.status);
});

// ========================================
// MANEJO DE ERRORES
// ========================================

vendorSocket.on('connect_error', (error) => {
  console.error('❌ Error de conexión (Vendedor):', error.message);
});

customerSocket.on('connect_error', (error) => {
  console.error('❌ Error de conexión (Cliente):', error.message);
});

// ========================================
// INFORMACIÓN INICIAL
// ========================================

console.log('\n' + '='.repeat(50));
console.log('🎯 Cliente WebSocket de Prueba - Kuin Twin API');
console.log('='.repeat(50));
console.log('\nEscuchando eventos en tiempo real...');
console.log('\nPara probar:');
console.log('1. Crea una reserva desde la API o Postman');
console.log('2. Simula un pago');
console.log('3. Envía mensajes de chat');
console.log('4. Crea/elimina slots de disponibilidad');
console.log('\nPresiona Ctrl+C para salir\n');

// ========================================
// CLEANUP
// ========================================

process.on('SIGINT', () => {
  console.log('\n\n👋 Cerrando conexiones...');
  vendorSocket.disconnect();
  customerSocket.disconnect();
  process.exit(0);
});
