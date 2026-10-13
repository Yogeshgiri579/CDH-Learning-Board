import http from 'http';

function check(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data: data.slice(0, 300) });
      });
    }).on('error', (err) => {
      resolve({ error: err.message });
    });
  });
}

async function run() {
  const urls = [
    'http://localhost:5173/',
    'http://localhost:5173/src/main.jsx',
    'http://localhost:5173/src/App.jsx',
    'http://localhost:5173/src/components/CurriculumSheet.jsx',
    'http://localhost:5173/src/components/SessionRow.jsx',
    'http://localhost:5173/src/components/Header.jsx',
    'http://localhost:5173/src/components/ProgressBanner.jsx',
    'http://localhost:5173/src/components/SessionCard.jsx',
    'http://localhost:5173/src/context/AuthContext.jsx'
  ];

  for (const url of urls) {
    const res = await check(url);
    console.log(url, '-->', res.status ? `Status: ${res.status}` : `Error: ${res.error}`);
    if (res.status !== 200 && res.data) {
      console.log('BODY:', res.data);
    }
  }
}

run();
