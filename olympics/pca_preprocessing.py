import pandas as pd
import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn import preprocessing
from sklearn.manifold import MDS
import matplotlib.pyplot as plt

data = pd.read_csv("test.csv")
year = 2016

year_data = data[data["Year"] == year]
# year_data = year_data[year_data["Season"] == "Summer"]

nocs = year_data["NOC"].unique()

new_country_data = pd.DataFrame()

for country in nocs:
    country_data = year_data[year_data["NOC"] == country]

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

print("new country data-->\n",new_country_data)

data = new_country_data.loc[:, ["Gold", "Silver", "Bronze"]]
y = new_country_data["Country"]

le = preprocessing.LabelEncoder()
countries = le.fit_transform(y)

scaler = StandardScaler()
scaler.fit(data)
scaled_data = scaler.transform(data)

mds = PCA(n_components=2)
pca_results = mds.fit_transform(scaled_data)

# plt.scatter(pca_results[:, 0], pca_results[:, 1], c=countries)

# for i in range(len(countries)):
#     plt.text(
#         pca_results[i, 0] + 0.02,
#         pca_results[i, 1] + 0.02,
#         y[i],
#         fontsize=8,
#         color="black",
#     )

# plt.xlabel("PC1")
# plt.ylabel("PC2")
# plt.show()
