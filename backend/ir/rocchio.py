import numpy as np
from recommendation import get_publisher_tfidf, show_index_to_name, show_name_to_index, docs_compressed_normed

relevant = []
irrelevant = []


def add_to_relevant(podcast):
    relevant.append(podcast)

def add_to_irrelevant(podcast):
    irrelevant.append(podcast)

def get_individual_tfidf(individual_prefs):
    """
    Params:
    {
        individual_prefs: list of an individual's preferred podcast publishers
    }

    Returns: a tf-idf vector representing an individual's preferred podcasts
    
    """
    individual_tfidf = np.zeros(docs_compressed_normed.shape[1])
    
    for pref in individual_prefs:
        if pref.type == "Publisher":
            individual_tfidf += get_publisher_tfidf(pref.data)
        elif pref.type == "Genre":
            # TODO: fix 
            individual_tfidf += get_publisher_tfidf(pref.data)
        elif pref.type == "Podcast":
             # TODO: fix 
            individual_tfidf += get_publisher_tfidf(pref.data)
        
    return individual_tfidf / len(individual_prefs)

def rocchio(user1_pref, user2_pref, relevant=relevant, irrelevant=irrelevant, input_doc_matrix=docs_compressed_normed, \
            show_name_to_index=show_name_to_index,a=0.8, b=0.6, c=0.2):
    """ 
    Params: {query: Numpy array representing two users' preference vectors,
             relevant: List (the names of relevant podcasts for query),
             irrelevant: List (the names of irrelevant podcasts for query),
             input_doc_matrix: Numpy Array,
             movie_name_to_index: Dict,
             a,b,c: floats (weighting of the original query, relevant queries,
                             and irrelevant queries, respectively),
    Returns: Numpy Array representing the modified query vector
    """
    # YOUR CODE HERE
    original_query = get_individual_tfidf(user1_pref) + get_individual_tfidf(user2_pref)
    new_query = np.zeros(len(original_query))
    relevant_vector = np.zeros(len(original_query))
    irrelevant_vector = np.zeros(len(original_query))
    
    irrelevant_i = []
    relevant_i = []
    
    for name in relevant:
        relevant_i.append(show_name_to_index[name])
    for name in irrelevant:
        irrelevant_i.append(show_name_to_index[name])
    
    for i in relevant_i:
        relevant_vector = np.add(relevant_vector, input_doc_matrix[i, :])
    if relevant:
        relevant_vector = (b/len(relevant)) * relevant_vector
            
    for i in irrelevant_i:
        irrelevant_vector = np.add(irrelevant_vector, input_doc_matrix[i, :])
    if irrelevant:
        irrelevant_vector = (c/len(irrelevant)) * irrelevant_vector

    for i in range(len(new_query)):
        new_query[i] = original_query[i] + relevant_vector[i] - irrelevant_vector[i]
        
    for i in range(len(new_query)):
        if new_query[i] < 0:
            new_query[i] = 0
    
    return new_query