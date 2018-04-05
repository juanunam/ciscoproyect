import _pickle as cPickle
import sys
import pandas as pd
fileurl = sys.argv[1]
trafico = pd.read_json(fileurl)

pred_validation  = trafico[['application','destination']].drop_duplicates()


result = pred_validation.to_json(orient='records')
print(result)