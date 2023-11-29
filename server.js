const PORT = process.env.PORT || 8060;
const express = require(`express`);
const app = express();

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('pages/index');
    console.log(`Loaded!`);
  });

app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
})