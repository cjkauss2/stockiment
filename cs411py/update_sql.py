from mysql.connector import MySQLConnection, Error
from python_mysql_dbconfig import read_db_config


def update_stock(ticker, date, sentiment):
    # read database configuration
    db_config = read_db_config()

    # prepare query and data
    query = """ UPDATE DailyPrice
                SET Sentiment = %s
                WHERE Symbol = %s AND Date = %s """

    data = (sentiment, ticker, date)

    try:
        conn = MySQLConnection(**db_config)

        # update book title
        cursor = conn.cursor()
        cursor.execute(query, data)

        # accept the changes
        conn.commit()

    except Error as error:
        print(error)

    finally:
        cursor.close()
        conn.close()

def insert_stock(ticker, date, sentiment):
    # read database configuration
    db_config = read_db_config()

    # prepare query and data
    query = """ INSERT INTO DailyPrice
            (Symbol, Date, Sentiment)
        VALUES
            (%s, %s, %s)
        ON DUPLICATE KEY UPDATE
            Sentiment = %s """

    data = (ticker, date, sentiment, sentiment)

    try:
        conn = MySQLConnection(**db_config)

        # update book title
        cursor = conn.cursor()
        cursor.execute(query, data)

        # accept the changes
        conn.commit()
    except Error as error:
        print(error)

    finally:
        cursor.close()
        conn.close()

def delete_stock(ticker, date):
    # read database configuration
    db_config = read_db_config()

    # prepare query and data
    query = """ DELETE from DailyPrice
                WHERE Symbol = %s AND Date = %s """

    data = (ticker, date)

    try:
       	conn = MySQLConnection(**db_config)

        # update book title
        cursor = conn.cursor()
        cursor.execute(query, data)

        # accept the changes
        conn.commit()
    except Error as error:
        print(error)
    finally:
       	cursor.close()
        conn.close()


if __name__ == '__main__':
    insert_stock(ticker, date, sentiment)
