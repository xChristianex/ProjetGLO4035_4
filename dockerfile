# Partir de l’image officielle de Python 3.7
FROM python:3.7-slim

# Mettre le code de l’application dans le répertoire / de l’image
WORKDIR /

# Copier les librairie nécessaire à votre application
ADD requirements.txt /

# Installer les packages Python nécessaires dans requirements.txt
RUN pip install -r requirements.txt

EXPOSE 80

# Copier le code de l’application dans le répertoire /
ADD . /

# Lancer le script app.py quand le container démarre
CMD ["python","app.py"]