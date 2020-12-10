import requests
import json

url = 'https://www.orcestra.ca/api/pset/complete'
myobj = {'COMMIT': '', "ZENODO_DOI": '', 'ORCESTRA_ID': '', 'download_link': ''}

x = requests.post(url, data = myobj)

print(x.text)