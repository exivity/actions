import { dockerAction } from '../../lib'

const image = 'exivity/postgres'
const defaultVersion = '12.3'

dockerAction({
  image,
  defaultVersion,
})
