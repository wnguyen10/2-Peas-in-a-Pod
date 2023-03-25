def find_similar_genres(user1_pref, user2_pref):
    user1_set = set(user1_pref)
    user2_set = set(user2_pref)
    return user1_set.intersection(user2_set)