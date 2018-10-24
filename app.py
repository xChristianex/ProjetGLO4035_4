from pymongo import MongoClient
from flask import Flask, request, make_response, render_template
from mongoengine import Document, StringField, FloatField, connect
from werkzeug.exceptions import BadRequest, Unauthorized

application = Flask("my_glo4035_application")

#--Connection definition
connect(host="mongodb://TestMoi:TestMoi2@ds045087.mlab.com:45087/projetglo4035_4")

#--Application route
@application.route("/", methods=["GET"])
def root():
    return render_template("accueil.html")
    
@application.route("/transactions", methods=["GET", "POST", "DELETE", "PUT"])
def transactions():
    #Test if the password for the deletion process is valid and refresh the browser with the error code and state.
    if (request.method == "POST" and request.form["myMethod"] == "DELETE") or request.method == "DELETE":
        try:
            #Get password from html page
            if (request.method == "POST" and request.form["myMethod"] == "DELETE") : 
                pwd = request.form["password"]

            #Get password from json
            elif request.method == "DELETE" : 
                jsonDoc = request.get_json(force=True)
                pwd = jsonDoc["password"]

            #Test password
            if pwd != "TestEffacer" :
                raise Unauthorized()
            
            #TODO : Drop BD
            return render_template("transactions.html", state="Bon mot de passe", error=200), 200                

        except BadRequest:
            return render_template("transactions.html", state="Document mal formaté", error=400), 400
        
        except Unauthorized:
            return render_template("transactions.html", state="Mauvais mot de passe", error=401), 401
        
    #Test if the input for the insertion process is valid and refresh the browser with the error code and state.
    elif (request.method == "POST" and request.form["myMethod"] == "PUT") or request.method == "PUT":
        try: 
            jsonDoc = request.get_json(force=True)
            return render_template("transactions.html", state="Document bien formaté", error=200), 200
        
        except BadRequest :
            return render_template("transactions.html", state="Document mal formaté", error=400), 400
    
    #Show the default page (GET)
    return render_template("transactions.html")

#--Main section
if __name__ ==  "__main__":
    application.run(host="0.0.0.0", port=8080)
