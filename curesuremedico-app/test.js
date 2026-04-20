const https = require('https');
function getImage(title) {
  return new Promise((resolve) => {
    https.get('https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=' + title + '&pithumbsize=1000&format=json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
            const pages = JSON.parse(data).query.pages;
            for (let id in pages) {
                if (pages[id].thumbnail) resolve(pages[id].thumbnail.source);
                else resolve(null);
            }
        } catch (e) { resolve(null); }
      });
    });
  });
}
async function run() {
  console.log('India:', await getImage('India'));
  console.log('Thailand:', await getImage('Thailand'));
  console.log('United Arab Emirates:', await getImage('United_Arab_Emirates'));
  console.log('Apollo Hospitals:', await getImage('Apollo_Hospitals'));
  console.log('Bumrungrad International Hospital:', await getImage('Bumrungrad_International_Hospital'));
  console.log('Cleveland Clinic:', await getImage('Cleveland_Clinic'));
}
run();
