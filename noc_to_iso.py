import pandas as pd
import pycountry

# Read in the CSV file
df = pd.read_csv('olympics/test.csv')
df["Medal"].fillna("NA", inplace=True)

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
print("new dataframe with iso3 values-->",df[df['iso3']=="Unknown"]["NOC"].unique())

values_to_drop = ["IOA", "YUG", "ROT", "CRT", "WIF", "UNK", "NFL"]

# Drop rows where "NOC" is in values_to_drop
df = df[~df['NOC'].isin(values_to_drop)]


map = {
    "DEN":"DNK",
    "NED":"NLD",
    "IRI":"IRN",
    "BUL":"BGR",
    "CHA":"TCD",
    "SUD":"SDN",
    "GRE":"GRC",
    "CHI":"CHL",
    "NCA":"NIC",
    "NGR":"NGA",
    "ALG":"DZA",
    "KUW":"KWT",
    "UAR":"EGY",
    "LIB":"LBN",
    "MAS":"MYS",
    "GER":"DEU",
    "RSA":"ZAF",
    "TAN":"TZA",
    "LBA":"LBY",
    "PLE":"PSE",
    "BRU":"BRN",
    "KSA":"SAU",
    "UAE":"ARE",
    "YAR":"YEM",
    "INA":"IDN",
    "PHI":"PHL",
    "EUN":"RUS",
    "CGO":"COG",
    "SUI":"CHE",
    "GDR":"DEU",
    "MON":"NCO",
    "URU":"URY",
    "SRI":"LKA",
    "NIG":"NER",
    "CRC":"CRI",
    "SLO":"SVN",
    "POR":"PRT",
    "PAR":"PRY",
    "ANG":"AGO",
    "FRG":"DEU",
    "BAN":"BGD",
    "ESA":"SLV",
    "PUR":"PRI",
    "HON":"HND",
    "MRI":"MUS",
    "SEY":"SYC",
    "TCH":"CZE",
    "MTN":"MRT",
    "SKN":"KNA",
    "VIN":"VCT",
    "NEP":"NPL",
    "MGL":"MNG",
    "TOG":"TGO",
    "AHO":"NLD",
    "ASA":"ASM",
    "SAM":"WSM",
    "CRO":"HRV",
    "HAI":"HTI",
    "GUI":"GIN",
    "BIZ":"BLZ",
    "YMD":"YEM",
    "BER":"BMU",
    "ANZ":"AUS",
    "SCG":"SRB",
    "OMA":"OMN",
    "FIJ":"FJI",
    "VAN":"VUT",
    "BAH":"BHS",
    "GUA":"GTM",
    "LAT":"LVA",
    "IVB":"VGB",
    "ISV":"VIR",
    "MAD":"MDG",
    "MAL":"MYS",
    "CAY":"CYM",
    "BAR":"BRB",
    "GBS":"GNB",
    "BOT":"BWA",
    "CAM":"KHM",
    "SOL":"SLB",
    "GEQ":"GNQ",
    "SAA":"DEU",
    "ANT":"ATG",
    "ZIM":"ZWE",
    "GRN":"GRD",
    "MYA":"MMR",
    "MAW":"MWR",
    "ZAM":"ZMB",
    "RHO":"ZIM",
    "TPE":"TWN",
    "BOH":"CZE",
    "GAM":"GMB",
    "BUR":"BFA",
    "NBO":"MYS",
    "ARU":"ABW",
    "VIE":"VNM",
    "BHU":"BTN",
    "TGA":"TON",
    "KOS":"KOS",
    "LES":"LSO"
}

# countries = df["NOC"].unique()

# for noc in countries:

#     if noc in map:

#         df[(df["NOC"] == noc) & (df["iso3"] == "Unknown") ]["iso3"] = map[noc]

#         print("{} changes to {}".format(noc, map[noc]))

iso3_series = df['NOC'].map(map)
print("iso3_series-->",len(iso3_series))

# Replace "Unknown" values with mapped ISO3 codes
df['iso3'] = iso3_series.fillna(df['iso3'])

# print("new dataframe with iso3 values-->",df[df['iso3']=="Unknown"]["NOC"].unique())
print("number of null iso3 values-->",df[df['iso3'].isna()])
# Write the new CSV file
df.to_csv('output.csv', index=False)