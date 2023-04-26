const http = require('http');
const os = require('os');
const querystring = require('querystring');

// Tạo một server HTTP đơn giản
http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      // Lấy thông tin từ form
      const postData = querystring.parse(body);
      const name = postData.name;
      const email = postData.email;

      // Lấy thông tin máy tính
      const osType = os.type();
      const platform = os.platform();
      const arch = os.arch();
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const homeDir = os.homedir();
      const userInfo = os.userInfo();
      const networkInterfaces = os.networkInterfaces();

      // Trả về kết quả cho người dùng
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write(`Name: ${name}\n`);
      res.write(`Email: ${email}\n`);
      res.write(`Operating system: ${osType}\n`);
      res.write(`Platform: ${platform}\n`);
      res.write(`CPU architecture: ${arch}\n`);
      res.write(`Total memory (bytes): ${totalMem}\n`);
      res.write(`Free memory (bytes): ${freeMem}\n`);
      res.write(`Home directory: ${homeDir}\n`);
      res.write(`User info: ${JSON.stringify(userInfo)}\n`);
      res.write(`Network interfaces: ${JSON.stringify(networkInterfaces)}\n`);
      res.end();
    });
  } else {
    // Trả về form cho người dùng điền thông tin
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`
      <html>
        <body>
          <form method="post">
            <label for="name">Name:</label>
            <input type="text" name="name"><br>
            <label for="email">Email:</label>
            <input type="email" name="email"><br>
            <button type="submit">Submit</button>
          </form>
        </body>
      </html>
    `);
    res.end();
  }
}).listen(8080);

console.log('Server running at http://localhost:8080/');
