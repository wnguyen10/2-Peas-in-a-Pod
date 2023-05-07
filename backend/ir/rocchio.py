import numpy as np
from ir.recommendation import get_total_tfidf, show_name_to_index, docs_compressed_normed, get_top_k_filtered_recs_given_query

def rocchio(user1_pref, user2_pref, relevant, irrelevant, input_doc_matrix=docs_compressed_normed,
            show_name_to_index=show_name_to_index, a=1, b=0.7, c=0.2):
    """ 
    Params: {user1_pref: Dict,
            user2_pref: Dict, 
             relevant: List (the names of relevant podcasts for query),
             irrelevant: List (the names of irrelevant podcasts for query),
             input_doc_matrix: Numpy Array,
             movie_name_to_index: Dict,
             a,b,c: floats (weighting of the original query, relevant queries,
                             and irrelevant queries, respectively),
    Returns: Numpy Array representing the modified query vector
    """
    indiv_one_tfidf = get_total_tfidf(user1_pref["genres"], user1_pref["publishers"], user1_pref["phrases"], user1_pref["podcasts"])
    indiv_two_tfidf = get_total_tfidf(user2_pref["genres"], user2_pref["publishers"], user2_pref["phrases"], user2_pref["podcasts"])
    original_query = (indiv_one_tfidf + indiv_two_tfidf) / 2

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
        new_query[i] = a * original_query[i] + \
            relevant_vector[i] - irrelevant_vector[i]

    new_recommendations = get_top_k_filtered_recs_given_query(new_query, user1_pref, user2_pref)

    return new_recommendations
