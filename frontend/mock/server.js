const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('database.json')
const middlewares = jsonServer.defaults()

router.render = (req, res) => {
    res.jsonp({
      data: res.locals.data,
      message: null,
    })
}

server.use(jsonServer.rewriter({
  '/api/v1/*': '/$1',
}));

server.use(middlewares);
server.use(router);
server.listen(5000, () => {
  console.log('JSON Server is running - port 5000')
});