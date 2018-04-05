import _pickle as cPickle
import sys
import pandas as pd
model = sys.argv[1]
with open(model, 'rb') as f:
	randomF = cPickle.load(f)
fileurl = sys.argv[2]
trafico = pd.read_json(fileurl)
trafico['recv'] = trafico['recv'] / trafico['numClients'] 
trafico['sent'] = trafico['sent'] / trafico['numClients'] 
pred_validation  = trafico[['recv','sent']] 

#Predecimos para los valores del grupo Test
predictions2=randomF.predict(pred_validation )
trafico['labels']= predictions2
result = trafico.to_json(orient='records')
print(result)