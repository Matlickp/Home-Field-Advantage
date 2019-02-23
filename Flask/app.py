from flask import Flask, render_template, url_for, flash, redirect, jsonify, Response, send_file
from flask_pymongo import PyMongo
import json
from bson import json_util
from bson.json_util import loads, dumps, CANONICAL_JSON_OPTIONS 
from nba_api.stats.static import teams


app = Flask(__name__)

app.config['MONGO_URI'] = 'mongodb://localhost:27017/sportsDB'
mongo = PyMongo(app)

@app.route("/")
@app.route("/home")
def home():
    return render_template('index.html', title="HOME PAGE JUMBO TEXT HERE")

@app.route("/bar")
def bar():
    return render_template('bar.html', title = "TITLE TO GO HERE")

@app.route("/travel")
def travel():
    return render_template('travel-map.html', title = "TITLE TO GO HERE")

@app.route("/api/nba", methods=['GET'])
def api_nba():

    nba_teams = teams.get_teams()
    team_names = [team["full_name"] for team in nba_teams]

    nba_data = mongo.db.nbateamdata.find({}, {'_id': False})
    nba_json = []
    for record in nba_data:
        nba_json.append({'team': record['TEAM'], 'year': record['YEAR'], 'home_win': record['HOME W'], 'home_loss': record['HOME L'],
            'away_win': record['AWAY W'], 'away_loss': record['AWAY L'], 'home_pct': record['HOME %'], 'away_pct': record['AWAY %']})

    playoff_data = mongo.db.nbaplayoffteamdata.find({}, {'_id': False})
    playoff_json = []
    for record in playoff_data:
        playoff_json.append({'team': record['TEAM'], 'year': record['YEAR'], 'home_win': record['HOME W'], 'home_loss': record['HOME L'],
            'away_win': record['AWAY W'], 'away_loss': record['AWAY L'], 'home_pct': record['HOME %'], 'away_pct': record['AWAY %']})

    total_json = [{'reg': nba_json, 'playoffs': playoff_json}]
    
    return jsonify((total_json))

@app.route("/api/nbageo", methods={'GET'})
def api_nbageo():
    geo_data = mongo.db.nbacoords.find({}, {'_id': False})
    matchup_data = mongo.db.nbamatchup.find({}, {'_id': False})
    geo_json = []
    matchup_json = []

    for record in geo_data:
        geo_json.append({'city': record['CITY'], 'state': record['STATE'], 'lat': record['LAT'], 'lng': record['LNG'] })

    nba_teams = teams.get_teams()
    team_names = [team["full_name"] for team in nba_teams]

    for record in matchup_data:
        matchup_json.append({'team': record['team'], 'opponent': record['opponent'], 'away_wins': record['away_wins'], 'away_losses': record['away_losses']})

    return jsonify({'geo': geo_json, 'teamnames': team_names, 'matchup': matchup_json})




if __name__ == "__main__":
    app.run(debug=True)