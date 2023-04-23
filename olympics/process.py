import numpy as np
import pandas as pd  
import json
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from flask_socketio import SocketIO
from sklearn.decomposition import PCA
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn import preprocessing

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

selected_year = 0
selected_line = []

@app.route('/trigger-script', methods=['GET'])
def trigger_script():
    year = json.loads(request.args.get('selectedYear')) 
    global selected_year
    selected_year = year
    
    generate_map_json()
    generate_barchart_json()
    generate_pcp_json()
    generate_pca_json()
    return jsonify(year)

@app.route('/trigger-pcp', methods=['GET'])
def trigger_pcp():
    line = json.loads(request.args.get('selectedPCPLines'))
    global selected_line
    selected_line = line
    # print(selected_line)
    generate_map_pcp_json()
    generate_barchart_pcp_json()
    return jsonify(line)

@socketio.on('connect')
def generate_map_json():
    df = pd.read_csv('test.csv')
    
    filtered_df = df[df["Year"] == selected_year]

    country_counts = filtered_df.groupby('NOC').size().reset_index(name='Count')
    country_counts = country_counts.rename(columns={'NOC': 'iso3'})
    json_str = country_counts.to_json()
    response = make_response(json_str)
    response.headers['Content-Disposition'] = 'attachment; filename=map.json'
    response.headers['Content-Type'] = 'application/json'

    socketio.emit('updated-map-json', response.data.decode('utf-8'))

@socketio.on('connect')
def generate_map_pcp_json():
    df = pd.read_csv('test.csv')
    
    filtered_df = df[df["Year"] == selected_year]
    filtered_df = filtered_df[filtered_df['ID'].isin(selected_line)]
    country_counts = filtered_df.groupby('NOC').size().reset_index(name='Count')
    country_counts = country_counts.rename(columns={'NOC': 'iso3'})
    json_str = country_counts.to_json()
    response = make_response(json_str)
    response.headers['Content-Disposition'] = 'attachment; filename=map.json'
    response.headers['Content-Type'] = 'application/json'

    socketio.emit('updated-map-json', response.data.decode('utf-8'))

@socketio.on('connect')
def generate_barchart_json():
    df = pd.read_csv('test.csv')
    
    filtered_df = df[df["Year"] == selected_year]
    
    sports_count = filtered_df.groupby('Sport').size().reset_index(name='Count')
    sports_count= sports_count.sort_values(by='Count', ascending=False)
    sports_count = sports_count.head(20)
    
    json_str = sports_count.to_json()
    
    response = make_response(json_str)
    
    response.headers['Content-Disposition'] = 'attachment; filename=barchart.json'
    response.headers['Content-Type'] = 'application/json'

    socketio.emit('updated-barchart-json', response.data.decode('utf-8'))

@socketio.on('connect')
def generate_barchart_pcp_json():
    df = pd.read_csv('test.csv')
    
    filtered_df = df[df["Year"] == selected_year]
    filtered_df = filtered_df[filtered_df['ID'].isin(selected_line)]
    
    sports_count = filtered_df.groupby('Sport').size().reset_index(name='Count')
    sports_count= sports_count.sort_values(by='Count', ascending=False)
    sports_count = sports_count.head(20)
    
    json_str = sports_count.to_json()
    
    response = make_response(json_str)
    
    response.headers['Content-Disposition'] = 'attachment; filename=barchart.json'
    response.headers['Content-Type'] = 'application/json'

    socketio.emit('updated-barchart-json', response.data.decode('utf-8'))

@socketio.on('connect')
def generate_pcp_json():
    df = pd.read_csv('test.csv')
    filtered_df = df[df["Year"] == selected_year]   
    new_df = filtered_df[['ID', 'Age', 'Weight', 'Height', 'Sex']]
    json_str = new_df.to_json()
    
    response = make_response(json_str)
    response.headers['Content-Disposition'] = 'attachment; filename=pcp.json'
    response.headers['Content-Type'] = 'application/json'

    socketio.emit('updated-pcp-json', response.data.decode('utf-8'))

@socketio.on('connect')
def generate_pca_json():
    df = pd.read_csv('test.csv')
    
    filtered_df = df[df["Year"] == selected_year]
    nocs = filtered_df["NOC"].unique()

    new_country_data = pd.DataFrame()

    for country in nocs:
        country_data = filtered_df[filtered_df["NOC"] == country]

        gold_medals = len(country_data[country_data["Medal"] == "Gold"])
        silver_medals = len(country_data[country_data["Medal"] == "Silver"])
        bronze_medals = len(country_data[country_data["Medal"] == "Bronze"])

        total_medals = gold_medals + silver_medals + bronze_medals

        if total_medals > 0:
            data = {
                "Country": country,
                "Gold": gold_medals,
                "Silver": silver_medals,
                "Bronze": bronze_medals,
            }

        new_country_data = new_country_data.append(data, ignore_index=True)

# print("new country data-->\n",new_country_data)

    data = new_country_data.loc[:, ["Gold", "Silver", "Bronze"]]
    y = new_country_data["Country"]

    le = preprocessing.LabelEncoder()
    countries = le.fit_transform(y)

    scaler = StandardScaler()
    scaler.fit(data)
    scaled_data = scaler.transform(data)

    pca = PCA(n_components=2)
    pca_results = pca.fit_transform(scaled_data)

    pca_x = pca_results[:, 0]
    pca_y = pca_results[:, 1]
    data_dict = {"pca_x": pca_x.tolist(), "pca_y": pca_y.tolist(), "countries": countries.tolist()}
    
    json_str = data_dict.to_json()
    
    
    response = make_response(json_str)
    
    response.headers['Content-Disposition'] = 'attachment; filename=pca.json'
    response.headers['Content-Type'] = 'application/json'

    socketio.emit('updated-pca-json', response.data.decode('utf-8'))

if __name__ == '__main__':
    socketio.run(app)
