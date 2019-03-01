# Home-Field-Advantage

HOME FIELD ADVANTAGE

Purpose</n>
Home field advantage is often talked about when teams play against rivals 
or make it to the playoffs. The purpose of this project is to determine 
how much of an advantage playing at home has. Using data 
from the 2012 - 2016 seasons for 3 major sports we will be able to determine the advantage for each team, which sports home field is more advantageous for, and which states have the best advantage. 

Datasets  
NFL - https://www.kaggle.com/toddwfloyd/footballscores  
NBA - api for stats.nba.com  
MLB -   


OVERVIEW:

Folders:

Data - Contains csv files and jupyter notebooks.  notebooks used to push data to mongodb and to web scrape for team logos.  mongodb folder contains a dump that can be used to restore the db (named sportsDB)

Flask

  -templates folder contains html pages
  
  -static folder has js files that correspond to the html pages.  also contains various d3/leaflet extension files (draw geodesic lines       etc.)
  -app.py used to pull data from mongo_db
    /api/<sport> (nba, nfl, mlb) provide team data by season
    /api/nbageo - provides a json with stadium coordinates, team names, and team-specific matchup data used on the map
    /bar - page with bar graph
    /travel-map - page with map
    /datapage - view/search data in html tables
    /index - home page
    layout.html - layout used for each page
  
 
