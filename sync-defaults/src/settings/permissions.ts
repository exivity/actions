interface PermissionsObject {
  admin?: boolean
  maintain?: boolean
  push?: boolean
  triage?: boolean
  pull?: boolean
}

export function mapPermissionsToPermission(permissions: PermissionsObject) {
  switch (true) {
    case permissions.admin:
      return 'admin' as const

    case permissions.maintain:
      return 'maintain' as const

    case permissions.push:
      return 'push' as const

    case permissions.triage:
      return 'triage' as const

    case permissions.pull:
      return 'pull' as const

    default:
      throw new Error('Permissions object is invalid')
  }
}
