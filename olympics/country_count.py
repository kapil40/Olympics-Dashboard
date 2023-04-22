import pandas as pd

# Read in the CSV file
df = pd.read_csv('olympics.csv')

filtered_df = df[df["Season"] == "Summer"]

filtered_df['Age'] = filtered_df['Age'].fillna(-1).astype(int) 
filtered_df['Weight'] = filtered_df['Weight'].fillna(-1).astype(int) 
filtered_df['Height'] = filtered_df['Height'].fillna(-1).astype(int) 
filtered_df["Medal"].fillna("NA", inplace=True)
# filtered_df = filtered_df[filtered_df["Year"] == 1896]
filtered_df['Team'] = filtered_df['Team'].replace('Soviet Union', 'Russia')
filtered_df['NOC'] = filtered_df['NOC'].replace('URS', 'RUS')

new_df = filtered_df[['Age', 'Weight', 'Height', 'Sex']]

# Group by the 'Country' column and count the number of occurrences
country_counts = filtered_df.groupby('NOC').size().reset_index(name='Count')

sports_count = filtered_df.groupby('Sport').size().reset_index(name='Count')
sports_count= sports_count.sort_values(by='Count', ascending=False)
sports_count = sports_count.head(20)


# Write the new CSV file
new_df.to_csv('pcp.csv',index=False)
country_counts.to_csv('output.csv', index=False)
filtered_df.to_csv("filtered_summer.csv", index=False)