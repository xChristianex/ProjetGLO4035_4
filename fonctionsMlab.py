from pymongo import *
import pprint
from flask import Flask, make_response, request
application = Flask("my_glo4035_application")

mongodb_URI = "mongodb://TestMoi:TestMoi2@ds045087.mlab.com:45087/projetglo4035_4"
client = MongoClient(mongodb_URI, connectTimeoutMS=30000)
db = client.get_database("projetglo4035_4")
test = db.test_collection


"""
Pour vider la collection de la BD, on a juste à demander un autre mot de passe qui n'est pas relié à mlab.
Parce que sera déjà connecté à mlab par ce qui est écrit plus haut et qui devra être exécuté dès le début (sinon ne pourra pas rien faire dans bd)
C'est ce que je comprends.
Le mot de passe pour dropper BD à donner au prof : TestEffacer.
"""
@application.route("/", methods=["DELETE"])
def effacer():
    if request.method == "DELETE":
        password = request.form['password']
            if password is not "TestEffacer":
                 return make_response("Mauvais mot de passe", 401)
            else:
                return make_response("Bon mot de passe", 200)
    return render_template('page???')

"""
On défini dans la classe ce qu'on veut dans le doc et les restrictions
voir:https://realpython.com/introduction-to-mongodb-and-python/#inserting-documents
ou http://docs.mongoengine.org/guide/defining-documents.html
"""

class Insertion(Document):
    produit = StringField(required=True)
    quantite = FloatField(required=True)

@application.route("/", methods=["POST"])
def verifier():
    if request.method == "POST":
        prod = request.form['Produit utilisé']
        quant = request.form['Quantité utilisée']
        
        try:
            doc = Insertion(prod, quant)
            doc.save()
            return make_response("Document mal formaté", 400)
        except ValidationError:
            return make_response("Document bien formaté", 200)
