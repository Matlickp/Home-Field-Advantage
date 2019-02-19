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


@app.route("/api/nba", methods=['GET'])
def api_nba():

    nba_teams = teams.get_teams()
    team_names = [team["full_name"] for team in nba_teams]

    nba_data = mongo.db.nbateamdata.find({}, {'_id': False})
    nba_json = []
    for record in nba_data:
        nba_json.append({'team': record['TEAM'], 'year': record['YEAR'], 'home_win': record['HOME W'], 'home_loss': record['HOME L'],
            'away_win': record['AWAY W'], 'away_loss': record['AWAY L'], 'home_pct': record['HOME %'], 'away_pct': record['AWAY %']})


    
    
    return jsonify((nba_json))


if __name__ == "__main__":
    app.run(debug=True)