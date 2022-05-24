#!/usr/bin/env python
# coding: utf-8

# In[9]:
"""
File : Apis.py
Author : Pruthvi Vadhirajarao Sreenivasan
Co-author: Rudy Lie
Date : 18/04/2022
About : This File Consists All the required APIS written in flask for the front end to connect with the ElasticSearch and
        Machine Learning Algorithms, This File contains multiple Apis therefore, kindy read the comments inside the functions
        to further understand the APIS.
        *** This File needs confog.ini file to run, Config file cntains secret credentials for the Elastic Search Service
        Kindly make sure you have Config.ini file in the appropriate location.
"""

from flask import Flask, render_template
from configparser import ConfigParser
from elastic_enterprise_search import AppSearch
from flask import jsonify, request
import flask
import ast
import numpy as np
import pandas as pd
from flask_jsonpify import jsonpify
from sklearn.impute import SimpleImputer
from sklearn.metrics import pairwise_distances
import math, json
from flask_cors import CORS, cross_origin
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.metrics.pairwise import linear_kernel, cosine_similarity
from random import randrange


# region Initial loading for ratings and books dataset

ratings = pd.read_csv('ratings.csv')
books = pd.read_csv('books_cleaned.csv')

df = ratings.merge(books[['book_id', 'original_title']],
                   how='left', on='book_id')

# drop empty book id
df = df[df['book_id'].notna()]

# discard books with no rating
rating_count = pd.DataFrame(df['book_id'].value_counts())
rare_books = rating_count[rating_count['book_id'] < 1].index
df_train = df[~df['book_id'].isin(rare_books)]
df_train = df_train.dropna()

# pivot the table (for each user, which books they have rated)
user_ratings_df = df_train.pivot_table(index=['user_id'], columns=[
                                       'book_id'], values='rating')

# endregion


# region Initial loading for content based recommendation

content_based_filtering_df = pd.read_csv("content_based_filtering_df.csv", sep=",", error_bad_lines=False, engine='python')

# combine the text features
def concat_texts(df):
    return ''.join(str(df['cleaned_title']) + ' | ' + str(df['cleaned_authors']) + ' | ' 
                   + str(int(df['original_publication_year'])) + ' | ' + str(df['language_code']) + ' | ' + str(df['cleaned_tag']))

content_based_filtering_df['combined_features'] = content_based_filtering_df.apply(concat_texts, axis=1)

# use count and tfidf vectorizers, and compare how the models perform
count_vec = CountVectorizer().fit_transform(content_based_filtering_df['combined_features'])

# get the similarity matrices, with combination of vectorizers (count vectorizer, TF-IDF vectorizer) and kernels (cosine, linear)
cs_count_vec = cosine_similarity(count_vec, count_vec)

# include indexing for quick query and drop duplicates
indices = pd.Series(content_based_filtering_df.index, index=content_based_filtering_df['book_id']).drop_duplicates()

# endregion

# using config parser package to access the credientials of elastic search
parser = ConfigParser()
parser.read('config.ini')
EngineUrl = parser['Engine']['URL']
EngineKey = parser['Engine']['Key']

app_search = AppSearch(EngineUrl, http_auth=EngineKey)

app = Flask(__name__)
CORS(app)

app.url_map.strict_slashes = False


def getUserEntry(user):
    """
    Function to get the user details using the username from
    the elastic search service.
    Parameters : Username of the user desired to get information. 
    """
    userresponse = app_search.search(
        engine_name="user-data",
        body={
            "query": "",
            "filters": {
                "all": [
                    {"username": user}
                ]
            }
        })
    return userresponse


def scoreCorrect(username):
    """
    A function to calculate the score for the leaderboard
    this function uses the ratings,comments and followings 
    of a user to calculate the score. In this function
    the user details is obtained and the score is calculated.
    Parameters : Username of the desired user
    """
    user = username
    userresponse = getUserEntry(user)

    ES_id = userresponse['results'][0]['id']['raw']

    if 'follow' in userresponse['results'][0].keys():
        follow = userresponse['results'][0]['follow']['raw']
        if follow == []:
            follow_Score = 0
        else:
            follow_Score = len(follow)
    else:
        follow_Score = 0

    if 'comments' in userresponse['results'][0].keys():
        comment = userresponse['results'][0]['comments']['raw']
        if comment == []:
            comment_Score = 0
        else:
            comment_Score = len(comment)
    else:
        comment_Score = 0



    if 'ratings' in userresponse['results'][0].keys():
        rating = userresponse['results'][0]['ratings']['raw']
        if rating == []:
            rating_Score = 0
        else:
            rating_Score = len(rating)
    else:
        rating_Score = 0




    final_score = (follow_Score * 25) + (comment_Score * 25) + (rating_Score * 50)
    resp = app_search.put_documents(engine_name="user-data",documents=[{"id": ES_id,"score": final_score}])
    return {"STATUS" : "SCORE UPDATED"}

def checkuseralreadyexists(username, password):
    """
    A function to check if the user already exists.
    If the username already exists in the database.
    The function return user already exists.
    """
    response = app_search.search(
        engine_name="user-data",
        body={
                    "query": "",
            "filters": {
                "all": [
                    {"username": username},
                    {"password": password}
                ]
            }
        })
    checklist = response['results']
    if not checklist:
        return {"STATUS": "User Does Not Exit"}
    else:
        return {"STATUS": "User Exits"}


def get_initial_recommendations(books_df, num_recommendation=20, count_threshold_percent=0.1):

    # average ratings
    overall_ratings = books_df.average_rating.mean()

    # as the dataset is large, we only care about the top n% most rated books
    min_count = books_df.ratings_count.quantile(1 - count_threshold_percent)
    popular_books = books_df.copy().loc[books_df["ratings_count"] >= min_count]

    # compute the score, taking account both rating and the number of ratings
    def weighted_rating(df, m=min_count, C=overall_ratings):
        v = df['ratings_count']
        R = df['average_rating']
        # calculation based true Bayesian estimate used in the IMDB formula
        score = (v / (v + m) * R) + (m / (m + v) * C)
        return score

    # calculate the score and sort the results based on the score
    popular_books['score'] = popular_books.apply(weighted_rating, axis=1)
    popular_books = popular_books.sort_values('score', ascending=False)

    # top books we should recommend for the new users with zero interaction
    recommended_books = popular_books[['book_id', 'title', 'authors',
                                       'ratings_count', 'average_rating', 'score']].head(num_recommendation)

    # comment/uncomment this to debug and evaluate
    print(
        recommended_books[['title', 'ratings_count', 'average_rating', 'score']])

    # returns the recommended book ID
    return list(recommended_books['book_id'])


@app.route('/getbooks/welcomepage', methods=['GET'])
def welcomePage():
    """
    An API to return the top 20 books from the database top-books.
    This api does not have parameters. It is a GET method.
    """
    response = app_search.search(
        engine_name="top-books",
        body={
                    "query": ""
        }
    )
    response_dict = dict(response)
    response_list = response_dict['results']
    list_fin = response_list[:20]

    res = jsonify(list_fin)
    res.headers.add('Access-Control-Allow-Origin', '*')
    return res


@app.route('/getbooks/featured', methods=['POST'])
def featuredRecommendations():
    """
    An api to return featured recomendation based on the users ratings. 
    """
    response = app_search.search(
        engine_name="top-books",
        body={
                    "query": ""
        }
    )
    response_dict = dict(response)
    response_list = response_dict['results']
    list_fin = response_list[:30]

    json_data = flask.request.json
    # ids = json_data['id']
    user = json_data['username']
    response = app_search.search(
            engine_name="user-data",
            body={
                "query": "",
                "filters": {
                    "all": [
                        {"username": user}
                    ]
                }
            })
    # user rating from the responce from elastic search
    user_ratings = response['results'][0]['ratings']['raw']

    exclude_id = []

    if (user_ratings != '[]' and len(user_ratings)>0):
        for i in user_ratings:
            loaded_rating = json.loads(i)
            exclude_id.append(loaded_rating['book_id'])


    list_fin = [x for x in list_fin if not(int(x['book_id']['raw']) in exclude_id)]

    res = jsonify(list_fin)

    res.headers.add('Access-Control-Allow-Origin', '*')
    return res


def get_content_based_recommendations(book_id, rated_books_id = [], sim_matrix=cs_count_vec, num_recommendation = 10, variation_size = 0.0):
    
    """Generate content based filtering recommendation (comparing a book with the other books)
    Keyword arguments:
    book_id -- id of the book to be compared
    sim_matrix -- the similarity matrix between the books (defaulted as cs_count_vec, loaded above)
    num_recommendation -- number of recommendations to be returned (defaulted at 10)
    variation_size -- the strength of recommendation noise ranged 0.0-1.0 (defaulted at 0)
    Example usage: get_content_based_recommendations(1)   -- returning books similar to the book with ID 1
    """

    if(len(books[books['book_id']==book_id]) == 0):
        return books[books['book_id']==book_id]
    
    # get the index of the book that matches the book_id
    idx = indices[book_id]

    # calculate how similar the book to the other books and sort based on the similarity score
    similarity_scores = list(enumerate(sim_matrix[idx]))
    similarity_scores = sorted(similarity_scores, key=lambda el: el[1], reverse=True)

    # get the scores of the 10 most similar books
    recommendation_idx = []
    num_of_variation = int((num_recommendation+1) * variation_size)
    if ((num_recommendation+1) > 5):
      for i in range(1, 1 + (num_recommendation+1) - num_of_variation):
        recommendation_idx.append(i)
      for i in range(num_of_variation):
        var_idx = randrange(num_of_variation * 5)
        while ((1 + (num_recommendation+1) - num_of_variation + var_idx) in recommendation_idx):
          var_idx = randrange(num_of_variation * 4)
        recommendation_idx.append((1 + (num_recommendation+1) - num_of_variation + var_idx))

    similarity_scores = [similarity_scores[i] for i in recommendation_idx]
    
    # get the book indices
    book_idx = [i[0] for i in similarity_scores]

    recommendation_df = books.iloc[book_idx]
    recommendation_df = recommendation_df[recommendation_df['book_id'] != book_id]
    recommendation_df = recommendation_df[~recommendation_df['book_id'].isin(rated_books_id)]

    # return the top n most similar books + some variations
    return recommendation_df.head(num_recommendation)


@app.route('/getrecommendation/content-based-recomendation', methods=['POST'])
def ContentBasedRecomendation():
    json_data = flask.request.json
    # ids = json_data['id']
    user = json_data['username']
    response = app_search.search(
            engine_name="user-data",
            body={
                "query": "",
                "filters": {
                    "all": [
                        {"username": user}
                    ]
                }
            })
    user_ratings = response['results'][0]['ratings']['raw']

    recommendation_list = {}

    if(user_ratings == '[]' or len(user_ratings)==0):
        return jsonify(recommendation_list)
    
    rated_books_id = []
    for i in user_ratings:
        res = json.loads(i)
        rated_books_id.append(res['book_id'])

    if (len(user_ratings) > 3):
        user_ratings = user_ratings[:4]

    for i in user_ratings:
        print(i)
        res = json.loads(i)
        if res['rating'] >= 4:

            recomendation_df = get_content_based_recommendations(res['book_id'], rated_books_id, cs_count_vec, 12, 0.0)

            response = app_search.search(
                engine_name="book-recommendation-system",
                body={
                            "query": "",
                    "filters": {
                        "all": [
                            {"book_id": res['book_id']}
                        ]
                    }
                })
            
            read_book_name = response['results'][0]['title']['raw']

            recommendation_list[read_book_name] = recomendation_df.to_dict(orient='records')

    cc = recommendation_list
    return jsonify(cc)


def generate_recommendation_collaborative(user_ratings_df, user_id, rated_books):
    """Generate collaborative filtering based recommendation (comparing an user with the other users)
    Keyword arguments:
    user_ratings_df -- dataframe containing pivoted table of merged ratings and books dataset, this is pre-loaded when the backend starts
    user_id -- the ID of the new user (int)
    rated_books -- a dict specifying which books were rated by the user and how much was the rating (format specified above)
    """

    if (len(rated_books) == 0):
        return books.loc[books['book_id'].isin([])]

    # finds all books that has been rated by the user
    if (len(user_ratings_df[user_ratings_df.index == user_id]) > 0):
        user_ratings_df = user_ratings_df[user_ratings_df.index != user_id]
    curr_user_ratings = {}
    for el in rated_books:
        if (el['book_id'] in user_ratings_df.columns):
            curr_user_ratings[el['book_id']] = el['rating']
    new_row = pd.Series(curr_user_ratings, name=user_id)
    user_ratings_df = user_ratings_df.append(new_row, ignore_index=False)
    user_df = user_ratings_df[user_ratings_df.index == user_id]
    rated_books_id = user_df.columns[user_df.notna().any()].tolist()

    # count how many similar books other users had rated
    books_read_df = user_ratings_df[rated_books_id]
    user_book_count = books_read_df.T.notnull().sum()
    user_book_count = user_book_count.reset_index()
    user_book_count.columns = ['user_id', 'book_count']

    # finds all users who had rated at least n% of the books the current user rated
    # only users who had rated half of similar books
    count_threshold = int(0.1 * len(rated_books_id))
    if (count_threshold < 1):
        count_threshold = 1
    user_book_count = user_book_count[user_book_count['book_count']
                                        >= count_threshold]['user_id']
    filtered_users = pd.concat([books_read_df[books_read_df.index.isin(
        user_book_count)], user_df[rated_books_id]]).drop_duplicates().T
    users_list = filtered_users.columns
    books_list = filtered_users.index
    imp_mean = SimpleImputer(missing_values=np.nan, strategy='mean')
    ratings_no_nan = imp_mean.fit_transform(filtered_users)
    filtered_users = pd.DataFrame(
        data=ratings_no_nan, index=books_list, columns=users_list).astype('float64')

    # Take the rating df of the filtered users, then find the correlation between the users
    sim_matrix = pairwise_distances(filtered_users.T, metric='cosine')
    user_dist = pd.DataFrame(
        data=sim_matrix, index=users_list, columns=users_list).astype('float64')
    user_dist = user_dist.unstack()
    user_dist = user_dist.sort_values().drop_duplicates()
    user_dist = pd.DataFrame(user_dist, columns=['dist'])
    user_dist.index.names = ['uid1', 'uid2']
    user_dist = user_dist.reset_index()

    # filter the users that are relatively similar to the current user
    similar_users = user_dist[(user_dist['uid1'] == user_id)][[
        'uid2', 'dist']].reset_index(drop=True)
    similar_users = similar_users.sort_values(by='dist', ascending=False)
    similar_users.rename(columns={'uid2': 'user_id'}, inplace=True)
    similar_users['dist'] = (similar_users['dist']-similar_users['dist'].min()) /         (similar_users['dist'].max()-similar_users['dist'].min())
    # print(similar_users)

    # list all the books rated by similar users, and calculate its average score
    user_books = similar_users.merge(
        ratings[['user_id', 'book_id', 'rating']], how='inner')
    user_books = user_books.merge(
        books[['book_id', 'ratings_count', 'average_rating']], how='left')
    user_books = user_books.dropna()
    # print(user_books)
    user_books = user_books[user_books['user_id'] != user_id]
    # user_books['score'] = user_books['dist'] * user_books['rating']
    C = books.average_rating.mean()
    user_books['score'] = user_books['dist'] * ((user_books['ratings_count'] / (
        user_books['ratings_count'] + 3) * user_books['rating']) + (3 / (3 + user_books['ratings_count']) * C))
    user_books.groupby('book_id').agg({'score': 'mean'})

    recommendation_df = user_books.groupby('book_id').agg({'score': 'mean'})
    recommendation_df = recommendation_df.reset_index()

    # recommendation_df = recommendation_df[recommendation_df['score'] > 3.0].sort_values(
    #     "score", ascending=False).head(100)

    recommendation_df = recommendation_df.sort_values(
        "score", ascending=False).head(20)

    # print(recommendation_df)

    recommendations_id = recommendation_df['book_id'].tolist()

    return books.loc[books['book_id'].isin(recommendations_id)]


@app.route('/getbooks/getbookbyid', methods=['POST'])
def getBookByBookid():
    book_id = request.args.get('book_id', type=int)
    response = app_search.search(
        engine_name="book-recommendation-system",
        body={
                    "query": "",
            "filters": {
                "all": [
                    {"book_id": book_id}
                ]
            }
        })

    return response



@app.route('/getbooks/coldstart', methods=['GET'])
def getColdStart():
    books = pd.read_csv("books.csv", sep=",",
                        error_bad_lines=False, engine='python')
    return {"Status": "Incomplete"}


@app.route('/storeuser/putuserdata', methods=['POST'])
def putUserData():
    json_data = flask.request.json
    # ids = json_data['id']
    first_name = json_data['first_name']
    last_name = json_data['last_name']
    dob = json_data['dob']
    email = json_data['email']
    age = json_data['age']
    country = json_data['country']
    collections = json_data['collections']
    username = json_data['username']
    password = json_data['password']
    ratings = json_data['ratings']
    comments = json_data['comments']
    score = json_data['score']
    check = checkuseralreadyexists(username, password)

    if check == {"STATUS": "User Exits"}:
        return {"STATUS": "Username already Exit"}
    else:
        response = app_search.index_documents(
            engine_name="user-data",
            documents=[{
                'first_name': first_name,
                'last_name': last_name,
                'dob': dob,
                'email': email,
                'age': age,
                'country': country,
                'collections': collections,
                'username': username,
                'password': password,
                'comments': comments,
                'ratings': ratings,
                'score' : score
            }]
        )

        return jsonify(response)

    
    
@app.route('/correstscore', methods=['POST'])
def correstscore():
    json_data = flask.request.json
    username = json_data['username']
    correct_score_response = scoreCorrect(username)
    return jsonify(correct_score_response)
    
    
@app.route('/getleaderboard', methods=['GET'])
def getleaderboard():  
    userresponse = app_search.search(
                engine_name="user-data",
                body={
                      "query": "",
                      "sort": {
                                "score": "desc"
                              }
                            })
    top_ten = userresponse['results'][:10]
    return jsonify(top_ten)
    
@app.route('/getuser/checkuserbycred', methods=['POST'])
def checkUserCred():
    json_data = flask.request.json
    username = json_data['username']
    password = json_data['password']
    check = checkuseralreadyexists(username, password)
    correct_score_response = scoreCorrect(username)
    return jsonify(check)


@app.route('/putbooks', methods=['PUT'])
def addBook():
    json_data = flask.request.json
    ratings_2 = json_data['ratings_2']
    work_id = json_data['work_id']
    ratings_1 = json_data['ratings_1']
    ratings_3 = json_data['ratings_3']
    ratings_4 = json_data['ratings_4']
    ratings_5 = json_data['ratings_5']
    books_count = json_data['books_count']
    original_title = json_data['original_title']
    image_url = json_data['image_url']
    index = json_data['index']
    isbn = json_data['isbn']
    average_rating = json_data['average_rating']
    book_id = json_data['book_id']
    original_publication_year = json_data['original_publication_year']
    title = json_data['title']
    best_book_id = json_data['best_book_id']
    language_code = json_data['language_code']
    work_ratings_count = json_data['work_ratings_count']
    work_text_reviews_count = json_data['work_text_reviews_count']
    small_image_url = json_data['small_image_url']
    isbn13 = json_data['isbn13']
    ratings_count = json_data['ratings_count']
    authors = json_data['authors']
    comments = json_data['comments']

    response = app_search.index_documents(
        engine_name="book-recommendation-system",
        documents=[{
            'ratings_2': ratings_2,
            'work_id': work_id,
            'ratings_1': ratings_1,
            'ratings_4': ratings_4,
            'ratings_3': ratings_3,
            'books_count': books_count,
            'original_title': original_title,
            'ratings_5': ratings_5,
            'image_url': image_url,
            'isbn': isbn,
            'index': index,
            'average_rating': average_rating,
            'book_id': book_id,
            'original_publication_year': original_publication_year,
            'title': title,
            'best_book_id': best_book_id,
            'language_code': language_code,
            'work_ratings_count': work_ratings_count,
            'work_text_reviews_count': work_text_reviews_count,
            'small_image_url': small_image_url,
            'isbn13': 'isbn13',
            'ratings_count': ratings_count,
            'authors': authors,
            'comments': comments
        }])

    return jsonify(response)


@app.route('/deletebooks', methods=['PUT'])
def deleteBook():
    json_data = flask.request.json
    book_id = json_data['book_id']
    response = app_search.search(
        engine_name="book-recommendation-system",
        body={
            "query": "",
            "filters": {
                "all": [
                    {"book_id": book_id}
                ]
            }
        })
    doc_id = response['results'][0]['id']['raw']
    delete = app_search.delete_documents(
        engine_name="book-recommendation-system",
        document_ids=[doc_id]
    )
    return jsonify(delete)


@app.route('/deletecomments', methods=['PUT'])
def deleteComments():
    json_data = flask.request.json
    book_id = json_data['book_id']
    user = json_data['username']
    user_comment = json_data['comment']
    app_search = AppSearch(EngineUrl, http_auth=EngineKey)
    # Request:
    response = app_search.search(
        engine_name="book-recommendation-system",
        body={
            "query": "",
            "filters": {
                "all": [
                    {"book_id": book_id}
                ]
            }
        })

    doc_id = response['results'][0]['id']['raw']
    cc = response['results'][0]['comments']['raw']
    if (cc == '[]'):
        cc = []
    new_cc = [ast.literal_eval(i) for i in cc]
    for i in range(len(new_cc)):
        if new_cc[i].get(user) == user_comment:
            del new_cc[i]
            break
    resp = app_search.put_documents(
        engine_name="book-recommendation-system",
        documents=[{
                    "id": doc_id,
                    "comments": new_cc
        }]
    )
    userresponse = app_search.search(
        engine_name="user-data",
        body={
            "query": "",
            "filters": {
                "all": [
                    {"username": user}
                ]
            }
        })

    ES_id = userresponse['results'][0]['id']['raw']
    user_comments = userresponse['results'][0]['comments']['raw']
    if (user_comments == '[]'):
        user_comments = []
    user_comment_list = [ast.literal_eval(i) for i in user_comments]
    for i in range(len(user_comment_list)):
        if user_comment_list[i].get(str(book_id)) == user_comment:
            del user_comment_list[i]
            break

    resp = app_search.put_documents(
        engine_name="user-data",
        documents=[{
            "id": ES_id,
            "comments": user_comment_list
        }])
    return jsonify({"STATUS": resp})


@app.route('/addcomments', methods=['PUT'])
def addComments():
    json_data = flask.request.json
    book_id = json_data['book_id']
    user = json_data['username']
    user_comment = json_data['comment']

    response = app_search.search(
        engine_name="book-recommendation-system",
        body={
            "query": "",
            "filters": {
                "all": [
                    {"book_id": book_id}
                ]
            }
        })

    doc_id = response['results'][0]['id']['raw']
    new_comment = {user: user_comment}

    if 'comments' not in response['results'][0] or response['results'][0]['comments']['raw'] == '[]':
        resp = app_search.put_documents(
            engine_name="book-recommendation-system",
            documents=[{
                "id": doc_id,
                "comments": [new_comment]
            }]
        )

    else:
        comment = response['results'][0]['comments']['raw']
        comment_list = [ast.literal_eval(i) for i in comment]
        comment_list.insert(0, new_comment)
        resp = app_search.put_documents(
            engine_name="book-recommendation-system",
            documents=[{
                "id": doc_id,
                "comments": comment_list
            }]
        )

    userresponse = app_search.search(
        engine_name="user-data",
        body={
            "query": "",
            "filters": {
                "all": [
                    {"username": user}
                ]
            }
        })

    new_user_comment = {book_id: user_comment}
    ES_id = userresponse['results'][0]['id']['raw']
    if 'comments' not in userresponse['results'][0] or userresponse['results'][0]['comments']['raw'] == '[]':
        resp = app_search.put_documents(
            engine_name="user-data",
            documents=[{
                "id": ES_id,
                "comments": [new_user_comment]
            }])
    else:
        user_comments = userresponse['results'][0]['comments']['raw']
        user_comment_list = [ast.literal_eval(i) for i in user_comments]
        user_comment_list.insert(0, new_user_comment)
        resp = app_search.put_documents(
            engine_name="user-data",
            documents=[{
                "id": ES_id,
                "comments": user_comment_list
            }])
    return jsonify({"STATUS": "ADDED"})


@app.route('/addrating', methods=['PUT'])
def addRating():
    json_data = flask.request.json
    book_id = json_data['book_id']
    user = json_data['username']
    rating = json_data['rating']
    #{"book_id":3,"rating":5.0}
    new_user_rating = {"book_id": book_id,"rating" : float(rating)}
    
    userresponse = getUserEntry(user)
    ES_id = userresponse['results'][0]['id']['raw']
    if 'ratings' not in userresponse['results'][0]:
        resp = app_search.put_documents(
        engine_name="user-data",
        documents=[{
            "id": ES_id,
            "ratings" : [new_user_rating]
        }])
    else:
        user_ratings = userresponse['results'][0]['ratings']['raw']
        user_ratings_list = [ast.literal_eval(i) for i in user_ratings]
        check_book = next(iter(item for item in user_ratings_list if item['book_id'] == book_id), None)
        if check_book == None:
            user_ratings_list.insert(0, new_user_rating)
        elif check_book['rating'] == rating:
            return jsonify({"STATUS": "RATING ALREADY ADDED"})
        elif check_book['book_id'] == book_id and check_book['rating'] != rating:
            check_book['rating'] = rating
            for i in range(len(user_ratings_list)):
                if user_ratings_list[i]['book_id'] == book_id:
                    user_ratings_list[i]['rating'] = float(rating)
        resp = app_search.put_documents(engine_name="user-data",documents=[{"id": ES_id,"ratings": user_ratings_list}])
    default_rating = "ratings_"
    rating_star = default_rating + str(rating)
    userresponse = app_search.search(
        engine_name="book-recommendation-system",
        body={
            "query": "",
            "filters": {
                "all": [
                    {"book_id": book_id}
                ]
            }
        })
    ES_id = userresponse['results'][0]['id']['raw']
    old_rating = userresponse['results'][0][rating_star]['raw']
    new_rating = old_rating + 1
    resp = app_search.put_documents(engine_name="book-recommendation-system",documents=[{"id": ES_id,rating_star: new_rating}])
    return jsonify({"STATUS": "ADDED"})


@app.route('/getuser', methods=['POST'])
def getUser():
    json_data = flask.request.json
    user = json_data['username']
    userresponse = app_search.search(
        engine_name="user-data",
        body={
            "query": "",
            "filters": {
                "all": [
                    {"username": user}
                ]
            }
        })
    return jsonify(userresponse)


@app.route('/editcomments', methods=['PUT'])
def editComments():
    json_data = flask.request.json
    book_id = json_data['book_id']
    user = json_data['username']
    user_comment = json_data['new_comment']
    old_comment = json_data['old_comment']

    response = app_search.search(
        engine_name="book-recommendation-system",
        body={
            "query": "",
            "filters": {
                "all": [
                    {"book_id": book_id}
                ]
            }
        })

    doc_id = response['results'][0]['id']['raw']

    if 'comments' not in response['results'][0] or response['results'][0]['comments']['raw'] == '[]' :
        return {"STATUS": "NO COMMENTS"}

    else:
        comment = response['results'][0]['comments']['raw']
        comment_list = [ast.literal_eval(i) for i in comment]
        for i in range(len(comment_list)):
            if comment_list[i].get(str(user)) == old_comment:
                comment_list[i][user] = user_comment
                print(comment_list)

        resp = app_search.put_documents(
            engine_name="book-recommendation-system",
            documents=[{
                "id": doc_id,
                "comments": comment_list
            }]
        )

    userresponse = app_search.search(
        engine_name="user-data",
        body={
            "query": "",
            "filters": {
                "all": [
                    {"username": user}
                ]
            }
        })

    new_user_comment = {book_id: user_comment}
    ES_id = userresponse['results'][0]['id']['raw']
    if 'comments' not in userresponse['results'][0] or userresponse['results'][0]['comments']['raw'] == '[]':
        return {"STATUS": "NO COMMENTS"}

    else:
        user_comments = userresponse['results'][0]['comments']['raw']
        user_comment_list = [ast.literal_eval(i) for i in user_comments]
        for i in range(len(user_comment_list)):
            if user_comment_list[i].get(str(book_id)) == old_comment:
                user_comment_list[i][book_id] = user_comment
        resp = app_search.put_documents(
            engine_name="user-data",
            documents=[{
                "id": ES_id,
                "comments": user_comment_list
            }])
    return jsonify({"STATUS": "ADDED"})


@app.route('/addcollections', methods=['POST'])
def addcollections():
    """
    An Api to add a new collections other than
    Main Collection and already existing collection.
    This Api requires the collection name and the 
    logged in username as parameters.
    """
    json_data = flask.request.json
    book_id = request.json.get('book_id', None)
    if not book_id:
        book_id = None
    # book_id = json_data['book_id']
    user = json_data['username']
    collectionname = json_data['collectionname']

    userresponse = getUserEntry(user)

    # new_user_rating = {book_id : rating}
    ES_id = userresponse['results'][0]['id']['raw']
    if ('collections' not in userresponse['results'][0] or userresponse['results'][0]['collections']['raw'] == '[]'):
        resp = app_search.put_documents(
            engine_name="user-data",
            documents=[{
                "id": ES_id,
                "collections":  [{collectionname: [book_id]}]
            }])
        return jsonify({"STATUS": "collection created and added"})
    else:

        user_collections = userresponse['results'][0]['collections']['raw']
        user_collections_list = [ast.literal_eval(i) for i in user_collections]
        if any(collectionname in d for d in user_collections_list):
            res = {}
            for line in user_collections_list:
                res.update(line)
            if book_id in res[collectionname]:
                return jsonify({"STATUS": "Book in COLLECTION ALREADY EXIXTS"})

            else:
                res[collectionname].insert(0, book_id)
                resp = app_search.put_documents(
                    engine_name="user-data",
                    documents=[{
                        "id": ES_id,
                        "collections": user_collections_list
                    }])
                return jsonify({"STATUS": "ADDED"})
        else:
            new_collection = {collectionname: [book_id]}
            user_collections_list.insert(0, new_collection)
            resp = app_search.put_documents(
                engine_name="user-data",
                documents=[{
                    "id": ES_id,
                    "collections": user_collections_list
                }])
            return jsonify({"STATUS": "ADDED"})


@app.route('/deletebooksfromcollections', methods=['POST'])
def deletebookscollection():
    """
    An api to delete the books from the collection
    This Api requires the book id and the collection name.
    """
    json_data = flask.request.json
    book_id = json_data['book_id']
    user = json_data['username']
    collectionname = json_data['collectionname']
    userresponse = getUserEntry(user)

    # new_user_rating = {book_id : rating}
    ES_id = userresponse['results'][0]['id']['raw']
    if 'collections' not in userresponse['results'][0]:
        return jsonify({"STATUS": "NO COLLECTIONS"})

    else:

        user_collections = userresponse['results'][0]['collections']['raw']
        print("oooo", user_collections)
        user_collections_list = [ast.literal_eval(i) for i in user_collections]
        if any(collectionname in d for d in user_collections_list):
            res = {}
            for line in user_collections_list:
                res.update(line)
            if book_id in res[collectionname]:
                res[collectionname].remove(book_id)
                print(res[collectionname])
                resp = app_search.put_documents(
                    engine_name="user-data",
                    documents=[{
                        "id": ES_id,
                        "collections":  [res]
                    }])
                return jsonify({"STATUS": "COLLECTION ALREADY EXIXTS"})

            else:
                return jsonify({"STATUS": "BOOK DOES NOT EXISTS IN THIS COLLECTION"})
        else:
            return jsonify({"STATUS": "COLLECTIONS NOT EXISTS"})


@app.route('/deletecompletecollections', methods=['POST'])
def deletecompletecollection():
    """
    An Api to detele the complete collections
    along with the books inside it. This Api requires
    username of the logged in user and the collection name.
    """
    json_data = flask.request.json
    user = json_data['username']
    collectionname = json_data['collectionname']
    userresponse = getUserEntry(user)

    # new_user_rating = {book_id : rating}
    ES_id = userresponse['results'][0]['id']['raw']
    if 'collections' not in userresponse['results'][0]:
        return jsonify({"STATUS": "COLLECTIONS NOT EXISTS"})
    else:

        user_collections = userresponse['results'][0]['collections']['raw']
        user_collections_list = [ast.literal_eval(i) for i in user_collections]

        if any(collectionname in d for d in user_collections_list):
            res = {}
            for line in user_collections_list:
                res.update(line)
            del res[collectionname]

            resp = app_search.put_documents(
                engine_name="user-data",
                documents=[{
                    "id": ES_id,
                    "collections":  [res]
                }])
            return jsonify({"STATUS": "COLLECTIONS Deleted"})

        else:
            return jsonify({"STATUS": "NO COLLECTION"})


@app.route('/getcollections', methods=['POST'])
def getCollections():
    """
    An Api to get all the collections along with the books 
    inside it.This Api requires the username of the user 
    whose collection must be returned
    """
    json_data = flask.request.json
    user = json_data['username']
    userresponse = getUserEntry(user)
    prep_dict = {}
    final_dict = {}
    #new_user_rating = {book_id : rating}
    ES_id = userresponse['results'][0]['id']['raw']
    if ('collections' not in userresponse['results'][0] or userresponse['results'][0]['collections']['raw']=='[]'):
        return jsonify({"STATUS" : "NO COLLECTION"})
    else:

        user_collections = userresponse['results'][0]['collections']['raw']  
        user_collections_list = [ast.literal_eval(i) for i in user_collections]
        print(user_collections_list)

        for collections_dict in user_collections_list:

            for elements in collections_dict:
                print("elements", elements)
                if not collections_dict[elements]:
                    prep_dict[elements] = ["EMPTY COLLECTION"]
                    final_dict.update({elements : ["EMPTY COLLECTION"] })
                else:
                    for bookids in collections_dict[elements]:
                        bookresponse = app_search.search(
                                        engine_name="book-recommendation-system",
                                        body={
                                              "query": "",
                                              "filters": {
                                                "all": [
                                                  { "book_id": bookids }
                                                ]
                                                  }
                                                    })

                        if elements in prep_dict.keys():
                            prep_dict[elements].append(bookresponse)
                        else:
                            prep_dict[elements] = [bookresponse]



    return jsonify(prep_dict)


@app.route('/getmaincollection',methods = ['POST'])        
def getMainCollection():
    """
    An Api to get the books inside the Main collection.
    This Api required the username as the parameter.
    """
    json_data = flask.request.json
    user = json_data['username']
    userresponse = getUserEntry(user)
    final_dict = {}
    final_dict["Main Collection"] = []
    #new_user_rating = {book_id : rating}
    ES_id = userresponse['results'][0]['id']['raw']
    if ('collections' not in userresponse['results'][0] or userresponse['results'][0]['collections']['raw']=='[]'):
        return jsonify({"STATUS" : "NO COLLECTION"})
    else:
        user_collections = userresponse['results'][0]['collections']['raw']  
        user_collections_list = [ast.literal_eval(i) for i in user_collections]

        for collections_dict in user_collections_list:

            if "Main Collection" in collections_dict:
                if not collections_dict["Main Collection"]:
                    final_dict["Main Collection"] = ["EMPTY COLLECTION"]
                else:
                    for bookids in collections_dict["Main Collection"]:
                        print(bookids)
                        bookresponse = app_search.search(
                                        engine_name="book-recommendation-system",
                                        body={
                                              "query": "",
                                              "filters": {
                                                "all": [
                                                  { "book_id": bookids }
                                                ]
                                                  }
                                                    })
                        if "Main Collection" in final_dict:
                            final_dict["Main Collection"].append(bookresponse)
                        else:
                            final_dict["Main Collection"] = [bookresponse]



    return jsonify(final_dict)
    
@app.route('/getnamedcollection',methods = ['POST'])        
def getNamedCollection():
    """
    An api to get all the books inside a collection.
    The function return an dictionary of books inside a
    collection and this api requires user name of the logged
    in user and the collection name.
    """
    json_data = flask.request.json
    user = json_data['username']
    collectionname = json_data['collectionname']
    userresponse = getUserEntry(user)
    final_dict = {}
    final_dict[collectionname] = []
    #new_user_rating = {book_id : rating}
    ES_id = userresponse['results'][0]['id']['raw']
    if ('collections' not in userresponse['results'][0] or userresponse['results'][0]['collections']['raw']=='[]'):
        return jsonify({"STATUS" : "NO COLLECTION"})
    else:
        user_collections = userresponse['results'][0]['collections']['raw']  
        user_collections_list = [ast.literal_eval(i) for i in user_collections]

        for collections_dict in user_collections_list:

            if collectionname in collections_dict:
                if not collections_dict[collectionname]:
                    final_dict[collectionname] = ["EMPTY COLLECTION"]
                else:
                    for bookids in collections_dict[collectionname]:
                        print(bookids)
                        bookresponse = app_search.search(
                                        engine_name="book-recommendation-system",
                                        body={
                                              "query": "",
                                              "filters": {
                                                "all": [
                                                  { "book_id": bookids }
                                                ]
                                                  }
                                                    })
                        if collectionname in final_dict:
                            final_dict[collectionname].append(bookresponse)
                        else:
                            final_dict[collectionname] = [bookresponse]

    return jsonify(final_dict)


@app.route('/addcollectionsname',methods = ['PUT'])        
def addCollectionsname():
    json_data = flask.request.json
    user = json_data['username']
    collectionname = json_data['coldName']
    userresponse = getUserEntry(user)
    ES_id = userresponse['results'][0]['id']['raw']
    if ('collections' not in userresponse['results'][0] or userresponse['results'][0]['collections']['raw'] == '[]'):
        resp = app_search.put_documents(
            engine_name="user-data",
            documents=[{
                "id": ES_id,
                "collections":  [{collectionname: []}]
            }])
        return jsonify({"STATUS": "collection created and added"})
    elif collectionname.lower() == "main collection":
        return jsonify({"STATUS": "CANNOT CREAT IN THE NAME MAIN COLLECTION"})
    else:
        user_collections = userresponse['results'][0]['collections']['raw']
        user_collections_list = [ast.literal_eval(i) for i in user_collections]
        if any(collectionname in d for d in user_collections_list):
            res = {}
            for line in user_collections_list:
                res.update(line)
            if collectionname in res:
                return jsonify({"STATUS": "COLLECTION ALREADY EXISTS"})
            else:
                res[collectionname].insert(0, [])
                resp = app_search.put_documents(
                    engine_name="user-data",
                    documents=[{
                        "id": ES_id,
                        "collections": res
                    }])
                return jsonify({"STATUS": "ADDED"})
        else:
            new_collection = {collectionname: []}
            user_collections_list.insert(0, new_collection)
            resp = app_search.put_documents(
                engine_name="user-data",
                documents=[{
                    "id": ES_id,
                    "collections": user_collections_list
                }])
            return jsonify({"STATUS": "ADDED"})


@app.route('/changecollectionsname',methods = ['PUT'])        
def changeCollectionsname():
    """
    An Api to change the name of collection. other than
    Mai collection and already existing name. This Api
    Required the old name of the collection, new name of
    the collection and the username of the user.
    """
    json_data = flask.request.json
    user = json_data['username']
    collectionname = json_data['coldName']
    collectionnewname = json_data['cnewName']
    finalres = []
    userresponse = getUserEntry(user)
    final_dict = {}
    #new_user_rating = {book_id : rating}
    ES_id = userresponse['results'][0]['id']['raw']
    if 'collections' not in userresponse['results'][0] or collectionnewname.lower() == 'main collection':
        return jsonify({"STATUS" : "Cannot Change Name Of COLLECTION"})
    else:
        user_collections = userresponse['results'][0]['collections']['raw']  
        user_collections_list = [ast.literal_eval(i) for i in user_collections]
        if any(collectionname in d for d in user_collections_list):
            res = {}
            for line in user_collections_list:
                res.update(line)
            if collectionnewname in res:
                return jsonify({"STATUS" : "Collection Name Already exists"})
            else:
                res[collectionnewname] = res.pop(collectionname)
                for k,v in res.items():
                    finalres.append({k:v})
                resp = app_search.put_documents(
                            engine_name="user-data",
                            documents=[{
                            "id": ES_id,
                            "collections" :  finalres
                            }])
                return jsonify({"STATUS" : "COLLECTIONS NAME CHANGED"})
        else:
            return jsonify({"STATUS" : "COLLECTIONS NAME DOES NOT EXISTS"})

@app.route('/getCCrecommendation/', methods=['POST'])
def getRecomendationCC():
    json_data = flask.request.json
    user = json_data['username']
    userresponse = getUserEntry(user)
    final_dict = {}
    # new_user_rating = {book_id : rating}
    ES_id = userresponse['results'][0]['id']['raw']
    if ('ratings' not in userresponse['results'][0] or userresponse['results'][0]['ratings']['raw']=='[]'):
        return jsonify([])
    else:
        user_ratings = userresponse['results'][0]['ratings']['raw']
        user_ratings_list = [ast.literal_eval(i) for i in user_ratings]
        recommendations = generate_recommendation_collaborative(
            user_ratings_df, user, user_ratings_list)
        cc = recommendations.to_dict(orient='records')
        return jsonify(cc)

@app.route('/getbooks/getbookbyauthor', methods=['POST'])
def getBookByAuthor():
    """
    An api to search books by author of the book.
    for this api to function.the book author (complete or partial)
    must be sent to from the frontend.
    """
    json_data = flask.request.json
    #ids = json_data['id']
    author = json_data['author'] 
    response = app_search.search(
            engine_name="book-recommendation-system",
            body={"query": author, "search_fields": {
        "authors": {}}})
    return response

@app.route('/getbooks/getbookbyname', methods=['POST'])
def getBookByTitle():
    """
    An api to search books by Title of the book.
    for this api to function.the book title (complete or partial)
    must be sent to from the frontend.
    """
    json_data = flask.request.json
    #ids = json_data['id']
    title = json_data['title']    
    response = app_search.search(
            engine_name="book-recommendation-system",
            body={"query": title, "search_fields": {
        "title": {}}})

    return response


@app.route('/getuser/getuserbyusername', methods=['POST'])
def getUserEntryApi():
    """
    An api to search users based on the username.
    for this api to function. the username must be passed
    (Complete username or partial). 
    """
    json_data = flask.request.json
    #ids = json_data['id']
    username = json_data['username'] 
    userresponse = app_search.search(
            engine_name="user-data",
            body={"query": username, "search_fields": {
                    "username": {}}})
    return userresponse



@app.route('/followUser', methods=['POST'])
def FollowUser():
    """
    an api to follow users. this api requires the username of the
    loggined user and the username of the person to be followed.
    
    """
    json_data = flask.request.json
    username = json_data['username']
    follow_user = json_data['follow_user']

    # check the following user
    userresponse_1 = app_search.search(
        engine_name="user-data",
        body={
            "query": "",
            "filters": {
                "all": [
                    {"username": username}
                ]
            }
        })

    # check the user to be followed
    userresponse_2 = app_search.search(
        engine_name="user-data",
        body={
            "query": "",
            "filters": {
                "all": [
                    {"username": follow_user}
                ]
            }
        })
    # cannot follow the user if the user is not present
    if not(('results' in userresponse_1.keys() and userresponse_1['results'] != '[]' and len(userresponse_1['results'])>0) and
    ('results' in userresponse_2.keys() and userresponse_2['results'] != '[]' and len(userresponse_2['results'])>0)):
        return jsonify({"STATUS" : "Cannot Follow"})


    ES_id_1 = userresponse_1['results'][0]['id']['raw']
    if 'follow' in userresponse_1['results'][0].keys():
        follow = userresponse_1['results'][0]['follow']['raw']
    else:
        follow = []
    follow_set = set(follow)
    if follow_user in follow_set :
        return jsonify({"STATUS" : "Already Following"})
    elif follow_user == username:
        return jsonify({"STATUS" : "Cannot Follow Yourself"})
    else:
        follow.insert(0, follow_user)
        resp = app_search.put_documents(engine_name="user-data",documents=[{"id": ES_id_1,"follow": follow}])
        return jsonify({"STATUS" : "FOLLOWED"})



@app.route('/checkFollow', methods=['POST'])
def checkFollow():
    """
    an api to check if the user is following a specific user.
    this api requires the username of the loggined in user and the
    username of the user to check.
    """
    json_data = flask.request.json
    username = json_data['username']
    follow_user = json_data['follow_user']
    # check the following user
    userresponse_1 = app_search.search(
        engine_name="user-data",
        body={
            "query": "",
            "filters": {
                "all": [
                    {"username": username}
                ]
            }
        })

    # check the user to be followed
    userresponse_2 = app_search.search(
        engine_name="user-data",
        body={
            "query": "",
            "filters": {
                "all": [
                    {"username": follow_user}
                ]
            }
        })

    
    if not(('results' in userresponse_1.keys() and userresponse_1['results'] != '[]' and len(userresponse_1['results'])>0) and
    ('results' in userresponse_2.keys() and userresponse_2['results'] != '[]' and len(userresponse_2['results'])>0)):
        return jsonify({"STATUS" : "User not found"})


    ES_id_1 = userresponse_1['results'][0]['id']['raw']
    if 'follow' in userresponse_1['results'][0].keys():
        print("INSIDE")
        follow = userresponse_1['results'][0]['follow']['raw']
    else:
        follow = []
    follow_set = set(follow)
    if follow_user in follow_set :
        return jsonify({"STATUS" : "Followed"})
    else:
        return jsonify({"STATUS" : "Not Followed"})

    
@app.route('/unfollowUser', methods=['POST'])
def unFollowUser():
    """
    An api to unfollow the user from the list of followers.
    this api requires username of the user and also the 
    username of the user which needs to be unfolowed.
    """
    json_data = flask.request.json
    username = json_data['username']
    follow_user = json_data['follow_user']
    # check the following user
    userresponse_1 = app_search.search(
        engine_name="user-data",
        body={
            "query": "",
            "filters": {
                "all": [
                    {"username": username}
                ]
            }
        })

    # check the user to be followed
    userresponse_2 = app_search.search(
        engine_name="user-data",
        body={
            "query": "",
            "filters": {
                "all": [
                    {"username": follow_user}
                ]
            }
        })

    
    if not(('results' in userresponse_1.keys() and userresponse_1['results'] != '[]' and len(userresponse_1['results'])>0) and
    ('results' in userresponse_2.keys() and userresponse_2['results'] != '[]' and len(userresponse_2['results'])>0)):
        return jsonify({"STATUS" : "Cannot Follow"})


    ES_id_1 = userresponse_1['results'][0]['id']['raw']
    follow = userresponse_1['results'][0]['follow']['raw']
    follow_set = set(follow)
    if follow_user in follow_set :
        follow.remove(follow_user)
        resp = app_search.put_documents(engine_name="user-data",documents=[{"id": ES_id_1,"follow": follow}])
        return jsonify({"STATUS" : "Removed user from Following"})
    elif follow_user == username:
        print("Cannot unFollow Yourself")
        return jsonify({"STATUS" : "Cannot unfollow Yourself"})
    else:
        return jsonify({"STATUS" : "CANNOT UNFOLLOW USER"})

    
    
    
@app.route('/follow/getall', methods=['POST'])
def getallFollow():    
    """
    An api to return all the followers of a perticular user
    The api requires username of the user trying to get list of followers from
    """
    json_data = flask.request.json
    username = json_data['username']
    userresponse = app_search.search(
        engine_name="user-data",
        body={
        "query": "",
        "filters": {
            "all": [
                {"username": username}
            ]
        }
        })
    final_follow_list = []
    if (not('results' in userresponse) or len(userresponse['results']) == 0 or userresponse['results'] == '[]'):
        return jsonify({"STATUS" : "NO Followers"})
    ES_id = userresponse['results'][0]['id']['raw']
    #follow = userresponse['results'][0]['follow']['raw']
    if 'follow' in userresponse['results'][0].keys():
        follow = userresponse['results'][0]['follow']['raw']
        if follow == []:
            return jsonify({"STATUS" : "NO Followers"})
        else:
            for i in follow:
                user_details = getUserEntry(i)
                if ('results' in user_details.keys() and user_details['results'] != '[]' and len(user_details['results'])>0 and 'username' in user_details['results'][0]):
                    final_follow_list.append(user_details['results'][0])
            return jsonify(final_follow_list)
    else:
        return jsonify({"STATUS" : "NO Followers"})



    
    
    
    
    
    
if __name__ == "__main__":
    app.run()
