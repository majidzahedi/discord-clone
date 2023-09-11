import { edenTreaty } from '@elysiajs/eden'
import type { App } from '../server'

 const api = edenTreaty<App>('http://localhost:8007')

 export default api
