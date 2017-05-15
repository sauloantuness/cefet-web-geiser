var express = require('express'),
	fs = require("fs"),
    app = express();

var db = {
	players: JSON.parse(fs.readFileSync('server/data/jogadores.json')).players,
	jogosPorJogador: JSON.parse(fs.readFileSync('server/data/jogosPorJogador.json'))
};

app.set('view engine', 'hbs');
app.set('views', 'server/views');

app.get('/', function(req, res) {
	res.render('index', {
		players: db.players
	});
});

app.get('/jogador/:numero_identificador/', function(req, res) {
	var player = db.players.filter(x => x.steamid == req.params.numero_identificador)[0];
	var games = db.jogosPorJogador[req.params.numero_identificador].games;

	var number_games = games.length;
	var games_not_played = games.filter(x => x.playtime_forever == 0).length;

	games.sort(function(a, b) {
		return b.playtime_forever - a.playtime_forever;
	});

	games = games.slice(0, 5);

	games = games.map(x => {
		x.playtime_forever = parseInt(x.playtime_forever / 60);
		return x;
	})

	res.render('jogador', {
		player: player,
		games: games,
		favorite: games[0],
		number_games: number_games,
		games_not_played: games_not_played
	});
});

app.use(express.static('client'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});