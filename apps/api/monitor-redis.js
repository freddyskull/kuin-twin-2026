const Redis = require('ioredis');

// ========================================
// CONFIGURACIÓN
// ========================================
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = new Redis(REDIS_URL);

// Colores para la terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// ========================================
// FUNCIONES DE MONITOREO
// ========================================

async function getRedisInfo() {
  const info = await redis.info('stats');
  const lines = info.split('\r\n');
  const stats = {};
  
  lines.forEach(line => {
    const [key, value] = line.split(':');
    if (key && value) {
      stats[key] = value;
    }
  });
  
  return stats;
}

async function monitorCache() {
  console.clear();
  
  // Header
  console.log(colors.bright + colors.cyan + '='.repeat(70) + colors.reset);
  console.log(colors.bright + '📊 Monitor de Caché Redis - Kuin Twin API' + colors.reset);
  console.log(colors.cyan + '='.repeat(70) + colors.reset);
  console.log();
  
  // Información del servidor
  const stats = await getRedisInfo();
  console.log(colors.yellow + '📈 Estadísticas del Servidor:' + colors.reset);
  console.log(`   Total de comandos: ${stats.total_commands_processed || 'N/A'}`);
  console.log(`   Conexiones totales: ${stats.total_connections_received || 'N/A'}`);
  console.log(`   Clientes conectados: ${stats.connected_clients || 'N/A'}`);
  console.log();
  
  // Obtener todas las claves
  const keys = await redis.keys('*');
  
  console.log(colors.green + `🔑 Claves en Caché: ${keys.length}` + colors.reset);
  console.log();
  
  if (keys.length === 0) {
    console.log(colors.yellow + '   ⚠️  No hay claves en el caché' + colors.reset);
    console.log();
    return;
  }
  
  // Agrupar claves por tipo
  const grouped = {
    services: [],
    categories: [],
    users: [],
    other: [],
  };
  
  keys.forEach(key => {
    if (key.startsWith('service')) grouped.services.push(key);
    else if (key.startsWith('categor')) grouped.categories.push(key);
    else if (key.startsWith('user')) grouped.users.push(key);
    else grouped.other.push(key);
  });
  
  // Mostrar por grupos
  for (const [group, groupKeys] of Object.entries(grouped)) {
    if (groupKeys.length === 0) continue;
    
    const icon = {
      services: '🛠️',
      categories: '📁',
      users: '👤',
      other: '📦',
    }[group];
    
    console.log(colors.bright + `${icon} ${group.toUpperCase()}:` + colors.reset);
    
    for (const key of groupKeys) {
      const ttl = await redis.ttl(key);
      const type = await redis.type(key);
      const size = await getKeySize(key, type);
      
      // Formatear TTL
      let ttlStr;
      if (ttl === -1) {
        ttlStr = colors.magenta + 'Sin expiración' + colors.reset;
      } else if (ttl === -2) {
        ttlStr = colors.yellow + 'Expirada' + colors.reset;
      } else {
        const minutes = Math.floor(ttl / 60);
        const seconds = ttl % 60;
        ttlStr = `${minutes}m ${seconds}s`;
      }
      
      console.log(`   ${colors.blue}▸${colors.reset} ${key}`);
      console.log(`     Tipo: ${type} | Tamaño: ${size} | TTL: ${ttlStr}`);
    }
    console.log();
  }
  
  // Memoria usada
  const memoryInfo = await redis.info('memory');
  const memoryLines = memoryInfo.split('\r\n');
  const usedMemory = memoryLines.find(l => l.startsWith('used_memory_human'));
  if (usedMemory) {
    const [, value] = usedMemory.split(':');
    console.log(colors.cyan + `💾 Memoria usada: ${value}` + colors.reset);
  }
  
  console.log();
  console.log(colors.yellow + '🔄 Actualizando cada 3 segundos... (Ctrl+C para salir)' + colors.reset);
}

async function getKeySize(key, type) {
  try {
    if (type === 'string') {
      const value = await redis.get(key);
      return `${value.length} bytes`;
    } else if (type === 'hash') {
      const count = await redis.hlen(key);
      return `${count} campos`;
    } else if (type === 'list') {
      const count = await redis.llen(key);
      return `${count} elementos`;
    } else if (type === 'set') {
      const count = await redis.scard(key);
      return `${count} miembros`;
    }
    return 'N/A';
  } catch (error) {
    return 'Error';
  }
}

// ========================================
// COMANDOS INTERACTIVOS
// ========================================

async function showCommands() {
  console.log(colors.bright + '\n📋 Comandos Disponibles:' + colors.reset);
  console.log('   1. Ver todas las claves');
  console.log('   2. Ver valor de una clave');
  console.log('   3. Eliminar una clave');
  console.log('   4. Limpiar todo el caché');
  console.log('   5. Ver estadísticas');
  console.log('   0. Salir');
  console.log();
}

async function interactiveMode() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const question = (query) => new Promise((resolve) => rl.question(query, resolve));
  
  while (true) {
    await showCommands();
    const choice = await question('Selecciona una opción: ');
    
    switch (choice.trim()) {
      case '1':
        const keys = await redis.keys('*');
        console.log(colors.green + `\n🔑 Claves encontradas: ${keys.length}` + colors.reset);
        keys.forEach((key, i) => console.log(`   ${i + 1}. ${key}`));
        break;
        
      case '2':
        const keyName = await question('Nombre de la clave: ');
        const value = await redis.get(keyName);
        if (value) {
          console.log(colors.green + '\n✅ Valor:' + colors.reset);
          console.log(JSON.stringify(JSON.parse(value), null, 2));
        } else {
          console.log(colors.yellow + '\n⚠️  Clave no encontrada' + colors.reset);
        }
        break;
        
      case '3':
        const keyToDelete = await question('Nombre de la clave a eliminar: ');
        const deleted = await redis.del(keyToDelete);
        if (deleted) {
          console.log(colors.green + '\n✅ Clave eliminada' + colors.reset);
        } else {
          console.log(colors.yellow + '\n⚠️  Clave no encontrada' + colors.reset);
        }
        break;
        
      case '4':
        const confirm = await question('¿Estás seguro? (s/n): ');
        if (confirm.toLowerCase() === 's') {
          await redis.flushall();
          console.log(colors.green + '\n✅ Caché limpiado completamente' + colors.reset);
        }
        break;
        
      case '5':
        const stats = await getRedisInfo();
        console.log(colors.cyan + '\n📊 Estadísticas:' + colors.reset);
        Object.entries(stats).forEach(([key, value]) => {
          console.log(`   ${key}: ${value}`);
        });
        break;
        
      case '0':
        console.log(colors.yellow + '\n👋 Saliendo...' + colors.reset);
        rl.close();
        redis.disconnect();
        process.exit(0);
        
      default:
        console.log(colors.yellow + '\n⚠️  Opción inválida' + colors.reset);
    }
    
    await question('\nPresiona Enter para continuar...');
    console.clear();
  }
}

// ========================================
// MAIN
// ========================================

const args = process.argv.slice(2);

if (args.includes('--monitor') || args.includes('-m')) {
  // Modo monitor continuo
  setInterval(monitorCache, 3000);
  monitorCache();
} else if (args.includes('--interactive') || args.includes('-i')) {
  // Modo interactivo
  interactiveMode();
} else {
  // Mostrar ayuda
  console.log(colors.bright + '\n🔧 Monitor de Redis - Kuin Twin API' + colors.reset);
  console.log('\nUso:');
  console.log('   node monitor-redis.js --monitor       Monitor en tiempo real');
  console.log('   node monitor-redis.js --interactive   Modo interactivo');
  console.log();
  
  // Ejecutar monitor por defecto
  setInterval(monitorCache, 3000);
  monitorCache();
}

// ========================================
// CLEANUP
// ========================================

process.on('SIGINT', () => {
  console.log(colors.yellow + '\n\n👋 Cerrando conexión con Redis...' + colors.reset);
  redis.disconnect();
  process.exit(0);
});
