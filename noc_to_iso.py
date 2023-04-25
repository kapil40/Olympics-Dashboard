import pandas as pd
import pycountry

# Read in the CSV file
df = pd.read_csv('olympics/test.csv')

# Map NOC codes to ISO 3166-1 alpha-3 codes
iso3_codes = {}
print("all unique countries-->\n",df[df['Team']=="Denmark/Sweden"])

for noc in df['NOC'].unique():
    try:
        iso3_codes[noc] = pycountry.countries.get(alpha_3=noc).alpha_3
    except AttributeError:
        iso3_codes[noc] = 'Unknown'

# Add a new column to the dataframe with the ISO 3166-1 alpha-3 codes
df['iso3'] = df['NOC'].map(iso3_codes)
print("new dataframe with iso3 values-->",len(df[df['iso3']=="Unknown"]))

# Write the new CSV file
# df.to_csv('output.csv', index=False)