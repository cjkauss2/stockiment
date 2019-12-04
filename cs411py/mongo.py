import pymongo
def getkeyword(ticker):
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["test"]
    mycol = mydb["keywords"]
    for x in mycol.find({"_id": ticker},{"_id":0}):
        return(list(x.values())[0][1])

if __name__ == '__main__':
    getkeyword("AAPL")


