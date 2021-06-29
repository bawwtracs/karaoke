
import Karaoke from './src/components/Karaoke'

const components = [
  Karaoke
]

Karaoke.install = app => {
  components.map(component => app.component(component.name, component))
}

export default Karaoke
