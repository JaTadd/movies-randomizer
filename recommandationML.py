import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib
import mlflow

MOVIES_FILE = "movieDB.movies.json"

def load_movie_data(file_path):
    # Charger les données JSON
    movies = pd.read_json(file_path)
    return movies

# Prepare datas
def prepare_data(movies):
    movies['genres_text'] = movies['genres'].apply(lambda x: ' '.join(x))
    
    movies['IMDBRating'] = movies['IMDBRating'].fillna(movies['IMDBRating'].mean())
    movies['year'] = pd.to_numeric(movies['year'], errors='coerce').fillna(0) 
    movies['NumVotes'] = movies['NumVotes'].fillna(0)
    movies['popularity'] = movies['NumVotes'] / movies['NumVotes'].max()  
    # Créer des labels fictifs 
    movies['label'] = [1 if i % 2 == 0 else 0 for i in range(len(movies))]
    # movies['label'] = movies['popularity'].apply(lambda x: 1 if x > 2*movies['popularity'].mean() else 0)

    return movies

# Entraîner le modèle
def train_model(movies):
    # Vectoriser les genres avec TF-IDF
    tfidf = TfidfVectorizer()
    genre_matrix = tfidf.fit_transform(movies['genres_text'])
    
    X = pd.concat(
        [pd.DataFrame(genre_matrix.toarray()), movies[['IMDBRating', 'NumVotes', 'year', 'popularity']].reset_index(drop=True)],
        axis=1
    )
    y = movies['label']
    
    X.columns = X.columns.astype(str)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Précision du modèle : {accuracy:.2f}")
    
    return model, tfidf, accuracy

# ML Flow
def save_model_with_mlflow(model, tfidf, accuracy):
    mlflow.set_experiment("Recommandation Content-Based")
    with mlflow.start_run():
        mlflow.log_param("model_type", "Random Forest")
        mlflow.log_metric("accuracy", accuracy)
        
        joblib.dump(model, "content_based_model.pkl")
        joblib.dump(tfidf, "tfidf_vectorizer.pkl")
        
        mlflow.log_artifact("content_based_model.pkl")
        mlflow.log_artifact("tfidf_vectorizer.pkl")
        print("Modèle et TF-IDF enregistrés avec MLFlow.")

if __name__ == "__main__":
    movies = load_movie_data(MOVIES_FILE)
    movies = prepare_data(movies)
    
    model, tfidf, accuracy = train_model(movies)
    
    save_model_with_mlflow(model, tfidf, accuracy)
