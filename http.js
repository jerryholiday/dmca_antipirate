const axios = require('axios');

// 创建 axios 实例
const instance = axios.create({
  timeout: 10000, // 10 秒超时
  headers: {
    'Content-Type': 'application/json'
  }
});

// 响应拦截器
instance.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    return Promise.reject(error);
  }
);

const queryBooks = async (pageNum, pageSize) => {
  const res = await instance.get(`http://127.0.0.1:3000/dmca/books`, {
    params: {
      pageNum,
      pageSize
    }
  });
  return res.data;
}

const submitBookHrefs = async (cbid, hrefs) => {
  const res = await instance.post(`http://127.0.0.1:3000/dmca/submitBookHrefs`, {
    cbid,
    hrefs,
  });
  return res;
}

module.exports = {
  queryBooks,
  submitBookHrefs,
};