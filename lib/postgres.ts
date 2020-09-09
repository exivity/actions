import { exec } from '@actions/exec'
import { platform } from 'os'
import path from 'path'

export async function startPostgres(password: string = 'postgres') {
  const script =
    platform() === 'win32'
      ? 'postgres-start-windows.sh'
      : 'postgres-start-linux.sh'

  await exec(`bash ${script}`, undefined, {
    // Once bundled, executing file will be /{action-name}/dist/index.js
    cwd: path.resolve(__dirname, '..', '..', 'lib'),
    env: {
      ATTRIBUTES: 'SUPERUSER CREATEDB CREATEROLE INHERIT LOGIN',
      PASSWORD: password,
    },
  })
}
