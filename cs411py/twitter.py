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
import schedule
import time

# Fill in corresponding credentials
consumer_key = None
consumer_secret = None
access_token = None
access_token_secret = None


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


# Define the search term and the date_since date as variables
def job():
    search_words = {"AAPL","UBER","TWTR","FB","TSLA","AMZN","GOOGL"}
    for search_word in search_words:
        print(search_word)
        global result
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
        topRetweet = 0
        topId = 0
        secondRetweet = 0
        secondId = 0
        print("running")
        for tweet in tweets:
            if ( tweet.created_at > datetime_object):
                get_tweet_sentiment(tweet)
                count += 1  
                total += result[tweet.id_str]
            if tweet.retweet_count > topRetweet:
                    topRetweet = tweet.retweet_count
                    topId = tweet.id_str
            if tweet.retweet_count > secondRetweet and  tweet.retweet_count< topRetweet:
                    secondRetweet = tweet.retweet_count
                    secondId = tweet.id_str
        remove_mongo(search_word)
        insert_mongo({ "twitterid" : str(topId),"ticker":search_word})
        insert_mongo({ "twitterid" : str(secondId),"ticker":search_word})
        avg = total/count
        print(count)
        print(avg)
        update_sentiment(search_word, avg)


while 1:
    job()
    time.sleep(3600)
    
