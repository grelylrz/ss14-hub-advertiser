const axios = require('axios');

const serverAddress = 'ss14://121.127.37.17:1212/'; // поменяйте на айпи своего сервера(express приложения).Формат ss14:// обязателен.

axios.post('https://hub.spacestation14.com/api/servers/advertise', { Address: serverAddress })
  .then(response => {
    console.log('Server advertised successfully:', response.data);
  })
  .catch(error => {
    if (error.response) {
      console.error('Error advertising server:', error.response.data);
      console.error('HTTP Status Code:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
  });
