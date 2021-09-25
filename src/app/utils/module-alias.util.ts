import * as path from 'path'
import moduleAlias from 'module-alias'

const files = path.resolve(__dirname, '..', '..')

moduleAlias.addAliases({
  '@app': path.join(files, 'app'),
  '@test': path.join(files, 'test'),
  '@utils': path.join(files, 'app', 'utils'),
  '@enums': path.join(files, 'app', 'enums'),
  '@logger': path.join(files, 'logger'),
  '@typings': path.join(files, 'typings')
})
