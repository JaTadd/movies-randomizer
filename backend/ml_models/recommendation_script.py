import sys
import json
import ast
import pandas as pd
from pymongo import MongoClient
from sklearn.metrics.pairwise import cosine_similarity
import joblib

# Connexion à MongoDB
def get_movies_from_db():
    client = MongoClient("mongodb+srv://jeanalexistaddei:3AtAGveoDeHmxqNv@targetdummybdd.4jjdl.mongodb.net/MovieRandomizer?retryWrites=true&w=majority")
    db = client.MovieRandomizer
    collection = db.movies
    movies = pd.DataFrame(list(collection.find()))
    return movies

# Générer des recommandations
def recommend_movies(watched_titles, model_path, tfidf_path):
    tfidf = joblib.load(tfidf_path)
    movies = get_movies_from_db()
    genres_matrix = tfidf.transform(movies['genres'].apply(lambda x: ' '.join(x)))
    watched_indices = movies[movies['title'].isin(watched_titles)].index.tolist()

    if not watched_indices:
        return []

    watched_vectors = genres_matrix[watched_indices]
    similarities = cosine_similarity(watched_vectors, genres_matrix)
    mean_similarities = similarities.mean(axis=0)
    similar_indices = mean_similarities.argsort()[::-1]
    recommended_indices = [i for i in similar_indices if i not in watched_indices][:10]

    recommended_movies = movies.iloc[recommended_indices]['title'].tolist()
    return recommended_movies

if __name__ == "__main__":
    print("Arguments reçus :", sys.argv)

    try:
        if sys.argv[1].endswith(".json"):
            with open(sys.argv[1], "r") as file:
                watched_titles = json.load(file)
        else:
            watched_titles = ast.literal_eval(sys.argv[1])  

        model_path = sys.argv[2]
        tfidf_path = sys.argv[3]

        recommendations = recommend_movies(watched_titles, model_path, tfidf_path)

        # Retour JSON
        print(json.dumps(recommendations))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
