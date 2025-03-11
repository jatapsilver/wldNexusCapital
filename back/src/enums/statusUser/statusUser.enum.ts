export enum StatusUser {
  ACTIVE = 'active', // Usuario activo y en funcionamiento
  INACTIVE = 'inactive', // Usuario desactivado (pero no eliminado)
  PENDING = 'pending', // Usuario registrado, pero esperando verificación
  SUSPENDED = 'suspended', // Usuario suspendido por incumplimiento o fraude
  BANNED = 'banned', // Usuario permanentemente bloqueado
  DELETED = 'deleted', // Usuario eliminado (pero con datos retenidos por razones legales)
}
