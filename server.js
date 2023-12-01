const PORT = process.env.PORT || 8060;
const express = require(`express`);
const app = express();
// stylesheet
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  const bananas = "bananas";
  console.log(res.body);
  const templateVars = {bananas};
  res.render('pages/index', templateVars);
});

app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
  console.log(`http://localhost:8060`);
})