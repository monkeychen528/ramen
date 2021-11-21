const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));
app.use('/socket.io', createProxyMiddleware({ target: 'https://ramen-chatroom.herokuapp.com', ws: true }));

app.get('*', (req, res) => {
  console.log(req, 'req');
  console.log(res, 'res');
  res.sendFile(path.join(publicPath, 'index.html'));
});


app.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
