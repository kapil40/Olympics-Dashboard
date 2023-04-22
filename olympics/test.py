# import pandas as pd

# df = pd.read_csv("olympics.csv")
# filtered_df = df[df["Season"] == "Summer"]
# filtered_df['Team'] = filtered_df['Team'].replace('Soviet Union', 'Russia')
# filtered_df['NOC'] = filtered_df['NOC'].replace('URS', 'RUS')

# filtered_df[['Height']] = filtered_df.groupby(['Year','NOC'])[['Height']].transform(lambda x: x.fillna(x.mean()))
# filtered_df[['Weight']] = filtered_df.groupby(['Year','NOC'])[['Weight']].transform(lambda x: x.fillna(x.mean()))
# filtered_df[['Age']] = filtered_df.groupby(['Year','NOC'])[['Age']].transform(lambda x: x.fillna(x.mean()))

# filtered_df["Medal"].fillna("NA", inplace=True)

# filtered_df.fillna(method='ffill', inplace=True)
# filtered_df.fillna(method='bfill', inplace=True)

# filtered_df["Age"] = filtered_df["Age"].astype(int)
# filtered_df["Height"] = filtered_df["Height"].astype(int)
# filtered_df["Weight"] = filtered_df["Weight"].astype(int)

# # verify that missing values have been filled with group mean
# filtered_df.to_csv('test.csv',index=False)
# print(filtered_df.isna().sum())

import pandas as pd
import numpy as np

data = pd.read_csv("test.csv")
year = 2016

year_data = data[data["Year"] == year]
year_data = year_data[year_data["Season"]=="Summer"]

# countries = year_data["Team"].unique()
# print("countries -->",countries)
nocs = year_data["NOC"].unique()
print("countries -->",nocs)
# print("unique countries in year {} --> {}".format(year, len(year_data["Team"].unique()) ))

new_country_data = pd.DataFrame()

for country in nocs:

    country_data = year_data[year_data["NOC"] == country]

    avg_age = country_data["Age"].mean()
    avg_height = country_data["Height"].mean()
    avg_weight = country_data["Weight"].mean()

    # medals = country_data["Medal"].value_counts()
    # print("medal counts-->",medals)

    # print("country_data before dropping duplicated-->\n",country_data)
    
    # country_data = country_data.drop_duplicates(subset=['Sport','Event','Medal'])

    # print("country_data after dropping duplicated-->\n",country_data)
    noc_df = country_data[(country_data['NOC'] == country) & (country_data['Year'] == year)]

    # Group by both Sport and Event columns and count the number of Gold medals
    gold_medals = len(noc_df[noc_df['Medal'] == 'Gold'].groupby(['Sport', 'Event']).agg({'Medal': 'count'}))
    silver_medals = len(noc_df[noc_df['Medal'] == 'Silver'].groupby(['Sport', 'Event']).agg({'Medal': 'count'}))
    bronze_medals = len(noc_df[noc_df['Medal'] == 'Bronze'].groupby(['Sport', 'Event']).agg({'Medal': 'count'}))
    # gold_medals = len(country_data[country_data["Medal"] == 'Gold'])
    # silver_medals = len(country_data[country_data["Medal"] == 'Silver'])
    # bronze_medals = len(country_data[country_data["Medal"] == "Bronze"])

    # print("Gold medals for {} --> {}".format(country, gold_medals))
    # print("Silver medals for {} --> {}".format(country, silver_medals))
    # print("Bronze medals for {} --> {}".format(country, bronze_medals))

    data = {
        "Country": country,
        "Average_Age":avg_age,
        "Average_Height":avg_height,
        "Average_Weight":avg_weight,
        "Gold":gold_medals,
        "Silver":silver_medals,
        "Bronze":bronze_medals
    }

    new_country_data = new_country_data.append(data, ignore_index=True)

    # break



print("dataframe-->\n",new_country_data.sort_values(by=['Gold'], ascending=False))