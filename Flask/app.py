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

@app.route("/api/nfl", methods=['GET'])
def api_nfl():
    nfl_data = mongo.db.nflteamdata.find({}, {'_id': False})
    nfl_json = []
    for record in nfl_data:
        nfl_json.append({'team': record['TEAM'], 'year': record['YEAR'], 'home_win': record['HOME W'], 'home_loss': record['HOME L'],
            'away_win': record['AWAY W'], 'away_loss': record['AWAY L'], 'home_pct': record['HOME %'], 'away_pct': record['AWAY %']})
    nfls = [{'reg': nfl_json}]
    return jsonify((nfls))

@app.route("/api/nbageo", methods={'GET'})
def api_nbageo():
    geo_data = mongo.db.nbacoords.find({}, {'_id': False})
    nfl_geo_data = mongo.db.nflcoords.find({}, {'_id': False})
    matchup_data = mongo.db.nbamatchupdict.find({}, {'_id': False})
    nfl_matchup_data = mongo.db.nflmatchupdict.find({}, {'_id': False})
    geo_json = []
    nfl_geo_json = []
    matchup_json = {}
    nfl_matchup_json = {}
    for record in geo_data:
        geo_json.append({'city': record['CITY'], 'state': record['STATE'], 'lat': record['LAT'], 'lng': record['LNG'] })

    for record in nfl_geo_data:
       nfl_geo_json.append({'team': record['TEAM NAME'], 'lat': record['LAT'], 'lng': record['LONG'] })

    nba_teams = teams.get_teams()
    team_names = [team["full_name"] for team in nba_teams]

    geo_icon_data = mongo.db.nbaiconcoords.find({}, {'_id': False})
    geo_icon_json = []

    nfl_geo_icon_data = mongo.db.nfliconcoords.find({}, {'_id': False})
    nfl_geo_icon_json = []

    for record in geo_icon_data:
        geo_icon_json.append({'city': record['CITY'], 'state': record['STATE'], 'lat': record['LAT'], 'lng': record['LNG'] })

    for record in nfl_geo_icon_data:
       nfl_geo_icon_json.append({'team': record['TEAM NAME'], 'lat': record['LAT'], 'lng': record['LONG'] })

    nba_teams = teams.get_teams()
    team_names = [team["full_name"] for team in nba_teams]

    nfl_teams = mongo.db.nflcoords.find({}, {'_id': False})
    nfl_team_names = [record['TEAM NAME'] for record in nfl_teams]

    # for name in team_names:
    #     for record in matchup_data:
    #         matchup_json.append(matchup_data[name])
    for record in matchup_data:
        for team in team_names:
            team_dict = {}
            team_dict[team] = record[team]
            matchup_json[team] = record[team]

    for record in nfl_matchup_data:
        print(record)
        for team in nfl_team_names:
            team_dict = {}
            team_dict[team] = record[team]
            nfl_matchup_json[team] = record[team]

    print(nfl_matchup_json)

    totaldict = {'nba': matchup_json, 'nfl': nfl_matchup_json}

    totalgeo = {'nba': geo_json, 'nfl': nfl_geo_json}
    totalicongeo = {'nba': geo_icon_json, 'nfl': nfl_geo_icon_json}
    totalnames = {'nba': team_names, 'nfl': nfl_team_names}


    return jsonify({'geo': totalgeo, 'geoicons': totalicongeo, 'teamnames': totalnames, 'matchup': totaldict})




if __name__ == "__main__":
    app.run(debug=True)