import _pickle as cPickle
import sys
import pandas as pd
model = sys.argv[1]
print(model)
with open(model, 'rb') as f:
	randomF = cPickle.load(f)
fileurl = sys.argv[2]
trafico = pd.read_json(fileurl)
trafico['recv'] = trafico['recv'] / trafico['numClients'] 
trafico['sent'] = trafico['sent'] / trafico['numClients'] 
pred_validation  = trafico[['recv','sent']] 

#Predecimos para los valores del grupo Test
predictions2=randomF.predict(pred_validation )
pred_validation['labels']= predictions2
print(pred_validation.to_json(orient='records'))