import os
import re
import tweepy as tw
import pandas as pd
from textblob import TextBlob
from datetime import datetime,date, time, timedelta
import mongo
from mongo import insert_mongo, remove_mongo
import sql
from sql import update_sentiment
import pprint

consumer_key = '2zhYzsZAVSa2cVLVcemfmz9nn'
consumer_secret = '78cuz18QeMkd6Z31rmnOkqWsASvyAJBg42wB0jqycs4KvWdjI6'

access_token = '3985700398-zubYyKBHfyl9qwYlkAWmuMDL2qMFoMKOUE3La2Q'
access_token_secret = 'W2uAbind64acBB9OI5X7DDHEGmPdsFD9akoJmP4mGjkdh'


auth = tw.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tw.API(auth, wait_on_rate_limit=True)

result = {}

def clean_tweet(tweet):
        ''' 
        Utility function to clean tweet text by removing links, special characters 
        using simple regex statements. 
        '''
        return ' '.join(re.sub("(@[A-Za-z0-9]+) | ([ ^ 0-9A-Za-z \t]) | (\w+: \/\/\S+)", " ", tweet).split())


def get_tweet_sentiment(tweet):
        ''' 
        Utility function to classify sentiment of passed tweet 
        using textblob's sentiment method 
        '''
        # create TextBlob object of passed tweet text
        analysis = TextBlob(clean_tweet(tweet.full_text))

        result[tweet.id_str] = analysis.sentiment.polarity

def findMax(result,ticker):
    topSentiment = 0
    topId = 0
    for postID, sentiment in result.items():
        if sentiment > topSentiment:
            topSentiment = sentiment
            topId = postID

    secondSentiment = 0
    secondId = 0
    for postID, sentiment in result.items():
        if sentiment > secondSentiment and sentiment < topSentiment:
            secondSentiment = sentiment
            secondId = postID
    remove_mongo(ticker)
    insert_mongo({"score":  str(round(topSentiment,3)), "twitterid" : str(topId),"ticker":ticker})
    insert_mongo({"score":  str(round(secondSentiment,3)), "twitterid" : str(secondId),"ticker":ticker})

# Define the search term and the date_since date as variables
search_words = {"AAPL","UBER","TWTR","FB","TSLA","AMZN","GOOGL"}
for search_word in search_words:
    result = {}
    date_since = datetime.utcnow().strftime("%Y-%m-%d")
    date_until = (datetime.utcnow() + timedelta(days=1)).strftime("%Y-%m-%d")
    # Collect tweets
    tweets = tw.Cursor(api.search,
                       q=search_word + "-filter:retweets",
                       lang="en",
                       since=date_since,
                       until=date_until,
                       tweet_mode='extended').items(1000)
    datetime_object = datetime.utcnow() - timedelta(hours=1)
    count = 0
    total = 0
    for tweet in tweets:
        if ( tweet.created_at > datetime_object):
            get_tweet_sentiment(tweet)
            count += 1  
            total += result[tweet.id_str]
            print("///////////////////////////")
            print(tweet.full_text)
            print(tweet.created_at)
    print(len(result))
    findMax(result,search_word)
    avg = total/count
    update_sentiment(search_word, avg)
