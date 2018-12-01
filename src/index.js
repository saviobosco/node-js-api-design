import http from 'http'
// import { execute, subscribe } from 'graphql'
import { createServer } from 'http'

import app from './server'
// import schema from './schema'

const server = http.createServer(app)
let currentApp = app
console.log(process.env.PORT);

const port = process.env.PORT || 3000

server.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})

/*if (module.hot) {
	module.hot.accept(['./server'], () => {
		server.removeListener('request', currentApp)
		server.on('request', app)
		currentApp = app
	})
}*/
