from pymongo import MongoClient
from flask import Flask, request, make_response, render_template
from mongoengine import Document, StringField, FloatField, connect

application = Flask("my_glo4035_application")

#--Connection definition
connect(host="mongodb://TestMoi:TestMoi2@ds045087.mlab.com:45087/projetglo4035_4")

#--Class definition
class Insertion(Document):
    product = StringField(required=True)
    quantity = FloatField(required=True)

#--Application route
@application.route("/", methods=["GET"])
def root():
    return render_template("accueil.html")
    
@application.route("/transactions", methods=["GET", "POST"])
def transactions():
    if request.method == "POST":
        #Test if the password for the deletion process is valid and refresh the browser with the error code and state.
        if request.form["myMethod"] == "DELETE":
            if request.form["password"] == "TestEffacer":
                return render_template("transactions.html", state="Bon mot de passe", error=200), 200
            
            else:
                return render_template("transactions.html", state="Mauvais mot de passe", error=401), 401
        
        #Test if the input for the insertion process is valid and refresh the browser with the error code and state.
        elif request.form["myMethod"] == "PUT":
            try: 
                doc = Insertion(product=request.form["product"], quantity=request.form["quantity"])
                doc.save()
                return render_template("transactions.html", state="Document bien formaté", error=200), 200
            
            except: 
                return render_template("transactions.html", state="Document mal formaté", error=400), 400
    
    #Show the default page (any method other than POST)
    return render_template("transactions.html")

#--Main section
if __name__ ==  "__main__":
    application.run(host="0.0.0.0", port=80)