import pymongo
def insert_mongo(mydict):
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["test"]
    mycol = mydb["interestingTweets"]
    mycol.insert_one(mydict)

def remove_mongo(ticker):
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["test"]
    mycol = mydb["interestingTweets"]
    mycol.remove({"_id":ticker})

