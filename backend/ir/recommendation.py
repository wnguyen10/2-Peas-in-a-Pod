import numpy as np
import pandas as pd
import pickle
from sklearn.preprocessing import normalize
from nltk.stem.porter import *

df = pd.read_csv("./data/trunc_metadata.csv")

docs_compressed = pickle.load(open("./data/docs_compressed.p", "rb"))
words_compressed = pickle.load(open("./data/words_compressed.p", "rb"))
tfidf_vec = pickle.load(open("./data/tfidf.p", "rb"))
genre_tf_idf = pickle.load(open("./data/genre_tf_idf_dict.p", "rb"))
publisher_tf_idf = pickle.load(open("./data/publisher_tf_idf_dict.p", "rb"))

shows = df.set_index("show_name").to_dict("index")

# Create lookup dictionaries
show_name_to_index = {
    show_name: index
    for index, show_name in enumerate([show_name for show_name in shows])
}
show_index_to_name = {v: k for k, v in show_name_to_index.items()}

words_compressed = words_compressed.transpose()
words_compressed_normed = normalize(words_compressed, axis=1)
docs_compressed_normed = normalize(docs_compressed)

stemmer = PorterStemmer()


def get_genre_tfidf(pref_list):
    """
    Params:
    {
        pref_list: string list of individual one's preferred genres
    }

    Requires: Each genre is a valid category (exists in trunc_metadata.csv)

    Returns: a tf-idf vector representing the individual's total genre preferences
    """
    tf_idf_vec = np.zeros(docs_compressed_normed.shape[1])

    for genre in pref_list:
        tf_idf_vec += genre_tf_idf[genre]

    return tf_idf_vec / len(pref_list)


def get_publisher_tfidf(pref_list):
    """
    Params:
    {
        pref_list: string list of individual one's preferred publishers
    }

    Requires: Each publisher is a valid publisher (exists in trunc_metadata.csv)

    Returns: a tf-idf vector representing the individual's total publisher preferences
    """
    tf_idf_vec = np.zeros(docs_compressed_normed.shape[1])

    for publisher in pref_list:
        tf_idf_vec += publisher_tf_idf[publisher]

    return tf_idf_vec / len(pref_list)


def get_phrase_tfidf(pref_list):
    tf_idf_vec = np.zeros(docs_compressed_normed.shape[1])

    for phrase in pref_list:
        # Use V matrix from SVD to represent query in words_compressed_normed space
        words = phrase.split(" ")
        stemmed_words = [stemmer.stem(word) for word in words]
        query = " ".join(stemmed_words)
        query_tfidf = tfidf_vec.transform([query]).toarray()
        query_vec = normalize(np.dot(query_tfidf, words_compressed)).squeeze()
        tf_idf_vec += query_vec

    return tf_idf_vec / len(pref_list)


def get_podcast_tfidf(pref_list):
    """
    Params:
    {
        pref_list: string list of individual one's preferred podcasts
    }

    Requires: Each podcast is a valid podcast title / show name (exists in trunc_metadata.csv)

    Returns: a tf-idf vector representing the individual's total specific podcast preferences
    """
    tf_idf_vec = np.zeros(docs_compressed_normed.shape[1])

    for podcast in pref_list:
        show_idx = show_name_to_index[podcast]
        tf_idf_vec += docs_compressed_normed[show_idx, :]

    return tf_idf_vec / len(pref_list)


def get_specific_tfidf(pref_type, pref_list):
    """
    Params:
    {
        pref_type: preference type (one of: "GENRE", "PUBLISHER", "PHRASE", "PODCAST")
        pref_list: string list of respective preference indicated by pref_type
    }

    Returns: a tf-idf vector representing the individual's specific preference for pref_type
    """

    if pref_type == "GENRE":
        tf_idf_vec = get_genre_tfidf(pref_list)

    elif pref_type == "PUBLISHER":
        tf_idf_vec = get_publisher_tfidf(pref_list)

    elif pref_type == "PHRASE":
        tf_idf_vec = get_phrase_tfidf(pref_list)

    else:  # pref_type is "PODCAST"
        tf_idf_vec = get_podcast_tfidf(pref_list)

    return tf_idf_vec


def get_total_tfidf(genres, publishers, phrases, podcasts):
    """
    Params:
    {
        genres: string list of individual one's preferred genres
        publishers: string list of individual one's preferred publishers
        phrases: string list of individual one's preferred phrases
        podcasts: string list of individual one's preferred podcast titles
    }

    Requires: For each string in genres, publishers, and podcasts, the preference must exist in the trunc_metadata.csv table

    Returns: a tf-idf vector representing the individual's tastes considering all inputted preferences
    """
    categories_considered = 0

    tf_idf_vec = np.zeros(docs_compressed_normed.shape[1])

    if genres:
        tf_idf_vec += get_specific_tfidf("GENRE", genres)
        categories_considered += 1

    if publishers:
        tf_idf_vec += get_specific_tfidf("PUBLISHER", publishers)
        categories_considered += 1

    if phrases:
        tf_idf_vec += get_specific_tfidf("PHRASE", phrases)
        categories_considered += 1

    if podcasts:
        tf_idf_vec += get_specific_tfidf("PODCAST", podcasts)
        categories_considered += 1

    if categories_considered == 0:
        return tf_idf_vec

    return tf_idf_vec / categories_considered


def get_top_k_filtered_recs_given_query(
    query, indiv_one_duration, indiv_two_duration, k
):
    """
    Params:
    {
        query: TF-IDF vector representing a query (shape of (40, ))
        indiv_one_duration: int list formatted as [min_duration, max_duration] for user duration preference
        indiv_two_duration: same as above
        k: number of recommendations returned (default = 10)
    }

    Returns: a list of k sorted tuples in format (podcast name, cosine similarity). If durations have no overlap, returns [].
    """

    # Find overlap of both user durations
    min_duration = max(indiv_one_duration[0], indiv_two_duration[0])
    max_duration = min(indiv_one_duration[1], indiv_two_duration[1])

    # If max_duration is 60, user is okay with any length greater than 60 as well
    if max_duration == 60:
        max_duration = float("inf")

    # Find indices of podcasts that satisfy duration constraints
    filtered_df = df[
        (df["avg_duration"] >= min_duration) & (df["avg_duration"] <= max_duration)
    ]
    valid_idx = filtered_df.index.tolist()

    # Only calculate similarity for podcasts satisfying duration constraints
    valid_docs = docs_compressed_normed[valid_idx, :]
    similarities = valid_docs.dot(query)
    sorted_idx = np.argsort(similarities)[::-1]

    top_matches = []
    num_iterations = min(k, len(sorted_idx))

    for i in range(num_iterations):
        similarity_score = similarities[sorted_idx[i]]
        if similarity_score != 0:
            podcast_idx = valid_idx[sorted_idx[i]]
            top_matches.append((show_index_to_name[podcast_idx], similarity_score))

    return top_matches


def get_top_k_recommendations(indiv_one_pref, indiv_two_pref, k=10):
    """
    Params:
    {
        indiv_one_pref: preference dictionary for individual one, formatted as such:

            indiv_one_pref =
            {
                "genres": [] (string list),
                "publishers": [] (string list),
                "phrases": [] (string list),
                "podcasts": [] (string list),
                "duration": [min_duration, max_duration] (int list)
            },

        indiv_two_pref: preference dictionary for individual two, formatted exactly as indiv_one_pref
        k: number of recommendations returned (default = 10)
    }

    Requires: For each string in the individual preference dictionaries in genres, publishers, and podcasts, the preference must exist in the trunc_metadata.csv table

    Returns: a list of k sorted tuples in format (podcast name, cosine similarity). If durations have no overlap, returns [].
    """
    indiv_one_tfidf = get_total_tfidf(
        indiv_one_pref["genres"],
        indiv_one_pref["publishers"],
        indiv_one_pref["phrases"],
        indiv_one_pref["podcasts"],
    )
    indiv_two_tfidf = get_total_tfidf(
        indiv_two_pref["genres"],
        indiv_two_pref["publishers"],
        indiv_two_pref["phrases"],
        indiv_two_pref["podcasts"],
    )

    # TF-IDF vector representing combined user preferences
    avg_tfidf = (indiv_one_tfidf + indiv_two_tfidf) / 2

    return get_top_k_filtered_recs_given_query(
        avg_tfidf, indiv_one_pref["duration"], indiv_two_pref["duration"], k
    )
