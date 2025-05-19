# Mon Vieux Grimoire – API & Backend

![image](https://github.com/user-attachments/assets/7cd34aa3-1943-4cb6-9d22-b637e79512ba)

Bienvenue dans le dépôt GitHub du projet **Mon Vieux Grimoire**, une API et un back-end pour une application de gestion de livres et de notes, réalisés dans le cadre de mon parcours de formation.

## Sommaire

- Présentation
- Fonctionnalités principales
- Spécifications techniques de l’API
- Modèles de données
- Sécurité
- Optimisation des images
- Installation et utilisation
- Stack technique

---

## Présentation

Ce projet propose une API REST sécurisée permettant la gestion d’une collection de livres, leur notation par les utilisateurs, et la gestion de l’authentification. Il répond à un cahier des charges précis, intégrant des règles métier et des exigences de sécurité robustes.

---

## Fonctionnalités principales

- **Inscription et connexion des utilisateurs** (avec hachage des mots de passe)
- **Ajout, modification, suppression de livres** (avec gestion des droits)
- **Optimisation et stockage des images mises en ligne**
- **Notation des livres** (une seule note par utilisateur, note non modifiable)
- **Calcul automatique de la note moyenne**
- **Classement des livres par note**
- **Sécurisation des routes sensibles via JWT**
- **Gestion des erreurs conforme aux spécifications**

---

## Spécifications techniques de l’API

| Méthode | Endpoint                      | Authentification | Corps de la requête                      | Réponse attendue         | Description                                                                 |
|---------|------------------------------|------------------|------------------------------------------|--------------------------|-----------------------------------------------------------------------------|
| POST    | /api/auth/signup             | Non              | { email, password }                      | { message }              | Création d’un utilisateur, mot de passe haché                               |
| POST    | /api/auth/login              | Non              | { email, password }                      | { userId, token }        | Connexion utilisateur, retourne un JWT                                      |
| GET     | /api/books                   | Non              | -                                        | [books]                  | Liste tous les livres                                                        |
| GET     | /api/books/:id               | Non              | -                                        | book                     | Détail d’un livre                                                           |
| GET     | /api/books/bestrating        | Non              | -                                        | [books]                  | Top 3 des livres les mieux notés                                             |
| POST    | /api/books                   | Oui              | { book, image }                          | { message }              | Ajout d’un livre (image + données)                                          |
| PUT     | /api/books/:id               | Oui              | { book } ou { book, image }              | { message }              | Modification d’un livre (seulement par son propriétaire)                    |
| DELETE  | /api/books/:id               | Oui              | -                                        | { message }              | Suppression d’un livre (et de son image, par le propriétaire uniquement)    |
| POST    | /api/books/:id/rating        | Oui              | { userId, rating }                       | book                     | Ajout d’une note (0 à 5, une seule fois par utilisateur, non modifiable)     |

> Toutes les routes de modification de livres nécessitent une authentification et vérifient que l’utilisateur courant est bien le propriétaire du livre.

---

## Modèles de données

### Utilisateur (`User`)

```
{
email: String, // unique, obligatoire
password: String // haché, obligatoire
}
```

### Livre (`Book`)

```
{
userId: String, // propriétaire (MongoDB ObjectId)
title: String,
author: String,
imageUrl: String,
year: Number,
genre: String,
ratings: [
{
userId: String, // MongoDB ObjectId
grade: Number // 0 à 5
}
],
averageRating: Number
}
```
> Les adresses e-mail sont uniques et vérifiées par Mongoose.

---

## Sécurité

- **Mot de passe** : haché avant stockage (bcrypt)
- **JWT** : authentification par token sur toutes les routes sensibles
- **Vérification d’unicité** : e-mail unique dans la base
- **Contrôle d’accès** : seul le propriétaire d’un livre peut le modifier ou le supprimer
- **Gestion des erreurs** : les erreurs sont renvoyées telles qu’elles sont produites, sans modification
- **Validation des entrées** : Les données entrées par les utilisateurs sont validées en terme de longueur et les injections XSS sont prévenues

---

## Optimisation des images

- **Stockage des images mise par les utilisateur** : Utilisation de multer et stockage en mémoire tampon pour de meilleures performances
- **Redimensionnement et compression** : Utilisation de sharp, dimensionnement avec une largeur de 448px, modification du format en WebP et compression (80% de la qualité originale)
- **Sauvegarde dans un repertoire image** : Vérification de la présence du repertoire ou création avec path et fs, puis enregistrement au format `userID_timestamp.webp`

---

## Installation et utilisation

1. **Cloner le dépôt**
```
git clone https://github.com/controleur/mon-vieux-grimoire-backend.git
cd mon-vieux-grimoire-backend
```
3. **Installer les dépendances**
```
npm install
```
5. **Configurer les variables d’environnement**
- Créez un fichier `.env` à la racine avec votre variable `DATABASE` (chaîne de connexion MongoDB).

4. **Lancer le serveur**
```
npm start
```
> Ce projet est configuré pour fonctionner avec le front-end suivant : https://github.com/OpenClassrooms-Student-Center/P7-Dev-Web-livres.

5. **L’API est accessible sur** `http://localhost:4000/`

---

## Stack technique

- **Environnement d'exécution** : Node.js 22.12
- **Framework:** : Express 5.1.0
- **Base de donnée** : MongoDB 8.0.9
- **Modèles de données** : Mongoose 7.8.7 (version compatible avec unique validator)
- **Variables d'environnement** : Dotenv 16.5.0
- **Validation des entrées** : validator 13.15
- **Vérification d'unicité** : mongoose unique validator 4.0.1
- **Gestion de token** : jsonwebtoken 9.0.2
- **Téléchargement de fichiers** : Multer 1.4.5-lts.2
- **Optimisation des images** : Sharp 0.34.1
- **Cryptage** : Bcrypt 5.1.1

