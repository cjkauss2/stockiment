import mysql.connector
import datetime
def update_sentiment(ticker, number):

    mydb = mysql.connector.connect(
        host= 'localhost',
        user= 'root',
        password= 'teamHigherUs12#$',
        database= 'Stocks',
        port= '3306'
    )

    mycursor = mydb.cursor()

    sql1 = "UPDATE HourlyPrice SET Sentiment = %s WHERE Symbol = %s AND DateTime = (SELECT MAX(h2.DateTime) FROM (SELECT * FROM HourlyPrice) AS h2 WHERE h2.Symbol = %s)"
    val1 = (number, ticker, ticker)
    mycursor.execute(sql1, val1)
    sql2 = "INSERT INTO DailyPrice (Symbol, Date, Sentiment) VALUES (%s, %s, %s) ON DUPLICATE KEY UPDATE Sentiment = VALUES(Sentiment)"
    val2 = (ticker, datetime.date.today(), number)
    mycursor.execute(sql1, val1)
    mycursor.execute(sql2, val2)    
    mydb.commit()
