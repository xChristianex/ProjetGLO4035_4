import pymongo
import json
from DBClass.DBInput import \
    processInputDict, dropDatabase
from DBClass.DBOutput import \
    getItem, getCategory, getJobDetail, \
    getInventory, getTotalCost, getAverageCost
from flask import Flask, request, make_response, render_template
from mongoengine import Document, StringField, FloatField, connect
from werkzeug.exceptions import HTTPException
from datetime import datetime

application = Flask(__name__)

#--Connection definition
connection = pymongo.MongoClient('ds045087.mlab.com', 45087)
DBApp = connection['projetglo4035_4']
DBApp.authenticate('Equipe4', 'cestpart1')

def setDictCost(dateInv, strItem, floatQty, strUnit, floatSTotal):
    return {
        'date': dateInv.strftime('%d %B %Y'),
        'item': strItem,
        'qte': floatQty,
        'unit': strUnit,
        'stotal': floatSTotal
    }

def setDictInventory(dateInv, strItem, floatJob, floatQty, strUnit):
    return {
        'date': dateInv.strftime('%d %B %Y'),
        'item': strItem,
        'job_id': floatJob,
        'qte': floatQty,
        'unit': strUnit
    }

def setDictItem(strItem, floatConvertG):
    if floatConvertG == float(-1):
        dictItem = {
            'item': strItem,
            'Information': 'item'
        }
    else:
        dictItem = {
            'item': strItem,
            'Information': 'density',
            'ml': '1',
            'g': str(floatConvertG)
        }
    return dictItem

#--Application route
@application.route("/", methods=["GET", "POST"])
def root():
    try:
        if request.method == "POST" :
            #Process with the drop database code 
            dropDatabase(DBApp, request.form["password"])
            return render_template("accueil.html", error=200, state="Database droped... congrats")
                
        return render_template("accueil.html")

    except HTTPException as e:
        return render_template("accueil.html", error=e.code, state=e.description), e.code

    except Exception as e:
        return render_template("accueil.html", error=type(e).__name__, state=str(e)), 1111

@application.route("/fabrication", methods=["GET", "POST"])
def fabrication():
    try:
        #Set default floatJob (view at Get)
        floatJob = float(1)
        arrItem = getItem(DBApp)

        if request.method == 'POST':
            #Get input
            dateInv = datetime.strptime(request.form['datefab'], '%Y-%m-%d')
            strItem = str(request.form.get('choixitem'))
            floatJob = float(request.form['job'])
            floatQty = float(request.form['qte'])
            strUnit = str(request.form['unit'])

            #Save entry
            dictInventory = setDictInventory(dateInv, strItem, floatJob, floatQty, strUnit)
            processInputDict(DBApp, dictInventory)
        
        #Show template
        dictJob = getJobDetail(DBApp, floatJob)
        return render_template("fabrication.html", itemlist=arrItem, job=floatJob, inv=dictJob)
    
    except HTTPException as e:
        return render_template("fabrication.html", error=e.code, state=e.description, itemlist=arrItem), e.code

    except Exception as e:
        return render_template("fabrication.html", error=type(e).__name__, state=str(e), itemlist=arrItem), 1111
    
@application.route("/achats", methods=["GET", "POST"])
def achats():
    try:
        #Set default value
        floatJob = float(-1)
        arrItem = getItem(DBApp)
        
        if request.method == 'POST':
            #Get input
            dateInv = datetime.strptime(request.form['dateachat'], '%Y-%m-%d')
            strItem = str(request.form.get('choixitem'))
            floatQty = float(request.form['qte'])
            strUnit = str(request.form['unit'])
            floatSTotal = float(request.form['stotal'])

            #Save entry
            dictCout = setDictCost(dateInv, strItem, floatQty, strUnit, floatSTotal)
            processInputDict(DBApp, dictCout)
        
        #Show template
        dictJob = getJobDetail(DBApp, floatJob)
        return render_template("achats.html", itemlist=arrItem, job=floatJob, inv=dictJob)

    except HTTPException as e:
        return render_template("achats.html", error=e.code, state=e.description, itemlist=arrItem), e.code

    except Exception as e:
        return render_template("achats.html", error=type(e).__name__, state=str(e), itemlist=arrItem), 1111
    
@application.route("/couts", methods=["GET", "POST"])
def couts():
    try:
        #Set default value
        strCalcul = 'CoutTot'
        arrCategory = getCategory(DBApp)
        floatResult = 0
        strCategory = ''
        dateCost = datetime.now()
        dictResult = {}

        if len(arrCategory) != 0:
            strCategory = arrCategory[0]

        if request.method == "POST":
            #Get input
            strCalcul = str(request.form['calcul'])
            strCategory = str(request.form.get('choixcat'))
            dateCost = datetime.strptime(request.form['datecout'], '%Y-%m-%d')

        #Get result
        if strCalcul == 'CoutTot':
            floatResult = getTotalCost(DBApp, dateCost, strCategory)
        
        elif strCalcul == 'CoutMoyMl':
            dictResult = getAverageCost(DBApp, dateCost, strCategory, 'ml')
            if 'ml' in dictResult:
                floatResult = float(dictResult['ml']['avgCost'])

        elif strCalcul == 'CoutMoyG':
            dictResult = getAverageCost(DBApp, dateCost, strCategory, 'g')
            if 'g' in dictResult:
                floatResult = float(dictResult['g']['avgCost'])

        else:
            raise ValueError("couts : Unexpected calcul selection")

        #Show data
        return render_template("couts.html", itemlist=arrCategory, resultat=str(floatResult), \
            state=strCalcul + ' ' + strCategory + ' ' + dateCost.strftime("%Y-%m-%d"), inv=dictResult )

    except HTTPException as e:
        return render_template("couts.html", error=e.code, state=e.description, itemlist=arrCategory), e.code

    except Exception as e:
        return render_template("couts.html", error=type(e).__name__, state=str(e), itemlist=arrCategory), 1111
    
@application.route("/inventaire", methods=["GET", "POST"])
def inventaire():
    try:
        #Set default date
        dateInv = datetime.now()

        if request.method == "POST":
            #Get input
            dateInv = datetime.strptime(request.form['dateinv'], '%Y-%m-%d')

        #Show template
        dictInv = getInventory(DBApp, dateInv)
        return render_template("inventaire.html", inv=dictInv, state=dateInv.strftime("%Y-%m-%d"))

    except HTTPException as e:
        return render_template("inventaire.html", error=e.code, state=e.description), e.code

    except Exception as e:
        return render_template("inventaire.html", error=type(e).__name__, state=str(e)), 1111

@application.route("/item", methods=["GET", "POST"])
def item():
    try:
        arrItem = getItem(DBApp)
        strSuccessState = ''
        if request.method == "POST":      
            if request.form["myMethod"] == "AjoutConversion":
                strItem = str(request.form.get('choixitem'))
                floatConvertG = float(request.form['conv'])
                strSuccessState = 'Conversion ajoutée / mise à jour : ' + strItem
                
                if floatConvertG <= 0:
                    raise ValueError("item : convertion to gramme should be a positive value.")
                
            else: 
                strItem = str(request.form['item'])
                floatConvertG = float(-1)
                strSuccessState = 'Item ajouté : ' + strItem

            dictItem = setDictItem(strItem, floatConvertG)
            processInputDict(DBApp, dictItem)

        return render_template("item.html", itemlist=arrItem, state=strSuccessState)

    except HTTPException as e:
        return render_template("item.html",  itemlist=arrItem, error=e.code, state=e.description), e.code

    except Exception as e:
        return render_template("item.html",  itemlist=arrItem,error=type(e).__name__, state=str(e)), 1111
    
@application.route("/transactions", methods=["POST", "DELETE"])
def transactions():
    try:
        #Force input parse to json dictionnary
        dictInput = request.get_json(force=True)
        
        #If the method is delete try to drop the database
        if request.method == "DELETE":
            dropDatabase(DBApp, dictInput['password'])
           
        #If the method is post, try to insert rough data in the db than
        #process it as needed in the other collections
        elif request.method == "POST":
            processInputDict(DBApp, dictInput)

        return render_template("transactions.html")

    except HTTPException as e:
        return render_template("transactions.html", error=e.code, state=e.description), e.code

    except Exception as e:
        return render_template("transactions.html", error=type(e).__name__, state=str(e)), 1111
        
#--Main section
if __name__ ==  "__main__":
    application.run(host="0.0.0.0", port=80) 
