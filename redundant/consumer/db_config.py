import psycopg2

def get_cursor():
    db_params = {
        "dbname": "bugsmash",
        "user": "postgres",
        "password": "sahib bandgi",
        "host": "localhost", 
        "port": "5432"  
    }

    try:
        conn = psycopg2.connect(**db_params)
        cursor = conn.cursor()
        return cursor
    except Exception as e:
        raise e
