const app = require('./app');

// starting the server
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
  console.debug(`Server on port ${app.get('port')}`);
});
