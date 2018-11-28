import pymongo

def getItem(DBApp):
    #Get the items
    curItem = DBApp.item.find({}, {"_id": False, "item": True}).sort("item", pymongo.ASCENDING)

    #Transform to array
    arrItem = []
    for dictItem in curItem:
        arrItem.append(dictItem['item'])

    return arrItem

def getCategory(DBApp):
    #Get the categories
    curCategory = DBApp.item.aggregate([
        #TODO : see if we need to keep this {"$project": {"category": {"$arrayElemAt": ["$category", 1]}}},
        {"$unwind": "$category"},
        {"$group": {"_id": "$category"}},
        {"$sort": {"_id": 1}}
    ])

    #Transform to array of value
    arrCategory = []
    for dictCaterogy in curCategory:
        arrCategory.append(dictCaterogy['_id'])

    return arrCategory


def getJobDetail(DBApp, floatJob):
    #Get the inventory for the specified job
    arrInventory = list(DBApp.inventory.aggregate([
        {"$match": {"job_id": floatJob}},
        {"$group": {
            "_id": {"item": "$item", "unit": "$unit"}, 
            "sumQty": {"$sum": "$qty"}}
        }
    ]))

    #TODO : encapsulate getJobDetail and getInventory proc.
    #Get the conversion
    arrConversion = list(DBApp.item.find(
        {"conversion": {"$exists": True}}, 
        {"_id": False, "item": True, "conversion": True}
    ))

    dictAnswer = {}
    for dictInventory in arrInventory:        
        #Set default conversion unit
        floatConvert = float(1)
        strUnit = dictInventory['_id']['unit']

        for dictConversion in arrConversion:
            #If a conversion exist for this item's unit, autoconvert to ml
            #TODO : Might not always be ideal since we might want to convert g to kg later on... anyway.
            if dictConversion['item'] == dictInventory['_id']['item']:
                floatConvert = float(dictConversion['conversion'][strUnit])
                strUnit = 'ml'

        #Create the item 
        if dictInventory['_id']['item'] not in dictAnswer:
            dictAnswer[dictInventory['_id']['item']] = {}
        
        #Create the unit in the item
        if strUnit not in dictAnswer[dictInventory['_id']['item']]:
            dictAnswer[dictInventory['_id']['item']][strUnit] = 0

        #List all unconverted unit and sum there qty
        dictAnswer[dictInventory['_id']['item']][strUnit] += (float(dictInventory['sumQty']) * floatConvert)

    return dictAnswer


def getInventory(DBApp, dateInv):
    #Get the inventory at the specified date
    arrInventory = list(DBApp.inventory.aggregate([
        {"$match": {"date": {"$lte": dateInv}}},
        {"$group": {
            "_id": {"item": "$item", "unit": "$unit"}, 
            "sumQty": {"$sum": "$qty"}}
        }
    ]))

    #Get the conversion
    arrConversion = list(DBApp.item.find(
        {"conversion": {"$exists": True}}, 
        {"_id": False, "item": True, "conversion": True}
    ))

    dictAnswer = {}
    for dictInventory in arrInventory:        
        #Set default conversion unit
        floatConvert = float(1)
        strUnit = dictInventory['_id']['unit']

        for dictConversion in arrConversion:
            #If a conversion exist for this item's unit, autoconvert to ml
            #TODO : Might not always be ideal since we might want to convert g to kg later on... anyway.
            if dictConversion['item'] == dictInventory['_id']['item']:
                floatConvert = float(dictConversion['conversion'][strUnit])
                strUnit = 'ml'

        #Create the item 
        if dictInventory['_id']['item'] not in dictAnswer:
            dictAnswer[dictInventory['_id']['item']] = {}
        
        #Create the unit in the item
        if strUnit not in dictAnswer[dictInventory['_id']['item']]:
            dictAnswer[dictInventory['_id']['item']][strUnit] = 0

        #List all unconverted unit and sum there qty
        dictAnswer[dictInventory['_id']['item']][strUnit] += (float(dictInventory['sumQty']) * floatConvert)

    return dictAnswer

def getTotalCost(DBApp, dateCost, strCategory):
    arrCategory = []
    arrCategory.append(strCategory)
    floatResult = 0

    #Get the items in the category
    arrItem = list(DBApp.item.find(
        {"category": {"$in": arrCategory}}, 
        {"_id": False, "item": True}
    ))

    #Set list of item name
    arrItemName = []
    for dictItem in arrItem:
        arrItemName.append(dictItem['item'])

    #Get total cost
    arrCost = list(DBApp.cost.aggregate([
        {"$match": {"date": {"$lte": dateCost}, "item": {"$in": arrItemName}}},
        {"$group": {"_id": 1, "sumSTotal": {"$sum": "$stotal"}}}
    ]))

    if len(arrCost) != 0:
        floatResult = arrCost[0]['sumSTotal']
    
    return floatResult

def getAverageCost(DBApp, dateCost, strCategory, strUnit):
    arrCategory = []
    arrCategory.append(strCategory)

    #Get the items in the category
    arrItem = list(DBApp.item.find(
        {"category": {"$in": arrCategory}}, 
        {"_id": False, "item": True, "conversion" : True}
    ))

    #Set list of item name
    arrItemName = []
    for dictItem in arrItem:
        arrItemName.append(dictItem['item'])

    #Aggregate stotal per item, per unit
    arrCost = list(DBApp.cost.aggregate([
        {"$match": {"date": {"$lte": dateCost}, "item": {"$in": arrItemName}}},
        {"$group": 
            {"_id": {"item": "$item", "unit": "$unit"},
            "sumSTotal": {"$sum": "$stotal"},
            "sumQty": {"$sum": "$qty"}}
        }
    ]))

    dictAnswer = {}
    for dictCost in arrCost:
        floatConvert = 1
        strConvertUnit = dictCost['_id']['unit']

        if dictCost['_id']['unit'] != strUnit:
            for dictItem in arrItem:
                if dictItem['item'] == dictCost['_id']['item']:
                    if 'conversion' in dictItem:
                        if strUnit in dictItem['conversion']:
                            floatConvert = float(dictItem['conversion'][strUnit])
                            strConvertUnit = strUnit
        
        #Create the unit
        if strConvertUnit not in dictAnswer:
            dictAnswer[strConvertUnit] = {}
            dictAnswer[strConvertUnit]['qty'] = 0
            dictAnswer[strConvertUnit]['stotal'] = 0
            dictAnswer[strConvertUnit]['avgCost'] = 0

        #List all unconverted unit and sum there qty
        dictAnswer[strConvertUnit]['qty'] += \
            (float(dictCost['sumQty']) * floatConvert)

        dictAnswer[strConvertUnit]['stotal'] += \
            float(dictCost['sumSTotal'])

        if dictAnswer[strConvertUnit]['qty'] != 0:
            dictAnswer[strConvertUnit]['avgCost'] = \
                dictAnswer[strConvertUnit]['stotal'] / \
                dictAnswer[strConvertUnit]['qty']

    for field in dictAnswer.keys():
        dictAnswer[field].pop('stotal')
        dictAnswer[field].pop('qty')
        
    return dictAnswer