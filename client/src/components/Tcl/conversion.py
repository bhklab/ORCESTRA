# Re-importing libraries and reloading the dataset after state reset
import pandas as pd

# Reloading the uploaded dataset
file_path = 'TCL-cell-lines.csv'
data_full = pd.read_csv(file_path)

# Cleaning the data
data_full = data_full.dropna(how='all').fillna('').rename(columns=lambda x: x.strip())

# Renaming the columns for consistency
data_full.columns = [
    "cellLineName",
    "cellosaurusId",
    "diseaseType",
    "subtype",
    "publicDatasets",
    "omicsAvailability",
    "singleAgentTesting",
    "numberOfSingleAgentsAcrossDatasets",
    "numberOfSingleAgentsTCL38",
    "numberOfDrugCombinationsPSet",
    "numberOfDrugCombinationsSYNERGxDB",
    "numberOfDrugCombinationsDrugComb",
    "datasetOnOrcestra"
]

# Converting to the desired format
cell_line_data = [
    {
        "cellLineName": row["cellLineName"],
        "cellosaurusId": row["cellosaurusId"],
        "diseaseType": row["diseaseType"],
        "subtype": row["subtype"],
        "publicDatasets": row["publicDatasets"],
        "omicsAvailability": row["omicsAvailability"],
        "singleAgentTesting": row["singleAgentTesting"],
        "numberOfSingleAgents": {
            "pharmacoDb": row["numberOfSingleAgentsAcrossDatasets"],
            "tcl38": row["numberOfSingleAgentsTCL38"]
        },
        "numberOfDrugCombinations": {
            "pharmacoDb": row["numberOfDrugCombinationsPSet"],
            "tcl38": row["numberOfDrugCombinationsSYNERGxDB"],
            "other": row["numberOfDrugCombinationsDrugComb"]
        },
        "datasetOnOrcestra": row["datasetOnOrcestra"]
    }
    for _, row in data_full.iterrows()
]

# Displaying the data for confirmation
print(cell_line_data)
