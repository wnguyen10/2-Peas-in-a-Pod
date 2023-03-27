import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

df = pd.read_csv("./data/trunc_metadata.csv")
doc_by_vocab = pd.read_csv("./data/trunc_tfidf.csv").to_numpy()

shows = df.set_index('show_name').to_dict('index')

# Create lookup dictionaries
show_name_to_index = {show_name : index for index, show_name in enumerate([show_name for show_name in shows])}
show_index_to_name = {v:k for k,v in show_name_to_index.items()}

publisher_to_show_name = {}

for show_name in shows:
    publisher = shows[show_name]["publisher"]
    if publisher in publisher_to_show_name:
        publisher_to_show_name[publisher].append(show_name)
    else:
        publisher_to_show_name[publisher] = [show_name]

def get_publisher_tfidf(publisher_name):
    """
    Params:
    {
        publisher_name (string): name of podcast publisher
    }

    Returns: tf-idf vector representing all podcasts made by publisher_name
    
    """
    publisher_shows = publisher_to_show_name[publisher_name]
    
    publisher_tfidf = np.zeros(doc_by_vocab.shape[1])
    
    for show in publisher_shows:
        show_idx = show_name_to_index[show]
        show_tfidf = doc_by_vocab[show_idx, :]
        publisher_tfidf += show_tfidf
        
    return publisher_tfidf / len(publisher_shows)

def get_individual_tfidf(individual_prefs):
    """
    Params:
    {
        individual_prefs: list of an individual's preferred podcast publishers
    }

    Returns: a tf-idf vector representing an individual's preferred podcasts
    
    """
    individual_tfidf = np.zeros(doc_by_vocab.shape[1])
    
    for publisher in individual_prefs:
        publisher_tfidf = get_publisher_tfidf(publisher)
        individual_tfidf += publisher_tfidf
        
    return individual_tfidf / len(individual_prefs)

def get_pair_tfidf(pref_one, pref_two):
    """
    Params:
    {
        pref_one: list of individual one's preferred podcast publishers
        pref_two: list of individual two's preferred podcast publishers
    }

    Returns: a tf-idf vector representing the preferences for a pair of individuals
    """
    
    individual_one_tfidf = get_individual_tfidf(pref_one)
    individual_two_tfidf = get_individual_tfidf(pref_two)
    
    return (individual_one_tfidf + individual_two_tfidf) / 2

def get_top_k_recommendations(pref_one, pref_two, k = 10):
    """ 
    Params: 
    {
        pref_one: list of individual one's preferred podcast publishers
        pref_two: list of individual two's preferred podcast publishers
        k: number of recommendations returned (default = 10)
    }

    Returns: a list of k sorted tuples in format (podcast name, cosine similarity) 
    """
    pair_tfidf = get_pair_tfidf(pref_one, pref_two)
    pair_tfidf = pair_tfidf.reshape((1, doc_by_vocab.shape[1]))
    similarities = cosine_similarity(pair_tfidf, doc_by_vocab)[0]
    sorted_idx = np.argsort(similarities)[::-1]
    
    top_matches = []
    for i in range(k):
        top_matches.append((show_index_to_name[sorted_idx[i]], similarities[sorted_idx[i]]))

    return top_matches

