import pymongo
from datetime import datetime
from werkzeug.exceptions import Unauthorized

def dropDatabase(DBApp, strPassword):
    #Test password
    if strPassword != "TestEffacer" :
        raise Unauthorized()
    
    #Drop DB collections
    DBApp.roughInput.drop()
    DBApp.item.drop()
    DBApp.inventory.drop()
    DBApp.cost.drop()

    #Recreate indexes
    DBApp.item.create_index([("item", pymongo.ASCENDING)], unique=True)


# Function to get the internal type of the actual dictInput,
# Return False if not found
# Return True if it fit one of the specified pattern
def processInputDict(DBApp, dictInput):
    
    #Push brute value to db
    DBApp.roughInput.insert_one(dictInput)
    blnValid = False

    if isInventorySourcePattern(dictInput) :
        floatMultiplier = float(1)
        if 'type' in dictInput:
            if 'usage' in dictInput['type']:
                floatMultiplier = float(-1)

        formatInputDict(dictInput)
        setItem(DBApp, dictInput)
        setInventory(DBApp, dictInput, floatMultiplier)
        blnValid = True

    if isInformationSourcePattern(dictInput):
        formatInputDict(dictInput)
        setItem(DBApp, dictInput)
        blnValid = True
    
    if isCostSourcePattern(dictInput):
        formatInputDict(dictInput)
        setItem(DBApp, dictInput)
        setInventory(DBApp, dictInput, 1)
        setCost(DBApp, dictInput)
        blnValid = True

    if not blnValid:
        raise ValueError("processInputDict : Unexpected source pattern")
        
def isInventorySourcePattern(dictInput): 
    return 'date' in dictInput \
        and 'item' in dictInput \
        and 'job_id' in dictInput \
        and 'qte' in dictInput \
        and 'unit' in dictInput

def isCostSourcePattern(dictInput):
    return 'date' in dictInput \
        and 'item' in dictInput \
        and 'qte' in dictInput \
        and 'stotal' in dictInput \
        and 'unit' in dictInput

def isInformationSourcePattern(dictInput):
    return  'Information' in dictInput \
        and 'item' in dictInput 

# Function to clean received data 
def formatInputDict(dictInput):
    if 'item' in dictInput:
        dictInput['item'] = dictInput['item'].replace('\u2013', '-').lower()
        dictInput['category'] = dictInput['item'].split(' - ')

    if 'date' in dictInput:
        dictInput['date'] = datetime.strptime(dictInput['date'], '%d %B %Y')

    if 'qte' in dictInput:
        dictInput['qte'] = float(dictInput['qte'])

    if 'stotal' in dictInput:
        dictInput['stotal'] = float(dictInput['stotal'])   

    if 'tax' in dictInput:
        dictInput['tax'] = float(dictInput['tax'])   

    if 'total' in dictInput:
        dictInput['total'] = float(dictInput['total'])         

    if 'unit' in dictInput:
        dictInput['unit'] = dictInput['unit'].lower()

    if 'g' in dictInput:
        dictInput['g'] = float(dictInput['g'])

    if 'ml' in dictInput:
        dictInput['ml'] = float(dictInput['ml'])

    if 'job_id' in dictInput:
        dictInput['job_id'] = float(dictInput['job_id'])
    
    if 'type' in dictInput:
        dictInput['type'] = dictInput['type'].lower()


# Function to create and update the item in the item collection
def setItem(DBApp, dictInput):
    #Get the item
    dictQuery = {
        'item': dictInput['item']
    }

    #Get conversion pattern
    dictConversion = {}
    if 'Information' in dictInput:
        if 'density' in dictInput['Information']:
            dictConversion['conversion.ml'] = dictInput['ml']
            dictConversion['conversion.g'] = dictInput['g']

    #Set my item upsert
    dictUpdate = { 
        '$set': {'item': dictInput['item']},
        '$addToSet': { 'category': {'$each': dictInput['category']}}
    }
    
    #Set my item conversion only if exists
    if dictConversion:
        dictUpdate['$set'] = dictConversion

    DBApp.item.update_one(dictQuery, dictUpdate, upsert=True)

# Function to create the inventory mouvement in the inventory collection
def setInventory(DBApp, dictInput, floatMultiplier) :
    #get standard quantity
    floatQuantity = float(dictInput['qte']) * float(floatMultiplier)

    #set job id to -1 if it doesn't exist (bought some stuff)
    floatJobID = float(-1)
    if 'job_id' in dictInput :
        floatJobID = dictInput['job_id']

    #create the insert query
    dictQuery = {
        'date': dictInput['date'],
        'item': dictInput['item'],
        'job_id': floatJobID,
        'qty': floatQuantity,
        'unit': dictInput['unit']
    }

    #Insert in inventory collection
    DBApp.inventory.insert_one(dictQuery)

# Function to create the cost line in the cost collection
def setCost(DBApp, dictInput):
    #create the insert query
    dictQuery = {
        'date': dictInput['date'],
        'item': dictInput['item'],
        'qty': dictInput['qte'],
        'stotal': dictInput['stotal'],
        'unit': dictInput['unit']
    }

    #Insert in cost collection
    DBApp.cost.insert_one(dictQuery)
