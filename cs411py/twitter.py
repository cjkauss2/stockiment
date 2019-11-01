import os
import re
import tweepy as tw
import pandas as pd
from textblob import TextBlob

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


# Define the search term and the date_since date as variables
search_words = "#airpods"
date_since = "2019-10-25"
date_until = "2019-10-29"

# Collect tweets
tweets = tw.Cursor(api.search,
                   q=search_words,
                   lang="en",
                   since=date_since,
                   until=date_until,
                   tweet_mode='extended').items(1000)

for tweet in tweets:
    #pp.pprint(tweet.entities.urls.url)
    get_tweet_sentiment(tweet)
    print("///////////////////////////")
    print(tweet.full_text)
    print(tweet.created_at)
    #print(tweet)
    #pp.pprint(tweet.urls.url)




#averageSentiment = sum(result)/ len(result)



# Collect a list of tweets
[tweet.full_text for tweet in tweets] 

# set sentiment
#if averageSentiment > 0:
#    print('positive')
#elif averageSentiment == 0:
#    print('neutral')
#else:
#    print('negative')

#print(averageSentiment)

def findMax(result):
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
    print("Highest Sentiment = " + str(topSentiment) + " at postid " + topId)
    print("2nd highest Sentiment = " +
          str(secondSentiment) + " at postid " + secondId)


print(len(result))
findMax(result)
print(result)
