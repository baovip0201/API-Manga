let dataRequest = [];
module.exports= (req, res, next) => {
    // Thiết lập giới hạn là 1000 request trong 1 phút
    const limit = 1000;
    const interval = 60 * 1000; // 1 phút
    const now = Date.now();
  
    // Lấy ra danh sách request đã gửi trong khoảng thời gian interval
    const requests = dataRequest.filter((request) => {
      return now - request.timestamp < interval;
    });
  
    // Nếu số lượng request vượt quá giới hạn, trả về lỗi 429 - Too Many Requests
    if (requests.length >= limit) {
      res.status(429).send({ message: 'Too Many Requests' });
      return;
    } 
    // Nếu chưa vượt quá giới hạn,tiếp tục xử lý request
    dataRequest.push({
        timestamp: now,
        ip: req.ip
      });
    next();
  };