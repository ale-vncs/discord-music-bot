import * as path from 'path'
import moduleAlias from 'module-alias'

const files = path.resolve(__dirname, '..', '..', '..')

moduleAlias.addAliases({
  '@context': path.join(files, 'src', 'app', 'context'),
  '@config': path.join(files, 'src', 'config'),
  '@utils': path.join(files, 'src', 'app', 'utils'),
  '@modules': path.join(files, 'src', 'app', 'modules'),
  '@enums': path.join(files, 'src', 'app', 'enums'),
  '@logger': path.join(files, 'src', 'logger'),
  '@middleware': path.join(files, 'src', 'app', 'middleware'),
  '@exceptions': path.join(files, 'src', 'app', 'exceptions'),
  '@filters': path.join(files, 'src', 'app', 'filters'),
  '@typings': path.join(files, 'typings')
})
